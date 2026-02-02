<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    /**
     * Handle an incoming request.
     * التحقق من أن المستخدم لديه الدور المطلوب
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role  اسم الدور المطلوب (مثل: admin, user, analyst)
     * @return mixed
     */
    public function handle(Request $request, Closure $next, string $role)
    {
        // الحصول على المستخدم من الـ Guard 'api'
        $user = auth('api')->user();

        // التحقق من وجود المستخدم
        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized - Please login first'
            ], 401);
        }

        // التحقق من أن المستخدم لديه الدور المطلوب
        // يدعم عدة أدوار مفصولة بـ |
        $requiredRoles = explode('|', $role);
        
        if (!$user->hasAnyRole($requiredRoles)) {
            return response()->json([
                'message' => 'Forbidden - You do not have permission to access this resource',
                'required_roles' => $requiredRoles,
                'your_roles' => $user->getRoleNames(),
            ], 403);
        }

        return $next($request);
    }
}
