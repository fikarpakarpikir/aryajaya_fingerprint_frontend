<?php

namespace App\Http\Livewire\Element\Modal;

use Livewire\Component;

class Notif extends Component
{
    public $id_modal, $title, $text;
    public function render()
    {
        return view('livewire.element.modal.notif');
    }
}
