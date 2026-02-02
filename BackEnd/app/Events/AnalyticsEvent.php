<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class AnalyticsEvent implements ShouldBroadcast
{
    use SerializesModels;

    public string $trackingId;
    public string $eventType;
    public array $data;

    public function __construct(string $trackingId, string $eventType, array $data = [])
    {
        $this->trackingId = $trackingId;
        $this->eventType = $eventType;
        $this->data = $data;
    }

    public function broadcastOn()
    {
        // Broadcast to tracking-specific channel
        return [
            new Channel("analytics-channel"),
            new Channel("analytics.{$this->trackingId}"),
        ];
    }

    public function broadcastAs()
    {
        return "analytics.new";
    }

    public function broadcastWith()
    {
        return [
            "tracking_id" => $this->trackingId,
            "event_type" => $this->eventType,
            "data" => $this->data,
            "timestamp" => now()->toISOString(),
        ];
    }
}
