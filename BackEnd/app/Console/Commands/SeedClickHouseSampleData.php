<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\ClickHouseTestService;
use Illuminate\Console\Command;

/**
 * إضافة بيانات نموذجية لـ ClickHouse للاختبار
 */
class SeedClickHouseSampleData extends Command
{
    protected $signature = 'clickhouse:seed-sample 
                            {--user-id= : User ID (UUID) to associate data with. If empty, uses first user.}';

    protected $description = 'Insert sample analytics data into ClickHouse for testing';

    public function handle(ClickHouseTestService $clickhouse): int
    {
        if (!$clickhouse->isConnected()) {
            $this->error('ClickHouse is not connected. Start Docker: docker compose up -d');
            return 1;
        }

        $targetUserId = $this->option('user-id');
        $users = $targetUserId
            ? User::where('id', $targetUserId)->get()
            : User::all();

        if ($users->isEmpty()) {
            $this->error('No users found. Run: php artisan db:seed --class=TestUsersSeeder');
            return 1;
        }

        foreach ($users as $user) {
            $this->seedForUser($clickhouse, $user->id);
        }

        $this->info('Sample data inserted successfully!');
        return 0;
    }

    protected function seedForUser(ClickHouseTestService $clickhouse, string $userId): void
    {
        $prefix = substr(str_replace('-', '', $userId), 0, 8);
        $trackingId = 'trk_demo_' . $prefix;
        $sessions = [
            ["sess_{$prefix}_001", now()->subHours(2)],
            ["sess_{$prefix}_002", now()->subHour()],
            ["sess_{$prefix}_003", now()->subMinutes(15)],
        ];

        $this->info("Inserting sample data for user: {$userId}, tracking_id: {$trackingId}");

        foreach ($sessions as [$sessionId, $startTime]) {
            $clickhouse->insertSession([
                'session_id' => $sessionId,
                'user_id' => $userId,
                'tracking_id' => $trackingId,
                'start_time' => $startTime->format('Y-m-d H:i:s'),
                'device_type' => fake()->randomElement(['Desktop', 'Mobile', 'Tablet']),
                'operating_system' => fake()->randomElement(['Windows', 'macOS', 'Linux', 'iOS', 'Android']),
                'browser' => fake()->randomElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
                'screen_width' => fake()->randomElement([1920, 1366, 1440, 768, 375]),
                'screen_height' => fake()->randomElement([1080, 768, 900, 1024, 667]),
                'viewport_width' => 1200,
                'viewport_height' => 800,
                'country' => fake()->randomElement(['Saudi Arabia', 'Egypt', 'UAE', 'USA']),
                'country_code' => fake()->randomElement(['SA', 'EG', 'AE', 'US']),
                'language' => fake()->randomElement(['ar', 'en']),
                'timezone' => 'Asia/Riyadh',
                'referrer' => fake()->randomElement(['google.com', 'direct', 'facebook.com', '']),
                'entry_page' => '/',
            ]);
        }

        $pages = [
            ['/', 'Home Page', 'page_view'],
            ['/products', 'Products', 'page_view'],
            ['/about', 'About Us', 'page_view'],
            ['/contact', 'Contact', 'page_view'],
            ['/checkout', 'Checkout', 'page_view'],
        ];

        foreach ($sessions as $i => [$sessionId, $startTime]) {
            $numEvents = fake()->numberBetween(3, 8);
            for ($j = 0; $j < $numEvents; $j++) {
                $page = $pages[array_rand($pages)];
                $ts = $startTime->copy()->addMinutes($j * 2);
                $clickhouse->insertEvent([
                    'timestamp' => $ts->format('Y-m-d H:i:s'),
                    'session_id' => $sessionId,
                    'user_id' => $userId,
                    'tracking_id' => $trackingId,
                    'event_type' => $page[2],
                    'page_url' => $page[0],
                    'page_title' => $page[1],
                    'referrer' => $j === 0 ? ($i === 0 ? 'google.com' : 'direct') : $pages[array_rand($pages)][0],
                    'duration_ms' => fake()->numberBetween(5000, 60000),
                    'scroll_depth_max' => fake()->randomFloat(2, 0.3, 1),
                    'click_count' => fake()->numberBetween(1, 15),
                ]);
            }
        }

        $clickCount = count($sessions) * 5;
        for ($i = 0; $i < $clickCount; $i++) {
            $s = $sessions[array_rand($sessions)];
            $clickhouse->insertInteractionEvent([
                'timestamp' => $s[1]->copy()->addMinutes(rand(1, 10))->format('Y-m-d H:i:s'),
                'session_id' => $s[0],
                'user_id' => $userId,
                'tracking_id' => $trackingId,
                'event_type' => 'click',
                'page_url' => $pages[array_rand($pages)][0],
                'x' => fake()->numberBetween(100, 800),
                'y' => fake()->numberBetween(100, 600),
                'element' => fake()->randomElement(['button', 'a', 'div', 'input']),
                'element_id' => fake()->optional(0.5)->randomElement(['btn-submit', 'link-home', null]),
                'element_class' => fake()->optional(0.5)->randomElement(['btn-primary', 'nav-link', null]),
                'button_text' => fake()->optional(0.5)->randomElement(['Submit', 'Learn More', null]),
                'link_url' => fake()->optional(0.5)->url(),
                'link_text' => fake()->optional(0.5)->words(2, true),
                'is_external' => fake()->boolean(20),
            ]);
        }

    }
}
