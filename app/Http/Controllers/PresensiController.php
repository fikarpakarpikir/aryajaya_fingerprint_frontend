<?php

namespace App\Http\Controllers;

use App\Models\JadwalKerja;
use App\Models\Karyawan;
use App\Models\Presensi;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use DateInterval;
use DatePeriod;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;

class PresensiController extends Controller
{
    public function index()
    {
        $subtitle = 'Presensi';
        $karyawans = Karyawan::whereNotIn('id', [1])
            ->where('status_aktif', 1)
            ->setEagerLoads([])
            // ->whereIn('id', [4, 51])
            ->with([
                'pegawai' => with([
                    'divisi',
                    'struktur',
                    'fungsi',
                    'kontrak' => with(['divisi']),
                ]),
                //     // 'kerja',
            ])
            ->orderBy('nama')
            ->get();
        // $start_date =  Carbon::parse('11 January 2024');
        // $end_date = Carbon::parse('11 January 2025');

        // $now = Carbon::parse('15 January 2024');
        // $now = Carbon::parse('16 April 2025');
        $now = Carbon::now();

        // Ambil tanggal 21 bulan lalu
        $tanggal21BulanLalu = $now->day >= 21 ? $now->copy()->day(21) : $now->copy()->subMonth()->day(21);

        // Ambil tanggal 20 bulan ini
        $tanggal20BulanIni = $now->day >= 21 ? $now->copy()->addMonth()->day(19) : $now->copy()->day(19);


        // $tanggal21BulanLalu = $now->day >= 21 ? $now->copy()->day(21) : $now->copy()->subMonth()->day(30);
        // $tanggal20BulanIni = $now->day >= 21 ? $now->copy()->addMonth()->day(19) : $now->copy()->day(1);

        $start_date =  $tanggal21BulanLalu ?? $now;
        $end_date = $tanggal20BulanIni ?? $now;
        $interval = new DateInterval('P1D');
        $date_range = new DatePeriod(
            $start_date,
            $interval,
            (clone $end_date)->modify('+1 day')
        );
        $range = [
            'dates' => collect($date_range)->map(fn($d) => $d->format('Y-m-d')),
            'start' => $start_date->toIso8601String(),
            'end' => $end_date->toIso8601String(),
            'interval' => [
                'y' => $interval->y,
                'm' => $interval->m,
                'd' => $interval->d,
                'h' => $interval->h,
                'i' => $interval->i,
                's' => $interval->s,
                'f' => $interval->f,
                'invert' => $interval->invert,
                'days' => $interval->days,
            ],
            'include_start_date' => true,
            'include_end_date' => true, // <-- kamu set ini secara manual
        ];
        // dd($ajuan);
        // view()->share('mulai', Controller::tanggal_indo($req->tanggal_awal));
        // view()->share('selesai', Controller::tanggal_indo($req->tanggal_akhir));

        // view()->share('jenis', 'Rekapitulasi Presensi');
        // view()->share('mulai', $req->tanggal_awal);
        // view()->share('selesai', $req->tanggal_akhir);
        // view()->share('data', $ajuan);
        // view()->share('date_range', new DatePeriod($start_date, $interval, $end_date->modify('+1 day')));
        // $pdf = Pdf::loadView('General.Presensi.PDF.Rekapitulasi')->setPaper('a4', 'potrait');
        // return $pdf->stream();


        // return view('General.Presensi.PDF.Rekapitulasi', [
        //     'jenis' => 'Rekapitulasi Presensi',
        //     'mulai' => $start_date,
        //     'selesai' => $end_date,
        //     'preview' => true,
        //     'data' => $ajuan,
        //     'date_range' =>  new DatePeriod($start_date, $interval, $end_date->modify('+1 day'))
        // ]);
        $bawahan = JadwalKerjaController::listIdBawahan() ?? [];
        // $jaker = JadwalKerja::where('kode_ket', 1)
        //     ->whereIn('macam_hadir', [28, 29])
        //     ->whereIn('kode_status', [3, 10])
        //     ->whereIn('id_karyawan', $bawahan)
        //     ->get();
        // $presensi  = Presensi::with([
        //     'find_jaker' => fn($query) => $query->without('org'),
        // ])
        //     ->whereDate('mulai', '>=', $tanggal21BulanLalu)
        //     ->whereDate('mulai', '<=', $tanggal20BulanIni)
        //     ->setEagerLoads([]) // Matikan eager loading default dari Presensi

        //     ->get();
        // dd($jaker, $presensi, memory_get_usage(true)); // lihat usage saat proses berjalan

        return Inertia::render('Rekapitulasi/Presensi/index', [
            'title' => 'Rekapitulasi',
            'subtitle' => $subtitle,
            'kode_archive' => [null, 0, 1],
            'rekaps' => Presensi::with([
                'jaker' => fn($query) => $query->without('org'),
            ])
                ->whereDate('mulai', '>=', $tanggal21BulanLalu)
                ->whereDate('mulai', '<=', $tanggal20BulanIni)
                ->setEagerLoads([]) // Matikan eager loading default dari Presensi
                ->without('jaker')

                ->get(),
            'mulai' => $start_date,
            'selesai' => $end_date,
            'preview' => true,
            'karyawans' => $karyawans,
            'jenis' => 'Rekapitulasi Presensi',
            'date_range' =>  new DatePeriod(
                $start_date,
                $interval,
                (clone $end_date)->modify('+1 day')
            ),
            'jadwal' => JadwalKerja::where('kode_ket', 1)
                ->whereIn('macam_hadir', [28, 29])
                ->whereIn('kode_status', [3, 10])
                ->whereIn('id_karyawan', $bawahan)
                ->get(),
        ]);
    }

    public function search(Request $req)
    {
        $req->validate([
            'id' => 'nullable|numeric',
            'mulai' => 'nullable|date',
            'selesai' => 'nullable|date',
        ]);


        $query = Presensi::query();
        if ($req->id) {
            $query->where('id', $req->id);
        }
        if ($req->mulai) {
            $query->where('mulai', '>=', $req->mulai);
        } else {
            $query->where('mulai', '>=', now()->subMonths(3));
        }

        if ($req->selesai) {
            $query->where('selesai', '<=', $req->selesai);
        }

        return $query
            ->with([
                'org' => fn($query) => $query->select(['id', 'nama', 'no_hp'])->setEagerLoads([]),
            ])
            ->get();
    }

    public static function presensiStore(Request $req)
    {
        try {
            $valid = $req->validate([
                'jenis' => 'required',
                'long' => 'required',
                'lat' => 'required',
                'id_karyawan' => 'required',
                'id_jaker' => 'required',
            ]);

            $jenis = $valid['jenis'];
            $id_karyawan = $valid['id_karyawan'];
            $id_jaker = $valid['id_jaker'];
            $lat = $valid['lat'];
            $long = $valid['long'];

            switch ($jenis) {
                case 0:
                    $waktu = 'mulai';
                    $col_long = 'lokasi_longitude_mulai';
                    $col_lat = 'lokasi_latitude_mulai';
                    break;
                case 1:
                    $waktu = 'selesai';
                    $col_long = 'lokasi_longitude_selesai';
                    $col_lat = 'lokasi_latitude_selesai';
                    break;

                default:
                    return response()->json(['error' => 'Jenis presensi tidak valid'], 422);
            }

            // $check = Presensi::where([
            //     'id_karyawan' => $id_karyawan,
            //     'id_jaker' => $id_jaker,
            // ])->whereDate('mulai', now())->first();
            // return response()->json($jenis, $check);
            // if ($jenis == 1 && $check) {
            //     $waktuMulai = $check->mulai;

            //     if ($waktuMulai) {
            //         $selisihMenit = now()->diffInMinutes($waktuMulai, false); // gunakan selisih dengan tanda
            //         if ($selisihMenit >= 0 && $selisihMenit < 10) {
            //             return response()->json([
            //                 'error' => 'Anda baru saja presensi masuk. Jika akan presensi pulang, silakan tunggu minimal 10 menit.'
            //             ], 422);
            //         }
            //     }
            // }

            if ($jenis == 1) {

                $newData = Presensi::where(
                    [
                        'id' => $req->id,
                    ]
                )->update(
                    [
                        $waktu => now(),
                        $col_long => $long,
                        $col_lat => $lat,
                    ]
                );
            } else if ($jenis == 0) {
                // return response(['check'=> 'kosong']);
                $newData = Presensi::create(
                    [
                        'id_karyawan' => $id_karyawan,
                        'id_jaker' => $id_jaker,
                        $waktu => now(),
                        $col_long => $long,
                        $col_lat => $lat,
                    ]
                );
            }

            return response()->json([$newData]);
        } catch (\Throwable $th) {
            throw $th;
        }
        // return $code;
    }

    public function RekapitulasiPerKaryawan()
    {
        return view('HC.Karyawan.ListKaryawan', [
            'title' => 'Rekapitulasi',
            'subtitle' => 'index',
        ]);
    }

    public function riwayat($id_kar)
    {
        $id_kar = Crypt::decrypt($id_kar);
        return view('General.Presensi.Riwayat', [
            'title' => 'Riwayat Presensi',
            'subtitle' => 'index',
            'riwayats' => Presensi::where('id_karyawan', $id_kar)
                ->get()
        ]);
    }

    public function presensi_pdf(Request $req)
    {
        $req->validate([
            'tanggal_awal' => 'required',
            'tanggal_akhir' => 'required',
        ]);

        // $ajuan = Presensi::whereNotIn('id_karyawan', [1])
        //     ->whereDate('mulai', '>=', $req->tanggal_awal)

        //     ->whereDate('selesai', '<=', $req->tanggal_akhir)
        //     ->get()
        //     ->groupBy('id_karyawan');
        // dd(Karyawan::all()->pluck('id'));
        // dd($req->id_karyawan ? true : false);
        $ajuan = Karyawan::whereIn('id', $req->id_karyawan ? $req->id_karyawan : Karyawan::all()->pluck('id'))
            ->whereNotIn('id', [1])
            // ->whereIn('id', [4, 51])
            ->with([
                'akun',
                'dokumen',
                'pegawai' => with([
                    'struktur',
                    'fungsi',
                    'kontrak' => with(['divisi']),
                ]),
                // 'kerja',
            ])
            ->orderBy('nama')
            ->get();
        $start_date = new DateTime($req->tanggal_awal);
        $end_date = new DateTime($req->tanggal_akhir);
        $interval = new DateInterval('P1D');

        // dd($ajuan);
        // view()->share('mulai', Controller::tanggal_indo($req->tanggal_awal));
        // view()->share('selesai', Controller::tanggal_indo($req->tanggal_akhir));

        // view()->share('jenis', 'Rekapitulasi Presensi');
        // view()->share('mulai', $req->tanggal_awal);
        // view()->share('selesai', $req->tanggal_akhir);
        // view()->share('data', $ajuan);
        // view()->share('date_range', new DatePeriod($start_date, $interval, $end_date->modify('+1 day')));
        // $pdf = Pdf::loadView('General.Presensi.PDF.Rekapitulasi')->setPaper('a4', 'potrait');
        // return $pdf->stream();


        return view('General.Presensi.PDF.Rekapitulasi', [
            'jenis' => 'Rekapitulasi Presensi',
            'mulai' => $req->tanggal_awal,
            'selesai' => $req->tanggal_akhir,
            'preview' => true,
            'data' => $ajuan,
            'date_range' =>  new DatePeriod($start_date, $interval, $end_date->modify('+1 day'))
        ]);
    }

    public function syncJadwalKerja(Request $req)
    {
        JadwalKerja::updateOrCreate(
            [
                'id' => $req->id,
                'id_karyawan' => $req->id_karyawan,
            ],
            [
                'kode_ket' => $req->kode_ket,
                'macam_hadir' => $req->macam_hadir,
                'bukti' => $req->bukti,
                'mulai' => $req->mulai,
                'selesai' => $req->selesai,
                'kode_status' => $req->kode_status,
                'created_at' => $req->created_at,
                'updated_at' => $req->updated_at,

            ]
        );
    }
}
