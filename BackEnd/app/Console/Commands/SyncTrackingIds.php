<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\User;

class SyncTrackingIds extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tracking:sync 
                            {--kafka-url= : The Kafka backend URL (default: from KAFKA_BACKEND_URL env)}
                            {--dry-run : Show what would be synced without actually syncing}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync registered tracking IDs from Laravel to Kafka backend Redis';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $kafkaUrl = $this->option('kafka-url') ?? env('KAFKA_BACKEND_URL', 'http://localhost:8080');
        $dryRun = $this->option('dry-run');

        $this->info('Syncing tracking IDs to Kafka backend...');
        $this->info("Kafka backend URL: {$kafkaUrl}");

        // Get all tracking IDs from users table
        $trackingIds = User::whereNotNull('tracking_id')
            ->where('tracking_id', '!=', '')
            ->pluck('tracking_id')
            ->toArray();

        if (empty($trackingIds)) {
            $this->warn('No tracking IDs found to sync.');
            return 0;
        }

        $this->info("Found " . count($trackingIds) . " tracking IDs to sync.");

        if ($dryRun) {
            $this->info('Dry run mode - would sync these tracking IDs:');
            foreach ($trackingIds as $id) {
                $this->line("  - {$id}");
            }
            return 0;
        }

        // Send to Kafka backend sync endpoint
        try {
            $response = Http::timeout(30)
                ->post("{$kafkaUrl}/api/tracking-ids/sync", [
                    'tracking_ids' => $trackingIds
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $this->info("✓ Successfully synced {$data['count']} tracking IDs.");
                return 0;
            } else {
                $this->error("✗ Failed to sync tracking IDs: " . $response->body());
                return 1;
            }
        } catch (\Exception $e) {
            $this->error("✗ Error connecting to Kafka backend: " . $e->getMessage());
            $this->info("Make sure the Kafka backend is running at {$kafkaUrl}");
            return 1;
        }
    }
}
