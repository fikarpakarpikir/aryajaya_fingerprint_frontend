<?php

namespace App\Http\Controllers;

use App\Models\Agama;
use App\Models\Divisi;
use App\Models\Dokumen;
use App\Models\Fungsional;
use App\Models\Golongan;
use App\Models\JabatanFungsional;
use App\Models\JabatanStruktural;
use App\Models\JadwalKerja;
use App\Models\Kehadiran;
use App\Models\MacamKehadiran;
use App\Models\Nikah;
use App\Models\Nilai;
use App\Models\Pendidikan;
use App\Models\Record;
use App\Models\RiwayatPendidikan;
use App\Models\Sistem\Alat;
use App\Models\Status;
use App\Models\StatusKaryawan;
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

    public function home()
    {
        // dd();
        $ipAddress = '192.168.0.200';
        // $port = '5000';
        // $ipAddress = request()->ip();
        $port = request()->getPort();
        $fullAddress = $ipAddress . ':' . $port;
        // dd(Alat::where('ip_device', $fullAddress)
        //     ->pluck('ip_alat')->first());

        try {
            return Inertia::render(
                'Presensi/FPScanner',
                [
                    'ip_alat' => Alat::where('ip_device', $fullAddress)
                        ->pluck('ip_alat')->first(),
                    'jenis_kehadiran' => Kehadiran::all()
                ]
            );
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public static function waktu_notif($waktu)
    {
        $start = date_create($waktu, timezone_open('Asia/Jakarta'));

        $total = date_diff($start, now());
        if ($total->format('%a') >= 1) {
            $waktu = $total->format('%a hari');
        } elseif ($total->format('%h') >= 1) {
            $waktu = $total->format('%h jam %i menit');
        } elseif ($total->format('%i') >= 1) {
            $waktu = $total->format('%i menit');
        } else {
            $waktu = $total->format('%s detik');
        }

        return $waktu;
    }

    public function baca_semua_notif()
    {
        foreach (Auth::user()->unreadnotifications as $key) {
            $key->markAsRead();
        }

        return back();
    }
    public static function Status($kode_status)
    {
        switch ($kode_status) {
            case '1':
                $status = 'warning';
                break;
            case '2':
                $status = 'warning';
                break;
            case '3':
                $status = 'success';
                break;
            case '4':
                $status = 'danger';
                break;

            default:
                $status = 'secondary';
                break;
        }

        $kode = Status::find($kode_status);
        echo '<span
        class="badge badge-lg fw-bold bg-gradient-' . $status . '">' . $kode->title . '</span>';
    }

    public static function waktu_indo($tanggal)
    {
        $jam_indo = Controller::jam_indo($tanggal);
        $waktu_indo = Controller::tanggal_indo($tanggal) . ' ' . $jam_indo;
        return $waktu_indo;
    }

    public static function jam_indo($tanggal)
    {
        $jam_indo = date_format(date_create($tanggal), "H:i");
        return $jam_indo;
    }
    public static function tanggal_indo($tanggal)
    {
        $hari_indo = Controller::hari_indo($tanggal);
        $bulan_ini = Controller::bulan_indo($tanggal);
        $tanggal_indo = $hari_indo . ', ' . date_format(date_create($tanggal), "d") . ' ' . $bulan_ini . ' ' . date_format(date_create($tanggal), "Y");
        return $tanggal_indo;
    }
    public static function hari_indo($tanggal)
    {
        $hari = date_format(date_create($tanggal), "D");

        switch ($hari) {
            case 'Sun':
                $hari_ini = "Minggu";
                break;

            case 'Mon':
                $hari_ini = "Senin";
                break;

            case 'Tue':
                $hari_ini = "Selasa";
                break;

            case 'Wed':
                $hari_ini = "Rabu";
                break;

            case 'Thu':
                $hari_ini = "Kamis";
                break;

            case 'Fri':
                $hari_ini = "Jumat";
                break;

            case 'Sat':
                $hari_ini = "Sabtu";
                break;

            default:
                $hari_ini = "Tidak di ketahui";
                break;
        }

        return $hari_ini;
    }

    public static function bulan_indo($tanggal)
    {
        $bulan = date_format(date_create($tanggal), "n");
        switch ($bulan) {
            case '1':
                $bulan_ini = "Januari";
                break;
            case '2':
                $bulan_ini = "Februari";
                break;
            case '3':
                $bulan_ini = "Maret";
                break;
            case '4':
                $bulan_ini = "April";
                break;
            case '5':
                $bulan_ini = "Mei";
                break;
            case '6':
                $bulan_ini = "Juni";
                break;
            case '7':
                $bulan_ini = "Juli";
                break;
            case '8':
                $bulan_ini = "Agustus";
                break;
            case '9':
                $bulan_ini = "September";
                break;
            case '10':
                $bulan_ini = "Oktober";
                break;
            case '11':
                $bulan_ini = "November";
                break;
            case '12':
                $bulan_ini = "Desember";
                break;

            default:
                $bulan_ini = "Tidak di ketahui";
                break;
        }
        return $bulan_ini;
    }

    public static function Kode_Peringatan($kode_penilaian)
    {
        switch ($kode_penilaian) {
            case '1':
                $status = 'info';
                break;
            case '2':
                $status = 'warning';
                break;
            case '3':
                $status = 'warning';
                break;
            case '4':
                $status = 'danger';
                break;
            case '8':
                $status = 'primary';
                break;

            default:
                $status = 'secondary';
                break;
        }

        $kode = Nilai::find($kode_penilaian);
        echo '<span
        class="badge badge-lg fw-bold bg-gradient-' . $status . '">' . $kode->title . '</span>';
    }

    public function encryptLaravel(Request $req)
    {
        $req->validate([
            'object' => 'required'
        ]);
        return Crypt::encrypt($req->object);
    }
    public function decryptLaravel(Request $req)
    {
        $req->validate([
            'object' => 'required'
        ]);
        return Crypt::decrypt($req->object);
    }

    public static function getAddress($latitude, $longitude)
    {
        $url = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={$latitude}&lon={$longitude}";

        $client = new Client();
        $response = $client->get($url);
        $data = json_decode($response->getBody(), true);

        if (isset($data['display_name'])) {
            $address = $data['display_name'];
            // dd($address);
            return $address;
            // return response()->json(['address' => $address]);
        } else {
            return 'Alamat tidak ditemukan';
            // return response()->json(['error' => 'No address found for the given coordinates.']);
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
