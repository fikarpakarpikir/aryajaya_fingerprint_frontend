<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JabatanDivisi extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $with = ['div'];

    public function div()
    {
        return $this->belongsTo(Divisi::class, 'kode_divisi', 'id');
    }
}
