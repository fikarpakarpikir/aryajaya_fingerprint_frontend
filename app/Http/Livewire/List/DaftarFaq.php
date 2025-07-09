<?php

namespace App\Http\Livewire\List;

use App\Models\FAQ;
use Livewire\Component;

class DaftarFaq extends Component
{
    public $cari_title;

    protected $queryString = [
        'cari_title' => ['except' => '']
    ];
    public function render()
    {
        return view('livewire.list.daftar-faq', [
            'faqs' => FAQ::where('title', 'like', '%' . $this->cari_title . '%')
                ->get(),
            'role' => auth()->user()->kode_role,
        ]);
    }
}
