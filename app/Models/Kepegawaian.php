<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Kepegawaian extends Model
{
    use Notifiable;

    protected $guarded = ['id'];

    public function kerja()
    {
        return $this->belongsTo(StatusKaryawan::class, 'kode_status_kerja', 'id');
    }

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

    public function kontrak()
    {
        return $this->hasMany(PKWT::class, 'id_karyawan', 'id_karyawan');
    }

    public function kontrakTerakhir()
    {
        return $this->belongsTo(PKWT::class, 'id_karyawan', 'id_karyawan');
    }

    public function riw_jabs()
    {
        return $this->hasMany(RiwayatJabatan::class, 'id_karyawan', 'id_karyawan');
    }

    public function divisi()
    {
        return $this->belongsTo(JabatanDivisi::class, 'id', 'id_kepegawaian')
            ->where('kode_status_kerja', 1);
    }
    public function lemburSelesai()
    {
        return $this->hasMany(JadwalKerja::class, 'id_karyawan', 'id_karyawan')
            ->where('kode_ket', 9)
            ->where('kode_status', 10);
    }
}
