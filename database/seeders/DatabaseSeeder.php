<?php

namespace Database\Seeders;

use App\Models\Autoincrement;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call([
            IdentitySeeder::class,
            LocationSeeder::class,
            CountrySeeder::class,
            RoleUserSeeder::class,
        ]);



        Autoincrement::create([
            'name' => 'next_nhc',
            'value' => 1200000
        ]);
    }
}
