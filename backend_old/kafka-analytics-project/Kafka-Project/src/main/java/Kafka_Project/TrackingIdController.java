package Kafka_Project;

import Kafka_Project.service.TrackingIdValidationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Controller for managing registered tracking IDs.
 * 
 * This provides an API for Laravel/external services to sync tracking IDs.
 * 
 * Endpoints:
 * - POST /api/tracking-ids/sync - Sync tracking IDs from Laravel
 * - POST /api/tracking-ids/register - Register a single tracking ID
 * - DELETE /api/tracking-ids/{trackingId} - Unregister a tracking ID
 * - GET /api/tracking-ids - List all registered tracking IDs
 * - GET /api/tracking-ids/count - Get count of registered tracking IDs
 * - GET /api/tracking-ids/validate/{trackingId} - Validate a tracking ID
 */
@RestController
@RequestMapping("/api/tracking-ids")
public class TrackingIdController {
    
    private static final Logger logger = LoggerFactory.getLogger(TrackingIdController.class);
    
    private final TrackingIdValidationService validationService;
    
    public TrackingIdController(TrackingIdValidationService validationService) {
        this.validationService = validationService;
    }
    
    /**
     * Sync tracking IDs from Laravel/MySQL.
     * Expected payload: {"tracking_ids": ["id1", "id2", ...]}
     */
    @PostMapping("/sync")
    public ResponseEntity<?> syncTrackingIds(@RequestBody Map<String, List<String>> payload) {
        try {
            List<String> trackingIds = payload.get("tracking_ids");
            
            if (trackingIds == null || trackingIds.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "tracking_ids array is required"));
            }
            
            Set<String> trackingIdSet = Set.copyOf(trackingIds);
            validationService.syncTrackingIds(trackingIdSet);
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Synced tracking IDs",
                "count", trackingIdSet.size(),
                "timestamp", Instant.now().toString()
            ));
            
        } catch (Exception e) {
            logger.error("Error syncing tracking IDs", e);
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to sync tracking IDs: " + e.getMessage()));
        }
    }
    
    /**
     * Register a single tracking ID.
     * Expected payload: {"tracking_id": "id"}
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerTrackingId(@RequestBody Map<String, String> payload) {
        try {
            String trackingId = payload.get("tracking_id");
            
            if (trackingId == null || trackingId.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "tracking_id is required"));
            }
            
            validationService.registerTrackingId(trackingId);
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Tracking ID registered",
                "tracking_id", trackingId,
                "timestamp", Instant.now().toString()
            ));
            
        } catch (Exception e) {
            logger.error("Error registering tracking ID", e);
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to register tracking ID: " + e.getMessage()));
        }
    }
    
    /**
     * Unregister a tracking ID.
     */
    @DeleteMapping("/{trackingId}")
    public ResponseEntity<?> unregisterTrackingId(@PathVariable String trackingId) {
        try {
            validationService.unregisterTrackingId(trackingId);
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Tracking ID unregistered",
                "tracking_id", trackingId,
                "timestamp", Instant.now().toString()
            ));
            
        } catch (Exception e) {
            logger.error("Error unregistering tracking ID", e);
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to unregister tracking ID: " + e.getMessage()));
        }
    }
    
    /**
     * List all registered tracking IDs.
     */
    @GetMapping
    public ResponseEntity<?> listTrackingIds() {
        try {
            Set<String> trackingIds = validationService.getAllRegisteredTrackingIds();
            
            return ResponseEntity.ok(Map.of(
                "tracking_ids", trackingIds,
                "count", trackingIds.size(),
                "timestamp", Instant.now().toString()
            ));
            
        } catch (Exception e) {
            logger.error("Error listing tracking IDs", e);
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to list tracking IDs: " + e.getMessage()));
        }
    }
    
    /**
     * Get count of registered tracking IDs.
     */
    @GetMapping("/count")
    public ResponseEntity<?> getTrackingIdCount() {
        try {
            long count = validationService.getRegisteredCount();
            
            return ResponseEntity.ok(Map.of(
                "count", count,
                "validation_enabled", validationService.isValidationEnabled(),
                "timestamp", Instant.now().toString()
            ));
            
        } catch (Exception e) {
            logger.error("Error getting tracking ID count", e);
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to get tracking ID count: " + e.getMessage()));
        }
    }
    
    /**
     * Validate a tracking ID.
     */
    @GetMapping("/validate/{trackingId}")
    public ResponseEntity<?> validateTrackingId(@PathVariable String trackingId) {
        try {
            boolean isValid = validationService.isValidTrackingId(trackingId);
            
            return ResponseEntity.ok(Map.of(
                "tracking_id", trackingId,
                "is_valid", isValid,
                "timestamp", Instant.now().toString()
            ));
            
        } catch (Exception e) {
            logger.error("Error validating tracking ID", e);
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to validate tracking ID: " + e.getMessage()));
        }
    }
}
