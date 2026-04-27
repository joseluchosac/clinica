<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleUserSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $permissions = [
      // users
      'create_users' => 'create_users',
      'read_users' => 'read_users',
      'update_users' => 'update_users',
      'delete_users' => 'delete_users',
      // patients
      'create_patients' => 'create_patients',
      'read_patients' => 'read_patients',
      'update_patients' => 'update_patients',
      'delete_patients' => 'delete_patients',
      'debug_patients' => 'debug_patients',
      'print_patients' => 'print_patients',
      // ajustes
      'update_app_settings' => 'update_app_settings'
    ];

    $roles = [
      'admin' => $permissions,
      'archivo' => [
        $permissions['create_patients'],
        $permissions['read_patients'],
        $permissions['update_patients'],
        $permissions['debug_patients'],
        $permissions['print_patients'],
      ],
      'admision' => [
        $permissions['create_patients'],
        $permissions['read_patients'],
        $permissions['update_patients'],
        $permissions['print_patients'],
      ],
      'guest' => [
        $permissions['read_patients']
      ],
    ];
    $users = [
      [
        'name' => 'Administrador',
        'username' => 'admin',
        'email' => 'admin@prp.com',
        'password' => bcrypt(98765432),
        'roles' => ['admin'],
      ],
      [
        'name' => 'Archivo',
        'username' => 'archivo',
        'email' => 'archivo@prp.com',
        'password' => bcrypt(12345678),
        'roles' => ['archivo'],
      ],
      [
        'name' => 'Admision',
        'username' => 'admision',
        'email' => 'admision@prp.com',
        'password' => bcrypt(12345678),
        'roles' => ['admision'],
      ],
      [
        'name' => 'Invitado',
        'username' => 'invitado',
        'email' => 'invitado@prp.com',
        'password' => bcrypt(12345678),
        'roles' => ['guest'],
      ],
    ];

    // Creando permisos
    foreach ($permissions as $key => $permission) {
      Permission::create(['name' => $permission]);
    }

    // Creando roles
    foreach ($roles as $key => $role){
      Role::create(['name' => $key])->givePermissionTo($roles[$key]);
    }

    // Creando usuarios
    foreach ($users as $key => $user){
      User::create([
        'name' => $user['name'],
        'username' => $user['username'],
        'email' => $user['email'],
        'password' => $user['password']
      ])->assignRole($user['roles']);
    }
  }
}
