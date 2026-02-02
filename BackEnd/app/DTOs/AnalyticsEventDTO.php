<?php

namespace App\DTOs;

/**
 * Base Analytics Event DTO
 * القاعدة الأساسية لجميع أحداث التحليلات
 */
class AnalyticsEventDTO
{
    public string $trackingId;
    public string $sessionId;
    public string $userId;
    public string $eventType;
    public string $pageUrl;
    public ?string $timestamp;

    public function __construct(array $data)
    {
        $this->trackingId = $data['tracking_id'] ?? '';
        $this->sessionId = $data['session_id'] ?? 'sess_' . uniqid();
        $this->userId = $data['user_id'] ?? 'guest';
        $this->eventType = $data['event_type'] ?? $data['type'] ?? 'unknown';
        $this->pageUrl = $data['page_url'] ?? $data['url'] ?? '';
        $this->timestamp = $data['timestamp'] ?? now()->toDateTimeString();
    }

    public function toArray(): array
    {
        return [
            'tracking_id' => $this->trackingId,
            'session_id' => $this->sessionId,
            'user_id' => $this->userId,
            'event_type' => $this->eventType,
            'page_url' => $this->pageUrl,
            'timestamp' => $this->timestamp,
        ];
    }

    public static function fromRequest(\Illuminate\Http\Request $request): self
    {
        return new self($request->all());
    }
}
