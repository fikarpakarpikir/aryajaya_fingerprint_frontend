<?php

namespace App\Models\LMS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class SoalPG extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $appends = ['encId'];

    public function getEncIdAttribute()
    {
        return Crypt::encrypt($this->id);
    }

    public function pg()
    {
        return $this->belongsTo(PG::class, 'kode_soal', 'kode_soal');
    }

    public function pgs()
    {
        return $this->hasMany(PG::class, 'soal_pg_id', 'id');
    }

    public function pilihan($kode_soal, $id_pilihan)
    {
        $benar = PG::where('kode_soal', $kode_soal)
            ->where('id_pilihan', $id_pilihan)
            ->pluck('pilihan')
            ->first();
        return $benar;
    }
}
