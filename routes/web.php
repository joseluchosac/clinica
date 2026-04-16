<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\DebuggController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\MovementController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\RegisterController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // USUARIOS
    Route::resource("users", UserController::class);
    // PACIENTES
    Route::resource("patients", PatientController::class);
    Route::get('patients/data/{patient}',[PatientController::class, 'data'])->name('patients.data');
    Route::put('patients/debug-hc/{patient}',[PatientController::class, 'updateDebugHc'])->name('patients.update.debug-hc');

    // LOCALIZACIONES
    Route::get('locations/search', [LocationController::class, 'search'])->name('locations.search');

    // ARCHIVO
    Route::get('archive/movements', [MovementController::class, 'index'])->name('archive.movements.index');
    Route::get('archive/debuggs', [DebuggController::class, 'index'])->name('archive.debuggs.index');
    
    // ADMISION
    Route::get('admission/register', [RegisterController::class, 'index'])->name('admission.register.index');
});

Route::get('/pdf/hc-clasica/{patient}', [PatientController::class, 'hcClasica'])->name('pdf.hc-clasica');
Route::get('/pdf/hoja-identificacion/{patient}', [PatientController::class, 'hojaIdentificacion'])->name('pdf.hoja-identificacion');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
