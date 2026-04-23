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
    // Creando permisos
    $permissions = [
      // users
      'create_users',
      'read_users',
      'update_users',
      'delete_users',
      // patients
      'create_patients',
      'read_patients',
      'update_patients',
      'delete_patients',
      'print_patients',
    ];
    foreach ($permissions as $key => $permission) {
      Permission::create(['name' => $permission]);
    }

    // Creando roles
    Role::create(['name' => 'admin'])->givePermissionTo(Permission::all());
    Role::create(['name' => 'archive'])->givePermissionTo([
      'create_patients',
      'read_patients',
      'update_patients',
      'delete_patients',
      'print_patients',
    ]);
    Role::create(['name' => 'reader'])->givePermissionTo(['read_patients']);
    Role::create(['name' => 'admission'])->givePermissionTo([
      'create_patients',
      'read_patients',
      'update_patients',
      'delete_patients',
    ]);

    // Creando usuarios
    User::create([
      'name' => 'Administrador',
      'username' => 'admin',
      'email' => 'admin@example.com',
      'password' => bcrypt(98765432)
    ])->assignRole('admin');

    User::create([
      'name' => 'Servicio',
      'username' => 'servicio',
      'email' => 'servicio@example.com',
      'password' => bcrypt(12345678)
    ])->assignRole('archive');

    User::create([
      'name' => 'Invitado',
      'username' => 'guest',
      'email' => 'guest@example.com',
      'password' => bcrypt(12345678)
    ])->assignRole('reader');
  }
}
