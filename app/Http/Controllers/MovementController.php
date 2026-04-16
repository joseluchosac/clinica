<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MovementController extends Controller
{
    public function index()
    {
        return Inertia::render('archive/movements/index');
    }
}
