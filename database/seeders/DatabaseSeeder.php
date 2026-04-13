<?php

namespace Database\Seeders;

use App\Models\Autoincrement;
use App\Models\User;
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
        ]);

        User::create([
           'name' => 'José Luis',
           'username' => 'jose',
           'email' => 'josvelsac@gmail.com',
           'password' => bcrypt(12345678)
        ]);

        Autoincrement::create([
            'name' => 'next_nhc',
            'value' => 1200000
        ]);
    }
}
