<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Support\Facades\Mail;

use App\Models\User;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\UserAnalyticsController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\DashboardStatsController;
use App\Services\ClickHouseTestService;
use App\Events\UserLoggedIn;

/*
|--------------------------------------------------------------------------
| Public Auth Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Password Reset Routes
|--------------------------------------------------------------------------
*/

Route::post('/password/forgot', [PasswordResetController::class, 'sendResetLink']);
Route::post('/password/reset',  [PasswordResetController::class, 'resetPassword']);

/*
|--------------------------------------------------------------------------
| Email Verification
|--------------------------------------------------------------------------
*/

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return response()->json(['message' => 'Email verified successfully']);
})->middleware(['signed', 'throttle:6,1'])->name('verification.verify');

/*
|--------------------------------------------------------------------------
| Protected Routes (JWT)
|--------------------------------------------------------------------------
*/

Route::middleware('jwt.auth')->group(function () {

    Route::post('/logout',  [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/me',       [AuthController::class, 'me']);

    /*
    |--------------------------------------------------------------------------
    | Onboarding Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('onboarding')->group(function () {
        Route::get('/status',           [OnboardingController::class, 'status']);
        Route::post('/website-type',    [OnboardingController::class, 'saveWebsiteType']);
        Route::post('/generate-tracking', [OnboardingController::class, 'generateTrackingId']);
        Route::post('/complete',        [OnboardingController::class, 'complete']);
        Route::post('/verify',          [OnboardingController::class, 'verifyTracking']);
        Route::post('/skip',            [OnboardingController::class, 'skip']);
    });

});

/*
|--------------------------------------------------------------------------
| Admin Only
|--------------------------------------------------------------------------
*/

Route::middleware(['jwt.auth', 'role:admin'])->get('/admin-only', function () {
    return response()->json(['message' => 'Welcome Admin']);
});

/*
|--------------------------------------------------------------------------
| Analytics Tracking (ClickHouse)
|--------------------------------------------------------------------------
*/

// Main tracking endpoint - accepts all event types
// Rate limited: 120 requests per minute per IP
Route::post('/track', [AnalyticsController::class, 'track'])
    ->middleware('throttle:120,1');

// Batch tracking endpoint - for sending multiple events at once
// Rate limited: 30 requests per minute per IP (since each can contain multiple events)
Route::post('/track/batch', [AnalyticsController::class, 'trackBatch'])
    ->middleware('throttle:30,1');

// Real-time stats endpoint
Route::get('/analytics/{trackingId}/realtime', [AnalyticsController::class, 'getRealTimeStats']);

// Test ClickHouse connection
Route::get('/analytics/test-connection', [AnalyticsController::class, 'testConnection']);

/*
|--------------------------------------------------------------------------
| User Analytics Dashboard
|--------------------------------------------------------------------------
*/

Route::get('/user/{id}/analytics', [UserAnalyticsController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Dashboard Statistics (Protected - Real Data)
|--------------------------------------------------------------------------
*/

Route::middleware('jwt.auth')->prefix('dashboard')->group(function () {
    Route::get('/overview', [DashboardStatsController::class, 'overview']);
    Route::get('/traffic', [DashboardStatsController::class, 'traffic']);
    Route::get('/realtime', [DashboardStatsController::class, 'realtime']);
    Route::get('/pages', [DashboardStatsController::class, 'pages']);
    Route::get('/devices', [DashboardStatsController::class, 'devices']);
    Route::get('/behavior', [DashboardStatsController::class, 'behavior']);
    Route::get('/forms', [DashboardStatsController::class, 'forms']);
    Route::get('/videos', [DashboardStatsController::class, 'videos']);
    Route::get('/interactions', [DashboardStatsController::class, 'interactions']);
    Route::get('/geography', [DashboardStatsController::class, 'geography']);
    Route::get('/ecommerce', [DashboardStatsController::class, 'ecommerce']);
});

/*
|--------------------------------------------------------------------------
| DEV / LOCAL ONLY
|--------------------------------------------------------------------------
*/

if (app()->environment('local')) {

    Route::get('/test-clickhouse', function (ClickHouseTestService $service) {

        $service->insertEvent([
            "timestamp"   => now()->toDateTimeString(),
            "session_id"  => "sess_test",
            "user_id"     => "guest",
            "tracking_id" => "site_test",
            "event_type"  => "page_view",
            "page_url"    => "/test",
            "page_title"  => "Test Page",
            "referrer"    => "direct",
        ]);

        return "ClickHouse insert OK";
    });

    Route::get('/test-broadcast', function () {
        event(new UserLoggedIn('test@example.com'));
        return response()->json(['status' => 'event sent']);
    });

    Route::get('/test-mail', function () {
        Mail::raw("Laravel Test Email ✅", function ($m) {
            $m->to("malmasri345@gmail.com")
              ->subject("Laravel Mail Test");
        });
        return "Mail sent";
    });

    Route::get('/users', function () {
        return User::all();
    });
}
