<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\PatientController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource("users", UserController::class);
    Route::resource("patients", PatientController::class);
    Route::get('patients/data/{patient}',[PatientController::class, 'data'])->name('patients.data');
    Route::put('patients/debug-hc/{patient}',[PatientController::class, 'updateDebugHc'])->name('patients.update.debug-hc');
    Route::get('locations/search', [LocationController::class, 'search'])->name('locations.search');
    
});

Route::get('/pdf/hc-clasica/{patient}', [PatientController::class, 'hcClasica'])->name('pdf.hc-clasica');
Route::get('/pdf/hoja-identificacion/{patient}', [PatientController::class, 'hojaIdentificacion'])->name('pdf.hoja-identificacion');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
