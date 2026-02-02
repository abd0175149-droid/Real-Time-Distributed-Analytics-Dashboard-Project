<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * ✅ Register User
     */
    public function register(Request $request)
    {
        $request->validate([
            'name'         => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'email'        => 'required|email|unique:users',
            'password'     => 'required|min:6|confirmed',
        ]);

        $user = User::create([
            'id'           => Str::uuid(),
            'name'         => $request->name,
            'company_name' => $request->company_name,
            'email'        => $request->email,
            'password'     => Hash::make($request->password),
        ]);

        // إسناد دور افتراضي للمستخدم الجديد
        try {
            $defaultRole = Role::firstOrCreate(
                ['name' => 'user'],
                ['description' => 'Regular user with basic permissions']
            );
            $user->roles()->attach($defaultRole->id);
        } catch (\Exception $e) {
            Log::warning("Failed to assign default role: " . $e->getMessage());
        }

        return response()->json([
            'message' => 'Register success',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]
        ], 201);
    }

    /**
     * ✅ Login User
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        // Use JWTAuth::attempt instead of Auth::attempt for JWT guard
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json([
                'error' => 'Invalid credentials'
            ], 401);
        }

        $user = Auth::user();

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => config('jwt.ttl') * 60,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames(),
            ]
        ]);
    }

    /**
     * ✅ Logout
     */
    public function logout()
    {
        Auth::logout();

        return response()->json([
            'message' => 'Logged out'
        ]);
    }

    /**
     * ✅ Current User Info
     */
    public function me()
    {
        $user = Auth::user();
        
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'company_name' => $user->company_name,
            'website_type' => $user->website_type,
            'tracking_id' => $user->tracking_id,
            'is_onboarded' => (bool) $user->is_onboarded,
            'website_url' => $user->website_url,
            'roles' => $user->getRoleNames(),
            'created_at' => $user->created_at,
        ]);
    }

    /**
     * ✅ Refresh Token
     */
    public function refresh()
    {
        $newToken = JWTAuth::refresh();

        return response()->json([
            'access_token' => $newToken
        ]);
    }
}
