<?php

namespace App\Models;

use App\Models\Auth\FaceRecognition;
use App\Models\LMS\HasilJawabanEssay;
use App\Models\LMS\HasilJawabanPG;
use App\Models\LMS\Peserta;
use App\Models\LMS\Skill;
use App\Models\Sistem\Birokrasi;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Crypt;

class Karyawan extends Model
{
    use Notifiable;

    protected $guarded = ['id'];

    protected $with = ['dokumen', 'alamat', 'agama', 'nikah', 'face', 'pegawai'];
    protected $appends = ['encId'];

    public function getEncIdAttribute()
    {
        return Crypt::encrypt($this->id);
    }
    // public function getAlamatAttribute()
    // {

    //     return $this->alamat();
    // }
    // public function getAgamaAttribute()
    // {

    //     return $this->agama();
    // }
    // public function getNikahAttribute()
    // {

    //     return $this->nikah();
    // }

    public function dokumen()
    {
        return $this->hasMany(Dokumen::class, 'karyawan_id');
    }
    public function alamat()
    {
        return $this->belongsTo(Alamat::class, 'id', 'id_karyawan');
    }
    public function akun()
    {
        return $this->belongsTo(User::class, 'id', 'id_karyawan');
    }
    public function pegawai()
    {
        return $this->belongsTo(Kepegawaian::class, 'id', 'id_karyawan');
    }
    public function agama()
    {
        return $this->belongsTo(Agama::class, 'kode_agama', 'id');
    }
    public function nikah()
    {
        return $this->belongsTo(Nikah::class, 'kode_nikah', 'id');
    }
    public function sekolah()
    {
        return $this->belongsTo(RiwayatPendidikan::class, 'id', 'id_karyawan');
    }
    public function kerja()
    {
        return $this->belongsTo(RiwayatKerja::class, 'id', 'id_karyawan');
    }
    public function kerjaan()
    {
        return $this->hasMany(RiwayatKerja::class, 'id_karyawan', 'id');
    }
    public function kontrak()
    {
        return $this->hasMany(PKWT::class, 'id_karyawan', 'id');
    }

    public function acts()
    {
        return $this->hasMany(Record::class, 'id_karyawan', 'id');
    }

    public function sertifs()
    {
        return $this->hasMany(Sertifikat::class, 'id_karyawan', 'id');
    }

    public function absens()
    {
        return $this->hasMany(JadwalKerja::class, 'id_karyawan', 'id');
    }

    public function ingats()
    {
        return $this->hasMany(Peringatan::class, 'id_karyawan', 'id');
    }

    public function pesertas()
    {
        // return $this->belongsToMany(Skill::class, 'pesertas', 'id', 'kode_skill');
        return $this->hasManyThrough(
            Skill::class,
            Peserta::class,
            'id_karyawan', // Foreign key on the kedua table...
            'id', // Foreign key on the ketiga table...
            'id', //  Local key on the utama table...
            'kode_skill', // Local key on the kedua table...
        );
    }

    public function peserta()
    {
        // return $this->belongsToMany(Skill::class, 'pesertas', 'kode_skill', 'id_karyawan');
        return $this->belongsTo(Peserta::class, 'id', 'id_karyawan');
    }

    public function peringatans()
    {
        return $this->hasManyThrough(
            JadwalKerja::class, // table ketiga
            Peringatan::class, //table kedua
            'id_karyawan', // Foreign key on the kedua table...
            'macam_hadir', // Foreign key on the ketiga table...
            'id', // Local key on the utama table...
            'id' // Local key on the kedua table...
        );
    }

    public function jawab_pg()
    {
        return $this->hasMany(HasilJawabanPG::class, 'id_karyawan', 'id');
    }
    public function jawab_essay()
    {
        return $this->hasMany(HasilJawabanEssay::class, 'id_karyawan', 'id');
    }
    public function rek()
    {
        return $this->belongsTo(Rekening::class, 'id', 'id_karyawan');
    }

    public function birokrasi($id)
    {
        return $this->belongsTo(Birokrasi::class, 'id', 'id_karyawan')
            ->where('kode_divisi', $id)
            ->first();
    }

    public function rekaps($kode_ket, $mulai, $selesai)
    {

        $mulai = $mulai == null ? Carbon::now()->startOfYear() : $mulai;
        $selesai = $selesai == null ? Carbon::now()->endOfYear() : $selesai;
        // dd($mulai, $selesai);
        $absen = $this->hasMany(JadwalKerja::class, 'id_karyawan', 'id')
            ->where('kode_ket', $kode_ket)
            ->where('kode_status', 3)
            ->where('mulai', '>=', $mulai)
            ->where('selesai', '<=', $selesai)
            ->whereBetween('updated_at', [
                Carbon::now()->startOfYear(),
                Carbon::now()->endOfYear(),
            ])
            ->get();
        // dd($absen);
        // 1	Kerja
        // 2	Cuti Tahunan
        // 3	Cuti Khusus
        // 4	Izin
        // 5	Sakit
        // 6	Alpha
        // 7	Terlambat
        // 8	Skorsing
        // 9	Lembur
        // 10	Izin Terlambat
        // 11	Overshift
        // 12	Izin Khusus
        // 13	Libur
        if ($absen->count() > 0) {
            $total_absen = 0;
            $totalJam = 0;
            $totalMenit = 0;

            foreach ($absen as $key) {
                if ($kode_ket == 10 || $kode_ket == 7) {
                    $interval = date_diff(date_create($key->mulai), date_create($key->selesai));

                    $jam = $interval->format('%H');
                    $menit = $interval->format('%I');

                    $totalJam += (int)$jam;
                    $totalMenit += (int)$menit;

                    // If the total minutes exceed 59, adjust the total hours and minutes
                    if ($totalMenit > 59) {
                        $totalJam += floor($totalMenit / 60);
                        $totalMenit %= 60;
                    }
                } else {
                    $hari_absen = date_create($key->mulai)->diff(date_create($key->selesai))->days + 1;
                    $total_absen += $hari_absen;
                }
            }
        }

        $pesan = '';
        if ($absen->isNotEmpty()) {
            if ($kode_ket == 10 || $kode_ket == 7) {
                $pesan = $absen->count() . ' kali dengan total ' . $totalJam . ' jam ' . $totalMenit . ' menit';
            } else {
                $pesan = $absen->count() . ' kali dengan total ' . $total_absen . ' hari';
            }
        } else {
            $pesan = 'Belum pernah';
        }

        return $pesan;
    }

    public function lemburSelesai()
    {
        return $this->hasMany(JadwalKerja::class, 'id_karyawan', 'id')
            ->where('kode_ket', 9)
            ->where('kode_status', 10);
    }

    public function face()
    {
        return $this->hasMany(FaceRecognition::class, 'id_karyawan', 'id');
    }
}
