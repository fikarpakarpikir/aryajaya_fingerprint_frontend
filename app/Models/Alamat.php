<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Alamat extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $with = ['kota', 'provinsi'];
    protected $appends = ['encId'];

    public function getEncIdAttribute()
    {
        return Crypt::encrypt($this->id);
    }

    public function org()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan', 'id');
    }
    public function kota()
    {
        return $this->belongsTo(City::class, 'city_id', 'city_id');
    }
    public function provinsi()
    {
        return $this->belongsTo(Province::class, 'province_id', 'province_id');
    }
}
