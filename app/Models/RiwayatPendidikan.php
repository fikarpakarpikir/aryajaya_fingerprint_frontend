<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiwayatPendidikan extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function tingkat()
    {
        return $this->belongsTo(Pendidikan::class, 'pendidikan', 'id');
    }
}
