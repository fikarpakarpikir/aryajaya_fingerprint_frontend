<?php

namespace App\Http\Livewire\Element\Desktop;

use Livewire\Component;

class ListFillProfil extends Component
{
    public $quest, $fill;
    public function render()
    {
        return view('livewire.element.desktop.list-fill-profil');
    }
}
