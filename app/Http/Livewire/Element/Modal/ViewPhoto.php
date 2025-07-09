<?php

namespace App\Http\Livewire\Element\Modal;

use Livewire\Component;

class ViewPhoto extends Component
{
    public $item, $id_modal, $title;
    public function render()
    {
        return view('livewire.element.modal.view-photo');
    }
}
