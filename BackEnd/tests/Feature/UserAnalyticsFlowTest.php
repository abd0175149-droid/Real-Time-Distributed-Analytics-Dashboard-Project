<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\ClickHouseTestService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * اختبار تدفق التحليلات: MySQL users + ClickHouse data + API
 */
class UserAnalyticsFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_analytics_returns_data_after_seeding(): void
    {
        // 1. Seed users
        $this->seed(\Database\Seeders\RolesSeeder::class);
        $this->seed(\Database\Seeders\TestUsersSeeder::class);

        $user = User::where('email', 'admin@test.com')->first();
        $this->assertNotNull($user, 'Admin user should exist');
        $this->assertEquals('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', $user->id);

        // 2. Seed ClickHouse (requires running ClickHouse)
        $ch = app(ClickHouseTestService::class);
        if (!$ch->isConnected()) {
            $this->markTestSkipped('ClickHouse not running');
        }

        $this->artisan('clickhouse:seed-sample')->assertSuccessful();

        // 3. Call API
        $response = $this->getJson("/api/user/{$user->id}/analytics");

        $response->assertOk()
            ->assertJsonStructure(['user', 'events_count', 'last_events']);

        $data = $response->json();
        $this->assertGreaterThan(0, $data['events_count'], 'Should have events in ClickHouse');
    }
}
