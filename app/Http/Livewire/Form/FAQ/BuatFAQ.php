<?php

namespace App\Http\Livewire\Form\FAQ;

use App\Http\Livewire\Trix;
use Livewire\Component;

class BuatFAQ extends Component
{
    public $value, $name, $id_pertanyaan;

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
        return view('livewire.form.f-a-q.buat-f-a-q');
    }
}
