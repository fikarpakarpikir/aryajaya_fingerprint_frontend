<?php

namespace App\Notifications;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\Notifiable;

class Notification extends DatabaseNotification
{
    use Notifiable;

    // public function org()
    // {
    //     return $this->belongsTo(Karyawan::class, 'data');
    // }
}
