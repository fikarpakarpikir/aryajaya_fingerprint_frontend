<?php

namespace App\Http\Controllers;

use App\Models\Rekening;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class RekeningController extends Controller
{
    public function updateRekening(Request $request, $id_kar)
    {
        $id_kar = Crypt::decrypt($id_kar);

        $valid = $request->validate([
            'atas_nama' => 'required',
            'id_bank' => 'required|numeric',
            'no_rekening' => 'required|numeric',
        ]);

        Rekening::updateOrCreate(
            [
                'id_karyawan' => $id_kar,
            ],
            [
                'atas_nama' => $valid['atas_nama'],
                'id_bank' => $valid['id_bank'],
                'no_rekening' => $valid['no_rekening'],
            ]
        );

        return back()->with('success', 'Data Rekening berhasil diupdate');
    }
}
