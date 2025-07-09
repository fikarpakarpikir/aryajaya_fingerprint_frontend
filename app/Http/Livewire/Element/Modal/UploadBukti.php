<?php

namespace App\Http\Livewire\Element\Modal;

use Livewire\Component;

class UploadBukti extends Component
{
    public $id_modal, $title, $id_jaker, $subtitle;
    public function render()
    {
        return view('livewire.element.modal.upload-bukti');
    }
}
