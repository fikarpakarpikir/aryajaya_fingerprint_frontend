<?php

namespace App\Http\Livewire\List;

use App\Models\JabatanDivisi;
use App\Models\JadwalKerja;
use App\Models\Karyawan;
use App\Models\Kehadiran;
use App\Models\Kepegawaian;
use App\Models\PKWT;
use App\Models\Presensi;
use App\Models\Sistem\Birokrasi;
use App\Models\Status;
use App\Models\User;
use Livewire\Component;
use Livewire\WithPagination;

class DaftarJadwalKerja extends Component
{
    use WithPagination;
    protected $paginationTheme = 'bootstrap';
    public $jenis, $id_jaker, $status, $tanggal_awal, $tanggal_akhir, $kode_archive, $subtitle;
    public $search;
    protected $queryString = [
        'id_jaker' => ['except' => ''],
        'jenis' => ['except' => ''],
        'status' => ['except' => ''],
        'tanggal_awal' => ['except' => ''],
        'tanggal_akhir' => ['except' => ''],
        'search' => ['except' => ''],
    ];

    public $perPage = 10;
    public $page = 1;
    // public function setPage($page)
    // {
    //     $this->page = $page;
    // }
    public function render()
    {

        if (auth()->user()->kode_role == 1 || auth()->user()->kode_role == 2 || auth()->user()->kode_role == 5) {
            $kode_status = 2;
        } else {
            $kode_status = 1;
        }
        // $ajuan = Presensi::
        // whereNotIn('id_karyawan', [1])
        // ->whereIn('id_karyawan', $this->search == null ? Karyawan::whereNotIn('id', [1])->pluck('id')->toArray() : [$this->search])
        // ->when($this->tanggal_awal, function ($builder) {
        //     $builder->whereDate('mulai', '>=', $this->tanggal_awal);
        // })
        // ->when($this->tanggal_akhir, function ($builder) {
        //     $builder->whereDate('selesai', '<=', $this->tanggal_akhir);
        // })
        // ->first();
    

        // dd($ajuan->id);

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
        if ($this->subtitle == 'Pribadi') {
            $bawahan = [auth()->user()->id_karyawan];
        } else {
            // if (auth()->user()->kode_role == 1 || auth()->user()->kode_role == 2 || auth()->user()->kode_role == 5) {
            //     $bawahan = User::all()->pluck('id_karyawan');
            // } else
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
        }

        // dd(JadwalKerja::whereIn('id_karyawan', $bawahan)
        //     ->get());
        if ($this->subtitle == 'Atur Jadwal Kerja') {
            return view('livewire.list.daftar-jadwal-kerja', [
                'kehadiran' => Kehadiran::all(),
                'statuses' => Status::whereIn('id', [1, 2, 3, 4, 8, 9, 10, 11, 12])->get(),
                'ajuan' => JadwalKerja::where('kode_ket', 1)
                    ->with([
                        'org' => with([
                            'dokumen',
                            'pegawai' => with([
                                'struktur',
                                'fungsi',
                                'kontrak',
                            ])
                        ]),
                        'stat',
                        'absen',
                        'pegawai',
                        'laporan',
                        'jenis_absen',
                        'absen',
                    ])
                    ->orderBy('created_at', 'desc')
                    ->paginate($this->perPage, ['*'], 'page', $this->page),

                'halaman' => JadwalKerja::where('kode_ket', 1)
                    ->orderBy('created_at', 'desc')
                    ->paginate($this->perPage, ['*'], 'page', $this->page),
                'subtitle' => $this->subtitle,
            ]);
        } else if ($this->subtitle != 'Rekapitulasi Presensi') {
            return view('livewire.list.daftar-jadwal-kerja', [
                'kehadiran' => Kehadiran::all(),
                'statuses' => Status::whereIn('id', [1, 2, 3, 4, 8, 9, 10, 11, 12])->get(),
                'ajuan' => JadwalKerja::whereIn('id_karyawan', $bawahan)
                    ->when($this->id_jaker, function ($builder) {
                        $builder->where('id', $this->id_jaker);
                    })
                    ->when($this->jenis, function ($builder) {
                        $builder->where('kode_ket', $this->jenis);
                    })
                    ->when($this->status, function ($builder) {
                        $builder->where('kode_status', $this->status);
                    })
                    ->when($this->tanggal_awal, function ($builder) {
                        $builder->where('mulai', '>=', $this->tanggal_awal);
                    })
                    ->when($this->tanggal_akhir, function ($builder) {
                        $builder->where('selesai', '<=', $this->tanggal_akhir);
                    })
                    ->with([
                        'org' => with([
                            'dokumen',
                            'pegawai' => with([
                                'struktur',
                                'fungsi',
                                'kontrak',
                            ])
                        ]),
                        'stat',
                        'absen',
                        'pegawai',
                        'laporan',
                        'jenis_absen',
                        'absen',
                    ])
                    ->orderBy('created_at', 'desc')
                    ->paginate($this->perPage, ['*'], 'page', $this->page),
                // ->get()
                // ->whereIn('kode_status', [$kode_status, 3, 4, 8, 9, 10, 11])
                // ->whereIn('is_archive', $this->kode_archive)
                // ->sortByDesc('created_at'),
                'halaman' => JadwalKerja::whereIn('id_karyawan', $bawahan)
                    ->when($this->id_jaker, function ($builder) {
                        $builder->where('id', $this->id_jaker);
                    })
                    ->when($this->jenis, function ($builder) {
                        $builder->where('kode_ket', $this->jenis);
                    })
                    ->when($this->status, function ($builder) {
                        $builder->where('kode_status', $this->status);
                    })
                    ->when($this->tanggal_awal, function ($builder) {
                        $builder->where('mulai', '>=', $this->tanggal_awal);
                    })
                    ->when($this->tanggal_akhir, function ($builder) {
                        $builder->where('selesai', '<=', $this->tanggal_akhir);
                    })
                    ->orderBy('created_at', 'desc')
                    ->paginate($this->perPage, ['*'], 'page', $this->page),
                // ->sortByDesc('created_at'),
                'subtitle' => $this->subtitle,
            ]);
        } else {
            return view('livewire.list.daftar-jadwal-kerja', [
                'karyawans' => Karyawan::whereNotIn('id', [1])->get(),
                'kehadiran' => Kehadiran::all(),
                'statuses' => Status::whereIn('id', [1, 2, 3, 4, 10, 11, 12])->get(),
                'ajuan' => Presensi::
                    whereNotIn('id_karyawan', [1])
                    ->whereIn('id_karyawan', $this->search == null ? Karyawan::whereNotIn('id', [1])->pluck('id')->toArray() : [$this->search])
                    ->when($this->tanggal_awal, function ($builder) {
                        $builder->whereDate('mulai', '>=', $this->tanggal_awal);
                    })
                    ->when($this->tanggal_akhir, function ($builder) {
                        $builder->whereDate('selesai', '<=', $this->tanggal_akhir);
                    })
                    ->orderBy('created_at', 'desc')
                    ->paginate($this->perPage, ['*'], 'page', $this->page),
                'halaman' => Presensi::
                    whereNotIn('id_karyawan', [1])
                    ->whereIn('id_karyawan', $this->search == null ? Karyawan::whereNotIn('id', [1])->pluck('id')->toArray() : [$this->search])
                    ->when($this->tanggal_awal, function ($builder) {
                        $builder->whereDate('mulai', '>=', $this->tanggal_awal);
                    })
                    ->when($this->tanggal_akhir, function ($builder) {
                        $builder->whereDate('selesai', '<=', $this->tanggal_akhir);
                    })
                    ->orderBy('created_at', 'desc')
                    ->paginate($this->perPage, ['*'], 'page', $this->page),
                'subtitle' => $this->subtitle,
                'tanggal_awal' => $this->tanggal_awal,
                'tanggal_akhir' => $this->tanggal_akhir,
            ]);
        }
    }
}
