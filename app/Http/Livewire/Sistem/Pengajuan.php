<?php

namespace App\Http\Livewire\Sistem;

use App\Models\JadwalKerja;
use App\Models\Kehadiran;
use App\Models\MacamKehadiran;
use App\Models\Status;
use Livewire\Component;
use Livewire\WithPagination;

class Pengajuan extends Component
{
    use WithPagination;
    protected $paginationTheme = 'bootstrap';
    public $jenis, $status, $tanggal_awal, $tanggal_akhir;
    protected $queryString = [
        'jenis' => ['except' => ''],
        'status' => ['except' => ''],
        'tanggal_awal' => ['except' => ''],
        'tanggal_akhir' => ['except' => ''],
    ];

    public $perPage = 50;
    public $page = 1;
    public function render()
    {
        return view('livewire.sistem.pengajuan', [
            'kehadiran' => Kehadiran::all(),
            'jenis_kehadiran' => MacamKehadiran::all(),
            'statuses' => Status::whereIn('id', [1, 2, 3, 4, 10, 11, 12])->get(),
            'pengajuans' => JadwalKerja::when($this->jenis, function ($builder) {
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
                // ->get()
                ->orderBy('created_at', 'desc')
                    // ->sortByDesc('created_at')
                // ->sortBy('created_at')
                ->paginate($this->perPage, ['*'], 'page', $this->page),
        ]);
    }
}
