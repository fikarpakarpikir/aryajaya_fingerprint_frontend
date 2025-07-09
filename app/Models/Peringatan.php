<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peringatan extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function org()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan', 'id');
    }
    public function diproses()
    {
        return $this->hasMany(JadwalKerja::class, 'macam_hadir', 'id');
    }
}
