<?php

namespace App\Models\LMS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class LMS extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $appends = ['encId'];

    public function getEncIdAttribute()
    {
        return Crypt::encrypt($this->id);
    }

    public function levels()
    {
        return $this->hasMany(Level::class, 'lms_id', 'id');
    }
}
