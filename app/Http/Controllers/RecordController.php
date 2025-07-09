<?php

namespace App\Http\Controllers;

use App\Models\Record;
use Illuminate\Http\Request;

class RecordController extends Controller
{
    public static function RecordAct($id, $kode_act)
    {
        $record = [
            'id_karyawan' => $id,
            'kode_act' => $kode_act,
            'device_karyawan' => gethostbyaddr($_SERVER["REMOTE_ADDR"]),
            'ip_karyawan' => gethostbyname($_SERVER["REMOTE_ADDR"]),
            'browser_karyawan' => $_SERVER["HTTP_USER_AGENT"]
        ];

        // dd($user);
        Record::create($record);
    }
}
