package Kafka_Project.service;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Iterator;
import java.util.Map;

@Service
public class KafkaConsumerService {
    
    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumerService.class);
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
 
    public KafkaConsumerService(JdbcTemplate jdbcTemplate, KafkaTemplate<String, String> kafkaTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = new ObjectMapper();
        this.kafkaTemplate = kafkaTemplate;
    }

    /**
     * Helper method to parse timestamp from various formats
     */
    private LocalDateTime parseTimestamp(JsonNode json, JsonNode data) {
        String tsStr = json.has("timestamp") ? json.get("timestamp").asText() : 
                       data.path("timestamp").asText(null);
        
        if (tsStr != null && !tsStr.isEmpty()) {
            try {
                return LocalDateTime.ofInstant(Instant.parse(tsStr), ZoneOffset.UTC);
            } catch (Exception e) {
                // Try other formats or fallback
            }
        }
        return LocalDateTime.now(ZoneOffset.UTC);
    }

    /**
     * Helper method to get URL from data (handles both 'url' and 'page_url' fields)
     */
    private String getUrl(JsonNode data) {
        if (data.has("page_url") && !data.get("page_url").isNull()) {
            return data.get("page_url").asText("");
        }
        return data.path("url").asText("");
    }

    // =========================================================================
    // PAGE EVENTS CONSUMER
    // =========================================================================
    @KafkaListener(
        topics = {"page_load", "page_view", "page_unload", "page_hidden", "page_visible"}, 
        groupId = "analytics-consumers",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumePageEvents(ConsumerRecord<String, String> record) {
        try {
            JsonNode json = objectMapper.readTree(record.value());
            String eventType = json.path("event_type").asText();
            JsonNode data = json.path("data");
            
            LocalDateTime timestamp = parseTimestamp(json, data);
            
            // Insert page event
            String sql = "INSERT INTO page_events (timestamp, session_id, user_id, tracking_id, " +
                        "event_type, page_url, page_title, referrer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            
            jdbcTemplate.update(sql,
                timestamp.format(FORMATTER),
                data.path("session_id").asText(""),
                data.path("user_id").asText(""),
                data.path("tracking_id").asText(""),
                eventType,
                getUrl(data),
                data.path("title").asText(""),
                data.path("referrer").asText("")
            );
            
            // On page_load, also create/update session
            if ("page_load".equals(eventType)) {
                insertSession(data, timestamp);
            }
            
            logger.info("✓ Inserted page event: {} for tracking_id: {}", eventType, data.path("tracking_id").asText());
        } catch (Exception e) {
            logger.error("✗ Error processing page event from topic {}: {}", record.topic(), e.getMessage(), e);
        }
    }

    // =========================================================================
    // SESSIONS CONSUMER - Creates session records on page_load
    // =========================================================================
    private void insertSession(JsonNode data, LocalDateTime timestamp) {
        try {
            String sessionId = data.path("session_id").asText("");
            String userId = data.path("user_id").asText("");
            String trackingId = data.path("tracking_id").asText("");
            
            if (sessionId.isEmpty() || trackingId.isEmpty()) {
                logger.warn("Cannot create session without session_id or tracking_id");
                return;
            }
            
            // Extract device/browser info - ensure non-empty for LowCardinality
            String deviceType = data.path("device_type").asText(
                data.path("deviceType").asText("Unknown")
            );
            if (deviceType == null || deviceType.isEmpty()) deviceType = "Unknown";
            
            String os = data.path("operating_system").asText(
                data.path("os").asText("Unknown")
            );
            if (os == null || os.isEmpty()) os = "Unknown";
            
            String browser = data.path("browser").asText("Unknown");
            if (browser == null || browser.isEmpty()) browser = "Unknown";
            
            // Clamp UInt16 (0-65535) to avoid overflow/type errors
            int screenWidth = Math.max(0, Math.min(65535, data.path("screen_width").asInt(
                data.path("screenWidth").asInt(0)
            )));
            int screenHeight = Math.max(0, Math.min(65535, data.path("screen_height").asInt(
                data.path("screenHeight").asInt(0)
            )));
            int viewportWidth = Math.max(0, Math.min(65535, data.path("viewport_width").asInt(
                data.path("viewportWidth").asInt(0)
            )));
            int viewportHeight = Math.max(0, Math.min(65535, data.path("viewport_height").asInt(
                data.path("viewportHeight").asInt(0)
            )));
            
            String language = data.path("language").asText("en");
            if (language == null || language.isEmpty()) language = "en";
            String timezone = data.path("timezone").asText("UTC");
            if (timezone == null || timezone.isEmpty()) timezone = "UTC";
            String referrer = data.path("referrer").asText("");
            if (referrer == null) referrer = "";
            String entryPage = getUrl(data);
            if (entryPage == null || entryPage.isEmpty()) entryPage = "";
            
            // Use explicit cast for DateTime string - ClickHouse expects 'YYYY-MM-DD HH:MM:SS'
            String tsStr = timestamp.format(FORMATTER);
            
            String sql = "INSERT INTO sessions (session_id, user_id, tracking_id, start_time, " +
                        "device_type, operating_system, browser, screen_width, screen_height, " +
                        "viewport_width, viewport_height, language, timezone, referrer, entry_page, page_views) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            jdbcTemplate.update(sql,
                sessionId,
                userId.isEmpty() ? "guest" : userId,
                trackingId,
                tsStr,
                deviceType,
                os,
                browser,
                screenWidth,
                screenHeight,
                viewportWidth,
                viewportHeight,
                language,
                timezone,
                referrer,
                entryPage,
                1  // page_views
            );
            
            logger.info("✓ Created session: {} for tracking_id: {}", sessionId, trackingId);
        } catch (Exception e) {
            logger.error("✗ Error creating session: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(
        topics = {"mouse_click", "button_click", "link_click", "file_download"}, 
        groupId = "analytics-consumers",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeInteractionEvents(ConsumerRecord<String, String> record) {
        try {
            JsonNode json = objectMapper.readTree(record.value());
            String eventType = json.path("event_type").asText();
            JsonNode data = json.path("data");
            
            LocalDateTime timestamp = parseTimestamp(json, data);
            
            // Extended INSERT with all interaction_events fields
            String sql = "INSERT INTO interaction_events (timestamp, session_id, user_id, tracking_id, " +
                        "event_type, page_url, x, y, element, element_id, element_class, " +
                        "button_text, button_type, link_url, link_text, file_name, is_external, target) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            jdbcTemplate.update(sql,
                timestamp.format(FORMATTER),
                data.path("session_id").asText(""),
                data.path("user_id").asText(""),
                data.path("tracking_id").asText(""),
                eventType,
                getUrl(data),
                data.has("x") ? data.get("x").asInt() : null,
                data.has("y") ? data.get("y").asInt() : null,
                data.path("element").asText(""),
                data.has("element_id") ? data.get("element_id").asText() : null,
                data.has("element_class") ? data.get("element_class").asText() : null,
                data.has("button_text") ? data.get("button_text").asText() : null,
                data.has("button_type") ? data.get("button_type").asText() : null,
                data.has("link_url") ? data.get("link_url").asText() : null,
                data.has("link_text") ? data.get("link_text").asText() : null,
                data.has("file_name") ? data.get("file_name").asText() : null,
                data.has("is_external") ? (data.get("is_external").asBoolean() ? 1 : 0) : null,
                data.has("target") ? data.get("target").asText() : null
            );
            
            logger.info("✓ Inserted interaction event: {} for tracking_id: {}", eventType, data.path("tracking_id").asText());
        } catch (Exception e) {
            logger.error("✗ Error processing interaction event from topic {}: {}", record.topic(), e.getMessage(), e);
        }
    }

    @KafkaListener(
        topics = {"form_submit", "form_focus", "form_input"}, 
        groupId = "analytics-consumers",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeFormEvents(ConsumerRecord<String, String> record) {
        try {
            JsonNode json = objectMapper.readTree(record.value());
            String eventType = json.path("event_type").asText();
            JsonNode data = json.path("data");
            
            LocalDateTime timestamp = parseTimestamp(json, data);
            
            // Extended INSERT with all form_events fields
            String sql = "INSERT INTO form_events (timestamp, session_id, user_id, tracking_id, " +
                        "page_url, event_type, form_id, form_name, form_action, form_method, " +
                        "field_name, field_type, field_count, value_length, has_file_upload, success) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            jdbcTemplate.update(sql,
                timestamp.format(FORMATTER),
                data.path("session_id").asText(""),
                data.path("user_id").asText(""),
                data.path("tracking_id").asText(""),
                getUrl(data),
                eventType,
                data.path("form_id").asText(""),
                data.has("form_name") ? data.get("form_name").asText() : "default_form",
                data.has("form_action") ? data.get("form_action").asText() : null,
                data.has("form_method") ? data.get("form_method").asText() : null,
                data.has("field_name") ? data.get("field_name").asText() : null,
                data.has("field_type") ? data.get("field_type").asText() : null,
                data.has("field_count") ? data.get("field_count").asInt() : null,
                data.has("value_length") ? data.get("value_length").asInt() : null,
                data.has("has_file_upload") ? (data.get("has_file_upload").asBoolean() ? 1 : 0) : null,
                data.has("success") ? (data.get("success").asBoolean() ? 1 : 0) : null
            );
            
            logger.info("✓ Inserted form event: {} for tracking_id: {}", eventType, data.path("tracking_id").asText());
        } catch (Exception e) {
            logger.error("✗ Error processing form event from topic {}: {}", record.topic(), e.getMessage(), e);
        }
    }

   @KafkaListener(
        topics = {"product_view", "cart_add", "cart_remove", "checkout_step", "purchase"},
        groupId = "analytics-consumers",
        containerFactory = "kafkaListenerContainerFactory"
)
public void consumeEcommerceEvents(ConsumerRecord<String, String> record) {

    logger.info(
            "🟢 KAFKA CONSUMER START | topic={} partition={} offset={} key={}",
            record.topic(),
            record.partition(),
            record.offset(),
            record.key()
    );

    logger.info("📦 RAW MESSAGE: {}", record.value());

    try {
        // ===============================
        // 1️⃣ Parse JSON
        // ===============================
        JsonNode json = objectMapper.readTree(record.value());
        JsonNode data = json.path("data");

        if (!json.has("event_type") || data.isMissingNode()) {
            logger.error("❌ INVALID JSON STRUCTURE | json={}", json);
            return;
        }

        String eventType = json.get("event_type").asText();
        String trackingId = data.path("tracking_id").asText(null);

        if (trackingId == null) {
            logger.error("❌ MISSING tracking_id | data={}", data);
            return;
        }

        logger.info("🔍 eventType={} trackingId={}", eventType, trackingId);

        // ===============================
        // 2️⃣ Timestamp handling
        // ===============================
        String tsStr = json.has("timestamp")
                ? json.get("timestamp").asText()
                : data.path("timestamp").asText(null);

        LocalDateTime timestamp;
        try {
            timestamp = tsStr != null
                    ? LocalDateTime.ofInstant(Instant.parse(tsStr), ZoneOffset.UTC)
                    : LocalDateTime.now();
        } catch (Exception e) {
            logger.warn("⚠ Timestamp parse failed, fallback to now()");
            timestamp = LocalDateTime.now();
        }

        timestamp = timestamp.withNano(0);
        logger.info("⏱ timestamp={}", timestamp);

        // ===============================
        // 3️⃣ SAFE TYPE CONVERSIONS
        // ===============================
        Float price = data.has("price") && !data.get("price").isNull()
                ? (float) data.get("price").asDouble()
                : null;

        Float total = data.has("total") && !data.get("total").isNull()
                ? (float) data.get("total").asDouble()
                : null;

        Integer quantity = data.has("quantity") && !data.get("quantity").isNull()
                ? Math.max(0, data.get("quantity").asInt())
                : null;

        Integer step = data.has("step") && !data.get("step").isNull()
                ? Math.min(255, Math.max(0, data.get("step").asInt()))
                : null;

        logger.info(
                "🧪 INSERT VALUES | price={} quantity={} total={} step={}",
                price, quantity, total, step
        );

        // ===============================
        // 4️⃣ INSERT INTO CLICKHOUSE
        // ===============================
        jdbcTemplate.update(
                "INSERT INTO ecommerce_events (" +
                        "timestamp, session_id, user_id, tracking_id, page_url, event_type, " +
                        "product_id, product_name, price, quantity, category, currency, " +
                        "order_id, total, step, step_name" +
                        ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                timestamp,
                data.path("session_id").asText(null),
                data.path("user_id").asText(null),
                trackingId,
                data.path("page_url").asText(null),
                eventType,
                data.path("product_id").isMissingNode() ? null : data.path("product_id").asText(),
                data.path("product_name").isMissingNode() ? null : data.path("product_name").asText(),
                price,
                quantity,
                data.path("category").isMissingNode() ? null : data.path("category").asText(),
                data.path("currency").isMissingNode() ? "USD" : data.path("currency").asText(),
                data.path("order_id").isMissingNode() ? null : data.path("order_id").asText(),
                total,
                step,
                data.path("step_name").isMissingNode() ? null : data.path("step_name").asText()
        );

        logger.info("✅ INSERT SUCCESS | trackingId={} offset={}",
                trackingId, record.offset());

    } catch (Exception e) {
        logger.error(
                "💥 CONSUMER FAILED | topic={} offset={} payload={}",
                record.topic(),
                record.offset(),
                record.value(),
                e
        );
    }
}

    // =========================================================================
    // VIDEO EVENTS CONSUMER
    // =========================================================================
    @KafkaListener(
        topics = {"video_events"}, 
        groupId = "analytics-consumers",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeVideoEvents(ConsumerRecord<String, String> record) {
        try {
            JsonNode json = objectMapper.readTree(record.value());
            String eventType = json.path("event_type").asText();
            JsonNode data = json.path("data");
            
            LocalDateTime timestamp = parseTimestamp(json, data);
            
            // Get video-specific fields
            String videoSrc = data.path("video_src").asText(
                data.path("src").asText("unknown")
            );
            Float videoDuration = data.has("video_duration") ? 
                (float) data.get("video_duration").asDouble() :
                (data.has("duration") ? (float) data.get("duration").asDouble() : null);
            Float currentTime = data.has("current_time") ? 
                (float) data.get("current_time").asDouble() :
                (data.has("currentTime") ? (float) data.get("currentTime").asDouble() : null);
            
            String sql = "INSERT INTO video_events (timestamp, session_id, user_id, tracking_id, " +
                        "page_url, event_type, video_src, video_duration, current_time) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            jdbcTemplate.update(sql,
                timestamp.format(FORMATTER),
                data.path("session_id").asText(""),
                data.path("user_id").asText(""),
                data.path("tracking_id").asText(""),
                getUrl(data),
                eventType,
                videoSrc,
                videoDuration,
                currentTime
            );
            
            logger.info("✓ Inserted video event: {} for tracking_id: {}", eventType, data.path("tracking_id").asText());
        } catch (Exception e) {
            logger.error("✗ Error processing video event: {}", e.getMessage(), e);
        }
    }

    // =========================================================================
    // SCROLL EVENTS CONSUMER
    // =========================================================================
    @KafkaListener(
        topics = {"scroll_depth"}, 
        groupId = "analytics-consumers",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeScrollEvents(ConsumerRecord<String, String> record) {
        try {
            JsonNode json = objectMapper.readTree(record.value());
            String eventType = json.path("event_type").asText("scroll_depth");
            JsonNode data = json.path("data");
            
            LocalDateTime timestamp = parseTimestamp(json, data);
            
            // Get scroll-specific fields
            Integer depthPercent = data.has("depth_percent") ? 
                data.get("depth_percent").asInt() :
                (data.has("depthPercent") ? data.get("depthPercent").asInt() : 
                (data.has("depth") ? data.get("depth").asInt() : null));
            Integer scrollTop = data.has("scroll_top") ? 
                data.get("scroll_top").asInt() :
                (data.has("scrollTop") ? data.get("scrollTop").asInt() : null);
            Integer scrollPercent = data.has("scroll_percent") ? 
                data.get("scroll_percent").asInt() :
                (data.has("scrollPercent") ? data.get("scrollPercent").asInt() : null);
            
            String sql = "INSERT INTO scroll_events (timestamp, session_id, user_id, tracking_id, " +
                        "page_url, event_type, depth_percent, scroll_top, scroll_percent) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            jdbcTemplate.update(sql,
                timestamp.format(FORMATTER),
                data.path("session_id").asText(""),
                data.path("user_id").asText(""),
                data.path("tracking_id").asText(""),
                getUrl(data),
                eventType,
                depthPercent,
                scrollTop,
                scrollPercent
            );
            
            logger.info("✓ Inserted scroll event for tracking_id: {}", data.path("tracking_id").asText());
        } catch (Exception e) {
            logger.error("✗ Error processing scroll event: {}", e.getMessage(), e);
        }
    }

    // =========================================================================
    // MOUSE EVENTS CONSUMER
    // =========================================================================
    @KafkaListener(
        topics = {"mouse_move"}, 
        groupId = "analytics-consumers",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeMouseMoveEvents(ConsumerRecord<String, String> record) {
        try {
            JsonNode json = objectMapper.readTree(record.value());
            JsonNode data = json.path("data");
            
            LocalDateTime timestamp = parseTimestamp(json, data);
            
            // Get mouse position
            int x = data.path("x").asInt(0);
            int y = data.path("y").asInt(0);
            
            String sql = "INSERT INTO mouse_events (timestamp, session_id, user_id, tracking_id, " +
                        "page_url, x, y) VALUES (?, ?, ?, ?, ?, ?, ?)";
            
            jdbcTemplate.update(sql,
                timestamp.format(FORMATTER),
                data.path("session_id").asText(""),
                data.path("user_id").asText(""),
                data.path("tracking_id").asText(""),
                getUrl(data),
                x,
                y
            );
            
            logger.debug("✓ Inserted mouse event for tracking_id: {}", data.path("tracking_id").asText());
        } catch (Exception e) {
            logger.error("✗ Error processing mouse event: {}", e.getMessage(), e);
        }
    }

    // =========================================================================
    // PERIODIC EVENTS CONSUMER - Unpacks batch events and re-publishes
    // =========================================================================
    @KafkaListener(
        topics = {"periodic_events"}, 
        groupId = "analytics-consumers",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumePeriodicEvents(ConsumerRecord<String, String> record) {
        try {
            JsonNode json = objectMapper.readTree(record.value());
            JsonNode data = json.path("data");
            String timestampStr = json.path("timestamp").asText();
            String trackingId = data.path("tracking_id").asText("");
            String sessionId = data.path("session_id").asText("");
            String userId = data.path("user_id").asText("");
            String url = getUrl(data);
            
            logger.info("Processing periodic_events for tracking_id: {}", trackingId);
            
            int processedCount = 0;
            
            // Process linkClicks array
            if (data.has("linkClicks") && data.get("linkClicks").isArray()) {
                for (JsonNode click : data.get("linkClicks")) {
                    processPeriodicEvent(click, "link_click", trackingId, sessionId, userId, url, timestampStr);
                    processedCount++;
                }
            }
            
            // Process videoEvents array
            if (data.has("videoEvents") && data.get("videoEvents").isArray()) {
                for (JsonNode video : data.get("videoEvents")) {
                    String eventType = video.path("type").asText(video.path("event_type").asText("video_play"));
                    processVideoEvent(video, eventType, trackingId, sessionId, userId, url, timestampStr);
                    processedCount++;
                }
            }
            
            // Process mouseClicks array
            if (data.has("mouseClicks") && data.get("mouseClicks").isArray()) {
                for (JsonNode click : data.get("mouseClicks")) {
                    processPeriodicEvent(click, "mouse_click", trackingId, sessionId, userId, url, timestampStr);
                    processedCount++;
                }
            }
            
            // Process scrollEvents array
            if (data.has("scrollEvents") && data.get("scrollEvents").isArray()) {
                for (JsonNode scroll : data.get("scrollEvents")) {
                    processScrollEvent(scroll, trackingId, sessionId, userId, url, timestampStr);
                    processedCount++;
                }
            }
            
            // Process formEvents array
            if (data.has("formEvents") && data.get("formEvents").isArray()) {
                for (JsonNode form : data.get("formEvents")) {
                    String eventType = form.path("type").asText(form.path("event_type").asText("form_input"));
                    processFormEvent(form, eventType, trackingId, sessionId, userId, url, timestampStr);
                    processedCount++;
                }
            }
            
            logger.info("✓ Processed {} events from periodic_events for tracking_id: {}", processedCount, trackingId);
            
        } catch (Exception e) {
            logger.error("✗ Error processing periodic events: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Process individual event from periodic_events batch and insert into interaction_events
     */
    private void processPeriodicEvent(JsonNode event, String eventType, String trackingId, 
                                      String sessionId, String userId, String url, String timestampStr) {
        try {
            LocalDateTime timestamp = parseTimestampString(timestampStr);
            
            String sql = "INSERT INTO interaction_events (timestamp, session_id, user_id, tracking_id, " +
                        "event_type, page_url, element, x, y) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            jdbcTemplate.update(sql,
                timestamp.format(FORMATTER),
                sessionId,
                userId,
                trackingId,
                eventType,
                event.path("url").asText(url),
                event.path("element").asText(""),
                event.has("x") ? event.get("x").asInt() : null,
                event.has("y") ? event.get("y").asInt() : null
            );
        } catch (Exception e) {
            logger.error("Error processing periodic interaction event: {}", e.getMessage());
        }
    }
    
    /**
     * Process video event from periodic_events batch
     */
    private void processVideoEvent(JsonNode event, String eventType, String trackingId,
                                   String sessionId, String userId, String url, String timestampStr) {
        try {
            LocalDateTime timestamp = parseTimestampString(timestampStr);
            
            String videoSrc = event.path("video_src").asText(event.path("src").asText("unknown"));
            Float duration = event.has("duration") ? (float) event.get("duration").asDouble() : null;
            Float currentTime = event.has("currentTime") ? (float) event.get("currentTime").asDouble() : null;
            
            String sql = "INSERT INTO video_events (timestamp, session_id, user_id, tracking_id, " +
                        "page_url, event_type, video_src, video_duration, current_time) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            jdbcTemplate.update(sql,
                timestamp.format(FORMATTER),
                sessionId,
                userId,
                trackingId,
                url,
                eventType,
                videoSrc,
                duration,
                currentTime
            );
        } catch (Exception e) {
            logger.error("Error processing periodic video event: {}", e.getMessage());
        }
    }
    
    /**
     * Process scroll event from periodic_events batch
     */
    private void processScrollEvent(JsonNode event, String trackingId, String sessionId,
                                    String userId, String url, String timestampStr) {
        try {
            LocalDateTime timestamp = parseTimestampString(timestampStr);
            
            String sql = "INSERT INTO scroll_events (timestamp, session_id, user_id, tracking_id, " +
                        "page_url, event_type, depth_percent, scroll_top, scroll_percent) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            jdbcTemplate.update(sql,
                timestamp.format(FORMATTER),
                sessionId,
                userId,
                trackingId,
                url,
                "scroll_depth",
                event.has("depth") ? event.get("depth").asInt() : null,
                event.has("scrollTop") ? event.get("scrollTop").asInt() : null,
                event.has("scrollPercent") ? event.get("scrollPercent").asInt() : null
            );
        } catch (Exception e) {
            logger.error("Error processing periodic scroll event: {}", e.getMessage());
        }
    }
    
    /**
     * Process form event from periodic_events batch
     */
    private void processFormEvent(JsonNode event, String eventType, String trackingId,
                                  String sessionId, String userId, String url, String timestampStr) {
        try {
            LocalDateTime timestamp = parseTimestampString(timestampStr);
            
            String sql = "INSERT INTO form_events (timestamp, session_id, user_id, tracking_id, " +
                        "page_url, event_type, form_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
            
            jdbcTemplate.update(sql,
                timestamp.format(FORMATTER),
                sessionId,
                userId,
                trackingId,
                url,
                eventType,
                event.path("form_id").asText(event.path("formId").asText(""))
            );
        } catch (Exception e) {
            logger.error("Error processing periodic form event: {}", e.getMessage());
        }
    }
    
    /**
     * Parse timestamp string to LocalDateTime
     */
    private LocalDateTime parseTimestampString(String timestampStr) {
        if (timestampStr != null && !timestampStr.isEmpty()) {
            try {
                return LocalDateTime.ofInstant(Instant.parse(timestampStr), ZoneOffset.UTC);
            } catch (Exception e) {
                // fallback
            }
        }
        return LocalDateTime.now(ZoneOffset.UTC);
    }

}