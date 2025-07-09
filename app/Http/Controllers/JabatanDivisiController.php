<?php

namespace App\Http\Controllers;

use App\Models\JabatanDivisi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class JabatanDivisiController extends Controller
{
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
        // return Kepegawaian::find(Crypt::decrypt($req->id));
        $data = JabatanDivisi::find(Crypt::decrypt($req->id));
        $data->update([
            $req->key => $req[$req->key]
        ]);

        return response()->json(
            $this->getData($req->key, $req[$req->key], $data->kode_status_kerja == 1 ? 'pegawai' : 'kontrak', $data->id_kepegawaian)
        );
    }
    // public function updateDivisi(Request $request, $kode_status_kerja, $id_kepegawaian)
    // {
    //     $kode_status_kerja = Crypt::decrypt($kode_status_kerja);
    //     $id_kepegawaian = Crypt::decrypt($id_kepegawaian);

    //     $valid = $request->validate([
    //         'kode_divisi' => 'required|numeric',
    //     ]);

    //     JabatanDivisi::updateOrCreate(
    //         [
    //             'kode_status_kerja' => $kode_status_kerja,
    //             'id_kepegawaian' => $id_kepegawaian,
    //         ],
    //         [
    //             'kode_divisi' => $valid['kode_divisi'],
    //         ]
    //     );

    //     return back()->with('success', 'Data Divisi berhasil diupdate');
    // }
}
