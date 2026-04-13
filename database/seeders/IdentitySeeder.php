<?php

namespace Database\Seeders;

use App\Models\Identity;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IdentitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $identities = [
            ['code' => '00', 'name' => 'Sin documento', 'long_name' => 'Otros documentos', 'long' => 15],
            ['code' => '01', 'name' => 'DNI', 'long_name' => 'Documento Nacional de Identidad', 'long' => 8],
            ['code' => '04', 'name' => 'Carnet ext.', 'long_name' => 'Carnet de Extranjería', 'long' => 12],
            ['code' => '06', 'name' => 'RUC', 'long_name' => 'Registro Unico de Contribuyentes', 'long' => 11],
            ['code' => '07', 'name' => 'Pasaporte', 'long_name' => 'Pasaporte', 'long' => 12],
            ['code' => '11', 'name' => 'P. Nac.', 'long_name' => 'Partida de nacimiento', 'long' => 15],
        ];
        foreach ($identities as $identity) {
            Identity::create($identity);
        }
    }
}
