<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements JWTSubject, MustVerifyEmail
{
    use Notifiable;

    /**
     * لأننا نستخدم UUID بدل auto increment
     */
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * الحقول المسموح تعبئتها
     */
    protected $fillable = [
        'id',
        'name',
        'company_name',
        'email',
        'password',
        'website_type',
        'tracking_id',
        'is_onboarded',
        'website_url'
    ];

    /**
     * تحويل الأنواع تلقائياً
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_onboarded' => 'boolean',
    ];

    /**
     * الحقول المخفية
     */
    protected $hidden = [
        'password'
    ];

    /**
     * JWT Identifier
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * JWT Custom Claims
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * علاقة Many-to-Many مع الأدوار
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * التحقق من أن المستخدم لديه دور معين
     */
    public function hasRole(string $roleName): bool
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    /**
     * التحقق من أن المستخدم لديه أي من الأدوار المحددة
     */
    public function hasAnyRole(array $roleNames): bool
    {
        return $this->roles()->whereIn('name', $roleNames)->exists();
    }

    /**
     * إسناد دور للمستخدم
     */
    public function assignRole(string $roleName): void
    {
        $role = Role::where('name', $roleName)->first();
        if ($role && !$this->hasRole($roleName)) {
            $this->roles()->attach($role->id);
        }
    }

    /**
     * إزالة دور من المستخدم
     */
    public function removeRole(string $roleName): void
    {
        $role = Role::where('name', $roleName)->first();
        if ($role) {
            $this->roles()->detach($role->id);
        }
    }

    /**
     * الحصول على أسماء الأدوار
     */
    public function getRoleNames(): array
    {
        return $this->roles()->pluck('name')->toArray();
    }
}
