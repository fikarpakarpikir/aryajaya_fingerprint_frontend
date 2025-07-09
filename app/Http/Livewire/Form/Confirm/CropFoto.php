<?php

namespace App\Http\Livewire\Form\Confirm;

use Livewire\Component;

class CropFoto extends Component
{
    public $id_modal, $pertanyaan;
    public function render()
    {
        return view('livewire.form.confirm.crop-foto');
    }
}
