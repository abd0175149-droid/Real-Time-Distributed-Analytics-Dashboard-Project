<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * مستخدمي الاختبار - Test Users
 * كلمة المرور لجميع المستخدمين: password123
 *
 * يحذف المستخدمين الحاليين ويعيد إنشاءهم بـ IDs ثابتة لضمان توافق ClickHouse
 */
class TestUsersSeeder extends Seeder
{
    private const TEST_EMAILS = ['admin@test.com', 'user@test.com', 'analyst@test.com'];

    public function run(): void
    {
        // حذف المستخدمين القدامى لضمان IDs ثابتة (توافق مع ClickHouse)
        User::whereIn('email', self::TEST_EMAILS)->each(function (User $u) {
            $u->roles()->detach();
            $u->delete();
        });

        $users = [
            [
                'id' => 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
                'name' => 'Admin User',
                'company_name' => 'Demo Company',
                'email' => 'admin@test.com',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
                'roles' => ['admin'],
            ],
            [
                'id' => 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
                'name' => 'Test User',
                'company_name' => 'Test Site',
                'email' => 'user@test.com',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
                'roles' => ['user'],
            ],
            [
                'id' => 'cccccccc-cccc-cccc-cccc-cccccccccccc',
                'name' => 'Analyst User',
                'company_name' => 'Analytics Co',
                'email' => 'analyst@test.com',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
                'roles' => ['analyst'],
            ],
        ];

        foreach ($users as $data) {
            $roles = $data['roles'];
            unset($data['roles']);

            $user = User::create($data);

            foreach ($roles as $roleName) {
                $role = Role::firstOrCreate(
                    ['name' => $roleName],
                    ['description' => ucfirst($roleName) . ' role']
                );
                $user->roles()->attach($role->id);
            }
        }
    }
}
