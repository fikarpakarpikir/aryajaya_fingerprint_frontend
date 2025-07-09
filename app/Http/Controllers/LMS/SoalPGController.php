<?php

namespace App\Http\Controllers\LMS;

use App\Http\Controllers\Controller;
use App\Models\LMS\HasilJawabanPG;
use App\Models\LMS\PG;
use App\Models\LMS\SoalPG;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class SoalPGController extends Controller
{
    public function add(Request $req)
    {
        $req->validate([
            'skill_id' => 'required|string',
            'kode_jenis_jawaban' => 'required|numeric',
            'pertanyaan' => 'required|string',
            // 'pg_id_benar' => $req->kode_jenis_jawaban == 1 ? 'required|numeric' : 'required|string',
        ]);

        $skill_id = Crypt::decrypt($req->skill_id);
        if ($req->id) {
            $id = Crypt::decrypt($req->id);
        }

        $req['nilai'] = $data['nilai'] ?? 1;

        $new = SoalPG::create(
            [
                'skill_id' => $skill_id,
                'pertanyaan' => $req['pertanyaan'],
                'dokumen' => $req['dokumen'],
                'pg_id_benar' => $req['pg_id_benar'],
                'nilai' => $req['nilai'],
            ]
        );
        $new->load(['pgs']);
        return response()->json($new);
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
        SoalPG::find($id)
            ->update([
                $req->key => $req[$req->key]
            ]);

        return response()->json(
            $this->getData($req->key, $req[$req->key], null, $id),
        );
    }

    public function changeKJ(Request $req)
    {
        $rules = [
            'id' => 'required|string',
            'key' => 'required|string',
            'soal_pg_id' => 'required|string',
        ];

        $req->validate($rules);

        $id = Crypt::decrypt($req->id);
        $soal_pg_id = Crypt::decrypt($req->soal_pg_id);
        SoalPG::find($soal_pg_id)
            ->update([
                $req->key => $id
            ]);

        return response()->json(
            $this->getData($req->key, $id, null, $soal_pg_id),
        );
    }

    public function delete(Request $req)
    {
        $rules = [
            'id' => 'required|string',
        ];

        $req->validate($rules);

        $id = Crypt::decrypt($req->id);
        SoalPG::find($id)->delete();
        PG::where('soal_pg_id', $id)->delete();
        HasilJawabanPG::where('soal_pg_id', $id)->delete();

        return response()->json(['id' => $id]);
    }
}
