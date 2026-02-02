<?php

namespace App\Services\ClickHouse;

use ClickHouseDB\Client;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * Base ClickHouse Service
 * الخدمة الأساسية للاتصال بـ ClickHouse
 */
abstract class BaseClickHouseService
{
    protected ?Client $client = null;
    protected bool $connected = false;

    public function __construct()
    {
        $this->initializeClient();
    }

    /**
     * Initialize ClickHouse client with error handling
     */
    protected function initializeClient(): void
    {
        try {
            $this->client = new Client([
                "host"     => env("CLICKHOUSE_HOST", "127.0.0.1"),
                "port"     => env("CLICKHOUSE_PORT", 8123),
                "username" => env("CLICKHOUSE_USERNAME", "default"),
                "password" => env("CLICKHOUSE_PASSWORD", ""),
            ]);

            $this->client->database(env("CLICKHOUSE_DATABASE", "default"));
            $this->client->setTimeout(5);
            $this->client->setConnectTimeOut(3);
            $this->connected = true;
        } catch (Exception $e) {
            Log::error("ClickHouse connection failed: " . $e->getMessage());
            $this->connected = false;
        }
    }

    /**
     * Check if ClickHouse is connected
     */
    public function isConnected(): bool
    {
        return $this->connected && $this->client !== null;
    }

    /**
     * Execute a select query safely
     */
    protected function safeSelect(string $query, array $params = []): array
    {
        if (!$this->isConnected()) {
            Log::warning("ClickHouse not connected");
            return [];
        }

        try {
            $result = $this->client->select($query, $params);
            return $result->rows();
        } catch (Exception $e) {
            Log::error("ClickHouse query failed: " . $e->getMessage(), [
                'query' => $query,
                'params' => $params
            ]);
            return [];
        }
    }

    /**
     * Execute an insert query safely
     */
    protected function safeInsert(string $table, array $columns, array $values): bool
    {
        if (!$this->isConnected()) {
            Log::warning("ClickHouse not connected, data not inserted");
            return false;
        }

        try {
            $columnList = implode(', ', $columns);
            $this->client->insert("{$table} ({$columnList})", [$values]);
            return true;
        } catch (Exception $e) {
            Log::error("ClickHouse insert failed: " . $e->getMessage(), [
                'table' => $table,
                'columns' => $columns
            ]);
            return false;
        }
    }

    /**
     * Count records in a table
     */
    protected function countWhere(string $table, string $whereClause, array $params = []): int
    {
        $query = "SELECT count(*) as total FROM {$table} WHERE {$whereClause}";
        $rows = $this->safeSelect($query, $params);
        return isset($rows[0]['total']) ? (int)$rows[0]['total'] : 0;
    }

    /**
     * Test connection
     */
    public function testConnection(): array
    {
        if (!$this->isConnected()) {
            return [
                'success' => false,
                'message' => 'ClickHouse client not initialized'
            ];
        }

        try {
            $this->client->select("SELECT 1");
            return [
                'success' => true,
                'message' => 'ClickHouse connection successful'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Connection test failed: ' . $e->getMessage()
            ];
        }
    }
}
