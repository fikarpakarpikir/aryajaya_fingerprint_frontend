<?php

namespace App\Http\Livewire\Sistem;

use App\Models\Karyawan;
use Livewire\Component;

class Birokrasi extends Component
{
    public $divisis, $search;

    public $queryString = [
        'search' => ['except' => '']
    ];

    public function render()
    {
        return view('livewire.sistem.birokrasi', [
            'karyawans' => Karyawan::where('nama', 'like', '%' . $this->search . '%')
                ->with([
                    'akun',
                    'pegawai',
                    'dokumen',
                    'pegawai' => with(['struktur', 'fungsi'])
                ])
                ->get()
                ->sortBy('nama'),
            'divisis' => $this->divisis,
        ]);
    }
}
