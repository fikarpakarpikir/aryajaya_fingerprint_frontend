<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Record extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function org()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan', 'id');
    }

    public function act()
    {
        return $this->belongsTo(Aktifitas::class, 'kode_act', 'id');
    }
}
