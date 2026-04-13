<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Autoincrement extends Model
{
    protected $fillable = [
        'name',
        'value',
    ];
}
