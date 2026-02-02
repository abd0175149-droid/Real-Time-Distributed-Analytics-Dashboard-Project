<?php

namespace App\Services\ClickHouse;

/**
 * Interaction Events Service
 * خدمة أحداث التفاعل
 */
class InteractionEventsService extends BaseClickHouseService
{
    protected string $table = 'interaction_events';

    /**
     * Insert an interaction event
     */
    public function insert(array $data): bool
    {
        $columns = [
            'timestamp', 'session_id', 'user_id', 'tracking_id', 'event_type',
            'page_url', 'x', 'y', 'element', 'element_id', 'element_class',
            'button_text', 'link_url', 'link_text', 'is_external'
        ];

        $values = [
            $data['timestamp'] ?? now()->toDateTimeString(),
            $data['session_id'] ?? '',
            $data['user_id'] ?? '',
            $data['tracking_id'] ?? '',
            $data['event_type'] ?? '',
            $data['page_url'] ?? '',
            $data['x'] ?? null,
            $data['y'] ?? null,
            $data['element'] ?? '',
            $data['element_id'] ?? null,
            $data['element_class'] ?? null,
            $data['button_text'] ?? null,
            $data['link_url'] ?? null,
            $data['link_text'] ?? null,
            $data['is_external'] ?? null,
        ];

        return $this->safeInsert($this->table, $columns, $values);
    }

    /**
     * Get click heatmap data for a page
     */
    public function getClickHeatmap(string $trackingId, string $pageUrl): array
    {
        $query = "SELECT 
                    x, y, count(*) as clicks
                  FROM {$this->table}
                  WHERE tracking_id = :tracking_id 
                    AND page_url = :page_url 
                    AND event_type = 'click'
                    AND x IS NOT NULL 
                    AND y IS NOT NULL
                  GROUP BY x, y
                  ORDER BY clicks DESC
                  LIMIT 1000";

        return $this->safeSelect($query, ['tracking_id' => $trackingId, 'page_url' => $pageUrl]);
    }

    /**
     * Get most clicked elements
     */
    public function getMostClickedElements(string $trackingId, int $limit = 20): array
    {
        $query = "SELECT 
                    element,
                    element_id,
                    page_url,
                    count(*) as clicks
                  FROM {$this->table}
                  WHERE tracking_id = :tracking_id AND event_type = 'click'
                  GROUP BY element, element_id, page_url
                  ORDER BY clicks DESC
                  LIMIT :limit";

        return $this->safeSelect($query, ['tracking_id' => $trackingId, 'limit' => $limit]);
    }

    /**
     * Get external links clicked
     */
    public function getExternalLinks(string $trackingId): array
    {
        $query = "SELECT 
                    link_url,
                    link_text,
                    count(*) as clicks
                  FROM {$this->table}
                  WHERE tracking_id = :tracking_id 
                    AND event_type = 'link_click'
                    AND is_external = 1
                  GROUP BY link_url, link_text
                  ORDER BY clicks DESC
                  LIMIT 50";

        return $this->safeSelect($query, ['tracking_id' => $trackingId]);
    }
}
