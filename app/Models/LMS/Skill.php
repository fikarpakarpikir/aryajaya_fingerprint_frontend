<?php

namespace App\Models\LMS;

use App\Models\Karyawan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Skill extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $appends = ['encId'];

    public function getEncIdAttribute()
    {
        return Crypt::encrypt($this->id);
    }

    public function level()
    {
        return $this->belongsTo(Level::class, 'level_id', 'id');
    }

    public function soals()
    {
        return $this->hasMany(SoalPG::class, 'skill_id', 'id');
    }
    // public function soals()
    // {
    //     return $this->hasMany(BankSoal::class, 'skill_id', 'id');
    // }

    public function pesertas()
    {
        return $this->hasMany(Peserta::class, 'skill_id');
    }

    public function peserta()
    {
        return $this->belongsTo(Peserta::class, 'id', 'skill_id');
    }

    public function karyawans()
    {
        // return $this->belongsToMany(Karyawan::class, 'pesertas', 'id_karyawan', 'skill_id');
        return $this->hasManyThrough(
            Karyawan::class,
            Peserta::class,
            'skill_id', // Foreign key on the kedua table...
            'id', // Foreign key on the ketiga table...
            'id', //  Local key on the utama table...
            'id_karyawan', // Local key on the kedua table...
        );
    }

    public function semua_soal_pg()
    {
        return $this->hasManyThrough(
            SoalPG::class, // table ketiga
            BankSoal::class, //table kedua
            'skill_id', // Foreign key on the kedua table...
            'soal_id', // Foreign key on the ketiga table...
            'id', // Local key on the utama table...
            'id', // Local key on the kedua table...
        );
    }
    public function semua_soal_essay()
    {
        return $this->hasManyThrough(
            SoalEssay::class, // table ketiga
            BankSoal::class, //table kedua
            'skill_id', // Foreign key on the kedua table...
            'soal_id', // Foreign key on the ketiga table...
            'id', // Local key on the utama table...
            'id' // Local key on the kedua table...
        );
    }
}
