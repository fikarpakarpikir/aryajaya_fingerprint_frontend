<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PKWT extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $with = ['golongan', 'struktur', 'bagian', 'fungsi', 'divisi'];

    public function golongan()
    {
        return $this->belongsTo(Golongan::class, 'kode_golongan', 'id');
    }

    public function struktur()
    {
        return $this->belongsTo(JabatanStruktural::class, 'kode_struktural', 'id');
    }

    public function bagian()
    {
        return $this->belongsTo(Fungsional::class, 'fungsional', 'id');
    }

    public function fungsi()
    {
        return $this->belongsTo(JabatanFungsional::class, 'kode_fungsional', 'id');
    }

    public function divisi()
    {
        return $this->belongsTo(JabatanDivisi::class, 'id', 'id_kepegawaian')
            ->where('kode_status_kerja', 2);
    }
}
