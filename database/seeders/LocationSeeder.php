<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ruta del archivo JSON
        $jsonPath = database_path('seeders/data/locations.json');

        // Leer y decodificar
        $json = file_get_contents($jsonPath);
        $data = json_decode($json, true);

        // Insertar en la tabla
        foreach ($data as $item) {
            DB::table('locations')->insert([
                'id' => $item['id'] ?? null,
                'country_code' => $item['country_code'] ?? null,
                'country' => $item['country'] ?? null,
                'ubigeo_inei'  => $item['ubigeo_inei'] ?? null,
                'ubigeo_reniec' => $item['ubigeo_reniec'] ?? null,
                'location_name' => $item['location_name'] ?? null,
                'departamento' => $item['departamento'] ?? null,
                'provincia' => $item['provincia'] ?? null,
                'distrito' => $item['distrito'] ?? null,
                'status' => $item['status'] ?? 1,
                'order' => $item['order'] ?? null,
            ]);
        }
    }
}
