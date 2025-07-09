<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisData extends Model
{
    protected $filled = ['bagian_data_id', 'title'];
    protected $with = ['bagian'];

    public function bagian()
    {
        return $this->belongsTo(BagianData::class, 'bagian_data_id');
    }
}
