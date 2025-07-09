<?php

namespace App\Http\Controllers;

use App\Models\RiwayatKerja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class RiwayatController extends Controller
{
    public function add(Request $req)
    {
        $req->validate([
            'idKar' => 'required',
            'nama_instansi' => 'required',
            'sebagai' => 'required',
            'selesai' => 'nullable',
        ]);

        $new = RiwayatKerja::create(
            [
                'id_karyawan' => Crypt::decrypt($req->idKar),
                'nama_instansi' => $req->nama_instansi,
                'sebagai' => $req->sebagai,
                'selesai' => $req->selesai,
            ]
        );

        return response()->json(['parent' => "kerjaan", 'data' => $new]);
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
        $id = Crypt::decrypt($req->id);
        $data = RiwayatKerja::find($id);
        // return Kepegawaian::find(Crypt::decrypt($req->id));

        $data->update([
            $req->key => $req[$req->key]
        ]);

        return response()->json(
            $this->getData($req->key, $req[$req->key], 'kerjaan', $id)
        );
    }
}
