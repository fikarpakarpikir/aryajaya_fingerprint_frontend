<?php

namespace App\Http\Controllers;

use App\Models\Alamat;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class AlamatController extends Controller
{
    public function change(Request $req)
    {
        $validated = $req->validate([
            'id' => ['required_without:id_kar', 'string'],
            'id_kar' => ['required_without:id', 'string'],
            'province_id' => 'required|numeric',
            'city_id' => 'required|numeric',
            'detail' => 'required|string',
            'kode_pos' => 'required|numeric',
        ]);
        if (!$req->id) {
            $additional = $req->validate([
                'nama_dkt' => 'required|string',
                'no_hp_dkt' => 'required|numeric',
            ]);
        }

        $id = $req->id ? Crypt::decrypt($req->id) : null;
        $id_kar = $req->id_kar ? Crypt::decrypt($req->id_kar) : null;

        $data = [
            'province_id' => $validated['province_id'],
            'city_id' => $validated['city_id'],
            'detail' => $validated['detail'],
            'kode_pos' => $validated['kode_pos'],
        ];
        // dd($id);
        if ($id) {
            $alamat = Alamat::findOrFail($id);
            $alamat->update($data);
        } else {
            $alamat = Alamat::create((array_merge([
                'id_karyawan' => $id_kar,
            ], $data, $additional)));
            // $alamat->load(['kota', 'provinsi']);
        }


        return response()->json([
            'key' => 'alamat',
            'data' => $alamat->load(['kota', 'provinsi']),
        ]);
        // $alamat = [

        //     "id" => 168,
        //     "id_karyawan" => 172,
        //     "province_id" => 9,
        //     "city_id" => 252,
        //     "kode_pos" => 45454,
        //     "detail" => "sukar",
        //     "nama_dkt" => "Fikar",
        //     "no_hp_dkt" => "89646615484",
        //     "created_at" => "2025-06-29T16:21:09.000000Z",
        //     "updated_at" => "2025-06-29T16:21:09.000000Z",
        //     "kota" => [
        //         "id" => 80,
        //         "province_id" => 9,
        //         "city_id" => 252,
        //         "title" => "Majalengka",
        //         "created_at" => "2023-05-01T17:26:30.000000Z",
        //         "updated_at" => "2023-05-01T17:26:30.000000Z",
        //     ],
        //     "provinsi" => [
        //         "id" => 9,
        //         "province_id" => 9,
        //         "title" => "Jawa Barat",
        //         "created_at" => "2023-05-01T17:26:30.000000Z",
        //         "updated_at" => "2023-05-01T17:26:30.000000Z",
        //     ],

        // ];
    }
    public function terdekatChange(Request $req)
    {
        $rules = [
            'id' => 'required',
            'key' => 'required',
        ];

        if ($req->filled('key') && $req->key) {
            $rules[$req->key] = 'required'; // Add dynamic validation rule safely
        }

        $req->validate($rules);

        Alamat::find(Crypt::decrypt($req->id))
            ->update([
                $req->key => $req[$req->key]
            ]);

        return response()->json([
            'parent' => 'alamat',
            'key' => $req->key,
            'data' => $req[$req->key]
        ]);
    }
}
