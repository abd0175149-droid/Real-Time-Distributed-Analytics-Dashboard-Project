<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('website_type')->nullable()->after('company_name');
            $table->string('tracking_id')->unique()->nullable()->after('website_type');
            $table->boolean('is_onboarded')->default(false)->after('tracking_id');
            $table->string('website_url')->nullable()->after('is_onboarded');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['website_type', 'tracking_id', 'is_onboarded', 'website_url']);
        });
    }
};
