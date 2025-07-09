<?php

namespace App\Http\Controllers;

use App\Models\Sistem\Birokrasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class BirokrasiController extends Controller
{
    public function change(Request $req)
    {
        $req->validate([
            'id_karyawan' => 'required|string',
            'kode_divisi' => 'required|numeric',
            'status' => 'required|boolean'
        ]);
        $id_karyawan = Crypt::decrypt($req->id_karyawan);
        $kode_divisi = $req->kode_divisi;

        $existing = Birokrasi::where('id_karyawan', $id_karyawan)
            ->where('kode_divisi', $kode_divisi)
            ->first();

        // Toggle status: jika ada dan aktif, matikan. Jika tidak ada atau tidak aktif, aktifkan.
        $status = ($existing && $existing->is_active == 1) ? 0 : 1;

        $new = Birokrasi::updateOrCreate(
            [
                'id_karyawan' => $id_karyawan,
                'kode_divisi' => $kode_divisi,
            ],
            [
                'is_active' => $status
            ]
        );
        return response()->json($new);
    }
}
