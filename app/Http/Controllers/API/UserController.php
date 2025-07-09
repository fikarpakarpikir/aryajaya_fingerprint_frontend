<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\JabatanDivisi;
use App\Models\JadwalKerja;
use App\Models\Karyawan;
use App\Models\Kepegawaian;
use App\Models\PKWT;
use App\Models\Presensi;
use App\Models\Sistem\Birokrasi;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class UserController extends Controller
{
    public function getUserAuth()
    {
        return auth()->user() != null ? auth()->user()->username : '';
        // return  auth()->user()->username;
    }

    public function getDataUser()
    {
        $data = Karyawan::with([
            'dokumen',
            'alamat' => with(['kota', 'provinsi']),
            'akun' => with(['face_neutral', 'face_happy']),
            'pegawai' => with(['struktur', 'fungsi', 'golongan', 'kerja', 'kontrak', 'riw_jabs']),
            'agama',
            'nikah',
            'sekolah' => with(['tingkat']),
            'kerja',
            'kerjaan',
            'acts' => with(['act']),
            'sertifs',
            'absens',
            'rek',
        ])->find(auth()->user()->id_karyawan);

        return $data;
    }

    public function getEvents()
    {
        $divisi = Birokrasi::where('id_karyawan', auth()->user()->id_karyawan)
            ->where('is_active', 1)
            ->pluck('kode_divisi');
        $pkwtt = JabatanDivisi::whereIn('kode_divisi', $divisi)
            ->where('kode_status_kerja', 1)
            ->pluck('id_kepegawaian');
        $pkwt = JabatanDivisi::whereIn('kode_divisi', $divisi)
            ->where('kode_status_kerja', 2)
            ->pluck('id_kepegawaian');
        $kar_pkwtt = Kepegawaian::whereIn('id', $pkwtt)
            ->pluck('id_karyawan');
        $kar_pkwt = PKWT::whereIn('id', $pkwt)
            ->groupBy('id_karyawan')
            ->pluck('id_karyawan');
        // dd($kar_pkwtt, $kar_pkwt);
        $kar = $kar_pkwtt->merge($kar_pkwt);
        if (auth()->user()->org->pegawai != null) {
            if (auth()->user()->org->pegawai->kode_struktural >= 8) {
                $bawahan = [auth()->user()->id_karyawan];
            } else if (auth()->user()->org->pegawai->kode_struktural <= 7) {
                $bawahan = Kepegawaian::where('kode_struktural', '>', auth()->user()->org->pegawai->kode_struktural)
                    // ->where('kode_struktural', '<=', auth()->user()->org->pegawai->kode_struktural + 1)
                    // ->where('fungsional', auth()->user()->org->pegawai->fungsional)
                    ->whereIn('id_karyawan', $kar)
                    ->select('id_karyawan')
                    ->get()
                    ->pluck('id_karyawan');
                // dd($bawahan);
            } else {
                $bawahan = [];
            }
        } else {
            $bawahan = [];
        }
        $kerja = JadwalKerja::whereIn('kode_status', [3, 10])
            ->where('id_karyawan', auth()->user()->id_karyawan)
            ->with([

                'org' => with([
                    'dokumen',
                    'pegawai',
                ]),
                'stat',
                'absen',
                'pegawai',
                'laporan',
                'jenis_absen',
                'absen',

            ])->get();
        // $ajuan = JadwalKerja::whereIn('id_karyawan', [auth()->user()->id_karyawan])
        $jadwal = JadwalKerja::whereIn('kode_status', [3, 10])
            ->whereIn('id_karyawan', $bawahan)
            ->with([

                'org' => with([
                    'dokumen',
                    'pegawai',
                ]),
                'stat',
                'absen',
                'pegawai',
                'laporan',
                'jenis_absen',
                'absen',

            ])->get();

        $semua = $jadwal->merge($kerja);
        // dd($jadwal);
        return $semua;
    }

    // public static function getJadwalPresensi($date = null, $id_kar = null)
    // {
    //     $date = $date ?? now()->toDateString();
    //     $id_kar = $id_kar ?? auth()->user()->id_karyawan;

    //     $jadwal = JadwalKerja::where('id_karyawan', $id_kar)
    //         ->where(function ($query) use ($date) {
    //             $query->whereDate('mulai', '<=', $date)
    //                 ->whereDate('selesai', '>=', $date);
    //         })
    //         ->where('kode_status', 3)
    //         ->whereIn('kode_ket', [2, 3, 4, 5, 8, 11, 12, 13])
    //         ->with(['absen', 'jenis_absen'])
    //         ->get();

    //     if ($jadwal->isEmpty()) {
    //         $jadwal = JadwalKerja::where('id_karyawan', $id_kar)
    //             ->whereDate('mulai', $date)
    //             ->where('kode_status', 3)
    //             ->where('kode_ket', 1)
    //             ->where('macam_hadir', 29)
    //             ->get();

    //         $keterangan = JadwalKerja::where('id_karyawan', $id_kar)
    //             ->where(function ($query) use ($date) {
    //                 $query->whereDate('mulai', '<=', $date)
    //                     ->whereDate('selesai', '>=', $date);
    //             })
    //             ->where('kode_status', 3)
    //             ->whereIn('kode_ket', [9, 10])
    //             ->with(['absen', 'jenis_absen', 'laporan'])
    //             ->get();

    //         if ($jadwal->isEmpty()) {
    //             $jadwal = JadwalKerja::where('id_karyawan', $id_kar)
    //                 ->where('kode_status', 3)
    //                 ->where('kode_ket', 1)
    //                 ->where('macam_hadir', 28)
    //                 ->get();
    //             if ($jadwal->isNotEmpty()) {
    //                 $array = json_decode($jadwal[0]->bukti);
    //                 $intDay = date_create($date)->format('N');
    //                 $cek = UserController::cekPresensi($jadwal[0]->id, $id_kar, $date)['angka'];
    //                 return [
    //                     'cek' => $cek,
    //                     'jadwal' => collect($array)->search($intDay) !== false ? $jadwal : 'libur',
    //                     'presensi' => [],
    //                     'keterangan' => $keterangan,
    //                 ];
    //             }
    //             $cek = $jadwal->isNotEmpty() ? UserController::cekPresensi($jadwal[0]->id, $id_kar, $date)['angka'] : 3;
    //             return [
    //                 'cek' => $cek,
    //                 'jadwal' => $jadwal,
    //                 'presensi' => [],
    //                 'keterangan' => $keterangan,
    //             ];
    //         }
    //         $cek = $jadwal->isNotEmpty() ? UserController::cekPresensi($jadwal[0]->id, $id_kar, $date)['angka'] : 3;
    //         return [
    //             'cek' => $cek,
    //             'jadwal' => $jadwal,
    //             'presensi' => [],
    //             'keterangan' => $keterangan,
    //         ];
    //     }
    //     $cek = $jadwal->isNotEmpty() ? UserController::cekPresensi($jadwal[0]->id, $id_kar, $date)['angka'] : 3;
    //     return [
    //         'cek' => $cek,
    //         'jadwal' => $jadwal,
    //         'presensi' => [],
    //         'keterangan' => [],
    //     ];
    // }

    // public static function cekPresensi($id_jaker, $id_kar = null, $date = null)
    // {
    //     $date = $date ?? now()->toDateString();
    //     $id_kar = $id_kar ?? auth()->user()->id_karyawan;

    //     $presensi = Presensi::where('id_karyawan', $id_kar)
    //         ->whereDate('mulai', $date)
    //         ->where('id_jaker', $id_jaker)
    //         ->get();

    //     $cek = 0;

    //     if (!$presensi->isEmpty()) {
    //         $presensi = Presensi::where('id_karyawan', $id_kar)
    //             ->whereDate('mulai', $date)
    //             ->where('id_jaker', $id_jaker)
    //             ->whereNull('selesai')
    //             ->whereNull('lokasi_longitude_selesai')
    //             ->whereNull('lokasi_latitude_selesai')
    //             ->get();

    //         if ($presensi->isNotEmpty()) {
    //             $cek = 1;
    //         } else {
    //             $cek = 2;
    //             $presensi = Presensi::where('id_karyawan', $id_kar)
    //                 ->whereDate('mulai', $date)
    //                 ->where('id_jaker', $id_jaker)
    //                 ->get();
    //         }
    //     }

    //     return [
    //         'angka' => $cek,
    //         'presensi' => $presensi,
    //     ];
    // }


    public static function getJadwalPresensi($id_kar = null, $date = null)
    {
        $date = $date ?? now()->toDateString();
        $id_kar = $id_kar ??  auth()->user()->id_karyawan;

        // return response()->json(['message' =>  $id_kar], 400);
        $jadwal = JadwalKerja::where('id_karyawan', $id_kar)
            ->where(function ($query) use ($date) {
                $query->whereDate('mulai', '<=', $date)
                    ->whereDate('selesai', '>=', $date);
            })
            ->where('kode_status', 3)
            ->whereIn('kode_ket', [2, 3, 4, 5, 8, 11, 12, 13])
            ->with(['absen', 'jenis_absen'])
            ->get();
        if ($jadwal->isEmpty()) {
            $jadwal = JadwalKerja::where('id_karyawan', $id_kar)
                ->whereDate('mulai', $date)
                ->where('kode_status', 3)
                ->where('kode_ket', 1)
                ->where('macam_hadir', 29)
                ->get();
            $keterangan = JadwalKerja::where('id_karyawan', $id_kar)
                ->where(function ($query) use ($date) {
                    $query->whereDate('mulai', '<=', $date)
                        ->whereDate('selesai', '>=', $date);
                })
                ->where('kode_status', 3)
                ->whereIn('kode_ket', [9, 10])
                ->with(['absen', 'jenis_absen', 'laporan'])
                ->get();


            if ($jadwal->isEmpty()) {
                $jadwal = JadwalKerja::where('id_karyawan', $id_kar)
                    ->where('kode_status', 3)
                    ->where('kode_ket', 1)
                    ->where('macam_hadir', 28)
                    ->get();

                // return [
                //     'cek' => ($jadwal->isNotEmpty()) ? UserController::cekPresensi($jadwal[0]->id, $id_kar, $date)['angka'] : 3,
                //     'jadwal' => $jadwal,
                //     'presensi' => ($jadwal->isNotEmpty()) ? UserController::cekPresensi($jadwal[0]->id, $id_kar, $date)['presensi'] : [],
                // ];
                if ($jadwal->isNotEmpty()) {
                    $array = json_decode($jadwal[0]->bukti);
                    $intDay = date_create($date)->format('N');
                    // $cek = ($jadwal->isNotEmpty()) ? UserController::cekPresensi($jadwal[0]->id, $id_kar, $date)['angka'] : 3;
                    // $cek = ($cek->isEmpty()) ? 0 : 1;
                    // dd($array, $intDay, $cek);
                    // dd(collect($array)->search($intDay) !== false ? $jadwal : 'libur');
                    return [
                        'cek' => ($jadwal->isNotEmpty()) ? UserController::cekPresensi($jadwal[0]->id, $id_kar, $date)['angka'] : 3,
                        'jadwal' => collect($array)->search($intDay) !== false ? $jadwal : 'libur',
                        'presensi' => ($jadwal->isNotEmpty()) ? UserController::cekPresensi($jadwal[0]->id, $id_kar, $date)['presensi'] : [],
                        'keterangan' => $keterangan,
                        // 'diff_mulai' => collect($array)->search($intDay) !== false ? date_diff(date_create($jadwal[0]->mulai), $date)->format('%i') : 'libur',
                        // 'diff_selesai' => collect($array)->search($intDay) !== false ? date_diff(date_create($jadwal[0]->selesai), $date)->format('%i') : 'libur',
                    ];
                }
                // return ;
                // $cek = $jadwal->isNotEmpty() ? UserController::cekPresensi($jadwal[0]->id, $id_kar, $date)['angka'] : 3;
                return [
                    // 'cek' => $cek,
                    // 'presensi' => $cek['presensi'],
                    'cek' => ($jadwal->isNotEmpty()) ? UserController::cekPresensi($jadwal[0]->id, $id_kar, $date)['angka'] : 3,
                    'jadwal' => $jadwal,
                    'presensi' => ($jadwal->isNotEmpty()) ? UserController::cekPresensi($jadwal[0]->id, $id_kar, $date)['presensi'] : [],
                    'keterangan' => $keterangan,
                ];
            }
            // $cek = $jadwal->isNotEmpty() ? UserController::cekPresensi($jadwal[0]->id, $id_kar, $date)['angka'] : 3;
            return [
                'cek' => ($jadwal->isNotEmpty()) ? UserController::cekPresensi($jadwal[0]->id, $id_kar, $date)['angka'] : 3,
                'jadwal' => $jadwal,
                'presensi' => ($jadwal->isNotEmpty()) ? UserController::cekPresensi($jadwal[0]->id, $id_kar, $date)['presensi'] : [],
                'keterangan' => $keterangan,
            ];
        }
        // $cek = $jadwal->isNotEmpty() ? UserController::cekPresensi($jadwal[0]->id, $id_kar, $date)['angka'] : 3;
        // $cek = ($cek == 0) ? 0 : 1;
        return [
            'cek' => ($jadwal->isNotEmpty()) ? UserController::cekPresensi($jadwal[0]->id, $id_kar, $date)['angka'] : 3,
            'jadwal' => $jadwal,
            'presensi' => ($jadwal->isNotEmpty()) ? UserController::cekPresensi($jadwal[0]->id, $id_kar, $date)['presensi'] : [],
            'keterangan' => [],
            // 'diff_mulai' => $jadwal ? date_diff(date_create($jadwal[0]->mulai), now())->format('%i') : 'libur',
            // 'diff_selesai' => $jadwal ? date_diff(date_create($jadwal[0]->selesai), now())->format('%i') : 'libur',
        ];
        // return $cek;
        // }
    }

    public static function cekPresensi($id_jaker, $id_kar = null, $date = null)
    {
        $date = $date ?? now()->toDateString();
        $id_kar = $id_kar ??  auth()->user()->id_karyawan;
        $presensi = Presensi::where('id_karyawan', $id_kar)
            ->whereDate('mulai', $date)
            ->where('id_jaker', $id_jaker)
            ->get();

        $cek = 0;

        if (!$presensi->isEmpty()) {
            $presensi = Presensi::where('id_karyawan', $id_kar)
                ->whereDate('mulai', $date)
                ->where('id_jaker', $id_jaker)
                ->whereNull('selesai')
                ->whereNull('lokasi_longitude_selesai')
                ->whereNull('lokasi_latitude_selesai')
                ->get();

            if ($presensi->isNotEmpty()) {
                $cek = 1;
            } else {
                $cek = 2;
                $presensi = Presensi::where('id_karyawan', $id_kar)
                    ->whereDate('mulai', $date)
                    ->where('id_jaker', $id_jaker)
                    // ->whereNull('mulai')
                    // ->whereNull('lokasi_longitude_mulai')
                    // ->whereNull('lokasi_latitude_mulai')
                    ->get();
            }
            // $cek = ($presensi->isNotEmpty()) ? 1 : 2;
        }

        return [
            'angka' => $cek,
            'presensi' => $presensi,
        ];
    }

    public static function getFotoProfil($filename)
    {
        $path = public_path('/assets/foto_profil/' . $filename);
        // return $path;
        if (!file_exists($path)) {
            return response()->json(['error' => 'File not found.'], 404);
        }
        return response()->file($path);
    }
}
