<?php

use App\Models\Patient;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/prueba', function(){
    return Patient::with([
            'identity:code,name', 
            'locationBirth:id,country,ubigeo_inei,ubigeo_reniec,distrito,provincia,departamento', 
            'locationAddress:id,country,ubigeo_inei,ubigeo_reniec,distrito,provincia,departamento'
        ])
        ->orderBy('id', 'desc')
        ->paginate();
});
Route::get('/prueba2', function(){
    return Patient::orderBy('id', 'desc')
        ->paginate();
});
Route::get('/create', function(){
    // return env('APP_TIMEZONE', 'UTC');
    // NOTA: aplicar la conversion siguiente sólo si mysql esta en UTC y en la variable de entorno esta APP_TIMEZONE=UTC
    // $fechaRecibidaLocal = '2026-04-05 05:12:12';
    $fechaRecibidaLocal = '2026-04-05 05:12:12';
    $birthDateRecibidaLocal = '1980-01-01';

    $entryAt = now();

    if(env('APP_TIMEZONE', 'UTC') == 'UTC'){
        $entryAt = Carbon::parse($fechaRecibidaLocal, 'America/Lima')
                      ->setTimezone('UTC');
    }else{
        $entryAt = $fechaRecibidaLocal;
    }

    // return $entryAt;
    Patient::create([
        'nhc' => "1111116",
        'entry_at' => now(),
        'identity_code' => "01",
        'identity_number' => "12345678",
        'last_name' => "Perez",
        'first_name' => "Juan",
        'gender' => "M",
        'birth_date' =>  $birthDateRecibidaLocal,
        'location_birth_id' => 1,
        'address' => "Av. Lima 123",
        'location_address_id' => 1,
    ]);
    return "OK";

});
