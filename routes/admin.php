<?php

use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

// route prefix 'admin'
// name prefix 'admin.'

// USUARIOS
  Route::resource("users", UserController::class);
