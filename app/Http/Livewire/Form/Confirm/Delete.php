<?php

namespace App\Http\Livewire\Form\Confirm;

use Livewire\Component;

class Delete extends Component
{
    public $id_modal, $pertanyaan, $route, $text;
    public function render()
    {
        return view('livewire.form.confirm.delete');
    }
}
