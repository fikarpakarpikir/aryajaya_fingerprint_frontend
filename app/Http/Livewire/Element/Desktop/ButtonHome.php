<?php

namespace App\Http\Livewire\Element\Desktop;

use Livewire\Component;

class ButtonHome extends Component
{
    public $route, $icon, $text;
    public function render()
    {
        return view('livewire.element.desktop.button-home2');
    }
}
