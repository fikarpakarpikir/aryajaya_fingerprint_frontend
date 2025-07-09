<?php

namespace App\Http\Controllers;

use App\Models\RiwayatJabatan;
use App\Models\User;
use App\Notifications\GeneralNotif;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Notification;

class RiwayatJabatanController extends Controller
{
    public function UpdateGolongan(Request $request, $id_kar)
    {
        $id_kar = Crypt::decrypt($id_kar);
        $valid = $request->validate([
            'kode_golongan' => 'required|numeric',
            'kode_struktural' => 'required|numeric',
            'fungsional' => 'numeric',
            'kode_fungsional' => 'numeric',
        ]);
        $valid['id_karyawan'] = $id_kar;
        $valid['tanggal_update'] = now();

        // dd($valid);
        RiwayatJabatan::create([
            'id_karyawan' => $valid['id_karyawan'],
            'tanggal_update' => $valid['tanggal_update'],
            'kode_golongan' => $valid['kode_golongan'],
            'kode_struktural' => $valid['kode_struktural'],
            'fungsional' => $valid['fungsional'],
            'kode_fungsional' => $valid['kode_fungsional'],
        ]);

        $notif = [
            'kode_aktifitas' => 8,
            'id_karyawan' => $id_kar,
            'pesan_notif' => 'Data karyawan anda telah diupdate, silakan cek di halaman Profil.'
        ];
        $user = User::find($id_kar);
        Notification::send($user, new GeneralNotif($notif));
        RecordController::RecordAct($valid['id_karyawan'], 8);
        return back()->with('success', 'Golongan berhasil diupdate');
    }
}
