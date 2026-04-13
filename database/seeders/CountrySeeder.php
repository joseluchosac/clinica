<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ruta del archivo JSON
        $jsonPath = database_path('seeders/data/countries.json');

        // Leer y decodificar
        $json = file_get_contents($jsonPath);
        $data = json_decode($json, true);

        // Insertar en la tabla
        foreach ($data as $item) {
            DB::table('countries')->insert([
                'code'   => $item['code'] ?? null,
                'name' => $item['name'] ?? null,
            ]);
        }
    }
}
