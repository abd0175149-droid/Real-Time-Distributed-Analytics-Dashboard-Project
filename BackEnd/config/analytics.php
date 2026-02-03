<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Tracking ID Validation
    |--------------------------------------------------------------------------
    |
    | Enable/disable validation of tracking IDs against registered users.
    | When enabled, only requests with registered tracking_ids will be accepted.
    |
    */
    'validate_tracking_id' => env('ANALYTICS_VALIDATE_TRACKING_ID', true),

    /*
    |--------------------------------------------------------------------------
    | Kafka Backend URL
    |--------------------------------------------------------------------------
    |
    | URL of the Kafka backend API for syncing tracking IDs and other operations.
    | This is used by the UserObserver to sync new tracking IDs in real-time.
    |
    */
    'kafka_backend_url' => env('KAFKA_BACKEND_URL', 'http://localhost:8080'),

    /*
    |--------------------------------------------------------------------------
    | Auto-sync Tracking IDs
    |--------------------------------------------------------------------------
    |
    | Enable/disable automatic syncing of tracking IDs to Kafka backend
    | when new users are created or their tracking_id is updated.
    |
    */
    'sync_tracking_ids' => env('ANALYTICS_SYNC_TRACKING_IDS', true),

    /*
    |--------------------------------------------------------------------------
    | Tracking ID Cache TTL
    |--------------------------------------------------------------------------
    |
    | How long (in seconds) to cache the validity of tracking IDs.
    | Default: 300 seconds (5 minutes)
    |
    */
    'tracking_id_cache_ttl' => env('ANALYTICS_TRACKING_ID_CACHE_TTL', 300),
];
