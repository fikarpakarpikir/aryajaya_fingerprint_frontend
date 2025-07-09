<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Golongan;
use App\Models\JabatanDivisi;
use App\Models\Karyawan;
use App\Models\Kepegawaian;
use App\Models\PKWT;
use App\Models\RiwayatJabatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class KepegawaianController extends Controller
{
    public static function NaikGolongan($id, $id_kar, $kode_gol)
    {
        $org = Karyawan::find($id_kar);
        $gol = RiwayatJabatan::where('id_karyawan', $id_kar)->latest()->first();

        switch ($org->pegawai->kode_status_kerja) {
            case '1':
                $start = date_create($gol->tanggal_update, timezone_open('Asia/Jakarta'));
                $total = number_format(date_diff($start, now())->format('%y'));
                break;
            case '2':
                $item = PKWT::find($id);
                $start = date_create($item->mulai, timezone_open('Asia/Jakarta'));
                $selesai = date_create($item->selesai, timezone_open('Asia/Jakarta'));
                $total =  number_format(date_diff($start, now())->format('%y'));
                break;

            default:
                # code...
                break;
        }


        switch ($kode_gol) {
            case $kode_gol >= 1 && $kode_gol <= 5:
                // Golongan IV
                $masa = 4;
                break;
            case $kode_gol >= 6 && $kode_gol <= 13:
                // Golongan III
                $masa = 3;
                break;
            case $kode_gol >= 14 && $kode_gol <= 17:
                // Golongan II
                $masa = 2;
                break;

            default:
                # code...
                break;
        }
        if ($total >= $masa) {
            echo '
            <div id="notif" class="text-center">
                <span class="badge bg-gradient-danger text-wrap">
                    Karyawan ini bisa dipertimbangkan untuk naik golongan <br>
                </span>
                <button class="btn btn-success m-0" data-bs-toggle="modal" data-bs-target="#UpdateGolongan">
                    Update Golongan
                </button>
            </div>
            ';
        }
    }

    public static function LamaKontrak($id_kar)
    {
        $org = Karyawan::find($id_kar);
        $total = 0;
        foreach ($org->pegawai->kontrak as $item) {
            $tanggal_mulai = date_create($item->mulai, timezone_open('Asia/Jakarta'));
            $tanggal_selesai = date_create($item->selesai, timezone_open('Asia/Jakarta'));
            $mulai = date_diff($tanggal_mulai, now());
            $selesai = date_diff(now(), $tanggal_selesai);
            $tanggal = date_diff($tanggal_mulai, $tanggal_selesai);
            $total_mulai =  intval($mulai->format('%a'));
            $total_selesai =  intval($selesai->format('%a'));
            $jumlah =  intval($tanggal->format('%a'));
            if ($total_mulai >= $jumlah) {
                $total += $jumlah;
            } else {
                $total += $total_mulai;
            }
            // $total += $jumlah;
        }
        $days = $total;
        $years = intval($days / 365);
        $days = $days % 365;

        $months = intval($days / 30);
        $days = $days % 30;

        echo "$years tahun, $months bulan, $days hari";
        if ($years > 5) {
            echo '<span class="badge bg-gradient-warning text-wrap">
        Kontrak Karyawan ini telah dari 5 tahun
        </span>';
        }
        // if ($total <= 60) {
        //     if ($total == 0) {
        //         echo '<span class="badge bg-gradient-danger text-wrap">
        //             Kontrak Karyawan ini telah habis
        //         </span>';
        //     }
        //     echo '<span class="badge bg-gradient-danger text-wrap">
        //         Kontrak Karyawan ini tersisa ' . $total . ' hari lagi
        //     </span>';
        // }
    }

    public function add(Request $req)
    {
        $valid = $req->validate([
            'id_kar' => 'required|string',
            'masuk' => 'required|date',
            'kode_status_kerja' => 'required|numeric',
            'kode_golongan' => 'required|numeric',
            'kode_struktural' => 'required|numeric',
            'fungsional' => 'nullable|numeric',
            'kode_fungsional' => 'nullable|numeric',
        ]);
        $id_kar = Crypt::decrypt($req->id_kar);
        $valid['id_karyawan'] = $id_kar;

        // dd($valid);
        $new =  Kepegawaian::create([
            'id_karyawan' => $valid['id_karyawan'],
            'kode_status_kerja' => $valid['kode_status_kerja'],
            'masuk' => $valid['masuk'],
            'kode_golongan' => $valid['kode_golongan'],
            'kode_struktural' => $valid['kode_struktural'],
            'fungsional' => $valid['fungsional'],
            'kode_fungsional' => $valid['kode_fungsional'],
        ]);
        JabatanDivisi::create([
            'kode_status_kerja' => $req->kode_status_kerja,
            'id_kepegawaian' => $new->id,
            'kode_divisi' => $req->kode_divisi,
        ]);

        return response()->json(
            $this->getData(
                'pegawai',
                $new->load(['struktur', 'fungsi', 'golongan', 'kerja', 'divisi'])
            )
        );
    }
    public function change(Request $req)
    {
        $rules = [
            'id' => 'required',
            'key' => 'required',
        ];

        if ($req->filled('key') && $req->key) {
            $rules[$req->key] = 'required'; // Add dynamic validation rule safely
        }


        $req->validate($rules);
        $data = Kepegawaian::find(Crypt::decrypt($req->id));
        // return Kepegawaian::find(Crypt::decrypt($req->id));
        // if ($req->key == 'kode_status_kerja' && $data->kode_status_kerja == $req[$req->key])
        $data->update([
            $req->key => $req[$req->key]
        ]);

        return response()->json(
            $this->getData($req->key, $req[$req->key], 'pegawai')
        );
    }
}
