<?php

use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Settings\AppController;
use Illuminate\Support\Facades\Route;

// route prefix 'admin'
// name prefix 'admin.'

// USUARIOS
Route::resource("users", UserController::class);
Route::post('users/reset-psw/{user}', [UserController::class, 'resetPsw'])->name('users.reset-psw');
  
// ROLES
Route::resource("roles", RoleController::class);

// PERMISOS
Route::resource("permissions", PermissionController::class);
