<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Crypt;

class RPiService
{
    protected $apiAlat;

    public function __construct()
    {
        $this->apiAlat = config('app.api.server') . '/Alat';
    }

    public function getSerial()
    {
        return trim(shell_exec("cat /proc/cpuinfo | grep Serial | cut -d ' ' -f 2"));
    }

    public function fetch($serial)
    {
        $response = Http::withHeaders([
            'Accept' => 'application/json'
        ])->post("{$this->apiAlat}/info", [
            'serial_number' => $serial
        ]);

        if ($response->status() === 404) {
            return ['status' => 404, 'message' => 'Alat belum terdaftar'];
        }

        if ($response->failed()) {
            return ['error' => $response['error'] ?? 'Unknown error'];
        }

        File::put(public_path('device.json'), $response->body());

        return json_decode($response->body(), true);
    }

    public function register($serial, $title)
    {
        $response = Http::post("{$this->apiAlat}/regist", [
            'title'         => $title,
            'serial_number' => $serial,
            'kode_akses'    => Crypt::encrypt(env('APP_KEY')),
            'ip_alat'       => request()->ip(),
        ]);

        if ($response->failed()) {
            return ['error' => $response['error'] ?? 'Gagal register'];
        }

        File::put(public_path('device.json'), $response->body());

        return json_decode($response->body(), true);
    }
}
