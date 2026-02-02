<?php

namespace App\Services\ClickHouse;

/**
 * Form Events Service
 * خدمة أحداث النماذج
 */
class FormEventsService extends BaseClickHouseService
{
    protected string $table = 'form_events';

    /**
     * Insert a form event
     */
    public function insert(array $data): bool
    {
        $columns = [
            'timestamp', 'session_id', 'user_id', 'tracking_id', 'page_url',
            'event_type', 'form_id', 'form_name', 'form_action', 'form_method',
            'field_name', 'field_type', 'field_count', 'has_file_upload', 'success'
        ];

        $values = [
            $data['timestamp'] ?? now()->toDateTimeString(),
            $data['session_id'] ?? '',
            $data['user_id'] ?? '',
            $data['tracking_id'] ?? '',
            $data['page_url'] ?? '',
            $data['event_type'] ?? '',
            $data['form_id'] ?? '',
            $data['form_name'] ?? 'default_form',
            $data['form_action'] ?? null,
            $data['form_method'] ?? null,
            $data['field_name'] ?? null,
            $data['field_type'] ?? null,
            $data['field_count'] ?? null,
            $data['has_file_upload'] ?? null,
            $data['success'] ?? null,
        ];

        return $this->safeInsert($this->table, $columns, $values);
    }

    /**
     * Get form performance metrics
     */
    public function getFormMetrics(string $trackingId, string $formId): array
    {
        $query = "SELECT 
                    countIf(event_type = 'form_focus') as starts,
                    countIf(event_type = 'form_submit') as submissions,
                    countIf(event_type = 'form_submit' AND success = 1) as successful,
                    if(countIf(event_type = 'form_focus') > 0,
                       countIf(event_type = 'form_submit') * 100.0 / countIf(event_type = 'form_focus'), 
                       0) as completion_rate
                  FROM {$this->table}
                  WHERE tracking_id = :tracking_id AND form_id = :form_id";

        $rows = $this->safeSelect($query, ['tracking_id' => $trackingId, 'form_id' => $formId]);
        return $rows[0] ?? [];
    }

    /**
     * Get all forms metrics
     */
    public function getAllFormsMetrics(string $trackingId): array
    {
        $query = "SELECT 
                    form_id,
                    form_name,
                    countIf(event_type = 'form_focus') as starts,
                    countIf(event_type = 'form_submit') as submissions,
                    if(countIf(event_type = 'form_focus') > 0,
                       countIf(event_type = 'form_submit') * 100.0 / countIf(event_type = 'form_focus'), 
                       0) as completion_rate
                  FROM {$this->table}
                  WHERE tracking_id = :tracking_id
                  GROUP BY form_id, form_name
                  ORDER BY submissions DESC";

        return $this->safeSelect($query, ['tracking_id' => $trackingId]);
    }
}
