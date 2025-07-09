<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Http\Controllers\API\UserController;
use App\Http\Controllers\JadwalKerjaController;
use App\Http\Controllers\KaryawanController;
use App\Models\Auth\FaceRecognition;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id_karyawan',
        'username',
        'email',
        'password',
        'kode_role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected $with = ['org', 'face', 'face_neutral', 'face_happy'];
    // public function getOrgAttribute()
    // {

    //     return $this->org();
    // }
    public function org()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan', 'id');
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'kode_role', 'id');
    }

    public function pegawai()
    {
        return $this->belongsTo(Kepegawaian::class, 'id_karyawan', 'id_karyawan');
    }

    public function face()
    {
        return $this->hasMany(FaceRecognition::class, 'id_karyawan', 'id_karyawan');
    }

    public function face_neutral()
    {
        return $this->belongsTo(FaceRecognition::class, 'id_karyawan', 'id_karyawan')
            ->where('ekspresi_wajah_id', 1);
    }
    public function face_happy()
    {
        return $this->belongsTo(FaceRecognition::class, 'id_karyawan', 'id_karyawan')
            ->where('ekspresi_wajah_id', 2);
    }

    public function sisa_cuti()
    {
        $date = date_create(Auth::user()->org->pegawai->masuk, timezone_open('Asia/Jakarta'));

        $diff = date_diff($date, now());
        if (number_format($diff->format('%y')) >= 1 && number_format($diff->format('%y')) < 2) {
            $sisa = KaryawanController::TotalSisaCutiBaruSetahunKerja(Auth::user()->id_karyawan);
        } elseif (number_format($diff->format('%y')) >= 2) {
            $sisa = 12;
        } else {
            $sisa = 0;
        }
        $total_sisa = $sisa - number_format(JadwalKerjaController::Total_Cuti_Tahunan(Auth::user()->id_karyawan, 2));
        return $total_sisa;
    }

    public function legal_cuti()
    {
        $date = date_create(Auth::user()->org->pegawai->masuk, timezone_open('Asia/Jakarta'));
        $diff = date_diff($date, now());
        $legal = date_add(date_create(Auth::user()->org->pegawai->masuk, timezone_open('Asia/Jakarta')), date_interval_create_from_date_string('1 year'));
        $diff2 = date_diff(now(), $legal);
    }

    public function presensi()
    {

        $jadwal = JadwalKerja::where('id_karyawan', $this->id_karyawan)
            ->whereDate('mulai', now()->toDateString())
            ->where('kode_status', 3)
            ->where('kode_ket', 1)
            ->where('macam_hadir', 29)
            ->get();


        if ($jadwal->isEmpty()) {
            $jadwal = JadwalKerja::where('id_karyawan', $this->id_karyawan)
                ->where('kode_status', 3)
                ->where('kode_ket', 1)
                ->where('macam_hadir', 28)
                ->get();
            if ($jadwal->isNotEmpty()) {
                $array = json_decode($jadwal[0]->bukti);
                $intDay = date_create(now())->format('N');
                $cek = ($jadwal->isNotEmpty()) ? UserController::cekPresensi($jadwal[0]->id) : 3;
                // $cek = ($cek->isEmpty()) ? 0 : 1;
                // dd($array, $intDay, $cek);
                return $cek;
                // return [
                //             'cek' => $cek,
                //             'jadwal' => collect($array)->search($intDay) !== false ? $jadwal : 'libur',
                //             // 'diff_mulai' => collect($array)->search($intDay) !== false ? date_diff(date_create($jadwal[0]->mulai), now())->format('%i') : 'libur',
                //             // 'diff_selesai' => collect($array)->search($intDay) !== false ? date_diff(date_create($jadwal[0]->selesai), now())->format('%i') : 'libur',
                //         ];
            }
            // return ;
        }
        $cek = $jadwal->isNotEmpty() ? UserController::cekPresensi($jadwal[0]->id) : 3;
        // $cek = ($cek == 0) ? 0 : 1;
        // dd($cek);
        return $cek;
    }
}
