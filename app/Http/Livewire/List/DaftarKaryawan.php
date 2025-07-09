<?php

namespace App\Http\Livewire\List;

use App\Models\Divisi;
use App\Models\Karyawan;
use Carbon\Carbon;
use Livewire\Component;

class DaftarKaryawan extends Component
{
    public $search, $title, $tanggal_awal, $tanggal_akhir;

    public $queryString = [
        'search' => ['except' => ''],
        'tanggal_awal' => ['except' => ''],
        'tanggal_akhir' => ['except' => ''],
    ];
    public function render()
    {
        if ($this->title != 'Rekapitulasi') {
            return view('livewire.list.daftar-karyawan', [
                'title' => $this->title,
                'list_karyawan' => Karyawan::where('nama', 'like', '%' . $this->search . '%')

                    ->whereNotIn('id', [1])
                    ->with([
                        'akun',
                        'pegawai',
                        'dokumen',
                        'pegawai' => with([
                            'struktur',
                            'fungsi',
                            'kontrak' => with(['divisi']),
                        ]),
                        // 'kerja',
                    ])
                    ->get()
                    ->sortBy('nama'),
                'divisis' => Divisi::all(),
            ]);
        } else {

            // dd($this->tanggal_awal, now(), $this->tanggal_akhir);
            return view('livewire.list.daftar-karyawan', [
                'title' => $this->title,
                'list_karyawan' => Karyawan::where('nama', 'like', '%' . $this->search . '%')

                    ->whereNotIn('id', [1])
                    ->with([
                        'akun',
                        'pegawai',
                        'dokumen',
                        // 'rekaps',
                        'pegawai' => with([
                            'struktur',
                            'fungsi',
                            'kontrak' => with(['divisi']),
                        ]),
                    ])
                    ->get()
                    ->sortBy('nama'),
                'divisis' => Divisi::all(),
                'tanggal_awal' => $this->tanggal_awal,
                'tanggal_akhir' => $this->tanggal_akhir,
            ]);
        }
    }
}
