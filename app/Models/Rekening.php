<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rekening extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $with = ['bank'];

    public function bank()
    {
        return $this->belongsTo(Bank::class, 'id_bank', 'id');
    }
}
