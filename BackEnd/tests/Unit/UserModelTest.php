<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

class UserModelTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Role $adminRole;
    protected Role $userRole;

    protected function setUp(): void
    {
        parent::setUp();

        $this->adminRole = Role::create(['name' => 'admin', 'description' => 'Administrator']);
        $this->userRole = Role::create(['name' => 'user', 'description' => 'Regular user']);

        $this->user = User::create([
            'id' => Str::uuid(),
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);
    }

    /** @test */
    public function user_can_have_roles()
    {
        $this->user->roles()->attach($this->userRole->id);

        $this->assertTrue($this->user->roles->contains($this->userRole));
    }

    /** @test */
    public function user_can_check_if_has_role()
    {
        $this->user->roles()->attach($this->adminRole->id);

        $this->assertTrue($this->user->hasRole('admin'));
        $this->assertFalse($this->user->hasRole('user'));
    }

    /** @test */
    public function user_can_check_if_has_any_role()
    {
        $this->user->roles()->attach($this->userRole->id);

        $this->assertTrue($this->user->hasAnyRole(['admin', 'user']));
        $this->assertTrue($this->user->hasAnyRole(['user', 'analyst']));
        $this->assertFalse($this->user->hasAnyRole(['admin', 'analyst']));
    }

    /** @test */
    public function user_can_assign_role()
    {
        $this->user->assignRole('admin');

        $this->assertTrue($this->user->hasRole('admin'));
    }

    /** @test */
    public function assigning_same_role_twice_does_not_duplicate()
    {
        $this->user->assignRole('admin');
        $this->user->assignRole('admin');

        $this->assertEquals(1, $this->user->roles()->count());
    }

    /** @test */
    public function user_can_remove_role()
    {
        $this->user->roles()->attach($this->adminRole->id);
        $this->assertTrue($this->user->hasRole('admin'));

        $this->user->removeRole('admin');

        $this->assertFalse($this->user->fresh()->hasRole('admin'));
    }

    /** @test */
    public function user_can_get_role_names()
    {
        $this->user->roles()->attach($this->adminRole->id);
        $this->user->roles()->attach($this->userRole->id);

        $roleNames = $this->user->getRoleNames();

        $this->assertContains('admin', $roleNames);
        $this->assertContains('user', $roleNames);
    }

    /** @test */
    public function user_uses_uuid_as_primary_key()
    {
        $this->assertFalse($this->user->incrementing);
        $this->assertEquals('string', $this->user->getKeyType());
    }

    /** @test */
    public function password_is_hidden()
    {
        $this->assertNotContains('password', array_keys($this->user->toArray()));
    }
}
