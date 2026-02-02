<?php

namespace App\Services;

use ClickHouseDB\Client;
use Illuminate\Support\Facades\Log;
use Exception;

class ClickHouseTestService
{
    protected ?Client $client = null;
    protected bool $connected = false;

    public function __construct()
    {
        $this->initializeClient();
    }

    /**
     * Initialize ClickHouse client with error handling
     */
    protected function initializeClient(): void
    {
        try {
            $this->client = new Client([
                "host"     => env("CLICKHOUSE_HOST", "127.0.0.1"),
                "port"     => env("CLICKHOUSE_PORT", 8123),
                "username" => env("CLICKHOUSE_USERNAME", "default"),
                "password" => env("CLICKHOUSE_PASSWORD", ""),
            ]);

            $this->client->database(env("CLICKHOUSE_DATABASE", "default"));
            $this->client->setTimeout(5);
            $this->client->setConnectTimeOut(3);
            $this->connected = true;
        } catch (Exception $e) {
            Log::error("ClickHouse connection failed: " . $e->getMessage());
            $this->connected = false;
        }
    }

    /**
     * Check if ClickHouse is connected
     */
    public function isConnected(): bool
    {
        return $this->connected && $this->client !== null;
    }

    /**
     * Insert a page event into ClickHouse
     */
    public function insertEvent(array $data): bool
    {
        if (!$this->isConnected()) {
            Log::warning("ClickHouse not connected, event not stored");
            return false;
        }

        try {
            $columns = ["timestamp", "session_id", "user_id", "tracking_id", "event_type", "page_url", "page_title", "referrer", "duration_ms", "scroll_depth_max", "click_count", "dns_time", "connect_time", "response_time", "dom_load_time", "page_load_time", "connection_type", "connection_downlink", "connection_rtt"];
            $values = [[
                $data["timestamp"] ?? now()->toDateTimeString(),
                $data["session_id"] ?? "",
                $data["user_id"] ?? "guest",
                $data["tracking_id"] ?? "",
                $data["event_type"] ?? "unknown",
                $data["page_url"] ?? "",
                $data["page_title"] ?? "",
                $data["referrer"] ?? "",
                $data["duration_ms"] ?? null,
                $data["scroll_depth_max"] ?? null,
                $data["click_count"] ?? null,
                $data["dns_time"] ?? null,
                $data["connect_time"] ?? null,
                $data["response_time"] ?? null,
                $data["dom_load_time"] ?? null,
                $data["page_load_time"] ?? null,
                $data["connection_type"] ?? null,
                $data["connection_downlink"] ?? null,
                $data["connection_rtt"] ?? null,
            ]];
            $this->client->insert("page_events", $values, $columns);

            Log::info("Event stored successfully", ["tracking_id" => $data["tracking_id"], "event_type" => $data["event_type"]]);
            return true;
        } catch (Exception $e) {
            Log::error("Failed to insert event: " . $e->getMessage(), ["data" => $data]);
            return false;
        }
    }

    /**
     * Insert a session record
     */
    public function insertSession(array $data): bool
    {
        if (!$this->isConnected()) {
            Log::warning("ClickHouse not connected, session not stored");
            return false;
        }

        try {
            $columns = ["session_id", "user_id", "tracking_id", "start_time", "device_type", "operating_system", "browser", "screen_width", "screen_height", "viewport_width", "viewport_height", "country", "country_code", "language", "timezone", "referrer", "entry_page"];
            $values = [[
                $data["session_id"] ?? "",
                $data["user_id"] ?? "",
                $data["tracking_id"] ?? "",
                $data["start_time"] ?? now()->toDateTimeString(),
                $data["device_type"] ?? "Unknown",
                $data["operating_system"] ?? "Unknown",
                $data["browser"] ?? "Unknown",
                $data["screen_width"] ?? 0,
                $data["screen_height"] ?? 0,
                $data["viewport_width"] ?? 0,
                $data["viewport_height"] ?? 0,
                $data["country"] ?? null,
                $data["country_code"] ?? null,
                $data["language"] ?? "en",
                $data["timezone"] ?? "UTC",
                $data["referrer"] ?? "",
                $data["entry_page"] ?? "",
            ]];
            $this->client->insert("sessions", $values, $columns);
            return true;
        } catch (Exception $e) {
            Log::error("Failed to insert session: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Insert an interaction event (click, scroll, etc.)
     */
    public function insertInteractionEvent(array $data): bool
    {
        if (!$this->isConnected()) {
            return false;
        }

        try {
            $columns = ["timestamp", "session_id", "user_id", "tracking_id", "event_type", "page_url", "x", "y", "element", "element_id", "element_class", "button_text", "link_url", "link_text", "is_external"];
            $values = [[
                $data["timestamp"] ?? now()->toDateTimeString(),
                $data["session_id"] ?? "",
                $data["user_id"] ?? "",
                $data["tracking_id"] ?? "",
                $data["event_type"] ?? "",
                $data["page_url"] ?? "",
                $data["x"] ?? null,
                $data["y"] ?? null,
                $data["element"] ?? "",
                $data["element_id"] ?? null,
                $data["element_class"] ?? null,
                $data["button_text"] ?? null,
                $data["link_url"] ?? null,
                $data["link_text"] ?? null,
                $data["is_external"] ?? null,
            ]];
            $this->client->insert("interaction_events", $values, $columns);
            return true;
        } catch (Exception $e) {
            Log::error("Failed to insert interaction event: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Insert a form event
     */
    public function insertFormEvent(array $data): bool
    {
        if (!$this->isConnected()) {
            return false;
        }

        try {
            $columns = ["timestamp", "session_id", "user_id", "tracking_id", "page_url", "event_type", "form_id", "form_name", "form_action", "form_method", "field_name", "field_type", "field_count", "has_file_upload", "success"];
            $values = [[
                $data["timestamp"] ?? now()->toDateTimeString(),
                $data["session_id"] ?? "",
                $data["user_id"] ?? "",
                $data["tracking_id"] ?? "",
                $data["page_url"] ?? "",
                $data["event_type"] ?? "",
                $data["form_id"] ?? "",
                $data["form_name"] ?? "default_form",
                $data["form_action"] ?? null,
                $data["form_method"] ?? null,
                $data["field_name"] ?? null,
                $data["field_type"] ?? null,
                $data["field_count"] ?? null,
                $data["has_file_upload"] ?? null,
                $data["success"] ?? null,
            ]];
            $this->client->insert("form_events", $values, $columns);
            return true;
        } catch (Exception $e) {
            Log::error("Failed to insert form event: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Count events for a specific user
     * @param string $userId The user ID (from MySQL/Laravel)
     * @return int The total count of events
     */
    public function countEventsForUser(string $userId): int
    {
        if (!$this->isConnected()) {
            Log::warning("ClickHouse not connected, returning 0 for event count");
            return 0;
        }

        try {
            // Note: user_id in ClickHouse might be 'guest' for unauthenticated users
            // We also count events by tracking_id which should match user's tracking ID
            $result = $this->client->select(
                "SELECT count(*) as total FROM page_events WHERE user_id = :user_id",
                ["user_id" => $userId]
            );

            $rows = $result->rows();
            return isset($rows[0]["total"]) ? (int)$rows[0]["total"] : 0;
        } catch (Exception $e) {
            Log::error("Failed to count events for user: " . $e->getMessage(), ["user_id" => $userId]);
            return 0;
        }
    }

    /**
     * Get the last N events for a specific user
     * @param string $userId The user ID
     * @param int $limit Maximum number of events to return
     * @return array List of recent events
     */
    public function getLastEventsForUser(string $userId, int $limit = 10): array
    {
        if (!$this->isConnected()) {
            Log::warning("ClickHouse not connected, returning empty array for events");
            return [];
        }

        try {
            $result = $this->client->select(
                "SELECT 
                    timestamp,
                    session_id,
                    user_id,
                    tracking_id,
                    event_type,
                    page_url,
                    page_title,
                    referrer,
                    duration_ms,
                    scroll_depth_max,
                    click_count
                FROM page_events 
                WHERE user_id = :user_id 
                ORDER BY timestamp DESC 
                LIMIT :limit",
                ["user_id" => $userId, "limit" => $limit]
            );

            return $result->rows();
        } catch (Exception $e) {
            Log::error("Failed to get events for user: " . $e->getMessage(), ["user_id" => $userId]);
            return [];
        }
    }

    /**
     * Get events count by tracking_id (for dashboard)
     */
    public function countEventsByTrackingId(string $trackingId): int
    {
        if (!$this->isConnected()) {
            return 0;
        }

        try {
            $result = $this->client->select(
                "SELECT count(*) as total FROM page_events WHERE tracking_id = :tracking_id",
                ["tracking_id" => $trackingId]
            );

            $rows = $result->rows();
            return isset($rows[0]["total"]) ? (int)$rows[0]["total"] : 0;
        } catch (Exception $e) {
            Log::error("Failed to count events by tracking_id: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Get recent events by tracking_id
     */
    public function getLastEventsByTrackingId(string $trackingId, int $limit = 10): array
    {
        if (!$this->isConnected()) {
            return [];
        }

        try {
            $result = $this->client->select(
                "SELECT 
                    timestamp,
                    session_id,
                    user_id,
                    tracking_id,
                    event_type,
                    page_url,
                    page_title
                FROM page_events 
                WHERE tracking_id = :tracking_id 
                ORDER BY timestamp DESC 
                LIMIT :limit",
                ["tracking_id" => $trackingId, "limit" => $limit]
            );

            return $result->rows();
        } catch (Exception $e) {
            Log::error("Failed to get events by tracking_id: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get traffic metrics for dashboard
     */
    public function getTrafficMetrics(string $trackingId, string $interval = "1d"): array
    {
        if (!$this->isConnected()) {
            return [];
        }

        try {
            $result = $this->client->select(
                "SELECT * FROM traffic_metrics 
                WHERE tracking_id = :tracking_id 
                AND interval_type = :interval 
                ORDER BY timestamp DESC 
                LIMIT 30",
                ["tracking_id" => $trackingId, "interval" => $interval]
            );

            return $result->rows();
        } catch (Exception $e) {
            Log::error("Failed to get traffic metrics: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get real-time stats (last 5 minutes)
     */
    public function getRealTimeStats(string $trackingId): array
    {
        if (!$this->isConnected()) {
            return [
                "active_users" => 0,
                "page_views" => 0,
                "events" => 0,
            ];
        }

        try {
            $result = $this->client->select(
                "SELECT 
                    uniq(session_id) as active_users,
                    countIf(event_type = 'page_view') as page_views,
                    count(*) as events
                FROM page_events 
                WHERE tracking_id = :tracking_id 
                AND timestamp >= now() - INTERVAL 5 MINUTE",
                ["tracking_id" => $trackingId]
            );

            $rows = $result->rows();
            return $rows[0] ?? [
                "active_users" => 0,
                "page_views" => 0,
                "events" => 0,
            ];
        } catch (Exception $e) {
            Log::error("Failed to get real-time stats: " . $e->getMessage());
            return [
                "active_users" => 0,
                "page_views" => 0,
                "events" => 0,
            ];
        }
    }

    /**
     * Test connection to ClickHouse
     */
    public function testConnection(): array
    {
        if (!$this->isConnected()) {
            return [
                "success" => false,
                "message" => "ClickHouse client not initialized",
            ];
        }

        try {
            $result = $this->client->select("SELECT 1 as test");
            return [
                "success" => true,
                "message" => "ClickHouse connection successful",
            ];
        } catch (Exception $e) {
            return [
                "success" => false,
                "message" => "Connection test failed: " . $e->getMessage(),
            ];
        }
    }

    /**
     * Get overview statistics for dashboard
     */
    public function getOverviewStats(string $trackingId, string $period = '7d'): array
    {
        if (!$this->isConnected()) {
            return $this->getEmptyOverviewStats();
        }

        try {
            $interval = $this->periodToInterval($period);
            $previousInterval = $this->periodToPreviousInterval($period);

            // Current period stats
            $currentStats = $this->client->select(
                "SELECT 
                    uniq(session_id) as sessions,
                    uniq(user_id) as visitors,
                    countIf(event_type = 'page_view') as pageviews,
                    count(*) as total_events
                FROM page_events 
                WHERE tracking_id = :tracking_id 
                AND timestamp >= now() - INTERVAL {$interval}",
                ["tracking_id" => $trackingId]
            )->rows()[0] ?? [];

            // Previous period stats for comparison
            $previousStats = $this->client->select(
                "SELECT 
                    uniq(session_id) as sessions,
                    uniq(user_id) as visitors,
                    countIf(event_type = 'page_view') as pageviews
                FROM page_events 
                WHERE tracking_id = :tracking_id 
                AND timestamp >= now() - INTERVAL {$previousInterval}
                AND timestamp < now() - INTERVAL {$interval}",
                ["tracking_id" => $trackingId]
            )->rows()[0] ?? [];

            // Bounce rate calculation
            $bounceData = $this->client->select(
                "SELECT 
                    countIf(page_count = 1) as bounced,
                    count() as total
                FROM (
                    SELECT session_id, count() as page_count
                    FROM page_events
                    WHERE tracking_id = :tracking_id 
                    AND timestamp >= now() - INTERVAL {$interval}
                    AND event_type IN ('page_view', 'page_load')
                    GROUP BY session_id
                )",
                ["tracking_id" => $trackingId]
            )->rows()[0] ?? [];

            $bounceRate = ($bounceData['total'] ?? 0) > 0 
                ? round(($bounceData['bounced'] ?? 0) / $bounceData['total'] * 100, 2) 
                : 0;

            // Average session duration
            $durationData = $this->client->select(
                "SELECT avg(duration_ms) as avg_duration
                FROM page_events
                WHERE tracking_id = :tracking_id 
                AND timestamp >= now() - INTERVAL {$interval}
                AND event_type = 'page_unload'
                AND duration_ms > 0",
                ["tracking_id" => $trackingId]
            )->rows()[0] ?? [];

            $avgDuration = round(($durationData['avg_duration'] ?? 0) / 1000); // Convert to seconds

            return [
                'visitors' => (int)($currentStats['visitors'] ?? 0),
                'previousVisitors' => (int)($previousStats['visitors'] ?? 0),
                'sessions' => (int)($currentStats['sessions'] ?? 0),
                'previousSessions' => (int)($previousStats['sessions'] ?? 0),
                'pageviews' => (int)($currentStats['pageviews'] ?? 0),
                'bounceRate' => $bounceRate,
                'previousBounceRate' => 0,
                'avgDuration' => $avgDuration,
                'previousAvgDuration' => 0,
                'totalEvents' => (int)($currentStats['total_events'] ?? 0),
            ];
        } catch (Exception $e) {
            Log::error("Failed to get overview stats: " . $e->getMessage());
            return $this->getEmptyOverviewStats();
        }
    }

    private function getEmptyOverviewStats(): array
    {
        return [
            'visitors' => 0,
            'previousVisitors' => 0,
            'sessions' => 0,
            'previousSessions' => 0,
            'pageviews' => 0,
            'bounceRate' => 0,
            'previousBounceRate' => 0,
            'avgDuration' => 0,
            'previousAvgDuration' => 0,
            'totalEvents' => 0,
        ];
    }

    /**
     * Get traffic data over time
     */
    public function getTrafficData(string $trackingId, string $period = '7d'): array
    {
        if (!$this->isConnected()) {
            return [];
        }

        try {
            $interval = $this->periodToInterval($period);
            
            $result = $this->client->select(
                "SELECT 
                    toDate(timestamp) as date,
                    uniq(user_id) as visitors,
                    uniq(session_id) as sessions,
                    countIf(event_type = 'page_view') as pageviews
                FROM page_events 
                WHERE tracking_id = :tracking_id 
                AND timestamp >= now() - INTERVAL {$interval}
                GROUP BY date
                ORDER BY date ASC",
                ["tracking_id" => $trackingId]
            );

            return array_map(function($row) {
                return [
                    'timestamp' => $row['date'],
                    'visitors' => (int)$row['visitors'],
                    'sessions' => (int)$row['sessions'],
                    'pageviews' => (int)$row['pageviews'],
                ];
            }, $result->rows());
        } catch (Exception $e) {
            Log::error("Failed to get traffic data: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get top pages
     */
    public function getTopPages(string $trackingId, int $limit = 10): array
    {
        if (!$this->isConnected()) {
            return [];
        }

        try {
            $result = $this->client->select(
                "SELECT 
                    page_url,
                    count() as pageviews,
                    uniq(user_id) as unique_visitors,
                    avg(duration_ms) / 1000 as avg_time_on_page_sec,
                    avg(scroll_depth_max) as avg_scroll_depth
                FROM page_events 
                WHERE tracking_id = :tracking_id 
                AND page_url != ''
                GROUP BY page_url
                ORDER BY pageviews DESC
                LIMIT :limit",
                ["tracking_id" => $trackingId, "limit" => $limit]
            );

            return array_map(function($row) {
                return [
                    'page_url' => $row['page_url'],
                    'pageviews' => (int)$row['pageviews'],
                    'unique_visitors' => (int)$row['unique_visitors'],
                    'avg_time_on_page_sec' => round($row['avg_time_on_page_sec'] ?? 0),
                    'avg_scroll_depth' => round($row['avg_scroll_depth'] ?? 0),
                ];
            }, $result->rows());
        } catch (Exception $e) {
            Log::error("Failed to get top pages: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get device breakdown
     */
    public function getDeviceStats(string $trackingId): array
    {
        if (!$this->isConnected()) {
            return ['devices' => [], 'browsers' => [], 'os' => []];
        }

        try {
            // Device types from sessions table
            $devices = $this->client->select(
                "SELECT 
                    device_type as name,
                    count() as value
                FROM sessions 
                WHERE tracking_id = :tracking_id 
                AND device_type != ''
                GROUP BY device_type
                ORDER BY value DESC",
                ["tracking_id" => $trackingId]
            )->rows();

            // Browsers
            $browsers = $this->client->select(
                "SELECT 
                    browser as name,
                    count() as value
                FROM sessions 
                WHERE tracking_id = :tracking_id 
                AND browser != ''
                GROUP BY browser
                ORDER BY value DESC
                LIMIT 5",
                ["tracking_id" => $trackingId]
            )->rows();

            // Operating systems
            $os = $this->client->select(
                "SELECT 
                    operating_system as name,
                    count() as value
                FROM sessions 
                WHERE tracking_id = :tracking_id 
                AND operating_system != ''
                GROUP BY operating_system
                ORDER BY value DESC
                LIMIT 5",
                ["tracking_id" => $trackingId]
            )->rows();

            // Screen resolutions
            $screens = $this->client->select(
                "SELECT 
                    concat(toString(screen_width), 'x', toString(screen_height)) as name,
                    count() as value
                FROM sessions 
                WHERE tracking_id = :tracking_id 
                AND screen_width > 0
                GROUP BY screen_width, screen_height
                ORDER BY value DESC
                LIMIT 5",
                ["tracking_id" => $trackingId]
            )->rows();

            return [
                'devices' => array_map(fn($r) => ['name' => $r['name'], 'value' => (int)$r['value']], $devices),
                'browsers' => array_map(fn($r) => ['name' => $r['name'], 'value' => (int)$r['value']], $browsers),
                'os' => array_map(fn($r) => ['name' => $r['name'], 'value' => (int)$r['value']], $os),
                'screens' => array_map(fn($r) => ['name' => $r['name'], 'value' => (int)$r['value']], $screens),
            ];
        } catch (Exception $e) {
            Log::error("Failed to get device stats: " . $e->getMessage());
            return ['devices' => [], 'browsers' => [], 'os' => [], 'screens' => []];
        }
    }

    /**
     * Get geographic data
     */
    public function getGeoStats(string $trackingId, int $limit = 10): array
    {
        if (!$this->isConnected()) {
            return [];
        }

        try {
            $result = $this->client->select(
                "SELECT 
                    country as name,
                    count() as value
                FROM sessions 
                WHERE tracking_id = :tracking_id 
                AND country != '' AND country IS NOT NULL
                GROUP BY country
                ORDER BY value DESC
                LIMIT :limit",
                ["tracking_id" => $trackingId, "limit" => $limit]
            );

            return array_map(fn($r) => ['name' => $r['name'], 'value' => (int)$r['value']], $result->rows());
        } catch (Exception $e) {
            Log::error("Failed to get geo stats: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get real-time active users (last 5 minutes)
     */
    public function getRealTimeData(string $trackingId): array
    {
        if (!$this->isConnected()) {
            return [
                'activeUsers' => 0,
                'pageViews' => 0,
                'events' => 0,
                'topPages' => [],
                'recentEvents' => [],
            ];
        }

        try {
            // Active users in last 5 minutes
            $stats = $this->client->select(
                "SELECT 
                    uniq(session_id) as active_users,
                    countIf(event_type = 'page_view') as page_views,
                    count(*) as events
                FROM page_events 
                WHERE tracking_id = :tracking_id 
                AND timestamp >= now() - INTERVAL 5 MINUTE",
                ["tracking_id" => $trackingId]
            )->rows()[0] ?? [];

            // Top pages in last 5 minutes
            $topPages = $this->client->select(
                "SELECT 
                    page_url,
                    count() as views
                FROM page_events 
                WHERE tracking_id = :tracking_id 
                AND timestamp >= now() - INTERVAL 5 MINUTE
                AND page_url != ''
                GROUP BY page_url
                ORDER BY views DESC
                LIMIT 5",
                ["tracking_id" => $trackingId]
            )->rows();

            // Recent events
            $recentEvents = $this->client->select(
                "SELECT 
                    timestamp,
                    event_type,
                    page_url,
                    session_id
                FROM page_events 
                WHERE tracking_id = :tracking_id 
                ORDER BY timestamp DESC
                LIMIT 10",
                ["tracking_id" => $trackingId]
            )->rows();

            return [
                'activeUsers' => (int)($stats['active_users'] ?? 0),
                'pageViews' => (int)($stats['page_views'] ?? 0),
                'events' => (int)($stats['events'] ?? 0),
                'topPages' => array_map(fn($r) => ['page' => $r['page_url'], 'views' => (int)$r['views']], $topPages),
                'recentEvents' => $recentEvents,
            ];
        } catch (Exception $e) {
            Log::error("Failed to get real-time data: " . $e->getMessage());
            return [
                'activeUsers' => 0,
                'pageViews' => 0,
                'events' => 0,
                'topPages' => [],
                'recentEvents' => [],
            ];
        }
    }

    /**
     * Get interaction stats (clicks, scrolls, etc.)
     */
    public function getInteractionStats(string $trackingId): array
    {
        if (!$this->isConnected()) {
            return ['clicks' => 0, 'linkClicks' => 0, 'scrollEvents' => 0, 'formSubmits' => 0];
        }

        try {
            $result = $this->client->select(
                "SELECT 
                    countIf(event_type = 'click') as clicks,
                    countIf(event_type = 'link_click') as link_clicks,
                    countIf(event_type = 'scroll') as scroll_events
                FROM interaction_events 
                WHERE tracking_id = :tracking_id",
                ["tracking_id" => $trackingId]
            )->rows()[0] ?? [];

            $formSubmits = $this->client->select(
                "SELECT count() as form_submits
                FROM form_events 
                WHERE tracking_id = :tracking_id 
                AND event_type = 'form_submit'",
                ["tracking_id" => $trackingId]
            )->rows()[0]['form_submits'] ?? 0;

            return [
                'clicks' => (int)($result['clicks'] ?? 0),
                'linkClicks' => (int)($result['link_clicks'] ?? 0),
                'scrollEvents' => (int)($result['scroll_events'] ?? 0),
                'formSubmits' => (int)$formSubmits,
            ];
        } catch (Exception $e) {
            Log::error("Failed to get interaction stats: " . $e->getMessage());
            return ['clicks' => 0, 'linkClicks' => 0, 'scrollEvents' => 0, 'formSubmits' => 0];
        }
    }

    /**
     * Convert period string to SQL interval
     */
    private function periodToInterval(string $period): string
    {
        return match($period) {
            '24h' => '24 HOUR',
            '7d' => '7 DAY',
            '30d' => '30 DAY',
            '90d' => '90 DAY',
            default => '7 DAY',
        };
    }

    /**
     * Convert period string to previous period interval
     */
    private function periodToPreviousInterval(string $period): string
    {
        return match($period) {
            '24h' => '48 HOUR',
            '7d' => '14 DAY',
            '30d' => '60 DAY',
            '90d' => '180 DAY',
            default => '14 DAY',
        };
    }

    /**
     * Get form analytics
     */
    public function getFormStats(string $trackingId): array
    {
        if (!$this->isConnected()) {
            return ['forms' => [], 'totalSubmissions' => 0, 'totalInteractions' => 0];
        }

        try {
            $submissions = $this->client->select(
                "SELECT 
                    form_id,
                    form_name,
                    count() as submissions,
                    uniq(session_id) as unique_users
                FROM form_events 
                WHERE tracking_id = :tracking_id 
                AND event_type = 'form_submit'
                GROUP BY form_id, form_name
                ORDER BY submissions DESC
                LIMIT 10",
                ["tracking_id" => $trackingId]
            )->rows();

            $totalSubmissions = $this->client->select(
                "SELECT count() as total FROM form_events 
                WHERE tracking_id = :tracking_id AND event_type = 'form_submit'",
                ["tracking_id" => $trackingId]
            )->rows()[0]['total'] ?? 0;

            $totalInteractions = $this->client->select(
                "SELECT count() as total FROM form_events 
                WHERE tracking_id = :tracking_id",
                ["tracking_id" => $trackingId]
            )->rows()[0]['total'] ?? 0;

            return [
                'forms' => $submissions,
                'totalSubmissions' => (int)$totalSubmissions,
                'totalInteractions' => (int)$totalInteractions,
            ];
        } catch (Exception $e) {
            Log::error("Failed to get form stats: " . $e->getMessage());
            return ['forms' => [], 'totalSubmissions' => 0, 'totalInteractions' => 0];
        }
    }

    /**
     * Get video analytics
     */
    public function getVideoStats(string $trackingId): array
    {
        if (!$this->isConnected()) {
            return ['videos' => [], 'totalPlays' => 0, 'totalCompletes' => 0];
        }

        try {
            $videos = $this->client->select(
                "SELECT 
                    element as video_src,
                    countIf(event_type = 'video_play') as plays,
                    countIf(event_type = 'video_pause') as pauses,
                    countIf(event_type = 'video_complete') as completes
                FROM interaction_events 
                WHERE tracking_id = :tracking_id 
                AND event_type LIKE 'video_%'
                GROUP BY element
                ORDER BY plays DESC
                LIMIT 10",
                ["tracking_id" => $trackingId]
            )->rows();

            $totalPlays = $this->client->select(
                "SELECT count() as total FROM interaction_events 
                WHERE tracking_id = :tracking_id AND event_type = 'video_play'",
                ["tracking_id" => $trackingId]
            )->rows()[0]['total'] ?? 0;

            $totalCompletes = $this->client->select(
                "SELECT count() as total FROM interaction_events 
                WHERE tracking_id = :tracking_id AND event_type = 'video_complete'",
                ["tracking_id" => $trackingId]
            )->rows()[0]['total'] ?? 0;

            return [
                'videos' => $videos,
                'totalPlays' => (int)$totalPlays,
                'totalCompletes' => (int)$totalCompletes,
            ];
        } catch (Exception $e) {
            Log::error("Failed to get video stats: " . $e->getMessage());
            return ['videos' => [], 'totalPlays' => 0, 'totalCompletes' => 0];
        }
    }

    /**
     * Get click/interaction details
     */
    public function getClickStats(string $trackingId): array
    {
        if (!$this->isConnected()) {
            return ['totalClicks' => 0, 'linkClicks' => 0, 'buttonClicks' => 0, 'topElements' => []];
        }

        try {
            $stats = $this->client->select(
                "SELECT 
                    count() as total_clicks,
                    countIf(event_type = 'link_click') as link_clicks,
                    countIf(event_type = 'click' AND element = 'button') as button_clicks
                FROM interaction_events 
                WHERE tracking_id = :tracking_id",
                ["tracking_id" => $trackingId]
            )->rows()[0] ?? [];

            $topElements = $this->client->select(
                "SELECT 
                    element,
                    element_id,
                    count() as clicks
                FROM interaction_events 
                WHERE tracking_id = :tracking_id 
                AND element != ''
                GROUP BY element, element_id
                ORDER BY clicks DESC
                LIMIT 10",
                ["tracking_id" => $trackingId]
            )->rows();

            return [
                'totalClicks' => (int)($stats['total_clicks'] ?? 0),
                'linkClicks' => (int)($stats['link_clicks'] ?? 0),
                'buttonClicks' => (int)($stats['button_clicks'] ?? 0),
                'topElements' => $topElements,
            ];
        } catch (Exception $e) {
            Log::error("Failed to get click stats: " . $e->getMessage());
            return ['totalClicks' => 0, 'linkClicks' => 0, 'buttonClicks' => 0, 'topElements' => []];
        }
    }

    /**
     * Get ecommerce stats
     */
    public function getEcommerceStats(string $trackingId): array
    {
        if (!$this->isConnected()) {
            return [
                'productViews' => 0,
                'cartAdds' => 0,
                'purchases' => 0,
                'revenue' => 0,
            ];
        }

        try {
            $stats = $this->client->select(
                "SELECT 
                    countIf(event_type = 'product_view') as product_views,
                    countIf(event_type = 'cart_add') as cart_adds,
                    countIf(event_type = 'purchase') as purchases
                FROM interaction_events 
                WHERE tracking_id = :tracking_id",
                ["tracking_id" => $trackingId]
            )->rows()[0] ?? [];

            return [
                'productViews' => (int)($stats['product_views'] ?? 0),
                'cartAdds' => (int)($stats['cart_adds'] ?? 0),
                'purchases' => (int)($stats['purchases'] ?? 0),
                'revenue' => 0, // Would need separate table for revenue tracking
            ];
        } catch (Exception $e) {
            Log::error("Failed to get ecommerce stats: " . $e->getMessage());
            return ['productViews' => 0, 'cartAdds' => 0, 'purchases' => 0, 'revenue' => 0];
        }
    }
}
