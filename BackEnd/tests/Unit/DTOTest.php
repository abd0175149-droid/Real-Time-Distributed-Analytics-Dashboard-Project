<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\DTOs\AnalyticsEventDTO;
use App\DTOs\PageLoadEventDTO;
use App\DTOs\InteractionEventDTO;
use App\DTOs\FormEventDTO;

class DTOTest extends TestCase
{
    /** @test */
    public function analytics_event_dto_creates_from_array()
    {
        $data = [
            'tracking_id' => 'site_123',
            'session_id' => 'sess_abc',
            'user_id' => 'user_xyz',
            'event_type' => 'page_view',
            'page_url' => '/dashboard',
        ];

        $dto = new AnalyticsEventDTO($data);

        $this->assertEquals('site_123', $dto->trackingId);
        $this->assertEquals('sess_abc', $dto->sessionId);
        $this->assertEquals('user_xyz', $dto->userId);
        $this->assertEquals('page_view', $dto->eventType);
        $this->assertEquals('/dashboard', $dto->pageUrl);
    }

    /** @test */
    public function analytics_event_dto_has_default_values()
    {
        $dto = new AnalyticsEventDTO([
            'tracking_id' => 'site_123',
        ]);

        $this->assertEquals('site_123', $dto->trackingId);
        $this->assertStringStartsWith('sess_', $dto->sessionId);
        $this->assertEquals('guest', $dto->userId);
        $this->assertEquals('unknown', $dto->eventType);
        $this->assertEquals('', $dto->pageUrl);
    }

    /** @test */
    public function analytics_event_dto_converts_to_array()
    {
        $dto = new AnalyticsEventDTO([
            'tracking_id' => 'site_123',
            'event_type' => 'page_view',
            'page_url' => '/test',
        ]);

        $array = $dto->toArray();

        $this->assertArrayHasKey('tracking_id', $array);
        $this->assertArrayHasKey('session_id', $array);
        $this->assertArrayHasKey('user_id', $array);
        $this->assertArrayHasKey('event_type', $array);
        $this->assertArrayHasKey('page_url', $array);
        $this->assertArrayHasKey('timestamp', $array);
    }

    /** @test */
    public function page_load_event_dto_extracts_nested_data()
    {
        $data = [
            'tracking_id' => 'site_123',
            'session_id' => 'sess_abc',
            'data' => [
                'url' => 'https://example.com/page',
                'title' => 'Test Page',
                'referrer' => 'https://google.com',
                'device_type' => 'Desktop',
                'operating_system' => 'Windows',
                'browser' => 'Mozilla/5.0 Chrome/120.0',
                'screen_resolution' => [
                    'width' => 1920,
                    'height' => 1080,
                ],
                'viewport' => [
                    'width' => 1200,
                    'height' => 800,
                ],
                'location' => [
                    'country' => 'Saudi Arabia',
                    'country_code' => 'SA',
                ],
                'performance' => [
                    'dns_time' => 10,
                    'connect_time' => 50,
                    'page_load_time' => 1200,
                ],
                'network' => [
                    'effectiveType' => '4g',
                    'downlink' => 10.5,
                    'rtt' => 50,
                ],
            ],
        ];

        $dto = new PageLoadEventDTO($data);

        $this->assertEquals('page_load', $dto->eventType);
        $this->assertEquals('Test Page', $dto->pageTitle);
        $this->assertEquals('Desktop', $dto->deviceType);
        $this->assertEquals('Chrome', $dto->browser);
        $this->assertEquals(1920, $dto->screenWidth);
        $this->assertEquals('Saudi Arabia', $dto->country);
        $this->assertEquals('SA', $dto->countryCode);
        $this->assertEquals(1200, $dto->pageLoadTime);
        $this->assertEquals('4g', $dto->connectionType);
    }

    /** @test */
    public function page_load_event_dto_converts_to_session_array()
    {
        $dto = new PageLoadEventDTO([
            'tracking_id' => 'site_123',
            'session_id' => 'sess_abc',
            'data' => [
                'device_type' => 'Mobile',
                'location' => ['country' => 'Egypt'],
            ],
        ]);

        $sessionArray = $dto->toSessionArray();

        $this->assertArrayHasKey('session_id', $sessionArray);
        $this->assertArrayHasKey('device_type', $sessionArray);
        $this->assertArrayHasKey('country', $sessionArray);
        $this->assertEquals('Mobile', $sessionArray['device_type']);
        $this->assertEquals('Egypt', $sessionArray['country']);
    }

    /** @test */
    public function interaction_event_dto_handles_click_data()
    {
        $dto = new InteractionEventDTO([
            'tracking_id' => 'site_123',
            'event_type' => 'click',
            'x' => 100,
            'y' => 200,
            'element' => 'button',
            'element_id' => 'submit-btn',
            'text' => 'Submit',
        ]);

        $this->assertEquals(100, $dto->x);
        $this->assertEquals(200, $dto->y);
        $this->assertEquals('button', $dto->element);
        $this->assertEquals('submit-btn', $dto->elementId);
        $this->assertEquals('Submit', $dto->buttonText);
    }

    /** @test */
    public function form_event_dto_handles_form_data()
    {
        $dto = new FormEventDTO([
            'tracking_id' => 'site_123',
            'event_type' => 'form_submit',
            'form_id' => 'contact-form',
            'form_name' => 'Contact Form',
            'action' => '/submit',
            'method' => 'POST',
            'field_count' => 5,
            'has_file_upload' => true,
            'success' => true,
        ]);

        $this->assertEquals('contact-form', $dto->formId);
        $this->assertEquals('Contact Form', $dto->formName);
        $this->assertEquals('/submit', $dto->formAction);
        $this->assertEquals('POST', $dto->formMethod);
        $this->assertEquals(5, $dto->fieldCount);
        $this->assertTrue($dto->hasFileUpload);
        $this->assertTrue($dto->success);
    }
}
