package Kafka_Project.service;

import Kafka_Project.Redis.RedisService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Set;

/**
 * Service for validating tracking IDs against registered users.
 * Uses Redis to cache registered tracking IDs for fast lookup.
 * 
 * The sync of tracking IDs from MySQL/Laravel can be done via:
 * 1. API endpoint (POST /api/tracking-ids/sync)
 * 2. Scheduled task that calls Laravel API
 * 3. Direct MySQL connection (not recommended as Laravel owns user data)
 */
@Service
public class TrackingIdValidationService {
    
    private static final Logger logger = LoggerFactory.getLogger(TrackingIdValidationService.class);
    
    private final RedisService redisService;
    
    // Enable/disable tracking ID validation (can be disabled for development)
    @Value("${tracking.validation.enabled:true}")
    private boolean validationEnabled;
    
    // Allow anonymous tracking IDs (useful for initial testing)
    @Value("${tracking.validation.allow-anonymous:false}")
    private boolean allowAnonymous;
    
    public TrackingIdValidationService(RedisService redisService) {
        this.redisService = redisService;
    }
    
    /**
     * Validate if a tracking ID is registered.
     * 
     * @param trackingId The tracking ID to validate
     * @return true if the tracking ID is valid, false otherwise
     */
    public boolean isValidTrackingId(String trackingId) {
        // If validation is disabled, allow all
        if (!validationEnabled) {
            return true;
        }
        
        // Handle null or empty tracking ID
        if (trackingId == null || trackingId.isEmpty() || "anonymous".equals(trackingId)) {
            return allowAnonymous;
        }
        
        // Check if registered in Redis
        boolean isRegistered = redisService.isTrackingIdRegistered(trackingId);
        
        if (!isRegistered) {
            logger.warn("Unregistered tracking ID attempted: {}", trackingId);
        }
        
        return isRegistered;
    }
    
    /**
     * Register a single tracking ID.
     */
    public void registerTrackingId(String trackingId) {
        if (trackingId != null && !trackingId.isEmpty()) {
            redisService.registerTrackingId(trackingId);
            logger.info("Registered tracking ID: {}", trackingId);
        }
    }
    
    /**
     * Register multiple tracking IDs at once.
     * This is typically called when syncing from Laravel/MySQL.
     */
    public void syncTrackingIds(Set<String> trackingIds) {
        if (trackingIds != null && !trackingIds.isEmpty()) {
            redisService.registerTrackingIds(trackingIds);
            logger.info("Synced {} tracking IDs to Redis", trackingIds.size());
        }
    }
    
    /**
     * Remove a tracking ID from the registry.
     */
    public void unregisterTrackingId(String trackingId) {
        if (trackingId != null && !trackingId.isEmpty()) {
            redisService.unregisterTrackingId(trackingId);
            logger.info("Unregistered tracking ID: {}", trackingId);
        }
    }
    
    /**
     * Get all registered tracking IDs.
     */
    public Set<String> getAllRegisteredTrackingIds() {
        return redisService.getAllRegisteredTrackingIds();
    }
    
    /**
     * Get count of registered tracking IDs.
     */
    public long getRegisteredCount() {
        return redisService.getRegisteredTrackingIdCount();
    }
    
    /**
     * Check if validation is enabled.
     */
    public boolean isValidationEnabled() {
        return validationEnabled;
    }
}
