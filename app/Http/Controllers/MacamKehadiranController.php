<?php

namespace App\Http\Controllers;

use App\Models\Kehadiran;
use App\Models\MacamKehadiran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class MacamKehadiranController extends Controller
{

    public function update($id_macam_hadir, $kode_hadir)
    {
        $macam = MacamKehadiran::find($id_macam_hadir)
            ->update(['kode_hadir' => $kode_hadir]);
        // ->update(['kode_hadir' => $kode_hadir]);
        // return response()->json(['hadir' => $macam]);
        // return json_encode($pesan);

        $hadir = Kehadiran::find($kode_hadir);
        return response()->json([
            'success' => 'Data berhasil diupdate',
            'hadir' => $hadir->title, // for status 200
            // 'hadir' => $macam, // for status 200
        ]);
    }

    public function updateTitle(Request $req, $id)
    {
        $id = Crypt::decrypt($id);
        $req->validate([
            'title' => 'required'
        ]);

        MacamKehadiran::where('id', $id)
            ->update([
                'title' => $req->title
            ]);

        return back()->with('success', 'Update data berhasil');
    }

    public function getKehadiran()
    {
        return Kehadiran::all();
    }
}
