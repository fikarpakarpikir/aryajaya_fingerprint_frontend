<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MacamKehadiran extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function hadir()
    {
        return $this->belongsTo(Kehadiran::class, 'kode_hadir', 'id');
    }
}
