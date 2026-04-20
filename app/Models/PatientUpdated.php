<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientUpdated extends Model
{
    protected $table = 'patients_updated';

    protected $fillable = [
        'finished',
    ];

    protected $casts = [
        'birth_date' => 'string', // para que no lo convierta por la zona horaria
        'entry_at' => 'datetime',
    ];
}
