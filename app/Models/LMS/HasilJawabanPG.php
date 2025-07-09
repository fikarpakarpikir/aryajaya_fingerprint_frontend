<?php

namespace App\Models\LMS;

use App\Models\Karyawan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HasilJawabanPG extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function org()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan', 'id');
    }

    public function kode_soal_pg()
    {
        return $this->belongsTo(SoalPG::class, 'soal_pg_id', 'id');
    }
    public function soal_pg()
    {
        return $this->belongsTo(SoalPG::class, 'soal_pg_id', 'id');
    }
}
