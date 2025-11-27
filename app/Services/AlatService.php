<?php

namespace App\Services;

class AlatService
{
    public static function info()
    {
        return json_decode(file_get_contents(public_path('device.json')));
    }
}
