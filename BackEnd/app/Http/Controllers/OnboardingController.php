<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class OnboardingController extends Controller
{
    /**
     * الحصول على حالة الـ onboarding للمستخدم الحالي
     */
    public function status()
    {
        $user = Auth::user();

        return response()->json([
            'is_onboarded' => $user->is_onboarded,
            'website_type' => $user->website_type,
            'tracking_id' => $user->tracking_id,
            'website_url' => $user->website_url,
            'steps' => [
                'website_type' => !empty($user->website_type),
                'tracking_id' => !empty($user->tracking_id),
                'completed' => $user->is_onboarded,
            ]
        ]);
    }

    /**
     * حفظ نوع الموقع
     */
    public function saveWebsiteType(Request $request)
    {
        $request->validate([
            'website_type' => 'required|string|in:ecommerce,blog,saas,portfolio,news,other',
            'website_url' => 'nullable|url|max:255',
        ]);

        $user = Auth::user();
        $user->website_type = $request->website_type;
        
        if ($request->has('website_url')) {
            $user->website_url = $request->website_url;
        }

        // إذا لم يكن لديه tracking_id، نُنشئ واحداً
        if (empty($user->tracking_id)) {
            $user->tracking_id = $this->generateUniqueTrackingId();
        }

        $user->save();

        return response()->json([
            'message' => 'Website type saved successfully',
            'website_type' => $user->website_type,
            'tracking_id' => $user->tracking_id,
        ]);
    }

    /**
     * إنشاء tracking_id جديد
     */
    public function generateTrackingId()
    {
        $user = Auth::user();

        // إذا كان لديه tracking_id مسبقاً، نرجعه
        if (!empty($user->tracking_id)) {
            return response()->json([
                'tracking_id' => $user->tracking_id,
                'message' => 'Tracking ID already exists',
            ]);
        }

        $trackingId = $this->generateUniqueTrackingId();
        $user->tracking_id = $trackingId;
        $user->save();

        return response()->json([
            'tracking_id' => $trackingId,
            'message' => 'Tracking ID generated successfully',
        ]);
    }

    /**
     * إكمال عملية الـ onboarding
     */
    public function complete()
    {
        $user = Auth::user();

        // التحقق من اكتمال الخطوات المطلوبة
        if (empty($user->website_type)) {
            return response()->json([
                'error' => 'Please select a website type first',
            ], 400);
        }

        if (empty($user->tracking_id)) {
            return response()->json([
                'error' => 'Please generate a tracking ID first',
            ], 400);
        }

        $user->is_onboarded = true;
        $user->save();

        return response()->json([
            'message' => 'Onboarding completed successfully',
            'is_onboarded' => true,
        ]);
    }

    /**
     * التحقق من استلام events من الموقع
     */
    public function verifyTracking()
    {
        $user = Auth::user();

        if (empty($user->tracking_id)) {
            return response()->json([
                'verified' => false,
                'message' => 'No tracking ID found',
            ], 400);
        }

        // التحقق من وجود events في ClickHouse
        try {
            $clickhouse = new \ClickHouseDB\Client([
                'host' => config('database.connections.clickhouse.host', '127.0.0.1'),
                'port' => config('database.connections.clickhouse.port', 8123),
                'username' => config('database.connections.clickhouse.username', 'default'),
                'password' => config('database.connections.clickhouse.password', ''),
            ]);
            $clickhouse->database(config('database.connections.clickhouse.database', 'analytics'));

            $result = $clickhouse->select(
                "SELECT count() as count FROM sessions WHERE tracking_id = :tracking_id",
                ['tracking_id' => $user->tracking_id]
            );

            $count = $result->fetchOne('count') ?? 0;

            return response()->json([
                'verified' => $count > 0,
                'events_count' => (int) $count,
                'message' => $count > 0 
                    ? 'التتبع يعمل! استلمنا ' . $count . ' جلسة من موقعك.' 
                    : 'لم نستلم أي جلسات بعد. تأكد من تثبيت كود التتبع بشكل صحيح.',
            ]);

        } catch (\Exception $e) {
            // في حالة عدم توفر ClickHouse
            $isDevelopment = app()->environment('local');
            
            return response()->json([
                'verified' => false,
                'events_count' => 0,
                'is_development' => $isDevelopment,
                'message' => $isDevelopment 
                    ? 'بيئة تطوير - خدمة التحليلات (ClickHouse) غير متصلة. يمكنك تخطي هذه الخطوة أو إعداد ClickHouse للتحقق الفعلي.'
                    : 'تعذر التحقق من التتبع. يرجى المحاولة مرة أخرى لاحقاً.',
            ]);
        }
    }

    /**
     * تخطي عملية الـ onboarding
     */
    public function skip()
    {
        $user = Auth::user();

        // إنشاء tracking_id إذا لم يكن موجوداً
        if (empty($user->tracking_id)) {
            $user->tracking_id = $this->generateUniqueTrackingId();
        }

        // تعيين نوع موقع افتراضي إذا لم يُحدد
        if (empty($user->website_type)) {
            $user->website_type = 'other';
        }

        $user->is_onboarded = true;
        $user->save();

        return response()->json([
            'message' => 'Onboarding skipped',
            'is_onboarded' => true,
            'tracking_id' => $user->tracking_id,
        ]);
    }

    /**
     * إنشاء tracking_id فريد
     */
    private function generateUniqueTrackingId(): string
    {
        do {
            $trackingId = 'trk_' . Str::random(16);
        } while (User::where('tracking_id', $trackingId)->exists());

        return $trackingId;
    }
}
