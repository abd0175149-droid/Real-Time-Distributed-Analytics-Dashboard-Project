<?php

namespace App\DTOs;

/**
 * Page Load Event DTO
 * بيانات تحميل الصفحة الأولى
 */
class PageLoadEventDTO extends AnalyticsEventDTO
{
    // Page Info
    public ?string $pageTitle;
    public ?string $referrer;

    // Device Info
    public string $deviceType;
    public string $operatingSystem;
    public string $browser;
    public int $screenWidth;
    public int $screenHeight;
    public int $viewportWidth;
    public int $viewportHeight;

    // Location
    public ?string $country;
    public ?string $countryCode;
    public ?string $city;
    public string $language;
    public string $timezone;

    // Performance
    public ?int $dnsTime;
    public ?int $connectTime;
    public ?int $responseTime;
    public ?int $domLoadTime;
    public ?int $pageLoadTime;

    // Network
    public ?string $connectionType;
    public ?float $connectionDownlink;
    public ?int $connectionRtt;

    public function __construct(array $data)
    {
        parent::__construct($data);

        $this->eventType = 'page_load';

        // Extract nested data
        $nestedData = $data['data'] ?? $data;
        $location = $nestedData['location'] ?? [];
        $performance = $nestedData['performance'] ?? [];
        $network = $nestedData['network'] ?? [];
        $screenRes = $nestedData['screen_resolution'] ?? [];
        $viewport = $nestedData['viewport'] ?? [];

        // Page Info
        $this->pageTitle = $nestedData['title'] ?? $data['page_title'] ?? '';
        $this->referrer = $nestedData['referrer'] ?? $data['referrer'] ?? '';

        // Device Info
        $this->deviceType = $nestedData['device_type'] ?? $data['device_type'] ?? 'Unknown';
        $this->operatingSystem = $nestedData['operating_system'] ?? $data['operating_system'] ?? 'Unknown';
        $this->browser = $this->extractBrowser($nestedData['browser'] ?? $data['browser'] ?? '');
        $this->screenWidth = $screenRes['width'] ?? $data['screen_width'] ?? 0;
        $this->screenHeight = $screenRes['height'] ?? $data['screen_height'] ?? 0;
        $this->viewportWidth = $viewport['width'] ?? $data['viewport_width'] ?? 0;
        $this->viewportHeight = $viewport['height'] ?? $data['viewport_height'] ?? 0;

        // Location
        $this->country = $location['country'] ?? $data['country'] ?? null;
        $this->countryCode = $location['country_code'] ?? $data['country_code'] ?? null;
        $this->city = $location['city'] ?? $data['city'] ?? null;
        $this->language = $nestedData['language'] ?? $data['language'] ?? 'en';
        $this->timezone = $nestedData['timezone'] ?? $data['timezone'] ?? 'UTC';

        // Performance
        $this->dnsTime = $performance['dns_time'] ?? $data['dns_time'] ?? null;
        $this->connectTime = $performance['connect_time'] ?? $data['connect_time'] ?? null;
        $this->responseTime = $performance['response_time'] ?? $data['response_time'] ?? null;
        $this->domLoadTime = $performance['dom_load_time'] ?? $data['dom_load_time'] ?? null;
        $this->pageLoadTime = $performance['page_load_time'] ?? $nestedData['page_load_time'] ?? $data['page_load_time'] ?? null;

        // Network
        $this->connectionType = $network['effectiveType'] ?? $data['connection_type'] ?? null;
        $this->connectionDownlink = $network['downlink'] ?? $data['connection_downlink'] ?? null;
        $this->connectionRtt = $network['rtt'] ?? $data['connection_rtt'] ?? null;
    }

    protected function extractBrowser(string $userAgent): string
    {
        if (empty($userAgent)) return 'Unknown';
        if (stripos($userAgent, 'Chrome') !== false && stripos($userAgent, 'Edg') === false) return 'Chrome';
        if (stripos($userAgent, 'Firefox') !== false) return 'Firefox';
        if (stripos($userAgent, 'Safari') !== false && stripos($userAgent, 'Chrome') === false) return 'Safari';
        if (stripos($userAgent, 'Edg') !== false) return 'Edge';
        if (stripos($userAgent, 'Opera') !== false || stripos($userAgent, 'OPR') !== false) return 'Opera';
        return 'Other';
    }

    public function toSessionArray(): array
    {
        return [
            'session_id' => $this->sessionId,
            'user_id' => $this->userId,
            'tracking_id' => $this->trackingId,
            'start_time' => $this->timestamp,
            'device_type' => $this->deviceType,
            'operating_system' => $this->operatingSystem,
            'browser' => $this->browser,
            'screen_width' => $this->screenWidth,
            'screen_height' => $this->screenHeight,
            'viewport_width' => $this->viewportWidth,
            'viewport_height' => $this->viewportHeight,
            'country' => $this->country,
            'country_code' => $this->countryCode,
            'language' => $this->language,
            'timezone' => $this->timezone,
            'referrer' => $this->referrer,
            'entry_page' => $this->pageUrl,
        ];
    }

    public function toEventArray(): array
    {
        return array_merge(parent::toArray(), [
            'page_title' => $this->pageTitle,
            'referrer' => $this->referrer,
            'dns_time' => $this->dnsTime,
            'connect_time' => $this->connectTime,
            'response_time' => $this->responseTime,
            'dom_load_time' => $this->domLoadTime,
            'page_load_time' => $this->pageLoadTime,
            'connection_type' => $this->connectionType,
            'connection_downlink' => $this->connectionDownlink,
            'connection_rtt' => $this->connectionRtt,
        ]);
    }
}
