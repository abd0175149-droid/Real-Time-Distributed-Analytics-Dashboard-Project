<?php

namespace App\Observers;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class UserObserver
{
    /**
     * Handle the User "created" event.
     * Syncs the new tracking_id to Kafka backend.
     */
    public function created(User $user): void
    {
        if ($user->tracking_id) {
            $this->syncTrackingIdToKafka($user->tracking_id);
        }
    }

    /**
     * Handle the User "updated" event.
     * If tracking_id changed, sync the new one.
     */
    public function updated(User $user): void
    {
        if ($user->isDirty('tracking_id') && $user->tracking_id) {
            $this->syncTrackingIdToKafka($user->tracking_id);
            
            // Invalidate cache for old tracking_id
            $oldTrackingId = $user->getOriginal('tracking_id');
            if ($oldTrackingId) {
                Cache::forget("tracking_id:valid:{$oldTrackingId}");
            }
        }
    }

    /**
     * Handle the User "deleted" event.
     * Could be used to unregister tracking_id from Kafka.
     */
    public function deleted(User $user): void
    {
        if ($user->tracking_id) {
            // Invalidate cache
            Cache::forget("tracking_id:valid:{$user->tracking_id}");
            
            // Optionally unregister from Kafka backend
            // $this->unregisterTrackingIdFromKafka($user->tracking_id);
        }
    }

    /**
     * Sync a tracking_id to Kafka backend Redis.
     */
    protected function syncTrackingIdToKafka(string $trackingId): void
    {
        if (!config('analytics.sync_tracking_ids', true)) {
            return;
        }

        $kafkaUrl = config('analytics.kafka_backend_url', env('KAFKA_BACKEND_URL', 'http://localhost:8080'));

        try {
            $response = Http::timeout(5)
                ->post("{$kafkaUrl}/api/tracking-ids/register", [
                    'tracking_id' => $trackingId
                ]);

            if ($response->successful()) {
                Log::info("Synced tracking_id to Kafka backend: {$trackingId}");
            } else {
                Log::warning("Failed to sync tracking_id to Kafka: {$trackingId} - " . $response->body());
            }
        } catch (\Exception $e) {
            // Log but don't fail - Kafka sync is not critical
            Log::warning("Could not sync tracking_id to Kafka backend: " . $e->getMessage());
        }
    }
}
