<?php

namespace App\Models\LMS;

use App\Models\Karyawan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Peserta extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $appends = ['encId'];

    public function getEncIdAttribute()
    {
        return Crypt::encrypt($this->id);
    }
    public function org()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan', 'id');
    }

    public function skill()
    {
        return $this->belongsTo(Skill::class, 'skill_id', 'id');
    }

    public function skills()
    {
        return $this->hasMany(Skill::class, 'id', 'kode_skill');
        // return $this->hasManyThrough(
        //     Skill::class,
        //     Karyawan::class,
        //     'kode_skill', // Foreign key on the kedua table...
        //     'id', // Foreign key on the ketiga table...
        //     'id_karyawan', //  Local key on the utama table...
        //     'id', // Local key on the kedua table...
        // );
    }

    public function karyawans()
    {
        return $this->hasMany(Karyawan::class, 'id', 'id_karyawan');
        // return $this->hasManyThrough(
        //     Skill::class,
        //     Karyawan::class,
        //     'id', // Foreign key on the ketiga table...
        //     'id', // Foreign key on the kedua table...
        //     'kode_skill', // Local key on the kedua table...
        //     'id', //  Local key on the utama table...
        // );
    }

    public function jawaban_pg()
    {
        return $this->hasMany(HasilJawabanPG::class, 'peserta_id', 'id');
    }
}
