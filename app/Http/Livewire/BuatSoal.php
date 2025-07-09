<?php

namespace App\Http\Livewire;

use App\Models\LMS\BankSoal;
use Livewire\Component;

class BuatSoal extends Component
{
    public $value;
    public $name;


    public $listeners = [
        Trix::EVENT_VALUE_UPDATED
    ];

    public function trix_value_updated($value)
    {
        $this->value = $value;
        // $this->name = $name;
    }

    public function render()
    {
        return view('livewire.buat-soal');
    }
}
