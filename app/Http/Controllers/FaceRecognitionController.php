<?php

namespace App\Http\Controllers;

use App\Models\Auth\FaceRecognition;
use App\Models\JadwalKerja;
use App\Models\Karyawan;
use App\Models\Presensi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;

class FaceRecognitionController extends Controller
{
    public function index()
    {
        // dd([
        //     'title' => 'Presensi',
        //     'subtitle' => 'Face Recognition',
        //     'org' => Karyawan::with([
        //         'dokumen',
        //         'alamat' => with(['kota', 'provinsi']),
        //         'akun' => with(['face']),
        //         'pegawai' => with(['struktur', 'fungsi', 'golongan', 'kerja', 'kontrak', 'riw_jabs', 'divisi']),
        //         'agama',
        //         'nikah',
        //         'sekolah' => with(['tingkat']),
        //         'kerja',
        //         'kerjaan',
        //         'kontrak',
        //         'ingats',
        //         'acts' => with(['act']),
        //         'sertifs',
        //         'absens',
        //         'rek',
        //     ])->find(auth()->user()->id_karyawan),
        //     'jadwalKerja' => $this->getJadwalPresensi()
        // ]);
        // dd($this->getJadwalPresensi());
        return Inertia::render('Presensi/index', [
            'title' => 'Presensi',
            'subtitle' => 'Face Recognition',
            'org' => Karyawan::find(auth()->user()->id_karyawan),
            'jadwalKerja' => $this->getJadwalPresensi()
        ]);
    }

    public static function getJadwalPresensi($id_kar = null, $date = null)
    {
        $date = $date ?? now()->toDateString();
        $id_kar = $id_kar ?? auth()->user()->id_karyawan;

        // Ambil semua data yang diperlukan dalam satu query
        $jadwal = JadwalKerja::where('id_karyawan', $id_kar)
            ->where('kode_status', 3)
            ->where(function ($query) use ($date) {
                $query->whereDate('mulai', '<=', $date)
                    ->whereDate('selesai', '>=', $date)
                    ->orWhereDate('mulai', $date);
            })
            ->with(['absen', 'jenis_absen', 'laporan'])
            ->get();

        // Filter berdasarkan kondisi tanpa query tambahan
        $jadwalUtama = $jadwal->filter(fn($j) => in_array($j->kode_ket, [2, 3, 4, 5, 8, 11, 12, 13]));
        if ($jadwalUtama->isNotEmpty()) {
            return self::formatResponse($jadwalUtama, $id_kar, $date);
        }

        $jadwalHadir29 = $jadwal->filter(fn($j) => $j->kode_ket == 1 && $j->macam_hadir == 29);
        $keterangan = $jadwal->filter(fn($j) => in_array($j->kode_ket, [9, 10, 11]));

        if ($jadwalHadir29->isNotEmpty()) {
            return self::formatResponse($jadwalHadir29, $id_kar, $date, $keterangan);
        }

        $jadwalHadir28 = JadwalKerja::where('id_karyawan', $id_kar)
            ->where('kode_ket', 1)
            ->where('macam_hadir', 28)
            ->where('kode_status', 3)
            ->with(['absen', 'jenis_absen', 'laporan'])
            ->get();
        if ($jadwalHadir28->isNotEmpty()) {
            $array = json_decode($jadwalHadir28->first()->bukti, true);
            $intDay = date('N', strtotime($date));
            $isWorkDay = collect($array)->contains($intDay);

            return [
                'cek' => self::cekPresensi($jadwalHadir28->first()->id, $id_kar, $date)['angka'],
                'jadwal' => $isWorkDay ? $jadwalHadir28 : 'libur',
                'presensi' => self::cekPresensi($jadwalHadir28->first()->id, $id_kar, $date)['presensi'],
                'keterangan' => $keterangan,
            ];
        }

        return self::formatResponse($jadwal, $id_kar, $date, $keterangan);
    }

    private static function formatResponse($jadwal, $id_kar, $date, $keterangan = [])
    {
        return [
            'cek' => $jadwal->isNotEmpty() ? self::cekPresensi($jadwal[0]->id, $id_kar, $date)['angka'] : 3,
            'jadwal' => $jadwal,
            'presensi' => $jadwal->isNotEmpty() ? self::cekPresensi($jadwal[0]->id, $id_kar, $date)['presensi'] : [],
            'keterangan' => $keterangan,
        ];
    }


    public static function cekPresensi($id_jaker, $id_kar = null, $date = null)
    {
        $date = $date ?? now()->toDateString();
        $id_kar = $id_kar ??  auth()->user()->id_karyawan;
        $presensi = Presensi::where('id_karyawan', $id_kar)
            ->whereDate('mulai', $date)
            ->where('id_jaker', $id_jaker)
            ->get();

        $cek = 0;

        if (!$presensi->isEmpty()) {
            $presensi = Presensi::where('id_karyawan', $id_kar)
                ->whereDate('mulai', $date)
                ->where('id_jaker', $id_jaker)
                ->whereNull('selesai')
                ->whereNull('lokasi_longitude_selesai')
                ->whereNull('lokasi_latitude_selesai')
                ->get();

            if ($presensi->isNotEmpty()) {
                $cek = 1;
            } else {
                $cek = 2;
                $presensi = Presensi::where('id_karyawan', $id_kar)
                    ->whereDate('mulai', $date)
                    ->where('id_jaker', $id_jaker)
                    // ->whereNull('mulai')
                    // ->whereNull('lokasi_longitude_mulai')
                    // ->whereNull('lokasi_latitude_mulai')
                    ->get();
            }
            // $cek = ($presensi->isNotEmpty()) ? 1 : 2;
        }

        return [
            'angka' => $cek,
            'presensi' => $presensi,
        ];
    }

    public function store_image(Request $req)
    {
        $valid = $req->validate([
            'image' => 'required',
            'id_karyawan' => 'required',
            'id_face' => 'required',
        ]);
        $data = [];
        for ($i = 0; $i < count($req->image); $i++) {

            // Get the screenshot data from the req
            $data[$i] = $req->input('image')[$i];

            // Decode the base64 data URL to get the binary image da
            $folderPath = public_path('assets/face_rec/' . $valid['id_karyawan'] . '/');
            if (is_dir($folderPath) == false) {
                mkdir($folderPath, 0755, true);
            }

            $image_parts[$i] = explode(";base64,", $data[$i]);
            // $image_type_aux = explode('image/', $image_parts[0]);
            $image[$i] = base64_decode($image_parts[$i][1]);

            $id_face[$i] = number_format($req['id_face'][$i]);
            $name_foto_profil[$i] = $id_face[$i] . '.png';
            $imageFullPath[$i] = $folderPath . $name_foto_profil[$i];
            file_put_contents($imageFullPath[$i], $image[$i]);

            FaceRecognition::updateOrCreate(
                [
                    'id_karyawan' => $valid['id_karyawan'],
                    'ekspresi_wajah_id' => $id_face[$i],
                ],
                [
                    'foto' => $id_face[$i],
                ]
            );
        }
        return response()->json(['ok' => 200]);
    }

    public function delete(Request $req)
    {
        try {
            $req->validate(['id_karyawan' => 'required|string']);
            $id_kar = Crypt::decrypt($req->id_karyawan);

            FaceRecognition::where('id_karyawan', $id_kar)
                ->delete();
        } catch (\Throwable $th) {
            throw $th;
        }

        // return redirect()->route('Kar.Presensi.face-rec', [Crypt::encrypt($id_kar)])->with('success', 'Foto untuk presensi Anda telah dihapus, silakan daftarkan kembali');
    }
}
