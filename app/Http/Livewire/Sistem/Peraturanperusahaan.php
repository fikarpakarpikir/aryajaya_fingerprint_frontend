<?php

namespace App\Http\Livewire\Sistem;

use App\Models\PeraturanPerusahaan as ModelsPeraturanPerusahaan;
use Livewire\Component;
use Livewire\WithPagination;

class Peraturanperusahaan extends Component
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
        // dd(ModelsPeraturanPerusahaan::get());
        return view('livewire.sistem.peraturanperusahaan', [
            'peraturans' => ModelsPeraturanPerusahaan::orderBy('title', 'asc')
                ->paginate($this->perPage, ['*'], 'page', $this->page),
        ]);
    }
}
