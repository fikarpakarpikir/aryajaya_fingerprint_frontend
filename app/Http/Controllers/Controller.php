<?php

namespace App\Http\Controllers;

use App\Models\Agama;
use App\Models\Divisi;
use App\Models\Dokumen;
use App\Models\JadwalKerja;
use App\Models\Kehadiran;
use App\Models\MacamKehadiran;
use App\Models\Sinkronisasi;
use App\Models\Sistem\Alat;
use App\Models\Status;
use GuzzleHttp\Client;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// use Illuminate\Support\Facades\Request;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
    public $apiServer, $ipAlat;

    public function __construct()
    {
        $this->apiServer = env('VITE_API_SERVER');
        $ipAddress = env('APP_URL');
        // $ipAddress = request()->ip();
        $port = request()->getPort();
        $fullAddress = $ipAddress . ':' . $port;
        $this->apiAlat = Alat::where('ip_device', $fullAddress)
                        ->pluck('ip_alat')->first();
    }

    public function home()
    {

        $getSync = function (int $jenis) {
            return Sinkronisasi::where('jenis_data', $jenis)
                ->latest('finished_at')
                ->first();
        };
        try {
            return Inertia::render(
                'Presensi/index',
                [
                    'ip_alat' => $this->apiAlat,
                    'jenis_kehadiran' => Kehadiran::all(),
                    'last_sync' => [
                        'fp' => $getSync(1),
                        'face' => $getSync(2),
                    ],
                ]
            );
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public static function getGifFingerprint($filename)
    {
        $path = public_path('/assets/GIF/Fingerprint/' . $filename);
        // return $path;
        if (!file_exists($path)) {
            return response()->json(['error' => 'File not found.'], 404);
        }
        return response()->file($path);
    }


    public static function getData($key, $dataId, $parent = null, $idArray = null)
    {
        $mappings = [
            'kode_agama' => [Agama::class, 'agama', null, null],
            'kode_nikah' => [Nikah::class, 'nikah', null, null],
            'kode_status_kerja' => [StatusKaryawan::class, 'kerja', null, null],
            'kode_golongan' => [Golongan::class, 'golongan', null, null],
            'kode_struktural' => [JabatanStruktural::class, 'struktur', null, null],
            'fungsional' => [Fungsional::class, 'bagian', null, null],
            'kode_fungsional' => [JabatanFungsional::class, 'fungsi', null, null],
            'kode_divisi' => [Divisi::class, 'divisi', 'div', null],
            'dokumen' => [Dokumen::class, null, null, null],
            'pendidikan' => [Pendidikan::class, 'tingkat', null, null],
            'jaker' => [JadwalKerja::class, null, null, null],
            'kode_status' => [Status::class, 'status', null, $idArray ?? null],
        ] + array_map(fn($k) => [null, $k, null, null], ['masuk', 'nama_institut', 'prodi', 'nilai', 'pertanyaan'])
            + array_map(fn($k) => [null, $k, null, $idArray], ['nama_instansi', 'sebagai', 'selesai_kerja']);

        [$model, $mappedKey, $child, $defaultIdArray] = $mappings[$key] ?? [null, $key, null, null];

        return array_filter([
            'parent' => $parent,
            'key' => $mappedKey,
            'child' => $child,
            'data' => $model ? $model::find($dataId) : $dataId,
            'id' => $idArray ?? $defaultIdArray, // Keep passed $idArray if not null
        ]);
    }
    public static function storeDoc($file, $folder)
    {
        $filename = uniqid($folder . "_") . '.' . $file->getClientOriginalExtension();
        $file->move(public_path("assets/{$folder}/"), $filename);
        return $filename;
    }
}
