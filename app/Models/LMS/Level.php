<?php

namespace App\Models\LMS;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Level extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $appends = ['encId'];

    public function getEncIdAttribute()
    {
        return Crypt::encrypt($this->id);
    }

    public function lms()
    {
        return $this->belongsTo(LMS::class, 'lms_id', 'id');
    }

    public function skills()
    {
        return $this->hasMany(Skill::class, 'level_id', 'id');
    }
}
