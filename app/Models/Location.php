<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = [
        'country_code',
        'country',
        'ubigeo_inei',
        'ubigeo_reniec',
        'departamento',
        'provincia',
        'distrito',
        'status',
        'order',
    ];


    // Relación uno a muchos
    public function patientsLocationBird()
    {
        return self::hasMany(Patient::class, 'location_birth_id', 'id');
    }

    // Relación uno a muchos
    public function patientsLocationAddress()
    {
        return self::hasMany(Patient::class, 'location_address_id', 'id');
    }
}
