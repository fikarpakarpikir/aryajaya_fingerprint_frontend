<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dokumen extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $with = ['jenis'];

    public function jenis()
    {
        return $this->belongsTo(JenisData::class, 'jenis_data_id');
    }
}
