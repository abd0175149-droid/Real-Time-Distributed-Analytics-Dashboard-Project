<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\ClickHouseTestService;

class DashboardStatsController extends Controller
{
    protected ClickHouseTestService $clickhouse;

    public function __construct(ClickHouseTestService $clickhouse)
    {
        $this->clickhouse = $clickhouse;
    }

    /**
     * Get overview statistics for the dashboard
     */
    public function overview(Request $request)
    {
        $user = Auth::user();
        $trackingId = $user->tracking_id ?? $request->input('tracking_id');
        $period = $request->input('period', '7d');

        if (!$trackingId) {
            return response()->json([
                'status' => 'error',
                'message' => 'No tracking ID found',
                'data' => null,
            ], 400);
        }

        $stats = $this->clickhouse->getOverviewStats($trackingId, $period);
        $trafficData = $this->clickhouse->getTrafficData($trackingId, $period);
        $topPages = $this->clickhouse->getTopPages($trackingId, 5);
        $deviceData = $this->clickhouse->getDeviceStats($trackingId);
        $geoData = $this->clickhouse->getGeoStats($trackingId, 5);

        return response()->json([
            'status' => 'ok',
            'data' => [
                'kpiData' => $stats,
                'trafficData' => $trafficData,
                'topPages' => $topPages,
                'deviceData' => $deviceData['devices'] ?? [],
                'geoData' => $geoData,
            ],
        ]);
    }

    /**
     * Get traffic analytics
     */
    public function traffic(Request $request)
    {
        $user = Auth::user();
        $trackingId = $user->tracking_id ?? $request->input('tracking_id');
        $period = $request->input('period', '7d');

        if (!$trackingId) {
            return response()->json([
                'status' => 'error',
                'message' => 'No tracking ID found',
            ], 400);
        }

        $stats = $this->clickhouse->getOverviewStats($trackingId, $period);
        $trafficData = $this->clickhouse->getTrafficData($trackingId, $period);
        $geoData = $this->clickhouse->getGeoStats($trackingId, 10);

        // Traffic sources (referrers)
        $sources = $this->getTrafficSources($trackingId);

        return response()->json([
            'status' => 'ok',
            'data' => [
                'totalVisitors' => $stats['visitors'],
                'sessions' => $stats['sessions'],
                'pageviews' => $stats['pageviews'],
                'bounceRate' => $stats['bounceRate'],
                'avgDuration' => $stats['avgDuration'],
                'trafficData' => $trafficData,
                'geoData' => $geoData,
                'sources' => $sources,
            ],
        ]);
    }

    /**
     * Get real-time statistics
     */
    public function realtime(Request $request)
    {
        $user = Auth::user();
        $trackingId = $user->tracking_id ?? $request->input('tracking_id');

        if (!$trackingId) {
            return response()->json([
                'status' => 'error',
                'message' => 'No tracking ID found',
            ], 400);
        }

        $data = $this->clickhouse->getRealTimeData($trackingId);

        return response()->json([
            'status' => 'ok',
            'data' => $data,
        ]);
    }

    /**
     * Get pages analytics
     */
    public function pages(Request $request)
    {
        $user = Auth::user();
        $trackingId = $user->tracking_id ?? $request->input('tracking_id');
        $period = $request->input('period', '7d');

        if (!$trackingId) {
            return response()->json([
                'status' => 'error',
                'message' => 'No tracking ID found',
            ], 400);
        }

        $topPages = $this->clickhouse->getTopPages($trackingId, 20);
        $stats = $this->clickhouse->getOverviewStats($trackingId, $period);
        $trafficData = $this->clickhouse->getTrafficData($trackingId, $period);

        // Extract pageviews trend
        $pageviewsTrend = array_map(function($item) {
            return [
                'date' => $item['timestamp'],
                'pageviews' => $item['pageviews'],
            ];
        }, $trafficData);

        return response()->json([
            'status' => 'ok',
            'data' => [
                'pages' => $topPages,
                'totalPageviews' => $stats['pageviews'],
                'avgTimeOnPage' => $stats['avgDuration'],
                'bounceRate' => $stats['bounceRate'],
                'pageviewsTrend' => $pageviewsTrend,
            ],
        ]);
    }

    /**
     * Get devices analytics
     */
    public function devices(Request $request)
    {
        $user = Auth::user();
        $trackingId = $user->tracking_id ?? $request->input('tracking_id');

        if (!$trackingId) {
            return response()->json([
                'status' => 'error',
                'message' => 'No tracking ID found',
            ], 400);
        }

        $deviceStats = $this->clickhouse->getDeviceStats($trackingId);

        return response()->json([
            'status' => 'ok',
            'data' => $deviceStats,
        ]);
    }

    /**
     * Get behavior analytics (interactions)
     */
    public function behavior(Request $request)
    {
        $user = Auth::user();
        $trackingId = $user->tracking_id ?? $request->input('tracking_id');

        if (!$trackingId) {
            return response()->json([
                'status' => 'error',
                'message' => 'No tracking ID found',
            ], 400);
        }

        $interactions = $this->clickhouse->getInteractionStats($trackingId);

        return response()->json([
            'status' => 'ok',
            'data' => $interactions,
        ]);
    }

    /**
     * Get traffic sources from referrers
     */
    private function getTrafficSources(string $trackingId): array
    {
        if (!$this->clickhouse->isConnected()) {
            return [];
        }

        try {
            // This would require a proper referrer parsing
            // For now, return basic referrer data
            return [
                ['name' => 'Direct', 'value' => 0],
                ['name' => 'Organic Search', 'value' => 0],
                ['name' => 'Social', 'value' => 0],
                ['name' => 'Referral', 'value' => 0],
            ];
        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Get form analytics
     */
    public function forms(Request $request)
    {
        $user = Auth::user();
        $trackingId = $user->tracking_id ?? $request->input('tracking_id');

        if (!$trackingId) {
            return response()->json(['status' => 'error', 'message' => 'No tracking ID found'], 400);
        }

        $formStats = $this->clickhouse->getFormStats($trackingId);

        return response()->json([
            'status' => 'ok',
            'data' => $formStats,
        ]);
    }

    /**
     * Get video analytics
     */
    public function videos(Request $request)
    {
        $user = Auth::user();
        $trackingId = $user->tracking_id ?? $request->input('tracking_id');

        if (!$trackingId) {
            return response()->json(['status' => 'error', 'message' => 'No tracking ID found'], 400);
        }

        $videoStats = $this->clickhouse->getVideoStats($trackingId);

        return response()->json([
            'status' => 'ok',
            'data' => $videoStats,
        ]);
    }

    /**
     * Get interactions/clicks analytics
     */
    public function interactions(Request $request)
    {
        $user = Auth::user();
        $trackingId = $user->tracking_id ?? $request->input('tracking_id');

        if (!$trackingId) {
            return response()->json(['status' => 'error', 'message' => 'No tracking ID found'], 400);
        }

        $clickStats = $this->clickhouse->getClickStats($trackingId);
        $interactionStats = $this->clickhouse->getInteractionStats($trackingId);

        return response()->json([
            'status' => 'ok',
            'data' => array_merge($clickStats, $interactionStats),
        ]);
    }

    /**
     * Get geography analytics
     */
    public function geography(Request $request)
    {
        $user = Auth::user();
        $trackingId = $user->tracking_id ?? $request->input('tracking_id');

        if (!$trackingId) {
            return response()->json(['status' => 'error', 'message' => 'No tracking ID found'], 400);
        }

        $geoData = $this->clickhouse->getGeoStats($trackingId, 20);

        return response()->json([
            'status' => 'ok',
            'data' => [
                'countries' => $geoData,
            ],
        ]);
    }

    /**
     * Get ecommerce analytics
     */
    public function ecommerce(Request $request)
    {
        $user = Auth::user();
        $trackingId = $user->tracking_id ?? $request->input('tracking_id');

        if (!$trackingId) {
            return response()->json(['status' => 'error', 'message' => 'No tracking ID found'], 400);
        }

        $ecommerceStats = $this->clickhouse->getEcommerceStats($trackingId);

        return response()->json([
            'status' => 'ok',
            'data' => $ecommerceStats,
        ]);
    }
}
