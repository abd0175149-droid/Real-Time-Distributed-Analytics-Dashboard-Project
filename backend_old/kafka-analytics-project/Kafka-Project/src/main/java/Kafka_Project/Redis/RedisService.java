package Kafka_Project.Redis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

import java.util.Set;

@Service
public class RedisService {
    
    // Key for storing registered tracking IDs
    private static final String TRACKING_IDS_SET_KEY = "registered_tracking_ids";
    
    @Autowired
    private JedisPool jedisPool;

    public void saveData(String key, String value, int time) {
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.setex(key, time, value);
        }
    }        

    public String getData(String key) {
        try (Jedis jedis = jedisPool.getResource()) {
            return jedis.get(key);
        }
    }
    
    public void deleteData(String key) {
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.del(key);
        }        
    }

    public Long incrementCounter(String key, int expireSeconds) {
        try (Jedis jedis = jedisPool.getResource()) {
            Long count = jedis.incr(key);
            if (count == 1) {
                jedis.expire(key, expireSeconds);
            }
            return count;
        }
    }
    
    // ==========================================
    // Tracking ID Validation Methods
    // ==========================================
    
    /**
     * Check if a tracking ID is registered (exists in the Redis set)
     */
    public boolean isTrackingIdRegistered(String trackingId) {
        if (trackingId == null || trackingId.isEmpty()) {
            return false;
        }
        try (Jedis jedis = jedisPool.getResource()) {
            return jedis.sismember(TRACKING_IDS_SET_KEY, trackingId);
        } catch (Exception e) {
            // If Redis fails, we'll allow the request (fail-open)
            // In production, you might want to fail-closed instead
            return true;
        }
    }
    
    /**
     * Register a new tracking ID
     */
    public void registerTrackingId(String trackingId) {
        if (trackingId == null || trackingId.isEmpty()) {
            return;
        }
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.sadd(TRACKING_IDS_SET_KEY, trackingId);
        }
    }
    
    /**
     * Register multiple tracking IDs at once
     */
    public void registerTrackingIds(Set<String> trackingIds) {
        if (trackingIds == null || trackingIds.isEmpty()) {
            return;
        }
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.sadd(TRACKING_IDS_SET_KEY, trackingIds.toArray(new String[0]));
        }
    }
    
    /**
     * Remove a tracking ID from the registry
     */
    public void unregisterTrackingId(String trackingId) {
        if (trackingId == null || trackingId.isEmpty()) {
            return;
        }
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.srem(TRACKING_IDS_SET_KEY, trackingId);
        }
    }
    
    /**
     * Get all registered tracking IDs
     */
    public Set<String> getAllRegisteredTrackingIds() {
        try (Jedis jedis = jedisPool.getResource()) {
            return jedis.smembers(TRACKING_IDS_SET_KEY);
        }
    }
    
    /**
     * Get count of registered tracking IDs
     */
    public long getRegisteredTrackingIdCount() {
        try (Jedis jedis = jedisPool.getResource()) {
            return jedis.scard(TRACKING_IDS_SET_KEY);
        }
    }
    
    /**
     * Clear all registered tracking IDs (use with caution)
     */
    public void clearAllTrackingIds() {
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.del(TRACKING_IDS_SET_KEY);
        }
    }
}