<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Identity extends Model
{
    protected $fillable = [
        'code',
        'name',
        'long_name',
        'long',
    ];

}
