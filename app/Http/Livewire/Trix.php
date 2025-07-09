<?php

namespace App\Http\Livewire;

use Illuminate\Support\Facades\Storage;
use Livewire\Component;
use Livewire\WithFileUploads;

class Trix extends Component
{
    use WithFileUploads;

    const EVENT_VALUE_UPDATED = 'trix_value_updated';

    public $value;
    public $name;
    public $trixId;
    public $photos = [];

    public function mount($value = '', $name)
    {
        $this->value = $value;
        $this->name = $name;
        $this->trixId = 'trix-' . uniqid();
        // $this->trixId = $value;
    }

    public function updatedValue($value)
    {
        $this->emit(self::EVENT_VALUE_UPDATED, $this->value);
    }

    public function completedUpload(string $uploadedUrl, string $trixUploadCompletedEvent)
    {
        foreach ($this->photos as $photo) {
            if ($photo->getFilename() == $uploadedUrl) {
                $newFilename = uniqid('soal_') . '.' . $photo->getClientOriginalExtension();
                // $photo->move(public_path('assets\soal'), $newFilename);
                $photo->storeAs(
                    'soal',
                    $newFilename,
                    ["disk" => "uploads_public"]
                );
                // $url = Storage::url(public_path('assets/soal/' . $newFilename));
                $url = asset('assets/soal/' . $newFilename);
                // $url = Storage::url($newFilename);
                // $url = $newFilename;

                $this->dispatchBrowserEvent($trixUploadCompletedEvent, [
                    'url' => $url,
                    'href' => $url,
                ]);
            }
        }
    }

    public function render()
    {
        return view('livewire.trix');
    }
}
