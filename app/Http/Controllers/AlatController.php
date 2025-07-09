<?php

namespace App\Http\Controllers;

use App\Models\Sistem\Alat;
use Illuminate\Http\Request;

class AlatController extends Controller
{
    public function add(Request $req)
    {
        try {
            $req->validate([
                'ipDevice' => 'required',
                'title' => 'required',
                'ipAlat' => 'required',
            ]);

            Alat::create([
                'ip_device' => $req->ipDevice,
                'title' => $req->title,
                'ip_alat' => $req->ipAlat,
            ]);
            return Alat::where('created_at', now())->first();
        } catch (\Throwable $th) {
            return [
                'message' => "Gagal: " . $th,
            ];
        }
    }

    public function change(Request $req)
    {
        try {
            $req->validate([
                'id' => 'required',
                'ipDevice' => 'required',
                'title' => 'required',
                'ipAlat' => 'required',
            ]);

            Alat::find($req->id)->update([
                'ip_device' => $req->ipDevice,
                'title' => $req->title,
                'ip_alat' => $req->ipAlat,
            ]);
            return Alat::find($req->id);
        } catch (\Throwable $th) {
            return [
                'message' => "Gagal: " . $th,
            ];
        }
    }

    public function delete(Request $req)
    {
        $req->validate([
            'id' => 'required',
            'ipDevice' => 'required',
            'title' => 'required',
            'ipAlat' => 'required',
        ]);

        Alat::find($req->id)
            ->delete();

        return ['id' => $req->id];
    }

    public function getIpAlat()
    {
        try {
            $ipAddress = request()->ip();
            $port = request()->getPort();

            $fullAddress = $ipAddress . ':' . $port;

            return Alat::where('ip_device', $fullAddress)
                ->pluck('ip_alat')->first();
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
