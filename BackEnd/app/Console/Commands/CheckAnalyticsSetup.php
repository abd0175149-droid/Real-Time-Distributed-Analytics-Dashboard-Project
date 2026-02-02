<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\ClickHouseTestService;
use Illuminate\Console\Command;

/**
 * فحص إعداد التحليلات والتحقق من توافق البيانات
 */
class CheckAnalyticsSetup extends Command
{
    protected $signature = 'check:analytics-setup';
    protected $description = 'Diagnose analytics setup: MySQL users vs ClickHouse data';

    public function handle(ClickHouseTestService $clickhouse): int
    {
        $this->info('=== Analytics Setup Diagnostics ===');
        $this->newLine();

        // 1. MySQL Users
        $this->info('[1] MySQL Users:');
        $users = User::all(['id', 'name', 'email']);
        if ($users->isEmpty()) {
            $this->error('   No users found! Run: php artisan db:seed --class=TestUsersSeeder');
            return 1;
        }
        foreach ($users as $u) {
            $this->line("   - {$u->email} | id: {$u->id}");
        }
        $this->newLine();

        // 2. ClickHouse Connection
        $this->info('[2] ClickHouse Connection:');
        if (!$clickhouse->isConnected()) {
            $this->error('   NOT CONNECTED. Start Docker: docker compose up -d');
            return 1;
        }
        $this->info('   Connected to ' . env('CLICKHOUSE_HOST', '127.0.0.1') . ':' . env('CLICKHOUSE_PORT', 8123));
        $this->info('   Database: ' . env('CLICKHOUSE_DATABASE', 'default'));
        $this->newLine();

        // 3. ClickHouse Data (per user)
        $this->info('[3] ClickHouse page_events per MySQL user:');
        $rows = [];
        foreach ($users as $u) {
            $cnt = $clickhouse->countEventsForUser($u->id);
            $rows[] = ['email' => $u->email, 'user_id' => $u->id, 'cnt' => $cnt];
        }
        if (array_sum(array_column($rows, 'cnt')) === 0) {
            $this->warn('   No page_events found for any user! Run: php artisan clickhouse:seed-sample');
        } else {
            foreach ($rows as $r) {
                $status = $r['cnt'] > 0 ? '✓' : '✗';
                $this->line("   {$status} {$r['email']} | events: {$r['cnt']}");
            }
        }
        $this->newLine();

        // 4. Match Check
        $this->info('[4] User ID Match Check:');
        $noData = array_filter($rows, fn($r) => $r['cnt'] === 0);
        if (!empty($noData)) {
            $this->warn('   Users with NO data in ClickHouse:');
            foreach ($noData as $r) {
                $this->line("   - {$r['email']}");
            }
            $this->warn('   Fix: php artisan clickhouse:seed-sample');
        } else {
            $this->info('   All MySQL users have data in ClickHouse.');
        }
        $this->newLine();

        // 5. API Test
        $this->info('[5] API Simulation (first user):');
        $firstUser = $users->first();
        $count = $clickhouse->countEventsForUser($firstUser->id);
        $this->line("   GET /api/user/{$firstUser->id}/analytics");
        $this->line("   events_count: {$count}");
        if ($count === 0) {
            $this->warn('   Expected > 0 if data exists for this user.');
        }
        $this->newLine();
        $this->info('=== Done ===');
        return 0;
    }
}
