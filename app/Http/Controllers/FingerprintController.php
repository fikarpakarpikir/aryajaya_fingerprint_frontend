<?php

namespace App\Http\Controllers;

use App\Http\Controllers\API\UserController;
use App\Models\Presensi;
use App\Models\Fingerprint;
use Illuminate\Http\Request;
use App\Http\Controllers\PresensiController;
use App\Http\Requests\PresensiStoreRequest;
use App\Models\JadwalKerja;
use App\Models\Karyawan;
use App\Models\Sistem\Alat;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

#[AsController]
class FingerprintController extends Controller
{
    public  function getIdAlat($ip)
    {
        try {
            return Alat::where('ip_alat', $ip)->first();
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Gagal, Alat tidak terdaftar',
                // 'data' => Fingerprint::where('id_karyawan', $req->id_karyawan)->first()
            ], 400);
        }
    }
    public function FingerprintDashboard()
    {
        // COMP - Component:
        // 1. livewire
        // 2. JSX
        return view('General.index', [
            'title' => 'Presensi',
            'subtitle' => 'Presensi Harian',
            'comp' => 2,
        ]);
    }
    public function FingerprintHome()
    {
        // COMP - Component:
        // 1. livewire
        // 2. JSX
        if (in_array(auth()->user()->kode_role, [1, 2, 4, 5])) {
            return view('General.index', [
                'title' => 'Presensi - Fingerprint',
                'subtitle' => 'Scanner Fingerprint',
                'comp' => 2,
            ]);
        } else {
            return back()->with('error', 'Anda tidak berhak mengakses laman ini');
            # code...
        }
    }
    public function presensiStore(Request $req)
    {
        $req->validate([
            'template_id' => 'required',
            'ip_alat' => 'required',
        ]);

        // return response()->json(['ok' => true, 'data' => $req->all()]);
        $alat = $this->getIdAlat($req->ip_alat);
        $karyawan = Fingerprint::where('template_id', $req->template_id)
            ->where('alat_id', $alat->id)
            ->first();
        // return response()->json(['message' =>  $req], 400);


        if ($karyawan) {
            // Koordinat Kantor
            // lat = -6.9550149, long = 107.6327055
            $getJadwal = UserController::getJadwalPresensi($karyawan->id_karyawan, now());
            try {
                if ($getJadwal['cek'] == 2) {

                    return response()->json(['newData' => [], 'status' => 3, 'message' => 'Anda sudah presensi']);
                } else
                if ($getJadwal['cek'] != 3 || $getJadwal['cek'] != 'libur') {
                    // $date = $date ?? now()->toDateString();
                    // if ($newPresensi instanceof JsonResponse) {
                    //     $presensiData = $newPresensi->getData(true); // Convert JsonResponse to array
                    if ($getJadwal['cek'] == 0) {
                        PresensiController::presensiStore(new PresensiStoreRequest([
                            'jenis' => $getJadwal['cek'],
                            'long' => 107.6327055,
                            'lat' => -6.9550149,
                            'id_karyawan' => $karyawan->id_karyawan,
                            'id_jaker' => $getJadwal['jadwal'][0]->id,
                            // 'id' => $getJadwal['presensi'][0]['id'],
                        ]));
                        $newData = Presensi::where('updated_at', now())
                            ->where('id_karyawan', $karyawan->id_karyawan)
                            ->first();
                        return response()->json(['newData' => $newData, 'status' => 4, 'message' => 'Presensi Berhasil']);
                    } else if ($getJadwal['cek'] == 1) {
                        $waktuMulai = Carbon::parse($getJadwal['presensi'][0]['mulai']);
                        if ($waktuMulai) {
                            $selisihMenit = now()->diffInMinutes($waktuMulai, false); // gunakan selisih dengan tanda
                            $selisihJam = now()->diffInHours($waktuMulai, false); // gunakan selisih dengan tanda
                            // return [$selisihJam];
                            if ($selisihMenit >= -10 && $selisihMenit <= 0 && $selisihJam > -1) {
                                return response()->json([
                                    'status' => 3,
                                    'newData' => ['id_karyawan' => $karyawan->id_karyawan],
                                    'message' => "Anda baru saja presensi masuk pada $waktuMulai. Jika akan presensi pulang, silakan tunggu minimal 10 menit."
                                ]);
                            }
                        }
                        PresensiController::presensiStore(new PresensiStoreRequest([
                            'jenis' => $getJadwal['cek'],
                            'long' => 107.6327055,
                            'lat' => -6.9550149,
                            'id_karyawan' => $karyawan->id_karyawan,
                            'id_jaker' => $getJadwal['jadwal'][0]->id,
                            'id' => $getJadwal['presensi'][0]['id'],
                        ]));

                        $newData = Presensi::find($getJadwal['presensi'][0]['id']);
                        return response()->json(['newData' => $newData, 'status' => 4, 'message' => 'Presensi Berhasil']);
                    }
                    // } else {
                    //     $newData = Presensi::find($newPresensi['id']);
                    // }
                }
            } catch (\Throwable $th) {
                // throw $th;
            }
            # code...
            return response()->json(['newData' => ['id_karyawan' => $karyawan->id_karyawan], 'status' => 3, 'message' => 'Anda tidak ada jadwal kerja hari ini']);
        }
        return response()->json(['status' => 3, 'message' => 'Jari Anda tidak terdeteksi']);
    }

    public function registStore(Request $req)
    {
        // return $req->hasFile('template_dat');
        $req->validate([
            'id_karyawan' => 'required',
            'template_id' => 'required',
            'template_dat' => 'required',
            'ip_alat' => 'required',
        ]);
        try {
            $alat = $this->getIdAlat($req->ip_alat);
            // return $alat;
            if (Fingerprint::where('id_karyawan', $req->id_karyawan)->where('alat_id', $alat->id)->first()) {
                return response()->json([
                    'message' => 'Gagal, Karyawan sudah terdaftar',
                    // 'data' => Fingerprint::where('id_karyawan', $req->id_karyawan)->first()
                ], 400);
            }

            if ($req->hasFile('template_dat')) {
                $filename = 'template_' . $alat->id . '_' . $req->template_id . '.' . $req['template_dat']->getClientOriginalExtension();

                $req['template_dat']->move(public_path('assets/fingerprint/template/'), $filename);

                $fingerprint = Fingerprint::create([
                    'alat_id' => $alat->id,
                    'id_karyawan' => $req->id_karyawan,
                    'template_id' => $req->template_id,
                    'template_dat' => $filename,
                ]);

                // Return the newly created fingerprint record in JSON format
                return response()->json([
                    'message' => 'Fingerprint successfully registered',
                    'data' => $fingerprint->load('org')  // Load any relationships if needed (e.g. 'org')
                ], 200);
            } else {
                return response()->json([
                    'message' => 'File upload failed'
                ], 400);
            }
            //code...
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Regist failed: ' . $th->getMessage()
            ], 400);
            //throw $th;
        }
        return response()->json($req);

        // return response()->json([
        //     'message' => 'Regist failed: ' . $th
        // ], 400);
    }

    public function getTemplateId(Request $req)
    {
        $req->validate([
            'id_karyawan' => 'required',
            'ip_alat' => 'required',
        ]);

        try {
            $alat = $this->getIdAlat($req->ip_alat);
            return response()->json([
                'data' => Fingerprint::where('id_karyawan', $req->id_karyawan)
                    ->where('alat_id', $alat->id)
                    ->pluck('template_id')
                    ->first()
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    public function getAlat(Request $req)
    {
        $req->validate([
            'ip_alat' => 'required',
        ]);

        try {
            $alat = $this->getIdAlat($req->ip_alat);
            return response()->json([
                'data' => $alat
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    // public function getIdKaryawan(Request $req)
    // {
    //     $req->validate([
    //         'template_id' => 'required',
    //     ]);

    //     try {
    //         return response()->json([
    //             'data' => Fingerprint::where('template_id', $req->template_id)->pluck('id_karyawan')->first()
    //         ]);
    //     } catch (\Throwable $th) {
    //         throw $th;
    //     }
    // }


    public function delete(Request $req)
    {
        // return $req->hasFile('template_dat');
        $req->validate([
            'id_karyawan' => 'required',
            'template_id' => 'required',
            'ip_alat' => 'required',
        ]);
        try {
            $alat = $this->getIdAlat($req->ip_alat);
            $fp = Fingerprint::where('id_karyawan', $req->id_karyawan)
                ->where('template_id', $req->template_id)
                ->where('alat_id', $alat->id)
                ->first();
            if ($fp) {
                $filePath = 'assets/fingerprint/template/' . $fp->template_dat;
                if (Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->delete($filePath);
                    // return response()->json(['message' => 'File deleted successfully'], 200);
                }
                Fingerprint::where('id_karyawan', $req->id_karyawan)
                    ->where('template_id', $req->template_id)
                    ->where('alat_id', $alat->id)
                    ->delete();
                return response()->json([
                    'message' => 'File delete successfully',
                    'data' => $fp->id
                ]);
            }
            return response()->json([
                'message' => 'Gagal, Karyawan belum terdaftar',
                // 'data' => Fingerprint::where('id_karyawan', $req->id_karyawan)->first()
            ], 400);

            //code...
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'File delete failed: ' . $th
            ], 400);
            //throw $th;
        }
        return response()->json($req);
    }

    public function getKaryawanFingerprint()
    {
        return response()->json([
            'listKaryawan' => Karyawan::whereNotIn('id', [1])
                ->where('status_aktif', 1)
                ->select('id', 'nama')
                ->setEagerLoads([])
                ->with(['dokumen' => function ($q) {
                    return $q->where('jenis_data_id', 1)->without('jenis');
                }])
                ->get(),
            'registered' => Fingerprint::all()->load(['org']),
        ]);
    }
}
