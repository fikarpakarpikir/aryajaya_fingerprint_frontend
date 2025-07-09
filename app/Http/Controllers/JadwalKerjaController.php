<?php

namespace App\Http\Controllers;

use App\Http\Livewire\Sistem\Birokrasi;
use App\Models\JabatanDivisi;
use App\Models\JadwalKerja;
use App\Models\Karyawan;
use App\Models\Kehadiran;
use App\Models\Kepegawaian;
use App\Models\LampiranPengajuan;
use App\Models\LaporanLembur;
use App\Models\MacamKehadiran;
use App\Models\PKWT;
use App\Models\Sistem\Birokrasi as SistemBirokrasi;
use App\Models\Status;
use App\Models\User;
use App\Notifications\PengajuanIzinNotif;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class JadwalKerjaController extends Controller
{
    // NOTE
    // * Konfirmasi overshift belum selesai
    public $title = 'Jadwal Kerja';

    function parseDateTime($tanggal, $jam = null)
    {
        return Carbon::parse(trim("$tanggal $jam"))->format('Y-m-d H:i:s');
    }
    public static function getKodeStruktural()
    {
        $org = auth()->user()->org;
        switch ($org->pegawai?->kode_status_kerja) {
            case 1:
                // console->log(1, $org->pegawai);
                return $org?->pegawai?->kode_struktural;

                break;
            case 2:
                // console->log(2, $org->pegawai->kontrak->length);
                if (count($org->pegawai->kontrak) > 0) {
                    $lastKontrak =
                        $org->pegawai->kontrak[count($org->pegawai->kontrak) - 1];
                    return $lastKontrak?->kode_struktural;
                } else {
                    return null;
                }
                break;

            default:
                break;
        }
    }
    public static function listIdBawahan()
    {
        $bawahan = [auth()->user()->id_karyawan];
        $kodeStruktural = self::getKodeStruktural();
        $divisi = SistemBirokrasi::where('id_karyawan', auth()->user()->id_karyawan)
            ->where('is_active', 1)
            ->pluck('kode_divisi');
        $pkwtt = JabatanDivisi::whereIn('kode_divisi', $divisi)
            ->where('kode_status_kerja', 1)
            ->pluck('id_kepegawaian');
        $pkwt = JabatanDivisi::whereIn('kode_divisi', $divisi)
            ->where('kode_status_kerja', 2)
            ->pluck('id_kepegawaian');
        $kar_pkwtt = Kepegawaian::whereIn('id', $pkwtt)
            ->where('kode_struktural', '>', $kodeStruktural)
            ->pluck('id_karyawan');
        $kar_pkwt = PKWT::whereIn('id', $pkwt)
            ->where('kode_struktural', '>', $kodeStruktural)
            ->groupBy('id_karyawan')
            ->pluck('id_karyawan');
        // dd($kar_pkwtt, $kar_pkwt);
        $kar = $kar_pkwtt->merge($kar_pkwt);
        if (in_array(auth()->user()->kode_role, [1, 2, 5])) {
            $bawahan = Karyawan::where('status_aktif', 1)->get()->pluck('id_karyawan');
            // }
        } elseif (optional(auth()->user()->org->pegawai)) {
            $isAtasan = $kodeStruktural <= 7;
            if (!$isAtasan) {
                $bawahan = [auth()->user()->id_karyawan];
            } else {
                $bawahan = $kar;
                // Kepegawaian::where('kode_struktural', '>', $kodeStruktural)
                //     // ->where('kode_struktural', '<=', auth()->user()->org->pegawai->kode_struktural + 1)
                //     // ->where('fungsional', auth()->user()->org->pegawai->fungsional)
                //     ->whereIn('id_karyawan', $kar)
                //     ->select('id_karyawan')
                //     ->get()
                //     ->pluck('id_karyawan');
            }
        }
        // dd($bawahan, $kodeStruktural, $isAtasan);
        return $bawahan;
    }
    public function index($scope = null)
    {
        return $this->getJadwal('index', $scope);
    }

    public function pengajuan($scope = null)
    {
        return $this->getJadwal('pengajuan', $scope);
    }

    public function dashboard()
    {
        return $this->getJadwalData('dashboard', 'Pribadi', 'Dashboard');
    }

    // khusus untuk render page
    private function getJadwal($type, $scope)
    {
        $data = $this->getJadwalData($type, $scope);

        return Inertia::render('Jaker/index', $data);
    }

    // khusus ambil data aja (buat index, pengajuan, dashboard, api)
    public function getJadwalData($type, $scope, $title = null)
    {
        $isPribadi = $scope === 'Pribadi';
        $bawahan = $this->listIdBawahan() ?? [];
        $isDev = auth()->user()->id === 1;
        $isHC = auth()->user()->kode_role === 5;
        $isAtasan = $this->getKodeStruktural();

        // * Kalo aman balikin ke 3 bulan
        $filters = [
            'index' => [
                'kode_ket' => [1, 8, 9, 11],
                'id_karyawan' => $isPribadi ? [auth()->user()->id_karyawan] : $bawahan ?? [],
                'date_range' => [now()->subMonths(3), now()]
                // 'date_range' => [now()->subMonths(13), now()]
            ],
            'pengajuan' => [
                'kode_ket' => [2, 3, 4, 5, 7, 10, 12],
                'id_karyawan' => $isPribadi ? [auth()->user()->id_karyawan] : $bawahan ?? [],
                'date_range' => [now()->subMonths(3), now()->addMonths(2)]
            ],
            'dashboard' => [
                'kode_ket' => [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13],
                'id_karyawan' => [auth()->user()->id_karyawan],
                'date_range' => [now()->subYear()->startOfYear(), now()->endOfYear()]
            ]
        ];
        $jadwal = JadwalKerja::whereBetween('created_at', $filters[$type]['date_range'])
            ->whereIn('kode_ket', $filters[$type]['kode_ket'])
            ->whereIn('id_karyawan', $filters[$type]['id_karyawan'])
            ->whereHas('org')
            ->orderBy('id', 'desc');

        if (trim($type) === 'dashboard') {
            $jadwal->limit(5);
        }
        if ($isDev || $isHC) {
            $karyawans =
                Karyawan::whereNotIn('id', [1])->where('status_aktif', 1)->select('id', 'nama')->setEagerLoads([])->get();
        } else if ($isAtasan) {
            $karyawans =
                Karyawan::whereNotIn('id', [1])->whereIn('id', $bawahan)->where('status_aktif', 1)->select('id', 'nama')->setEagerLoads([])->get();
        } else {
            $karyawans = [];
        }
        // dd($karyawans);
        return [
            'title' => ($title ?? ($isPribadi ? ($type === 'pengajuan' ? 'Pengajuan' : $this->title) : 'Kekaryawanan')),
            'subtitle' => $isPribadi ? '' : ($type === 'pengajuan' ? 'Pengajuan' : $this->title),
            'kode_ket_pengajuan' => [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13],
            'jadwal' => $jadwal->get(),
            'status' => Status::whereIn('id', [1, 2, 3, 4, 8, 9])->get(),
            'jenis' => Kehadiran::whereIn('id', [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13])->get(),
            'macam' => MacamKehadiran::whereIn('kode_hadir', [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13])->get(),
            'isPribadi' => $isPribadi,
            'karyawans' => $karyawans,
            'jadwalKerja' => FaceRecognitionController::getJadwalPresensi()
        ];
    }

    public function kalender($scope = null)
    {
        $isPribadi = $scope === 'Pribadi'; // Default to pribadi unless 'bawahan' is specified
        $bawahan = $this->listIdBawahan();
        $idKaryawanList = $isPribadi ? [auth()->user()->id_karyawan] : $bawahan ?? [];
        $dateRange = [now()->subYear()->startOfYear(), now()->endOfYear()];
        return Inertia::render('Kalender/index', [
            'title' => ($title ?? ($isPribadi ?  'Kalender' : 'Kekaryawanan')),
            'subtitle' => 'Kalender',
            'isPribadi' => $isPribadi,
            'jadwal' => JadwalKerja::whereIn('id_karyawan', $idKaryawanList)
                ->whereIn('kode_status', [3, 10])
                ->whereBetween('created_at', $dateRange)
                ->orWhere(function ($query) use ($idKaryawanList) {
                    $query->whereIn('id_karyawan', $idKaryawanList)
                        ->where('kode_ket', 1)
                        ->where('macam_hadir', 28);
                })
                ->get(),
            'bawahan' => $bawahan
        ]);
    }

    public function search(Request $req)
    {
        $bawahan = $this->listIdBawahan();
        $req->merge([
            'jenis' => is_array($req->jenis)
                ? $req->jenis
                : (is_string($req->jenis)
                    ? explode(',', $req->jenis)
                    : [$req->jenis])
        ]);
        // dd($req->jenis);

        $req->validate([
            'id' => 'nullable|numeric',
            'jenis' => 'nullable|array',
            'status' => 'nullable|numeric',
            'macam' => 'nullable|numeric',
            'mulai' => 'nullable|date',
            'selesai' => 'nullable|date',
        ]);


        $query = JadwalKerja::query();
        $query->whereIn('id_karyawan', $bawahan);
        if ($req->id) {
            $query->where('id', $req->id);
        }
        // dd($req);
        if (!empty($req->jenis)) {
            $query->whereIn('kode_ket', (array) $req->jenis);
        }

        if ($req->macam) {
            $query->where('macam_hadir', $req->macam);
        }

        if ($req->mulai) {
            $query->where('mulai', '>=', $req->mulai);
        } else {
            $query->where('mulai', '>=', now()->subMonths(3));
        }

        if ($req->selesai) {
            $query->where('selesai', '<=', $req->selesai);
        }

        if ($req->status) {
            $query->where('kode_status', $req->status);
        }

        return $query->get();
    }
    public function change(Request $req)
    {
        $req->validate([
            'id' => 'required|string',
            'key' => 'required|string'
        ]);
        try {
            if ($req->filled('key') && $req->key) {
                $rules[$req->key] = 'required';
            }

            $req->validate($rules);

            $id = Crypt::decrypt($req->id);
            $data = JadwalKerja::findOrFail($id);

            $value = $req->hasFile('bukti')
                ? $this->storeDoc($req->file('bukti'), 'absen')
                : $req[$req->key];

            $data->update([
                $req->key => $value,
            ]);
            return response()->json(
                $this->getData($req->key, $value, 'null', $data->id)
            );
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    public function changeStatus(Request $req)
    {
        $req->validate([
            'id' => 'required|array',
            'id.*' => 'string', // setiap elemen array wajib string terenkripsi
            'kode_status' => 'required|numeric',
        ]);
        $ids = collect($req->id)->map(function ($encryptedId) {
            return Crypt::decrypt($encryptedId);
        });

        $jakers = JadwalKerja::without(['org', 'laporan', 'lampiran', 'jenis', 'ket'])
            ->whereIn('id', $ids)
            ->select(['id', 'kode_status'])
            ->get();

        foreach ($jakers as $jaker) {
            $jaker->update(['kode_status' => $req->kode_status]);
        }
        return response()->json(
            $jakers->each->setAppends([])->load('status')
        );
    }
    public function add(Request $request)
    {

        // try {
        $kode_ket = Crypt::decrypt($request->kode_ket);
        $id_kar = is_array($request->id_kar) ? $request->id_kar : Crypt::decrypt($request?->id_kar);

        $macam_cutiTahunan = [1, 4, 31, 32];
        $macam_cutiKhusus = [3, 5, 6, 8, 9, 14, 15, 21, 22];
        $macam_izinKhusus = [2, 7, 10, 11, 12, 13, 23, 24, 25, 26];
        $macam_izinTerlambat = [16, 17, 18, 27];
        $macam_lembur = [19, 20];
        $macam_kerja = [28, 29];

        if ($kode_ket == 1) {
            // dd($request->bukti);
            $absen = [];
            $error = 1;

            $kode_status = in_array(auth()->user()->kode_role, [1, 2, 5]) ? 3 : 2;

            $request->validate([
                'id_kar' => 'required|array',
                'kode_ket' => 'required|string',
                'macam_hadir' => 'required|numeric',
                'mulai' => 'required|string',
                'selesai' => 'required|string',
                'mulai_jam' => 'required|string',
                'selesai_jam' => 'required|string',
                'bukti' => [function ($attribute, $value, $fail) use ($request) {
                    if ((int) $this->kode_ket === 5 || $request->macam_hadir == 29) {
                        return; // skip validation
                    }
                    if ($request->macam_hadir == 28 && !is_array($value)) {
                        return $fail('Bukti harus berupa array.');
                    }

                    // if (in_array($request->macam_hadir, [19, 20]) && !is_string($value)) {
                    //     return $fail('Bukti harus berupa string.');
                    // }

                    // if (isset($request->kode_ket) && $request->kode_ket == 5) {
                    //     // Tidak perlu validasi tambahan, dianggap lulus
                    //     return;
                    // }

                    // // Tambahkan validasi file jika perlu
                    // if ($request->regulasi[$request->macam_hadir][4] ?? '' === 'file') {
                    //     if (!($value instanceof \Illuminate\Http\UploadedFile)) {
                    //         return $fail('Bukti harus berupa file.');
                    //     }

                    //     $allowed = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'];
                    //     if (!in_array($value->getMimeType(), $allowed)) {
                    //         return $fail('File harus berupa PDF, PNG, JPG, atau JPEG.');
                    //     }

                    //     if ($value->getSize() > 4 * 1024 * 1024) {
                    //         return $fail('File tidak boleh lebih dari 4MB.');
                    //     }
                    // }
                }],
            ]);
            $bukti = $request->bukti ? json_encode($request->bukti) : null;

            for ($i = 0; $i < count($request->id_kar); $i++) {
                if ($request->macam_hadir == 28) {
                    $cek = JadwalKerja::where('id_karyawan', $request->id_kar[$i])
                        ->where('kode_ket', $kode_ket)
                        ->where('macam_hadir', $request->macam_hadir)
                        ->where('bukti', $bukti)
                        ->get();
                } else {
                    $cek = JadwalKerja::where('id_karyawan', $request->id_kar[$i])
                        ->where('kode_ket', $kode_ket)
                        ->where('macam_hadir', $request->macam_hadir)
                        ->whereDate('mulai', $request->mulai)
                        ->whereDate('selesai', $request->selesai)
                        ->get();
                }
                // dd(count($cek) <= 0, $cek->isEmpty());
                if ($cek->isEmpty()) {
                    $absen[] = [
                        'id_karyawan' => $request->id_kar[$i],
                        'kode_ket' => $kode_ket,
                        'macam_hadir' => $request->macam_hadir,
                        'bukti' => json_encode($request->bukti),
                        'mulai' => $this->parseDateTime($request['mulai'], $request['mulai_jam'] ?? null),
                        'selesai' => $this->parseDateTime($request['selesai'], $request['selesai_jam'] ?? null),
                        'kode_status' => $kode_status,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
            $absen = collect($absen);
        } elseif (in_array($kode_ket, [2, 3, 12])) {
            $kode_status = auth()->user()->kode_role == 5 ? 3 : 2;
            if ($request->macam_hadir == 32) {
                $cuti_bersama = [];
                $org_yg_habis_cuti = [];
                $org_yg_sedang_cuti = [];
                $error = 1;
                for ($i = 0; $i < count($request->id_kar); $i++) {
                    $cek = JadwalKerja::where('id_karyawan', $request->id_kar[$i])
                        ->where('kode_ket', $kode_ket)
                        ->where('macam_hadir', $request->macam_hadir)
                        ->where('mulai', $request->mulai)
                        ->get();

                    if ($cek->isEmpty()) {
                        $absen[] = [
                            'kode_ket' => $kode_ket,
                            'id_karyawan' => $request->id_kar[$i],
                            'macam_hadir' => $request->macam_hadir,
                            'mulai' => $request->mulai,
                            'selesai' => $request->selesai,
                            'bukti' => $request->bukti,
                            'kode_status' => $kode_status,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                }
                $absen = collect($absen);
            } else {

                $request->validate([
                    'id_kar' => 'required|string',
                    'macam_hadir' => 'required|numeric',
                    'mulai' => 'required|string',
                    'selesai' => 'required|string',
                    'mulai_jam' => 'nullable',
                    'selesai_jam' => 'nullable',
                    'bukti' => 'nullable',
                ]);
                if ($request->bukti != null) {
                    if ($request->hasFile('bukti')) {
                        $bukti = $this->storeDoc($request->file('bukti'), 'absen');
                    } else {
                        $bukti = $request->bukti;
                    }
                } else {
                    $bukti = null;
                }

                $kode_status = ($request->macam_hadir != 2) ? 1 : 3;
                $absen = [
                    'id_karyawan' => $id_kar,
                    'kode_ket' => $kode_ket,
                    'macam_hadir' => $request['macam_hadir'],
                    'mulai' => $this->parseDateTime($request['mulai'], $request['mulai_jam'] ?? null),
                    'selesai' => $this->parseDateTime($request['selesai'], $request['selesai_jam'] ?? null),
                    'bukti' => $bukti,
                    'kode_status' => $kode_status,
                ];
                // dd($absen);
            }
        } elseif ($kode_ket == 9) {

            $request->validate([
                'id_kar' => 'required|array',
                'kode_ket' => 'required|string',
                'macam_hadir' => 'required|numeric',
                'mulai' => 'required|string',
                'selesai' => 'required|string',
                'mulai_jam' => 'required|string',
                'selesai_jam' => 'required|string',
                'bukti' => 'required|string',
            ]);

            $kode_status = in_array(auth()->user()->kode_role, [1, 2, 5]) ? 3 : 2;
            for ($i = 0; $i < count($request->id_kar); $i++) {
                $cek = JadwalKerja::where('id_karyawan', $request->id_kar[$i])
                    ->where('kode_ket', $kode_ket)
                    ->where('macam_hadir', $request->macam_hadir)
                    ->whereDate('mulai', $request->mulai)
                    ->whereDate('selesai', $request->selesai)
                    ->get();
                // dd(count($cek) <= 0, $cek->isEmpty());
                if ($cek->isEmpty()) {
                    $absen[] = [
                        'id_karyawan' => $request->id_kar[$i],
                        'kode_ket' => $kode_ket,
                        'macam_hadir' => $request->macam_hadir,
                        'bukti' => $request->bukti,
                        'mulai' => $this->parseDateTime($request['mulai'], $request['mulai_jam'] ?? null),
                        'selesai' => $this->parseDateTime($request['selesai'], $request['selesai_jam'] ?? null),
                        'kode_status' => $kode_status,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
            $absen = collect($absen);
        } elseif ($kode_ket == 8) {
            $absen = $request->validate([
                'mulai' => 'required',
                'selesai' => 'required',
                'mulai_jam' => 'nullable',
                'selesai_jam' => 'nullable',
            ]);

            $absen = [
                'id_karyawan' => $id_kar,
                'kode_ket' => $kode_ket,
                'macam_hadir' => $id_kar,
                'mulai' => $absen['mulai'] . ' ' . $absen['mulai_jam'],
                'selesai' => $absen['selesai'] . ' ' . $absen['selesai_jam'],
                'kode_status' => 3,
            ];
        } elseif ($kode_ket == 10) {

            $absen = $request->validate([
                'mulai' => 'required',
                'selesai' => 'required',
                'mulai_jam' => 'required',
                'selesai_jam' => 'required',
                'bukti' => 'required',
            ]);

            $absen = [
                'id_karyawan' => $id_kar,
                'kode_ket' => $kode_ket,
                'macam_hadir' => $request->macam_hadir,
                'mulai' => $request->mulai . ' ' . $request->mulai_jam,
                'selesai' => $request->selesai . ' ' . $request->selesai_jam,
                'bukti' => $absen['bukti'],
                'kode_status' => 1,
            ];
        } elseif ($kode_ket == 13) {

            $request->validate([
                'id_kar' => 'required|array',
                'kode_ket' => 'required|string',
                'macam_hadir' => 'required|numeric',
                'mulai' => 'required|string',
                'selesai' => 'required|string',
                'bukti' => 'required|string',
            ]);

            $kode_status = in_array(auth()->user()->kode_role, [1, 2, 5]) ? 3 : 2;
            for ($i = 0; $i < count($request->id_kar); $i++) {
                $cek = JadwalKerja::where('id_karyawan', $request->id_kar[$i])
                    ->where('kode_ket', $kode_ket)
                    ->where('macam_hadir', $request->macam_hadir)
                    ->whereDate('mulai', $request->mulai)
                    ->whereDate('selesai', $request->selesai)
                    ->get();
                // dd(count($cek) <= 0, $cek->isEmpty());
                if ($cek->isEmpty()) {
                    $absen[] = [
                        'id_karyawan' => $request->id_kar[$i],
                        'kode_ket' => $kode_ket,
                        'macam_hadir' => $request->macam_hadir,
                        'bukti' => $request->bukti,
                        'mulai' => $this->parseDateTime($request['mulai'], $request['mulai_jam'] ?? null),
                        'selesai' => $this->parseDateTime($request['selesai'], $request['selesai_jam'] ?? null),
                        'kode_status' => $kode_status,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }
            }
            $absen = collect($absen);
        } elseif ($kode_ket == 5) {
            $request->validate([
                'id_kar' => 'required|string',
                'kode_ket' => 'required|string',
                'mulai' => 'required|string',
                'selesai' => 'required|string',
                'bukti' => 'nullable',
            ]);
            if ($request->bukti != null) {
                if ($request->hasFile('bukti')) {
                    $bukti = $this->storeDoc($request->file('bukti'), 'absen');
                } else {
                    $bukti = $request->bukti;
                }
            } else {
                $bukti = null;
            }

            $absen = [
                'id_karyawan' => $id_kar,
                'kode_ket' => $kode_ket,
                'macam_hadir' => $request['macam_hadir'],
                'mulai' => $this->parseDateTime($request['mulai'], $request['mulai_jam'] ?? null),
                'selesai' => $this->parseDateTime($request['selesai'], $request['selesai_jam'] ?? null),
                'bukti' => $bukti,
                'kode_status' => 3,
            ];
        } elseif ($kode_ket == 4) {
            if (auth()->user()->org->pegawai->kode_struktural) {

                if (auth()->user()->org->pegawai->kode_struktural >= 7) {
                    $kode_status = 1;
                    // $kode_status = 9;
                } else if (auth()->user()->org->pegawai->kode_struktural <= 6 && auth()->user()->org->pegawai->kode_struktural >= 4) {
                    // $kode_status = 8;
                    $kode_status = 1;
                } else if (auth()->user()->org->pegawai->kode_struktural == 3) {
                    $kode_status = 2;
                } else {

                    $kode_status = 1;
                }
            } else {
                $kode_status = 1;
            }
            $absen = $request->validate([
                'id_kar' => 'required|string',
                'kode_ket' => 'required|string',
                'mulai' => 'required|string',
                'selesai' => 'required|string',
                'bukti' => 'required',
            ]);
            if ($request->bukti == null) {
                $absen['bukti'] = '';
            }
            $absen = [
                'id_karyawan' => $id_kar,
                'kode_ket' => 4,
                'mulai' => $this->parseDateTime($request['mulai'], $request['mulai_jam'] ?? null),
                'selesai' => $this->parseDateTime($request['selesai'], $request['selesai_jam'] ?? null),
                'bukti' => $absen['bukti'],
                'kode_status' => $kode_status,
            ];
            // dd($absen);
        }
        if (is_object($absen) && count($absen) > 0) {
            // dd('object', $absen);
            $absenArray = collect($absen)->values()->all(); // pastikan array of arrays

            JadwalKerja::insert($absenArray);

            $new = JadwalKerja::whereIn('id_karyawan', collect($absen)->pluck('id_karyawan'))
                ->where('kode_ket', $kode_ket) // asumsi tanggal sama
                ->where('macam_hadir', $request->macam_hadir) // asumsi tanggal sama
                ->whereDate('mulai', $request['mulai']) // asumsi tanggal sama
                ->with('status')
                ->get();

            return response()->json($new);
        } else {
            $cek  = JadwalKerja::where('id_karyawan', $id_kar)
                ->where('kode_ket', $kode_ket)
                ->where('macam_hadir', $request->macam_hadir)
                ->whereDate('mulai', $request->mulai)
                ->get();
            if ($cek->isEmpty()) {
                // dd('array', $absen);
                $new = JadwalKerja::create($absen);
                return response()->json($new->load('status'));
            } else {
                return response()->json([
                    'message' => 'Anda telah mengajukan hal yang sama, silakan tunggu konfirmasi'
                ], 400);
            }
        }

        // return $new;
        // dd($atasan);
        // dd($atasan, Kepegawaian::where('fungsional', auth()->user()->pegawai->fungsional)
        //     ->where('kode_struktural', auth()->user()->pegawai->kode_struktural - 1)
        //     ->get());
        // Mail::to($atasan)->send(new SendPengajuanIzinEmail);
        // try {
        //     $data = JadwalKerja::where('id_karyawan', $id_kar)
        //         ->where('kode_ket', $kode_ket)
        //         ->where('macam_hadir', $request->macam_hadir)
        //         ->where('mulai', $absen['mulai'])
        //         ->where('selesai', $absen['selesai'])
        //         ->get();

        //     // dd($cek, $data, $absen);
        //     $absen['kode_aktifitas'] = 17;
        //     $absen['pesan_notif'] = 'telah mengajukan izin: ';
        //     if ($kode_ket == 10 || $kode_ket == 7) {
        //         $atasan = User::whereIn(
        //             'id_karyawan',
        //             // Kepegawaian::where('kode_struktural', 4)
        //             Kepegawaian::whereIn('kode_struktural',  [1, 3])
        //                 ->where('fungsional', auth()->user()->org->pegawai->fungsional)
        //                 // ->where('kode_struktural', auth()->user()->org->pegawai->kode_struktural - 1)
        //                 ->get()
        //                 ->pluck('id_karyawan')
        //         )->get();
        //     } else {
        //         $atasan = User::whereIn(
        //             'id_karyawan',
        //             // Kepegawaian::where('kode_struktural', 4)
        //             Kepegawaian::where('kode_struktural',  3)
        //                 ->where('fungsional', auth()->user()->org->pegawai->fungsional)
        //                 // ->where('kode_struktural', auth()->user()->org->pegawai->kode_struktural - 1)
        //                 ->get()
        //                 ->pluck('id_karyawan')
        //         )->get();
        //     }
        //     $notif_push = [
        //         'title' => 'Pengajuan Izin',
        //         'body' => 'Pengajuan Baru',
        //         'data' => [
        //             'url' =>
        //             // route('Jaker.konfirmasi_page', [auth()->user()->id_karyawan, Crypt::encrypt($data->first()->created_at)]),
        //             route('Jaker.konfirmasi_page', [auth()->user()->id_karyawan, Crypt::encrypt(1)]),
        //         ],
        //     ];
        //     // dd(route('Jaker.konfirmasi_page', [1]));
        //     NotificationController::sendNotification(
        //         $notif_push,
        //         $atasan
        //             ->pluck('id_karyawan'),
        //         // route('Jaker.konfirmasi_page', [auth()->user()->id_karyawan, Crypt::encrypt($data->first()->created_at)]),
        //         route('Jaker.konfirmasi_page', [auth()->user()->id_karyawan, Crypt::encrypt(1)]),
        //         // route('Jaker.konfirmasi_page', [auth()->user()->id_karyawan, Crypt::encrypt(1)]),
        //         // 'http://127.0.0.1:8000/JadwalKerja/pengajuan/konfirmasi/' . auth()->user()->id_karyawan . '/' . Crypt::encrypt($data->first()->created_at),
        //     );
        //     Notification::send($atasan, new PengajuanIzinNotif($absen));
        //     RecordController::RecordAct(auth()->user()->id, 17);
        //     //code...
        // } catch (\Throwable $th) {
        //     //throw $th;
        // }

        // return redirect()->route('Jaker.konfirmasi_page', [auth()->user()->id_karyawan, Crypt::encrypt($data->first()->created_at)]);
        //code...
        // } catch (\Exception $e) {
        //     throw response()->json(['error', $e->getMessage()], 400);
        // }

        // $absen = JadwalKerja::where('created_at', now())->first();

    }

    public function updatePengajuan(Request $request, $kode_ket, $id, $id_kar)
    {
        $kode_ket = Crypt::decrypt($kode_ket);
        $id = Crypt::decrypt($id);
        $id_kar = Crypt::decrypt($id_kar);
        $valid = $request->validate([
            'bukti' => 'image|file'
        ]);

        $data = JadwalKerja::where('created_at', $id)
            ->where('kode_ket', $kode_ket)
            ->first();
        if ($request->hasFile('bukti')) {
            $filename = uniqid('bukti_') . '.' . $valid['bukti']->getClientOriginalExtension();

            $valid['bukti']->move(public_path('assets/absen/'), $filename);
            $valid['bukti'] = $filename;
        }

        if ($request->hasFile('bukti')) {
            $data->update([
                'bukti' => $valid['bukti'],
            ]);
        }
        //    dd($request->has('selesai'));
        if ($request->has('mulai') && $request->has('selesai')) {
            $data->update([
                'mulai' => $request->mulai,
                'selesai' => $request->selesai,
            ]);
        }

        RecordController::RecordAct(auth()->user()->id_karyawan, 18);
        $notif = [
            "kode_aktifitas" => 18,
            "id_karyawan" => $data['id_karyawan'],
            "kode_ket" => $data['kode_ket'],
            "macam_hadir" => $data['macam_hadir'],
            "mulai" => $data['mulai'],
            "selesai" => $data['selesai'],
            "bukti" => $data['bukti'],
            "kode_status" => $data['kode_status'],
            'pesan_notif' => 'Pengajuan: telah diupdate, silakan cek.'
        ];
        $hc = User::where('kode_role', 5)->get();
        $user = User::where('id_karyawan', $data['id_karyawan'])->first();
        $notif_push = [
            'title' => 'Update Bukti Sakit',
            'body' => 'Pengajuan Diperbarui',
        ];
        $atasan = User::whereIn(
            'id_karyawan',
            // Kepegawaian::where('kode_struktural', 4)
            Kepegawaian::whereIn('kode_struktural',  [3])
                ->where('fungsional', auth()->user()->org->pegawai->fungsional)
                // ->where('kode_struktural', auth()->user()->org->pegawai->kode_struktural - 1)
                ->get()
                ->pluck('id_karyawan')
        )->get()
            ->pluck('id_karyawan');
        $target = User::whereIn('id_karyawan', $hc->pluck('id_karyawan'))
            ->get();
        // dd($target);
        NotificationController::sendNotification(
            $notif_push,
            $target->pluck('id_karyawan'),
            // route('Jaker.konfirmasi_page', [auth()->user()->id_karyawan, Crypt::encrypt($data->created_at)]),
            route('Jaker.konfirmasi_page', [auth()->user()->id_karyawan, Crypt::encrypt(1)]),
        );
        $notif['pesan_notif'] = 'Pengajuan izin: telah dikonfirmasi, silakan cek.';
        Notification::send($user, new PengajuanIzinNotif($notif));

        return back()->with('success', 'Pengajuan Izin sudah dikonfirmasi');
    }
    public function Lembur($id_kar)
    {
        $id_kar = Crypt::decrypt($id_kar);
        // dd(auth()->user()->id);
        return view('JadwalKerja.Lembur', [
            'title' => 'Jadwal Kerja',
            'subtitle' => 'Lembur',
            'lemburs' => JadwalKerja::where('id_karyawan', $id_kar)
                ->whereIn('kode_status', [3, 10, 11])
                ->where('kode_ket', 9)
                ->with([
                    'org' => with([
                        'dokumen',
                        'pegawai' => with(['struktur', 'fungsi']),
                    ]),
                    'stat',
                    'absen'
                ])->get(),
        ]);
    }

    public function hapusAbsen($id_jaker)
    {
        $id_jaker = Crypt::decrypt($id_jaker);

        JadwalKerja::find($id_jaker)->delete();

        return back()->with('success', 'Jadwal Kerja #' . $id_jaker . ' telah dihapus');
    }

    public function konfirmasi(Request $request, $kode_ket, $id, $id_kar)
    {
        $kode_ket = Crypt::decrypt($kode_ket);
        $id = Crypt::decrypt($id);
        $id_kar = Crypt::decrypt($id_kar);
        if ($request->kode_status == 11) {
            $valid = $request->validate([
                'bukti' => 'required',
                'kode_status' => 'required',
                'mulai' => 'required',
                'mulai_jam' => 'required',
                'selesai' => 'nullable',
                'selesai_jam' => 'nullable',
            ]);
        } elseif ($request->kode_status == 12) {
            $valid = $request->validate([
                'kode_status' => 'required',
                'selesai' => 'nullable',
                'selesai_jam' => 'nullable',
            ]);
            // dd($valid);
        } else {
            $valid = $request->validate([
                'kode_status' => 'required',
                'mulai' => 'required',
                'mulai_jam' => 'required',
                'selesai' => 'nullable',
                'selesai_jam' => 'nullable',
            ]);
        }
        $valid['kode_status'] = number_format($valid['kode_status']);

        // dd($valid);
        if ($valid['kode_status'] == 12) {
            $data = JadwalKerja::find($id);

            $data->update([
                'kode_status' => $valid['kode_status'],
            ]);
        } else if ($kode_ket == 11 && $valid['kode_status'] == 3) {
            $data = JadwalKerja::find($id);
            $this->konfirmasiOvershift($request, $data, $id_kar);
        } elseif ($kode_ket != 9 && $kode_ket != 1) {
            $data = JadwalKerja::where('id', $id)->first();

            if ($kode_ket == 2) {
                $date = date_create(auth()->user()->org->pegawai->masuk, timezone_open('Asia/Jakarta'));
                $legal = date_add(date_create(auth()->user()->org->pegawai->masuk, timezone_open('Asia/Jakarta')), date_interval_create_from_date_string('1 year'));

                $diff = date_diff($date, now());
                $diff2 = date_diff(now(), $legal);
                if (number_format($diff->format('%y')) >= 1 && number_format($diff->format('%y')) < 2) {
                    $sisaCuti = KaryawanController::TotalSisaCutiBaruSetahunKerja(auth()->user()->id_karyawan);
                    $sisa = $sisaCuti == 1 ? 12 - $sisaCuti : $sisaCuti;
                } elseif (number_format($diff->format('%y')) >= 2) {
                    $sisa = 12;
                } else {
                    $sisa = 0;
                }
                $total_sisa = $sisa - number_format(JadwalKerjaController::Total_Cuti_Tahunan(auth()->user()->id_karyawan, 2));
                // if (number_format($diff->format('%y')) >= 1 && number_format($diff->format('%y')) < 2) {
                //     if (number_format(JadwalKerjaController::Total_Cuti_Tahunan(auth()->user()->id_karyawan, 2)) >= $total_sisa) {
                //         return 'Cuti Tahunan Anda telah habis, silakan pilih jenis cuti yang tersedia';
                //     } else {
                //         return 'Sisa Cuti Tahunan Anda' . $sisa - number_format(JadwalKerjaController::Total_Cuti_Tahunan(auth()->user()->id_karyawan, 2)) .
                //             'hari lagi';
                //     }
                // } else if (number_format($diff->format('%y')) >= 2) {
                //     if (number_format(JadwalKerjaController::Total_Cuti_Tahunan(auth()->user()->id_karyawan, 2)) >= $total_sisa) {
                //         return 'Cuti Tahunan Anda telah habis, silakan pilih jenis cuti yang tersedia';
                //     } else {
                //         return 'Sisa Cuti Tahunan Anda' .
                //             $sisa - number_format(JadwalKerjaController::Total_Cuti_Tahunan(auth()->user()->id_karyawan, 2)) .
                //             'hari lagi';
                //     }
                // }

                // if (number_format($diff->format('%y')) >= 1 && number_format($diff->format('%y')) < 2) {
                //     $sisa = KaryawanController::TotalSisaCutiBaruSetahunKerja(auth()->user()->id_karyawan);
                // } elseif (number_format($diff->format('%y')) >= 2) {
                //     $sisa = 12;
                // } else {
                //     $sisa = 0;
                // }
                // $total_sisa = $sisa - number_format(JadwalKerjaController::Total_Cuti_Tahunan(auth()->user()->id_karyawan, 2));
                $total_cuti = (int)date_diff(date_create($valid['mulai']), date_create($valid['selesai']))->format('%a') + 1;
                if ($total_cuti > $total_sisa && $valid['kode_status'] == 3) {
                    return back()->with('error', 'Pengajuan ini tidak bisa di ACC, karena sisanya ' . $total_sisa . ' hari sedangkan pengajuan untuk ' . $total_cuti . ' hari');
                }
            }
            $data->update([
                'kode_status' => $valid['kode_status'],
                'mulai' => $valid['mulai'] . ' ' . $valid['mulai_jam'],
                'selesai' => $valid['selesai'] . ' ' . $valid['selesai_jam'],
            ]);
        } elseif ($kode_ket == 9 && ($valid['kode_status'] == 10 || $valid['kode_status'] == 11)) {
            $data = JadwalKerja::where('id', $id)->first();
            // dd($data, $valid);
            if ($valid['kode_status'] == 10) {
                $data->update([
                    'kode_status' => $valid['kode_status'],
                    'mulai' => $valid['mulai'] . ' ' . $valid['mulai_jam'],
                    'selesai' => $valid['selesai'] . ' ' . $valid['selesai_jam'],
                ]);
            } else if ($valid['kode_status'] == 11) {
                $data->update([
                    'bukti' => $valid['bukti'],
                    'kode_status' => $valid['kode_status'],
                    'mulai' => $valid['mulai'] . ' ' . $valid['mulai_jam'],
                    'selesai' => $valid['selesai'] . ' ' . $valid['selesai_jam'],
                ]);
            }
        } else {

            $data = JadwalKerja::where('created_at', $id)->first();
            JadwalKerja::where('created_at', $data->created_at)
                ->update([
                    'kode_status' => $valid['kode_status'],
                    'mulai' => $valid['mulai'] . ' ' . $valid['mulai_jam'],
                    'selesai' => $valid['selesai'] . ' ' . $valid['selesai_jam'],
                ]);
        }
        // dd($data['created_at']);
        RecordController::RecordAct(auth()->user()->id_karyawan, 18);
        $notif = [
            "kode_aktifitas" => 18,
            "id_karyawan" => $data['id_karyawan'],
            "kode_ket" => $data['kode_ket'],
            "macam_hadir" => $data['macam_hadir'],
            "mulai" => $data['mulai'],
            "selesai" => $data['selesai'],
            "bukti" => $data['bukti'],
            "kode_status" => $data['kode_status'],
            'pesan_notif' => 'Pengajuan izin: telah dikonfirmasi, silakan cek.'
        ];
        $hc = User::where('kode_role', 5)->get();
        $user = User::where('id_karyawan', $data['id_karyawan'])->first();
        $notif_push = [
            'title' => 'Pengajuan Izin',
            'body' => 'Pengajuan Dikonfirmasi',
        ];
        // dd($user->only(['id']));
        if ($valid['kode_status'] == 3 && $kode_ket == 9) {
            $notif_push = [
                'title' => 'Lembur',
                'body' => 'Lembur telah dijadwalkan',
            ];
            $target = User::whereIn(
                'id_karyawan',
                JadwalKerja::where('created_at', $data->created_at)
                    ->get()
                    ->pluck('id_karyawan')
            )->get();
            NotificationController::sendNotification(
                $notif_push,
                $target->pluck('id_karyawan'),
                // route('Jaker.konfirmasi_page', [auth()->user()->id_karyawan, Crypt::encrypt($data->created_at)]),
                route('Jaker.konfirmasi_page', [auth()->user()->id_karyawan, Crypt::encrypt(1)]),
            );
            // dd($target);
        } elseif ($valid['kode_status'] == 10 || $valid['kode_status'] == 11) {

            $atasan = User::whereIn(
                'id_karyawan',
                Kepegawaian::where('kode_struktural',  auth()->user()->org->pegawai->kode_struktural > 3 ? 3 : auth()->user()->org->pegawai->kode_struktural - 1)
                    ->where('fungsional', auth()->user()->org->pegawai->fungsional)
                    ->get()
                    ->pluck('id_karyawan')
            )->get();
            $notif_push = [
                'title' => 'Lembur',
                'body' => 'Lembur telah dikonfirmasi oleh karyawan',
            ];
            NotificationController::sendNotification(
                $notif_push,
                $atasan->pluck('id_karyawan'),
                // route('Jaker.konfirmasi_page', [auth()->user()->id_karyawan, Crypt::encrypt($data->created_at)]),
                route('Jaker.konfirmasi_page', [auth()->user()->id_karyawan, Crypt::encrypt(1)]),
            );
        } else {
            $notif_push = [
                'title' => 'Pengajuan Izin',
                'body' => 'Pengajuan Dikonfirmasi',
            ];
            NotificationController::sendNotification(
                $notif_push,
                $user->pluck('id'),
                // 'http://127.0.0.1:8000/JadwalKerja/pengajuan/konfirmasi/' . auth()->user()->id_karyawan . '/' . Crypt::encrypt($data->created_at),
                // route('Jaker.konfirmasi_page', [auth()->user()->id_karyawan, Crypt::encrypt($data->created_at)]),
                route('Jaker.konfirmasi_page', [auth()->user()->id_karyawan, Crypt::encrypt(1)]),
            );
        }
        // dd($user);
        if ($valid['kode_status'] == 2) {
            $notif['pesan_notif'] = 'Pengajuan izin: telah dikonfirmasi oleh atasan, silakan cek.';
            Notification::send($hc, new PengajuanIzinNotif($notif));
        } else {
            $notif['pesan_notif'] = 'Pengajuan izin: telah dikonfirmasi, silakan cek.';
            Notification::send(
                $user,
                new PengajuanIzinNotif($notif),
            );
        }

        return back()->with('success', 'Pengajuan sudah dikonfirmasi');
    }

    public static function Absen($id_kar, $kode_ket)
    {
        // $id_kar = Crypt::decrypt($id_kar);
        $org = Karyawan::find($id_kar);
        $tahun_skr = date_format(date_create(now()), 'Y');
        $absen = $org->absens
            ->where('kode_ket', $kode_ket)
            ->where('kode_status', 3)
            ->whereBetween('updated_at', [
                Carbon::now()->startOfYear(),
                Carbon::now()->endOfYear(),
            ]);

        // 7 : Terlambat
        // 10 : Izin Terlambat
        $total_absen = 0;
        foreach ($absen as $key) {
            if ($kode_ket == 10 || $kode_ket == 7) {
                $hari_absen = number_format(date_diff(date_create($key->mulai), date_create($key->selesai))->format('%H'));
            } else {
                $hari_absen = number_format(date_diff(date_create($key->mulai), date_create($key->selesai))->format('%a')) + 1;
            }
            $total_absen += $hari_absen;
        }

        $pesan = '';
        if ($absen->count() != null) {
            if ($kode_ket == 10 || $kode_ket == 7) {
                $pesan = $absen->count()  . ' kali dengan total ' . $total_absen . ' menit';
            } else {
                $pesan = $absen->count()  . ' kali dengan total ' . $total_absen . ' hari';
            }
            return $pesan;
        } else {
            $pesan = 'Belum pernah';
            return $pesan;
        }
    }

    public static function Total_Cuti_Tahunan($id_kar, $kode_ket)
    {
        // $id_kar = Crypt::decrypt($id_kar);
        $org = Karyawan::find($id_kar)->absens;
        // $org = Karyawan::find($id_kar);
        if ($org != null) {
            $tahun_skr = date_format(date_create(now()), 'Y');
            $absenceTypes = [1, 31, 32, 4];
            $totalAbsences = [];

            foreach ($absenceTypes as $type) {
                $absences = $org
                    ->where('kode_ket', $kode_ket)
                    ->where('kode_status', 3)
                    ->where('macam_hadir', $type)
                    ->whereBetween('updated_at', [
                        Carbon::now()->startOfYear(),
                        Carbon::now()->endOfYear(),
                    ]);

                $totalDays = 0;

                if ($absences->count() > 0) {
                    foreach ($absences as $key) {
                        $days = number_format(date_diff(date_create($key->mulai), date_create($key->selesai))->format('%a')) + 1;
                        $totalDays += $days;
                    }
                }

                $totalAbsences[$type] = $totalDays;
            }

            $total_absen = array_sum($totalAbsences);
        } else {
            $total_absen = 0;
        }

        return $total_absen;
    }

    public function notifIzin($kode_notif)
    {
        $kode_notif = Crypt::decrypt($kode_notif);
        $notif = auth()->user()->notifications->find($kode_notif);
        $notif->markAsRead();
        // dd($notif->data['id_karyawan']);

        return redirect()->route('Jaker.index', ['index', Crypt::encrypt(auth()->user()->id)]);
    }

    public function archivePengajuan($kode_archive, $created_at)
    {
        $created_at = Crypt::decrypt($created_at);
        $kode_archive = Crypt::decrypt($kode_archive);
        JadwalKerja::where('created_at', $created_at)
            ->update(['is_archive' => $kode_archive]);
        // dd($req);

        switch ($kode_archive) {
            case 0:
                $notif = 'Pengajuan telah dipulihkan';
                break;
            case 1:
                $notif = 'Pengajuan telah diarsipkan';
                break;

            default:
                # code...
                break;
        }
        return back()->with('success', $notif);
    }

    public function pengajuanOvershift(Request $req)
    {

        $absen = $req->validate([
            'id_kar' => 'required|string',
            'jaker_id' => 'required|string',
            'mulai' => 'required|string',
            'selesai' => 'required|string',
        ]);

        $jaker_id = Crypt::decrypt($req->jaker_id);
        $id_kar = Crypt::decrypt($req->id_kar);
        $cek = JadwalKerja::where([
            'id_karyawan' => $id_kar,
            'kode_ket' => 11,
            'macam_hadir' => $jaker_id,
            'mulai' => $absen['mulai'],
            'selesai' => $absen['selesai'],
            'kode_status' => 1,
        ])->get();

        if ($cek->isEmpty()) {
            JadwalKerja::create([
                'id_karyawan' => $id_kar,
                'kode_ket' => 11,
                'macam_hadir' => $jaker_id,
                'bukti' => 'Pengajuan Overshift dari ID Lembur #' . $jaker_id,
                'mulai' => $absen['mulai'],
                'selesai' => $absen['selesai'],
                'kode_status' => 1,
            ]);
            // $atasan = User::whereIn(
            //     'id_karyawan',
            //     Kepegawaian::where('kode_struktural',  auth()->user()->org->pegawai->kode_struktural > 3 ? 3 : auth()->user()->org->pegawai->kode_struktural - 1)
            //         ->where('fungsional', auth()->user()->org->pegawai->fungsional)
            //         ->get()
            //         ->pluck('id_karyawan')
            // )->get();
            // $notif_push = [
            //     'title' => 'Overshift',
            //     'body' => 'Karyawan mengajukan Overshift',
            // ];
            // NotificationController::sendNotification(
            //     $notif_push,
            //     $atasan->pluck('id_karyawan'),
            //     route('Jaker.index', ['index', Crypt::encrypt(auth()->user()->id_karyawan)]),
            // );

            return back()->with('success', 'Overshift sedang diajukan');
        } else {
            return back()->with('error', 'Overshift sudah diajukan sebelumnya');
        }
    }

    public function konfirmasiOvershift($request, $jaker, $id_kar)
    {
        // $id_jaker = Crypt::decrypt($id_jaker);
        // $id_kar = Crypt::decrypt($id_kar);
        $laporan = LaporanLembur::where('jaker_id', $jaker['macam_hadir'])->first();
        $lembur = JadwalKerja::find($jaker['macam_hadir']);
        $overshift = JadwalKerja::find($jaker['id']);
        $durasi_laporan = date_diff(date_create($laporan['waktu_awal'], timezone_open('Asia/Jakarta')), date_create($laporan['waktu_akhir'], timezone_open('Asia/Jakarta'))->modify('+1 day'));
        $total_durasi_laporan = ($durasi_laporan->format('%a') > 0) ? ($durasi_laporan->format('%a') * 24) + $durasi_laporan->format('%h') : $durasi_laporan->format('%h');

        if (auth()->user()->pegawai->fungsional == 2 || auth()->user()->pegawai->fungsional == 3) {
            $min_waktu_overshift = 7;
        } else {
            $min_waktu_overshift = 8;
        }
        $durasi_overshift = date_diff(date_create($overshift['mulai'], timezone_open('Asia/Jakarta')), date_create($overshift['selesai'], timezone_open('Asia/Jakarta'))->modify('+1 day'));
        $total_durasi_overshift = ($durasi_overshift->format('%a') > 0) ? ($durasi_overshift->format('%a') * $min_waktu_overshift) + $durasi_overshift->format('%h') : $durasi_overshift->format('%h');

        $total_durasi = $total_durasi_laporan - $total_durasi_overshift;
        if ($total_durasi / 24 >= 1) {
            $sisa_hari = floor(number_format($total_durasi) / 24) - 1;
        } else {
            $sisa_hari = floor(number_format($total_durasi) / 24);
        }
        $sisa_jam = fmod(number_format($total_durasi), 24);
        $overshift->update([
            'kode_status' => $request['kode_status'],
            'bukti' => 'Overshift dari ID Lembur #' . $lembur['id'] . ' dengan durasi ' . $durasi_overshift->format('%a') . ' hari',
        ]);

        $lembur->update([
            'selesai' => date_modify(date_create($lembur['mulai']), '+' . $sisa_hari . ' days ' . $sisa_jam . 'hours'),
        ]);
        $laporan->update([
            'waktu_akhir' => date_modify(date_create($laporan['waktu_awal']), '+' . $sisa_hari . ' days ' . $sisa_jam . 'hours')
        ]);
        // $target = User::whereIn(
        //     'id_karyawan',
        //     JadwalKerja::where('created_at', $lembur->created_at)
        //         ->get()
        //         ->pluck('id_karyawan')
        // )->get();
        // $notif_push = [
        //     'title' => 'Overshift',
        //     'body' => 'Overshift telah dikonfirmasi',
        // ];
        // NotificationController::sendNotification(
        //     $notif_push,
        //     $target->pluck('id_karyawan'),
        //     // route('Jaker.konfirmasi_page', [auth()->user()->id_karyawan, Crypt::encrypt($overshift->created_at)]),
        //     route('Jaker.konfirmasi_page', [auth()->user()->id_karyawan, Crypt::encrypt(1)]),
        // );

        return back()->with('success', 'Overshift sudah dikonfirmasi');
    }

    public function konfirmasi_page($id_kar, $created_at)
    {
        $created_at = Crypt::decrypt($created_at);
        return view('JadwalKerja.pages.konfirmasi', [
            'title' => 'Pengajuan',
            'subtitle' => 'Konfirmasi',
            'item' => JadwalKerja::where('created_at', $created_at)
                ->get(),
        ]);
    }

    public function editJadwalKerja(Request $req, $id_jaker)
    {
        $id_jaker = decrypt($id_jaker);
        $valid = $req->validate([
            'bukti' => 'required'
        ]);
        $hari = json_encode($req->bukti);
        // dd($id_jaker);

        JadwalKerja::find($id_jaker)
            ->update([
                'bukti' => $hari
            ]);

        return back()->with('success', 'ID #' . $id_jaker . ' berhasil diupdate');
    }

    public function uploadBukti(Request $request, $id_kar, $id_jaker)
    {
        $request->validate(['bukti' => 'required']);

        if ($request->hasFile('bukti')) {
            $filename = uniqid('bukti_') . '.' . $request['bukti']->getClientOriginalExtension();

            $request['bukti']->move(public_path('assets/absen/'), $filename);
            $valid['bukti'] = $filename;
        }
        LampiranPengajuan::updateOrCreate(
            [
                'id_karyawan' => Crypt::decrypt($id_kar),
                'id_jaker' => Crypt::decrypt($id_jaker),
            ],
            [
                'dokumen' => $valid['bukti']
            ]
        );

        return back()->with('success', 'Bukti pengajuan Anda berhasil diunggah');
    }

    public function getHariRaya()
    {
        return [
            'hariRaya' => JadwalKerja::where('kode_ket', 2)
                ->where('macam_hadir', 33)
                ->where('kode_status', 3)
                ->get(),
            'liburNas' => JadwalKerja::where('kode_ket', 2)
                ->where('macam_hadir', 34)
                ->where('kode_status', 3)
                ->get()
        ];
    }
}
