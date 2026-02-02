<?php

namespace App\Services\ClickHouse;

use Illuminate\Support\Facades\Log;

/**
 * Page Events Service
 * خدمة أحداث الصفحات
 */
class PageEventsService extends BaseClickHouseService
{
    protected string $table = 'page_events';

    /**
     * Insert a page event
     */
    public function insert(array $data): bool
    {
        $columns = [
            'timestamp', 'session_id', 'user_id', 'tracking_id', 'event_type',
            'page_url', 'page_title', 'referrer', 'duration_ms', 'scroll_depth_max',
            'click_count', 'dns_time', 'connect_time', 'response_time',
            'dom_load_time', 'page_load_time', 'connection_type',
            'connection_downlink', 'connection_rtt'
        ];

        $values = [
            $data['timestamp'] ?? now()->toDateTimeString(),
            $data['session_id'] ?? '',
            $data['user_id'] ?? 'guest',
            $data['tracking_id'] ?? '',
            $data['event_type'] ?? 'unknown',
            $data['page_url'] ?? '',
            $data['page_title'] ?? '',
            $data['referrer'] ?? '',
            $data['duration_ms'] ?? null,
            $data['scroll_depth_max'] ?? null,
            $data['click_count'] ?? null,
            $data['dns_time'] ?? null,
            $data['connect_time'] ?? null,
            $data['response_time'] ?? null,
            $data['dom_load_time'] ?? null,
            $data['page_load_time'] ?? null,
            $data['connection_type'] ?? null,
            $data['connection_downlink'] ?? null,
            $data['connection_rtt'] ?? null,
        ];

        $result = $this->safeInsert($this->table, $columns, $values);
        
        if ($result) {
            Log::info("Page event stored", [
                'tracking_id' => $data['tracking_id'],
                'event_type' => $data['event_type']
            ]);
        }

        return $result;
    }

    /**
     * Count events for a user
     */
    public function countForUser(string $userId): int
    {
        return $this->countWhere($this->table, "user_id = :user_id", ['user_id' => $userId]);
    }

    /**
     * Count events for a tracking ID
     */
    public function countForTracking(string $trackingId): int
    {
        return $this->countWhere($this->table, "tracking_id = :tracking_id", ['tracking_id' => $trackingId]);
    }

    /**
     * Get last events for a user
     */
    public function getLastForUser(string $userId, int $limit = 10): array
    {
        $query = "SELECT 
                    timestamp, session_id, user_id, tracking_id, event_type,
                    page_url, page_title, referrer, duration_ms, scroll_depth_max, click_count
                  FROM {$this->table} 
                  WHERE user_id = :user_id 
                  ORDER BY timestamp DESC 
                  LIMIT :limit";

        return $this->safeSelect($query, ['user_id' => $userId, 'limit' => $limit]);
    }

    /**
     * Get last events for a tracking ID
     */
    public function getLastForTracking(string $trackingId, int $limit = 10): array
    {
        $query = "SELECT 
                    timestamp, session_id, user_id, tracking_id, event_type, page_url, page_title
                  FROM {$this->table} 
                  WHERE tracking_id = :tracking_id 
                  ORDER BY timestamp DESC 
                  LIMIT :limit";

        return $this->safeSelect($query, ['tracking_id' => $trackingId, 'limit' => $limit]);
    }

    /**
     * Get page metrics
     */
    public function getPageMetrics(string $trackingId, string $pageUrl): array
    {
        $query = "SELECT 
                    count(*) as views,
                    uniq(session_id) as unique_visitors,
                    avg(duration_ms) as avg_duration,
                    avg(scroll_depth_max) as avg_scroll_depth,
                    avg(page_load_time) as avg_load_time
                  FROM {$this->table}
                  WHERE tracking_id = :tracking_id AND page_url = :page_url";

        $rows = $this->safeSelect($query, ['tracking_id' => $trackingId, 'page_url' => $pageUrl]);
        return $rows[0] ?? [];
    }
}
