<?php

namespace App\Services\ClickHouse;

/**
 * Sessions Service
 * خدمة الجلسات
 */
class SessionsService extends BaseClickHouseService
{
    protected string $table = 'sessions';

    /**
     * Insert a session
     */
    public function insert(array $data): bool
    {
        $columns = [
            'session_id', 'user_id', 'tracking_id', 'start_time',
            'device_type', 'operating_system', 'browser',
            'screen_width', 'screen_height', 'viewport_width', 'viewport_height',
            'country', 'country_code', 'language', 'timezone',
            'referrer', 'entry_page'
        ];

        $values = [
            $data['session_id'] ?? '',
            $data['user_id'] ?? '',
            $data['tracking_id'] ?? '',
            $data['start_time'] ?? now()->toDateTimeString(),
            $data['device_type'] ?? 'Unknown',
            $data['operating_system'] ?? 'Unknown',
            $data['browser'] ?? 'Unknown',
            $data['screen_width'] ?? 0,
            $data['screen_height'] ?? 0,
            $data['viewport_width'] ?? 0,
            $data['viewport_height'] ?? 0,
            $data['country'] ?? null,
            $data['country_code'] ?? null,
            $data['language'] ?? 'en',
            $data['timezone'] ?? 'UTC',
            $data['referrer'] ?? '',
            $data['entry_page'] ?? '',
        ];

        return $this->safeInsert($this->table, $columns, $values);
    }

    /**
     * Update session end time
     */
    public function updateEndTime(string $sessionId): bool
    {
        // Note: ClickHouse doesn't support traditional updates
        // This would need to be handled differently in production
        return true;
    }

    /**
     * Get session by ID
     */
    public function getById(string $sessionId): ?array
    {
        $query = "SELECT * FROM {$this->table} WHERE session_id = :session_id LIMIT 1";
        $rows = $this->safeSelect($query, ['session_id' => $sessionId]);
        return $rows[0] ?? null;
    }

    /**
     * Count sessions for tracking ID
     */
    public function countForTracking(string $trackingId): int
    {
        return $this->countWhere($this->table, "tracking_id = :tracking_id", ['tracking_id' => $trackingId]);
    }

    /**
     * Get sessions by device type
     */
    public function getByDeviceType(string $trackingId): array
    {
        $query = "SELECT 
                    device_type,
                    count(*) as sessions,
                    uniq(user_id) as unique_users
                  FROM {$this->table}
                  WHERE tracking_id = :tracking_id
                  GROUP BY device_type
                  ORDER BY sessions DESC";

        return $this->safeSelect($query, ['tracking_id' => $trackingId]);
    }

    /**
     * Get sessions by country
     */
    public function getByCountry(string $trackingId): array
    {
        $query = "SELECT 
                    country,
                    country_code,
                    count(*) as sessions,
                    uniq(user_id) as unique_users
                  FROM {$this->table}
                  WHERE tracking_id = :tracking_id
                  GROUP BY country, country_code
                  ORDER BY sessions DESC
                  LIMIT 20";

        return $this->safeSelect($query, ['tracking_id' => $trackingId]);
    }
}
