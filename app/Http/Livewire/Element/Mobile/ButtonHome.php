<?php

namespace App\Http\Livewire\Element\Mobile;

use Livewire\Component;

class ButtonHome extends Component
{
    public $route, $icon, $text;
    public function render()
    {
        return view('livewire.element.mobile.button-home');
    }
}
