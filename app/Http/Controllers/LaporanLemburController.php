<?php

namespace App\Http\Controllers;

use App\Models\JabatanDivisi;
use App\Models\JadwalKerja;
use App\Models\Karyawan;
use App\Models\Kehadiran;
use App\Models\Kepegawaian;
use App\Models\LaporanLembur;
use App\Models\MacamKehadiran;
use App\Models\PKWT;
use App\Models\Sistem\Birokrasi;
use App\Models\Status;
// use Barryvdh\DomPDF\PDF;
use Barryvdh\DomPDF\Facade\Pdf;
use DateInterval;
use DatePeriod;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;
use Livewire\Livewire;

class LaporanLemburController extends Controller
{
    public function index()
    {
        // return ['data' => Karyawan::join('kepegawaians', 'karyawans.id', '=', 'kepegawaians.id_karyawan')
        //     ->with([
        //         'lemburSelesai' => with(['laporan']),
        //         'pegawai' => with(['divisi', 'kontrak' => with(['divisi'])]),
        //     ])
        //     ->orderBy('kepegawaians.kode_struktural')
        //     ->orderBy('nama')
        //     // ->take(5)
        //     ->get()];
        // return ['data' => Kepegawaian::join('karyawans', 'karyawans.id', '=', 'kepegawaians.id_karyawan')
        // dd(Karyawan::with([
        //     'pegawai' => with([
        //         'lemburSelesai' => with(['laporan']),
        //         'divisi' => with(['div']),
        //         'kontrakTerakhir' => with(['divisi']),
        //     ])
        // ])
        //     ->whereNotIn('id', [1])
        //     // ->take(5)
        //     ->get());
        $start = now()->subMonths(12);
        $end = now();
        $date_range = [$start, $end];
        return Inertia::render('Rekapitulasi/Lembur/index', [
            'title' => 'Rekapitulasi',
            'subtitle' => 'Lembur',
            'start' => $start,
            'end' => $end,
            'karyawans' => Karyawan::whereNotIn('id', [1])
                ->where('status_aktif', 1)
                ->with([
                    'pegawai.divisi.div',
                    'pegawai.kontrakTerakhir'
                ])
                ->get(),
            'data' => JadwalKerja::whereBetween('created_at', $date_range)
                ->with('laporan')
                ->orderBy('created_at', 'desc')
                ->get(),

            'hariRaya' => JadwalKerja::where('kode_ket', 2)
                ->where('macam_hadir', 33)
                ->where('kode_status', 3)
                ->whereBetween('created_at', $date_range)
                ->get(),
            'liburNas' => JadwalKerja::where('kode_ket', 2)
                ->where('macam_hadir', 34)
                ->where('kode_status', 3)
                ->whereBetween('created_at', $date_range)
                ->get(),

            'kehadiran' => Kehadiran::all(),
            'statuses' => Status::whereIn('id', [1, 2, 3, 4, 8, 9, 10, 11, 12])->get(),
        ]);
    }

    public function search(Request $req)
    {
        $validated = $req->validate([
            'idKar' => 'nullable|array',
            'idKar.*' => 'integer',
            'mulai' => 'required|date',
            'selesai' => 'required|date',
        ]);

        $query = JadwalKerja::query()
            ->where('kode_ket', 9)
            ->where('kode_status', 10);
        if (!empty($validated['idKar'])) {
            $query->whereIn('id_karyawan', $validated['idKar']);
        }

        $query->whereDate('mulai', '>=', $validated['mulai'])
            ->whereDate('selesai', '<=', $validated['selesai']);
        // $query->whereBetween('selesai', [$validated['mulai'], $validated['selesai']]);
        // dd($query->get());

        return $query->without(['status'])->with(['laporan'])->get();
    }


    public function add(Request $req)
    {
        $req->validate([
            'target' => 'required|string|in:awal,akhir',
            'id_kar' => 'required|string',
            'jaker_id' => 'required|string',
        ]);
        $id_kar = Crypt::decrypt($req->id_kar);
        $jaker_id = Crypt::decrypt($req->jaker_id);
        $target = $req->target;

        $long = "lokasi_longitude_$target";
        $lat = "lokasi_latitude_$target";
        $waktu = "waktu_$target";
        $foto = "foto_$target";

        $req->validate([
            $long => 'required',
            $lat => 'required',
            $waktu => 'required',
            $foto => 'required',
            'pekerjaan' => 'required',
        ]);



        if ($req->hasFile($foto)) {
            $fotoFile = $this->storeDoc($req->file($foto), 'laporan_lembur');
        } else {
            $fotoFile = $req[$foto];
        }

        // dd($valid, $id_kar, $jaker_id);
        $new = LaporanLembur::updateOrCreate(
            [
                'jaker_id' => $jaker_id,
                'id_karyawan' => $id_kar,
            ],
            [
                $long => $req[$long],
                $lat => $req[$lat],
                $waktu => $req[$waktu],
                $foto => $fotoFile,
                'pekerjaan' => $req['pekerjaan'],
                'kode_status' => 2,
            ]
        );

        return response()->json($this->getData('laporan', $new));
    }

    public function overshift(Request $req)
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
            // 'macam_hadir' => $jaker_id,
        ])
            ->whereDate('mulai', $absen['mulai'])
            ->whereIn('kode_status', [1, 2])
            ->get();
        // dd($cek->isEmpty());
        if ($cek->isEmpty()) {
            $new = JadwalKerja::firstOrCreate([
                'id_karyawan' => $id_kar,
                'kode_ket' => 11,
                'macam_hadir' => $jaker_id,
                'mulai' => $absen['mulai'],
            ], [
                'selesai' => $absen['selesai'],
                'bukti' => 'Pengajuan Overshift dari ID Lembur #' . $jaker_id,
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

            return response()->json($new->load('status'));
        } else {
            return response()->json(['message' => 'Overshift sudah diajukan sebelumnya'], 400);
        }
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

            $laporan = LaporanLembur::findOrFail(Crypt::decrypt($req->id));
            $laporan->update([
                $req->key => $req[$req->key],
            ]);

            return response()->json(
                $this->getData($req->key, $req[$req->key], 'laporan', $laporan->jaker_id)
            );
        } catch (\Throwable $th) {
            throw $th;
        }
        // return back()->with('success', 'Laporan Lembur telah diupdate');
    }





    public function Laporan_Lembur($id_kar)
    {
        if (in_array(auth()->user()->kode_role, [1, 2, 5])) {
            $id_kar = Karyawan::all()->pluck('id');
        } else {
            $id_kar = [Crypt::decrypt($id_kar)];
        }

        $perPage = 10;
        $page = 1;
        // dd($bawahan, auth()->user()->kode_role);
        return view('JadwalKerja.LaporanLembur', [
            'title' => 'Jadwal Kerja',
            'subtitle' => 'Laporan Lembur',
            'laporans' => LaporanLembur::whereIn('id_karyawan', $id_kar)
                ->with([
                    'org' => with([
                        'dokumen',
                        'pegawai' => with(['struktur', 'fungsi']),
                    ]),
                ])
                ->orderBy('jaker_id', 'desc')
                ->paginate($perPage),
            // ->get(),
        ]);
    }

    public function laporanPDF(Request $req)
    {
        $req->validate([
            'jenis' => 'required',
            'status' => 'required',
            'tanggal_awal' => 'required',
            'tanggal_akhir' => 'required',
        ]);
        $jenis = $req->jenis != 0 ? [$req->jenis] : MacamKehadiran::all()->pluck('id');
        $status = $req->status != 0 ? [$req->status] : Status::all()->pluck('id');

        $start_date = new DateTime($req->tanggal_awal);
        $end_date = new DateTime($req->tanggal_akhir);
        $interval = new DateInterval('P1D');

        $data = JadwalKerja::whereIn('kode_ket', $jenis)
            ->whereIn('kode_status', $status)
            ->where('mulai', '>=', $req->tanggal_awal)
            ->where('selesai', '<=', $end_date->modify('+1 day'))
            ->with([
                'org' => with([
                    'dokumen',
                    'pegawai' => with([
                        'struktur',
                        'fungsi',
                        'kontrak',
                    ]),
                    'absens',
                ]),
                'stat',
                'absen',
                'pegawai',
                'laporan',
                'jenis_absen',
                'overshift_id',
                // 'overtime'
            ])
            ->get();

        // dd($data);

        // view()->share('jenis', $jenis != null && $req->jenis != 0 ? Kehadiran::find($req->jenis)->title : 'Semua Pengajuan');
        // view()->share('kode_jenis', $req->jenis);
        // view()->share('mulai', $req->tanggal_awal);
        // view()->share('selesai', $req->tanggal_akhir);
        // view()->share('data', $data);
        // $pdf = PDF::loadView('JadwalKerja.PDF.Laporan')->setPaper('a4', 'landscape');
        // return $pdf->stream();

        return view('General.index', [
            'title' => 'Rekapitulasi',
            'subtitle' => 'Laporan',
            'comp' => 2,
            'jenis' => 'Rekapitulasi Presensi',
            'mulai' => $req->tanggal_awal,
            'selesai' => $req->tanggal_akhir,
            'kode_jenis' => $req->jenis,
            'judul_laporan' => $req->jenis != 0 ? Kehadiran::find($req->jenis)->title : 'Semua',
            // 'req' => $req,
            'data' => $data,
            'preview' => true,
            'date_range' =>  new DatePeriod($start_date, $interval, $end_date->modify('+1 day'))
        ]);

        // return view('JadwalKerja.PDF.Laporan', [
        //     // return Inertia::render('PDF.Laporan', [
        //     // return view('General.Presensi.PDF.Rekapitulasi', [
        //     'jenis' => 'Rekapitulasi Presensi',
        //     'mulai' => $req->tanggal_awal,
        //     'selesai' => $req->tanggal_akhir,
        //     'kode_jenis' => $req->jenis,
        //     'data' => $data,
        //     'preview' => true,
        //     'date_range' =>  new DatePeriod($start_date, $interval, $end_date->modify('+1 day'))
        // ]);
    }


    public function editlaporanlembur(Request $request, $id_kar, $id)
    {
        $id_kar = Crypt::decrypt($id_kar);
        $id = Crypt::decrypt($id);
        $data = LaporanLembur::find($id);
        $data->update([
            'waktu_awal' => $request->waktu_awal,
            'waktu_akhir' => $request->waktu_akhir,
        ]);
        return back()->with('success', 'Laporan Lembur telah diupdate');
    }

    public function RekapLembur()
    {
        // COMP - Component:
        // 1. livewire
        // 2. JSX
        return view('General.index', [
            'title' => 'Rekapitulasi',
            'subtitle' => 'Lembur',
            'comp' => 2,
            // 'data' => Karyawan::join('kepegawaians', 'karyawans.id', '=', 'kepegawaians.id_karyawan')
            //     ->with(['lemburSelesai'])
            //     ->orderBy('kepegawaians.kode_struktural')
            //     ->orderBy('nama')
            //     ->get()
        ]);
    }


    public function getLaporanLemburReact()
    {

        if (in_array(auth()->user()->kode_role, [1, 2, 4, 5])) {

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
            return [
                'kehadiran' => Kehadiran::all(),
                'statuses' => Status::whereIn('id', [1, 2, 3, 4, 8, 9, 10, 11, 12])->get(),
                'laporans' => LaporanLembur::whereIn('id_karyawan', $bawahan)
                    ->with([
                        'jadwal',
                        'org' => with([
                            'dokumen',
                            'pegawai' => with(['struktur', 'fungsi']),
                        ]),
                    ])
                    ->orderBy('jaker_id', 'desc')
                    ->get(),
                'karyawans' => Karyawan::all(),
                'auth' => ['user' => auth()->user()],
            ];
        } else {
            return response()->json(['message' => 'Anda tidak berhak mengakses laman ini']);
            # code...
        }
    }

    public function LaporanLemburReact()
    {
        if (in_array(auth()->user()->kode_role, [1, 2, 4, 5])) {

            return view('General.index', [
                'title' => 'Rekapitulasi',
                'subtitle' => 'Laporan Lembur',
                'comp' => 2,
            ]);
        } else {
            return response()->json(['message' => 'Anda tidak berhak mengakses laman ini']);
            # code...
        }

        // ->sortByDesc('created_at'),
        // 'subtitle' => $this->subtitle,
    }
}
