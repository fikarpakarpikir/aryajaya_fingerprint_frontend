<?php

namespace App\Http\Livewire\Profil\Table;

use Livewire\Component;

class ListColumn extends Component
{
    public $quest, $fill;
    public function render()
    {
        return view('livewire.profil.table.list-column');
    }
}
