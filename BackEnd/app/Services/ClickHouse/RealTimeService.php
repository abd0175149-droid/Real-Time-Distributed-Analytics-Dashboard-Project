<?php

namespace App\Services\ClickHouse;

/**
 * Real-Time Analytics Service
 * خدمة التحليلات اللحظية
 */
class RealTimeService extends BaseClickHouseService
{
    /**
     * Get real-time stats (last 5 minutes)
     */
    public function getStats(string $trackingId): array
    {
        $query = "SELECT 
                    uniq(session_id) as active_users,
                    countIf(event_type = 'page_view') as page_views,
                    count(*) as events
                  FROM page_events 
                  WHERE tracking_id = :tracking_id 
                    AND timestamp >= now() - INTERVAL 5 MINUTE";

        $rows = $this->safeSelect($query, ['tracking_id' => $trackingId]);
        
        return $rows[0] ?? [
            'active_users' => 0,
            'page_views' => 0,
            'events' => 0,
        ];
    }

    /**
     * Get active pages (last 5 minutes)
     */
    public function getActivePages(string $trackingId, int $limit = 10): array
    {
        $query = "SELECT 
                    page_url,
                    page_title,
                    count(*) as views,
                    uniq(session_id) as visitors
                  FROM page_events 
                  WHERE tracking_id = :tracking_id 
                    AND timestamp >= now() - INTERVAL 5 MINUTE
                    AND event_type = 'page_view'
                  GROUP BY page_url, page_title
                  ORDER BY views DESC
                  LIMIT :limit";

        return $this->safeSelect($query, ['tracking_id' => $trackingId, 'limit' => $limit]);
    }

    /**
     * Get traffic over time (last hour, 5-minute intervals)
     */
    public function getTrafficOverTime(string $trackingId): array
    {
        $query = "SELECT 
                    toStartOfFiveMinutes(timestamp) as time_bucket,
                    count(*) as events,
                    uniq(session_id) as users
                  FROM page_events 
                  WHERE tracking_id = :tracking_id 
                    AND timestamp >= now() - INTERVAL 1 HOUR
                  GROUP BY time_bucket
                  ORDER BY time_bucket ASC";

        return $this->safeSelect($query, ['tracking_id' => $trackingId]);
    }

    /**
     * Get current active sessions
     */
    public function getActiveSessions(string $trackingId): array
    {
        $query = "SELECT 
                    session_id,
                    user_id,
                    argMax(page_url, timestamp) as current_page,
                    max(timestamp) as last_activity,
                    count(*) as event_count
                  FROM page_events 
                  WHERE tracking_id = :tracking_id 
                    AND timestamp >= now() - INTERVAL 5 MINUTE
                  GROUP BY session_id, user_id
                  ORDER BY last_activity DESC
                  LIMIT 50";

        return $this->safeSelect($query, ['tracking_id' => $trackingId]);
    }
}
