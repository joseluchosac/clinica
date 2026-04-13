<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;
use DateTimeZone;

class BaseModel extends Model
{

    protected function serializeDate(DateTimeInterface $date)
    {
        return Carbon::instance($date)
        ->setTimezone(new DateTimeZone('America/Lima'))
        ->format('Y-m-d H:i:s');
    }
}
