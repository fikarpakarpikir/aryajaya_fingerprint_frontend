<?php

namespace App\Http\Livewire\Element\Button;

use Livewire\Component;

class ButtonModal extends Component
{
    public $target, $text, $color;
    public function render()
    {
        return view('livewire.element.button.button-modal');
    }
}
