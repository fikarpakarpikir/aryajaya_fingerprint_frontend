<?php

namespace App\Http\Controllers;

use App\Models\Karyawan;
use App\Models\Peringatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class PeringatanController extends Controller
{
    public static function Peringatan($id_kar, $kode_nilai)
    {
        // $id_kar = Crypt::decrypt($id_kar);
        $org = Karyawan::find($id_kar);

        $ingat = $org->ingats->where('kode_nilai', $kode_nilai);
        foreach ($ingat as $key) {
            $total_ingat = 0;
            $hari_ingat = number_format(date_diff(date_create($key->mulai), date_create($key->selesai))->format('%d'));
            $total_ingat += $hari_ingat;
        }

        $pesan = '';
        if ($ingat->count() != null) {
            $pesan = $ingat->count()  . ' kali';
            return $pesan;
        } else {
            $pesan = 'Belum pernah';
            return $pesan;
        }
    }

    public function add(Request $req)
    {
        $req->validate([
            'idKar' => 'required',
            'kode_nilai' => 'required',
            'detail' => 'required',
        ]);

        $new = Peringatan::create(
            [
                'id_karyawan' => Crypt::decrypt($req->idKar),
                'kode_nilai' => $req->kode_nilai,
                'detail' => $req->detail,
            ]
        );

        return response()->json(['parent' => "ingats", 'data' => $new]);
    }
}
