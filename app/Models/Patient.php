<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Model;

class Patient extends BaseModel
{
    protected $fillable = [
        'nhc',
        'entry_at',
        'identity_code',
        'identity_number',
        'last_name',
        'first_name',
        'gender',
        'birth_date',
        'location_birth_id',
        'address',
        'location_address_id',
        'phone',
        'debugged',
        'status',
    ];

    protected $casts = [
        'birth_date' => 'string', // para que no lo convierta por la zona horaria
        'entry_at' => 'datetime',
    ];

    // Relación uno a muchos inversa
    public function locationBirth()
    {
        return self::belongsTo(Location::class, 'location_birth_id', 'id');
    }

    // Relación uno a muchos inversa
    public function locationAddress()
    {
        return self::belongsTo(Location::class, 'location_address_id', 'id');
    }

    // Relación uno a muchos inversa
    public function identity()
    {
        return self::belongsTo(Identity::class, 'identity_code', 'code');
    }
}
