<?php

namespace App\Http\Controllers;

use App\Models\RiwayatPendidikan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class RiwayatPendidikanController extends Controller
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
        $data = RiwayatPendidikan::find(Crypt::decrypt($req->id));
        // return Kepegawaian::find(Crypt::decrypt($req->id));

        $data->update([
            $req->key => $req[$req->key]
        ]);

        return response()->json(
            $this->getData($req->key, $req[$req->key], 'sekolah')
        );
    }
}
