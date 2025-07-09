<?php

namespace App\Http\Controllers;

use App\Models\JabatanDivisi;
use App\Models\Kepegawaian;
use App\Models\PKWT;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class PWKTController extends Controller
{
    public function editPKWT(Request $req, $id_pkwt, $id_kar)
    {
        $id_kar = Crypt::decrypt($id_kar);
        $id_pkwt = Crypt::decrypt($id_pkwt);
        $valid = $req->validate([
            'mulai' => 'required',
            'selesai' => 'required',
            'kode_golongan' => 'required',
            'kode_struktural' => 'required',
            'fungsional' => '',
            'kode_fungsional' => '',
        ]);
        // dd($valid);
        PKWT::where('id', $id_pkwt)->update([
            'mulai' => $valid['mulai'],
            'selesai' => $valid['selesai'],
            'kode_golongan' => $valid['kode_golongan'],
            'kode_struktural' => $valid['kode_struktural'],
            'fungsional' => $valid['fungsional'],
            'kode_fungsional' => $valid['kode_fungsional'],
        ]);

        return back()->with('success', 'Data berhasil diupdate');
    }

    public function add(Request $req)
    {
        $valid = $req->validate([
            'id_kar' => 'required|string',
            'mulai' => 'required|date',
            'selesai' => 'required|date',
            'kode_status_kerja' => 'required|numeric',
            'kode_golongan' => 'required|numeric',
            'kode_struktural' => 'required|numeric',
            'fungsional' => 'nullable|numeric',
            'kode_fungsional' => 'nullable|numeric',
        ]);
        $id_kar = Crypt::decrypt($req->id_kar);
        $valid['id_karyawan'] = $id_kar;

        // dd($valid);
        $new =  PKWT::create([
            'id_karyawan' => $valid['id_karyawan'],
            'kode_status_kerja' => $valid['kode_status_kerja'],
            'mulai' => $valid['mulai'],
            'selesai' => $valid['selesai'],
            'kode_golongan' => $valid['kode_golongan'],
            'kode_struktural' => $valid['kode_struktural'],
            'fungsional' => $valid['fungsional'],
            'kode_fungsional' => $valid['kode_fungsional'],
        ]);
        Kepegawaian::create([
            'id_karyawan' => $valid['id_karyawan'],
            'kode_status_kerja' => $valid['kode_status_kerja'],
            'masuk' => $valid['mulai'],
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
                null,
                $new->load(['struktur', 'fungsi', 'golongan', 'divisi']),
                'kontrak',
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
        $id = Crypt::decrypt($req->id);
        $data = PKWT::find($id);
        // return Kepegawaian::find(Crypt::decrypt($req->id));

        $data->update([
            $req->key => $req[$req->key]
        ]);

        return response()->json(
            $this->getData($req->key, $req[$req->key], 'kontrak', $id)
        );
    }
}
