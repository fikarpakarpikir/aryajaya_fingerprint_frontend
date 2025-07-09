<?php

namespace App\Models\LMS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class BankSoal extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $appends = ['encId'];

    public function getEncIdAttribute()
    {
        return Crypt::encrypt($this->id);
    }
    public function soal_pg()
    {
        return $this->belongsTo(SoalPG::class, 'id', 'kode_soal');
    }
    public function soalessay()
    {
        return $this->belongsTo(SoalEssay::class, 'id', 'kode_soal');
    }

    public function pgs()
    {
        return $this->hasMany(SoalPG::class, 'id', 'kode_soal');
    }

    public function pg()
    {
        return $this->hasMany(PG::class, 'kode_soal', 'id');
    }

    public function essays()
    {
        return $this->hasMany(SoalEssay::class, 'id', 'kode_soal');
    }

    public function jawab_pg()
    {
        return $this->belongsTo(HasilJawabanPG::class, 'id', 'kode_soal');
    }
    public function jawab_essay()
    {
        return $this->belongsTo(HasilJawabanEssay::class, 'id', 'kode_soal');
    }
}
