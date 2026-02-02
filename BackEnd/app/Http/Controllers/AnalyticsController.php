<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Services\ClickHouseTestService;
use App\Events\AnalyticsEvent;

class AnalyticsController extends Controller
{
    protected ClickHouseTestService $clickhouse;

    public function __construct(ClickHouseTestService $clickhouse)
    {
        $this->clickhouse = $clickhouse;
    }

    /**
     * Main tracking endpoint - handles all event types from Tracker
     */
    public function track(Request $request)
    {
        // Basic validation
        $request->validate([
            "tracking_id" => "required|string|max:100",
            "type"        => "sometimes|string",
            "event_type"  => "sometimes|string",
        ]);

        // Get event type from either 'type' or 'event_type' field
        $eventType = $request->input("type") ?? $request->input("event_type") ?? "unknown";
        $trackingId = $request->input("tracking_id");
        $sessionId = $request->input("session_id") ?? ("sess_" . uniqid());
        $userId = Auth::check() ? Auth::id() : ($request->input("user_id") ?? "guest");

        // Route to appropriate handler based on event type
        $result = match ($eventType) {
            "page_load" => $this->handlePageLoad($request, $trackingId, $sessionId, $userId),
            "page_view" => $this->handlePageView($request, $trackingId, $sessionId, $userId),
            "page_unload" => $this->handlePageUnload($request, $trackingId, $sessionId, $userId),
            "page_hidden", "page_visible" => $this->handleVisibilityEvent($request, $eventType, $trackingId, $sessionId, $userId),
            "click", "mouse_click" => $this->handleClick($request, $trackingId, $sessionId, $userId),
            "button_click" => $this->handleButtonClick($request, $trackingId, $sessionId, $userId),
            "scroll", "scroll_depth" => $this->handleScroll($request, $trackingId, $sessionId, $userId),
            "form_focus", "form_input", "form_submit" => $this->handleFormEvent($request, $eventType, $trackingId, $sessionId, $userId),
            "video_play", "video_pause", "video_complete", "play", "pause", "complete", "progress_25", "progress_50", "progress_75" => $this->handleVideoEvent($request, $eventType, $trackingId, $sessionId, $userId),
            "link_click", "file_download" => $this->handleLinkClick($request, $trackingId, $sessionId, $userId),
            "product_view", "cart_add", "cart_remove", "checkout_step", "purchase" => $this->handleEcommerceEvent($request, $eventType, $trackingId, $sessionId, $userId),
            "custom", "custom_event" => $this->handleCustomEvent($request, $trackingId, $sessionId, $userId),
            "periodic_events" => $this->handlePeriodicEvents($request, $trackingId, $sessionId, $userId),
            default => $this->handleGenericEvent($request, $eventType, $trackingId, $sessionId, $userId),
        };

        // Broadcast real-time event (if enabled)
        try {
            if (config('broadcasting.default') !== null) {
                broadcast(new AnalyticsEvent($trackingId, $eventType, [
                    "session_id" => $sessionId,
                    "user_id" => $userId,
                    "page_url" => $request->input("page_url") ?? $request->input("url"),
                ]))->toOthers();
            }
        } catch (\Exception $e) {
            Log::warning("Failed to broadcast analytics event: " . $e->getMessage());
        }

        return response()->json([
            "status" => $result ? "ok" : "error",
            "message" => $result ? "Event stored successfully" : "Failed to store event",
            "event_type" => $eventType,
        ], $result ? 200 : 500);
    }

    /**
     * Handle page_load event - includes first-time session data
     */
    protected function handlePageLoad(Request $request, string $trackingId, string $sessionId, string $userId): bool
    {
        $data = $request->input("data", []);
        
        // Insert session record
        $sessionResult = $this->clickhouse->insertSession([
            "session_id" => $sessionId,
            "user_id" => $userId,
            "tracking_id" => $trackingId,
            "start_time" => now()->toDateTimeString(),
            "device_type" => $data["device_type"] ?? $request->input("device_type") ?? "Unknown",
            "operating_system" => $data["operating_system"] ?? $request->input("operating_system") ?? "Unknown",
            "browser" => $this->extractBrowser($data["browser"] ?? $request->input("browser") ?? ""),
            "screen_width" => $data["screen_resolution"]["width"] ?? $request->input("screen_width") ?? 0,
            "screen_height" => $data["screen_resolution"]["height"] ?? $request->input("screen_height") ?? 0,
            "viewport_width" => $data["viewport"]["width"] ?? $request->input("viewport_width") ?? 0,
            "viewport_height" => $data["viewport"]["height"] ?? $request->input("viewport_height") ?? 0,
            "country" => $data["location"]["country"] ?? $request->input("country") ?? null,
            "country_code" => $data["location"]["country_code"] ?? $request->input("country_code") ?? null,
            "language" => $data["language"] ?? $request->input("language") ?? "en",
            "timezone" => $data["timezone"] ?? $request->input("timezone") ?? "UTC",
            "referrer" => $data["referrer"] ?? $request->input("referrer") ?? "",
            "entry_page" => $data["url"] ?? $request->input("url") ?? "",
        ]);

        // Extract performance data
        $performance = $data["performance"] ?? [];

        // Insert page event
        $eventResult = $this->clickhouse->insertEvent([
            "timestamp" => now()->toDateTimeString(),
            "session_id" => $sessionId,
            "user_id" => $userId,
            "tracking_id" => $trackingId,
            "event_type" => "page_load",
            "page_url" => $data["url"] ?? $request->input("url") ?? "",
            "page_title" => $data["title"] ?? $request->input("title") ?? "",
            "referrer" => $data["referrer"] ?? $request->input("referrer") ?? "",
            "dns_time" => $performance["dns_time"] ?? null,
            "connect_time" => $performance["connect_time"] ?? null,
            "response_time" => $performance["response_time"] ?? null,
            "dom_load_time" => $performance["dom_load_time"] ?? null,
            "page_load_time" => $performance["page_load_time"] ?? $data["page_load_time"] ?? null,
            "connection_type" => $data["network"]["effectiveType"] ?? null,
            "connection_downlink" => $data["network"]["downlink"] ?? null,
            "connection_rtt" => $data["network"]["rtt"] ?? null,
        ]);

        return $sessionResult || $eventResult;
    }

    /**
     * Handle page_view event
     */
    protected function handlePageView(Request $request, string $trackingId, string $sessionId, string $userId): bool
    {
        return $this->clickhouse->insertEvent([
            "timestamp" => now()->toDateTimeString(),
            "session_id" => $sessionId,
            "user_id" => $userId,
            "tracking_id" => $trackingId,
            "event_type" => "page_view",
            "page_url" => $request->input("page_url") ?? $request->input("url") ?? "",
            "page_title" => $request->input("page_title") ?? $request->input("title") ?? "",
            "referrer" => $request->input("referrer") ?? "",
        ]);
    }

    /**
     * Handle page_unload event - includes duration and scroll depth
     */
    protected function handlePageUnload(Request $request, string $trackingId, string $sessionId, string $userId): bool
    {
        return $this->clickhouse->insertEvent([
            "timestamp" => now()->toDateTimeString(),
            "session_id" => $sessionId,
            "user_id" => $userId,
            "tracking_id" => $trackingId,
            "event_type" => "page_unload",
            "page_url" => $request->input("page_url") ?? $request->input("url") ?? "",
            "duration_ms" => $request->input("duration_ms") ?? $request->input("time_on_page") ?? null,
            "scroll_depth_max" => $request->input("scroll_depth_max") ?? $request->input("max_scroll") ?? null,
            "click_count" => $request->input("click_count") ?? null,
        ]);
    }

    /**
     * Handle click events
     */
    protected function handleClick(Request $request, string $trackingId, string $sessionId, string $userId): bool
    {
        return $this->clickhouse->insertInteractionEvent([
            "timestamp" => now()->toDateTimeString(),
            "session_id" => $sessionId,
            "user_id" => $userId,
            "tracking_id" => $trackingId,
            "event_type" => "click",
            "page_url" => $request->input("page_url") ?? $request->input("url") ?? "",
            "x" => $request->input("x") ?? null,
            "y" => $request->input("y") ?? null,
            "element" => $request->input("element") ?? $request->input("target") ?? "",
            "element_id" => $request->input("element_id") ?? $request->input("targetId") ?? null,
            "element_class" => $request->input("element_class") ?? $request->input("targetClass") ?? null,
            "button_text" => $request->input("text") ?? null,
        ]);
    }

    /**
     * Handle scroll events
     */
    protected function handleScroll(Request $request, string $trackingId, string $sessionId, string $userId): bool
    {
        return $this->clickhouse->insertInteractionEvent([
            "timestamp" => now()->toDateTimeString(),
            "session_id" => $sessionId,
            "user_id" => $userId,
            "tracking_id" => $trackingId,
            "event_type" => "scroll",
            "page_url" => $request->input("page_url") ?? $request->input("url") ?? "",
            "element" => "document",
        ]);
    }

    /**
     * Handle form events
     */
    protected function handleFormEvent(Request $request, string $eventType, string $trackingId, string $sessionId, string $userId): bool
    {
        return $this->clickhouse->insertFormEvent([
            "timestamp" => now()->toDateTimeString(),
            "session_id" => $sessionId,
            "user_id" => $userId,
            "tracking_id" => $trackingId,
            "page_url" => $request->input("page_url") ?? $request->input("url") ?? "",
            "event_type" => $eventType,
            "form_id" => $request->input("form_id") ?? "",
            "form_name" => $request->input("form_name") ?? "default_form",
            "form_action" => $request->input("action") ?? null,
            "form_method" => $request->input("method") ?? null,
            "field_name" => $request->input("field_name") ?? null,
            "field_type" => $request->input("field_type") ?? null,
            "field_count" => $request->input("field_count") ?? null,
            "has_file_upload" => $request->input("has_file_upload") ? 1 : null,
            "success" => $request->input("success") ? 1 : null,
        ]);
    }

    /**
     * Handle video events
     */
    protected function handleVideoEvent(Request $request, string $eventType, string $trackingId, string $sessionId, string $userId): bool
    {
        // Normalize event type
        $normalizedType = match ($eventType) {
            "video_play", "play" => "play",
            "video_pause", "pause" => "pause",
            "video_complete", "complete" => "complete",
            default => $eventType,
        };

        // For now, store video events in interaction_events table
        return $this->clickhouse->insertInteractionEvent([
            "timestamp" => now()->toDateTimeString(),
            "session_id" => $sessionId,
            "user_id" => $userId,
            "tracking_id" => $trackingId,
            "event_type" => "video_" . $normalizedType,
            "page_url" => $request->input("page_url") ?? $request->input("url") ?? "",
            "element" => $request->input("video_src") ?? "",
        ]);
    }

    /**
     * Handle link click events
     */
    protected function handleLinkClick(Request $request, string $trackingId, string $sessionId, string $userId): bool
    {
        return $this->clickhouse->insertInteractionEvent([
            "timestamp" => now()->toDateTimeString(),
            "session_id" => $sessionId,
            "user_id" => $userId,
            "tracking_id" => $trackingId,
            "event_type" => "link_click",
            "page_url" => $request->input("page_url") ?? $request->input("url") ?? "",
            "link_url" => $request->input("href") ?? $request->input("link_url") ?? null,
            "link_text" => $request->input("text") ?? $request->input("link_text") ?? null,
            "is_external" => $request->input("is_external") ? 1 : null,
            "element" => "a",
        ]);
    }

    /**
     * Handle ecommerce events
     */
    protected function handleEcommerceEvent(Request $request, string $eventType, string $trackingId, string $sessionId, string $userId): bool
    {
        // This would insert into ecommerce_events table
        // For now, store as interaction event
        return $this->clickhouse->insertInteractionEvent([
            "timestamp" => now()->toDateTimeString(),
            "session_id" => $sessionId,
            "user_id" => $userId,
            "tracking_id" => $trackingId,
            "event_type" => $eventType,
            "page_url" => $request->input("page_url") ?? $request->input("url") ?? "",
            "element" => $request->input("product_id") ?? "",
        ]);
    }

    /**
     * Handle custom events
     */
    protected function handleCustomEvent(Request $request, string $trackingId, string $sessionId, string $userId): bool
    {
        return $this->clickhouse->insertInteractionEvent([
            "timestamp" => now()->toDateTimeString(),
            "session_id" => $sessionId,
            "user_id" => $userId,
            "tracking_id" => $trackingId,
            "event_type" => "custom",
            "page_url" => $request->input("page_url") ?? $request->input("url") ?? "",
            "element" => $request->input("event_name") ?? "custom_event",
        ]);
    }

    /**
     * Handle generic/unknown events - fallback handler
     */
    protected function handleGenericEvent(Request $request, string $eventType, string $trackingId, string $sessionId, string $userId): bool
    {
        return $this->clickhouse->insertEvent([
            "timestamp" => now()->toDateTimeString(),
            "session_id" => $sessionId,
            "user_id" => $userId,
            "tracking_id" => $trackingId,
            "event_type" => $eventType,
            "page_url" => $request->input("page_url") ?? $request->input("url") ?? "",
            "page_title" => $request->input("page_title") ?? $request->input("title") ?? "",
            "referrer" => $request->input("referrer") ?? "",
        ]);
    }

    /**
     * Handle button click events
     */
    protected function handleButtonClick(Request $request, string $trackingId, string $sessionId, string $userId): bool
    {
        return $this->clickhouse->insertInteractionEvent([
            "timestamp" => now()->toDateTimeString(),
            "session_id" => $sessionId,
            "user_id" => $userId,
            "tracking_id" => $trackingId,
            "event_type" => "button_click",
            "page_url" => $request->input("page_url") ?? $request->input("url") ?? "",
            "element" => "button",
            "element_id" => $request->input("button_id") ?? null,
            "button_text" => $request->input("button_text") ?? null,
        ]);
    }

    /**
     * Handle page visibility events
     */
    protected function handleVisibilityEvent(Request $request, string $eventType, string $trackingId, string $sessionId, string $userId): bool
    {
        return $this->clickhouse->insertEvent([
            "timestamp" => now()->toDateTimeString(),
            "session_id" => $sessionId,
            "user_id" => $userId,
            "tracking_id" => $trackingId,
            "event_type" => $eventType,
            "page_url" => $request->input("page_url") ?? $request->input("url") ?? "",
            "page_title" => "",
            "referrer" => "",
        ]);
    }

    /**
     * Handle periodic events batch from tracker
     */
    protected function handlePeriodicEvents(Request $request, string $trackingId, string $sessionId, string $userId): bool
    {
        $success = true;
        $timestamp = now()->toDateTimeString();

        // Handle link clicks
        $linkClicks = $request->input("linkClicks", []);
        foreach ($linkClicks as $link) {
            $this->clickhouse->insertInteractionEvent([
                "timestamp" => $timestamp,
                "session_id" => $sessionId,
                "user_id" => $userId,
                "tracking_id" => $trackingId,
                "event_type" => $link["type"] ?? "link_click",
                "page_url" => $link["page_url"] ?? "",
                "element" => "a",
                "link_url" => $link["url"] ?? null,
                "link_text" => $link["text"] ?? null,
                "is_external" => ($link["is_external"] ?? false) ? 1 : 0,
            ]);
        }

        // Handle video events
        $videoEvents = $request->input("videoEvents", []);
        foreach ($videoEvents as $video) {
            $this->clickhouse->insertInteractionEvent([
                "timestamp" => $timestamp,
                "session_id" => $sessionId,
                "user_id" => $userId,
                "tracking_id" => $trackingId,
                "event_type" => "video_" . ($video["type"] ?? "unknown"),
                "page_url" => $request->input("url") ?? "",
                "element" => $video["video_src"] ?? "",
            ]);
        }

        // Handle mouse clicks
        $mouseClicks = $request->input("mouseClicks", []);
        foreach ($mouseClicks as $click) {
            $this->clickhouse->insertInteractionEvent([
                "timestamp" => $timestamp,
                "session_id" => $sessionId,
                "user_id" => $userId,
                "tracking_id" => $trackingId,
                "event_type" => "click",
                "page_url" => $click["page_url"] ?? "",
                "x" => $click["x"] ?? null,
                "y" => $click["y"] ?? null,
                "element" => $click["element"] ?? "",
                "element_id" => $click["element_id"] ?? null,
                "element_class" => $click["element_class"] ?? null,
            ]);
        }

        // Handle form submissions
        $formSubmissions = $request->input("formSubmissions", []);
        foreach ($formSubmissions as $form) {
            $this->clickhouse->insertFormEvent([
                "timestamp" => $timestamp,
                "session_id" => $sessionId,
                "user_id" => $userId,
                "tracking_id" => $trackingId,
                "page_url" => $form["page_url"] ?? "",
                "event_type" => "form_submit",
                "form_id" => $form["form_id"] ?? "",
                "form_name" => $form["form_name"] ?? "default_form",
                "form_action" => $form["action"] ?? null,
                "form_method" => $form["method"] ?? null,
                "field_count" => $form["field_count"] ?? null,
                "has_file_upload" => ($form["has_file_upload"] ?? false) ? 1 : null,
            ]);
        }

        // Handle scroll events - store max depth
        $scrollEvents = $request->input("scrollEvents", []);
        if (!empty($scrollEvents)) {
            $maxScroll = max(array_column($scrollEvents, "scroll_percent"));
            $this->clickhouse->insertInteractionEvent([
                "timestamp" => $timestamp,
                "session_id" => $sessionId,
                "user_id" => $userId,
                "tracking_id" => $trackingId,
                "event_type" => "scroll",
                "page_url" => $request->input("url") ?? "",
                "element" => "document",
            ]);
        }

        return $success;
    }

    /**
     * Extract browser name from user agent string
     */
    protected function extractBrowser(string $userAgent): string
    {
        if (empty($userAgent)) {
            return "Unknown";
        }

        if (stripos($userAgent, "Chrome") !== false && stripos($userAgent, "Edg") === false) {
            return "Chrome";
        }
        if (stripos($userAgent, "Firefox") !== false) {
            return "Firefox";
        }
        if (stripos($userAgent, "Safari") !== false && stripos($userAgent, "Chrome") === false) {
            return "Safari";
        }
        if (stripos($userAgent, "Edg") !== false) {
            return "Edge";
        }
        if (stripos($userAgent, "MSIE") !== false || stripos($userAgent, "Trident") !== false) {
            return "Internet Explorer";
        }
        if (stripos($userAgent, "Opera") !== false || stripos($userAgent, "OPR") !== false) {
            return "Opera";
        }

        return "Other";
    }

    /**
     * Batch tracking endpoint - handle multiple events at once
     */
    public function trackBatch(Request $request)
    {
        $request->validate([
            "events" => "required|array",
            "events.*.tracking_id" => "required|string",
        ]);

        $events = $request->input("events", []);
        $successCount = 0;
        $failCount = 0;

        foreach ($events as $event) {
            // Create a new request-like object for each event
            $eventRequest = new Request($event);
            
            // Get event type
            $eventType = $event["type"] ?? $event["event_type"] ?? "unknown";
            $trackingId = $event["tracking_id"];
            $sessionId = $event["session_id"] ?? ("sess_" . uniqid());
            $userId = Auth::check() ? Auth::id() : ($event["user_id"] ?? "guest");

            // Use the generic handler for batch events
            $result = $this->handleGenericEvent($eventRequest, $eventType, $trackingId, $sessionId, $userId);

            if ($result) {
                $successCount++;
            } else {
                $failCount++;
            }
        }

        return response()->json([
            "status" => "ok",
            "message" => "Batch processed",
            "success_count" => $successCount,
            "fail_count" => $failCount,
            "total" => count($events),
        ]);
    }

    /**
     * Get real-time stats for a tracking ID
     */
    public function getRealTimeStats(Request $request, string $trackingId)
    {
        $stats = $this->clickhouse->getRealTimeStats($trackingId);

        return response()->json([
            "status" => "ok",
            "data" => $stats,
        ]);
    }

    /**
     * Test ClickHouse connection
     */
    public function testConnection()
    {
        $result = $this->clickhouse->testConnection();

        return response()->json($result);
    }
}
