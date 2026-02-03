package Kafka_Project;

import Kafka_Project.service.KafkaProducerService;
import Kafka_Project.service.TrackingIdValidationService;

import java.time.Instant;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import Kafka_Project.Redis.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
public class ProducerController {
    
    private static final Logger logger = LoggerFactory.getLogger(ProducerController.class);
    private final RateLimiter rateLimiter;
    private final KafkaProducerService kafkaProducerService;
    private final TrackingIdValidationService trackingIdValidationService;
    private final ObjectMapper objectMapper;

    // VALID_TOPICS - includes video event types from tracker
    private static final Set<String> VALID_TOPICS = Set.of(
        "page_load", "page_view", "link_click", "button_click", "mouse_click",
        "mouse_move", "scroll_depth", "form_submit", "form_focus", "form_input",
        "video_events", "periodic_events", "page_hidden", "page_unload",
        "product_view", "cart_add", "cart_remove", "purchase", "checkout_step",
        "custom_event", "file_download", "page_visible",
        // Video event types from tracker (mapped to video_events topic)
        "play", "pause", "complete", "progress_25", "progress_50", "progress_75",
        "video_play", "video_pause", "video_complete"
    );

    // Fields that should NOT be moved into data (metadata fields)
    private static final Set<String> METADATA_FIELDS = Set.of(
        "type", "event_type", "ts", "timestamp"
    );

    public ProducerController(KafkaProducerService kafkaProducerService, 
                             RateLimiter rateLimiter,
                             TrackingIdValidationService trackingIdValidationService,
                             ObjectMapper objectMapper) {
        this.kafkaProducerService = kafkaProducerService;
        this.rateLimiter = rateLimiter;
        this.trackingIdValidationService = trackingIdValidationService;
        this.objectMapper = objectMapper;
    }

    private String getClientIP(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }
    
    /**
     * Extract tracking_id from the request (works for both flat and nested formats)
     */
    private String extractTrackingId(JsonNode eventNode) {
        // Check top-level tracking_id
        if (eventNode.has("tracking_id")) {
            return eventNode.get("tracking_id").asText();
        }
        // Check inside data object
        if (eventNode.has("data")) {
            JsonNode data = eventNode.get("data");
            if (data.has("tracking_id")) {
                return data.get("tracking_id").asText();
            }
            if (data.has("trackingId")) {
                return data.get("trackingId").asText();
            }
        }
        return "anonymous";
    }

    /**
     * Get event type from the request (supports both 'type' and 'event_type' fields)
     */
    private String getEventType(JsonNode eventNode) {
        if (eventNode.has("event_type")) {
            return eventNode.get("event_type").asText();
        }
        if (eventNode.has("type")) {
            return eventNode.get("type").asText();
        }
        return "unknown";
    }

    /**
     * Map video event types from tracker to the video_events topic
     */
    private String mapToTopic(String eventType) {
        // Video events should go to video_events topic
        if (Set.of("play", "pause", "complete", "progress_25", "progress_50", "progress_75",
                   "video_play", "video_pause", "video_complete").contains(eventType)) {
            return "video_events";
        }
        return eventType;
    }

    /**
     * Convert flat tracker format to nested data format expected by consumers
     * Tracker sends: {"type":"page_load","session_id":"...","url":"..."}
     * Consumer expects: {"event_type":"page_load","data":{"session_id":"...","url":"..."}}
     */
    private ObjectNode normalizeEventFormat(JsonNode eventNode, String clientIp) {
        ObjectNode messageNode = objectMapper.createObjectNode();
        
        String eventType = getEventType(eventNode);
        String trackingId = extractTrackingId(eventNode);
        
        messageNode.put("timestamp", Instant.now().toString());
        messageNode.put("event_type", eventType);
        messageNode.put("client_ip", clientIp);
        
        // If the event already has a "data" field, use it
        if (eventNode.has("data")) {
            messageNode.set("data", eventNode.get("data"));
        } else {
            // Convert flat format to nested data format
            ObjectNode dataNode = objectMapper.createObjectNode();
            Iterator<Map.Entry<String, JsonNode>> fields = eventNode.fields();
            
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> field = fields.next();
                String fieldName = field.getKey();
                
                // Skip metadata fields, include everything else in data
                if (!METADATA_FIELDS.contains(fieldName)) {
                    dataNode.set(fieldName, field.getValue());
                }
            }
            
            // Ensure tracking_id is in data
            if (!dataNode.has("tracking_id") && !trackingId.equals("anonymous")) {
                dataNode.put("tracking_id", trackingId);
            }
            
            messageNode.set("data", dataNode);
        }
        
        // Copy metadata if present
        if (eventNode.has("metadata")) {
            messageNode.set("metadata", eventNode.get("metadata"));
        }
        
        return messageNode;
    }

    /**
     * Main endpoint - accepts both single object and array formats
     * Single object: {"type":"page_load","session_id":"...","tracking_id":"..."}
     * Array format: [{"event_type":"page_load","data":{...}}]
     */
    @PostMapping("/receive_data")
    public ResponseEntity<?> receiveData(
            @RequestBody JsonNode requestBody, 
            HttpServletRequest httpRequest,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        
        String clientIp = getClientIP(httpRequest);
        
        try {
            // Rate limiting check
            if (!rateLimiter.rateLimiter(clientIp)) {
                logger.warn("Rate limit exceeded for IP: {}", clientIp);
                return ResponseEntity.status(429)
                    .body(Map.of("error", "Too many requests, try again later"));
            }

            // Convert single object to array for uniform processing
            ArrayNode eventsArray;
            if (requestBody.isArray()) {
                eventsArray = (ArrayNode) requestBody;
            } else if (requestBody.isObject()) {
                // Single object from tracker - wrap in array
                eventsArray = objectMapper.createArrayNode();
                eventsArray.add(requestBody);
            } else {
                logger.warn("Invalid request format from IP: {}", clientIp);
                return ResponseEntity.status(400)
                    .body(Map.of("error", "Invalid request format: expected object or array"));
            }

            // Validate tracking ID (from first event in batch)
            // Per documentation 3.3.1: "validate to ensure data originates from a registered tracking ID"
            if (eventsArray.size() > 0) {
                String trackingId = extractTrackingId(eventsArray.get(0));
                
                if (!trackingIdValidationService.isValidTrackingId(trackingId)) {
                    logger.warn("Unregistered tracking ID rejected: {} from IP: {}", trackingId, clientIp);
                    return ResponseEntity.status(403)
                        .body(Map.of(
                            "error", "Invalid or unregistered tracking ID",
                            "tracking_id", trackingId
                        ));
                }
            }

            int processedCount = 0;
            int skippedCount = 0;

            for (JsonNode eventNode : eventsArray) {
                try {
                    String eventType = getEventType(eventNode);
                    
                    if ("unknown".equals(eventType) || !VALID_TOPICS.contains(eventType)) {
                        logger.debug("Skipping event with invalid/unknown type: {}", eventType);
                        skippedCount++;
                        continue;
                    }

                    // Normalize the event format
                    ObjectNode messageNode = normalizeEventFormat(eventNode, clientIp);
                    String message = objectMapper.writeValueAsString(messageNode);
                    
                    // Map event type to appropriate Kafka topic
                    String topic = mapToTopic(eventType);
                    
                    kafkaProducerService.sendMessage(message, topic);
                    processedCount++;
                    
                    logger.debug("Sent event {} to topic {}", eventType, topic);
                    
                } catch (Exception e) {
                    logger.error("Error processing individual event", e);
                    skippedCount++;
                }
            }

            String trackingId = eventsArray.size() > 0 ? extractTrackingId(eventsArray.get(0)) : "unknown";
            logger.info("Processed {} events, skipped {} events for tracking_id: {}", 
                processedCount, skippedCount, trackingId);

            return ResponseEntity.ok(Map.of(
                "status", "success",
                "processed", processedCount,
                "skipped", skippedCount
            ));

        } catch (Exception error) {
            logger.error("Error processing request from IP: {}", clientIp, error);
            return ResponseEntity.status(500)
                .body(Map.of("error", "Internal server error: " + error.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
            "status", "healthy",
            "timestamp", Instant.now().toString()
        ));
    }

    // @GetMapping("/ready")
    // public ResponseEntity<?> ready() {
    //     return ResponseEntity.ok(Map.of(
    //         "status", "ready",
    //         "timestamp", Instant.now().toString()
    //     ));
    // }

    @GetMapping("/ready")
public ResponseEntity<Map<String, Object>> ready() {
    Map<String, Object> status = new HashMap<>();
    status.put("timestamp", Instant.now().toString());
    status.put("kafka", "connected"); // update with real check if needed
    status.put("redis", "connected");
    status.put("clickhouse", "connected");
    return ResponseEntity.ok(status);
}

}