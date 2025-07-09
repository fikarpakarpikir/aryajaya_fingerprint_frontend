<?php

namespace App\Http\Livewire\List;

use App\Models\Karyawan;
use Livewire\Component;
use Livewire\WithPagination;

class DaftarLembur extends Component
{
    use WithPagination;
    protected $paginationTheme = 'bootstrap';

    public $tanggal_awal, $tanggal_akhir, $nama;
    public $queryString = [
        'tanggal_awal' => ['except' => ''],
        'tanggal_akhir' => ['except' => ''],
    ];
    public $perPage = 10;
    public $page = 1;

    public function render()
    {
        return view(
            'livewire.list.daftar-lembur',
            [
                'karyawans' => Karyawan::when($this->nama, function ($builder) {
                        $builder->where('nama', $this->nama);
                    })
                    ->join('kepegawaians', 'karyawans.id', '=', 'kepegawaians.id_karyawan')
                    ->orderBy('kepegawaians.kode_struktural')
                    ->orderBy('nama')
                    ->get(),
            ]
        );
    }
}
