<?php

namespace App\Http\Controllers\LMS;

use App\Http\Controllers\Controller;
use App\Models\LMS\PG;
use Illuminate\Database\Eloquent\Casts\Json;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class PGController extends Controller
{
    public function add(Request $req)
    {
        $req->validate([
            'soal_pg_id' => 'required|string',
            'pilihan' => 'required',
        ]);
        $soal_pg_id = Crypt::decrypt(($req->soal_pg_id));
        $pilihanValue = null;

        // Jika ada file gambar
        if ($req->hasFile('pilihan')) {
            $file = $req->file('pilihan');

            // Validasi file secara manual (ukuran dan tipe)
            if (!$file->isValid()) {
                return response()->json(['error' => 'File tidak valid'], 422);
            }

            if (!in_array($file->getMimeType(), ['image/jpeg', 'image/jpg', 'image/png'])) {
                return response()->json(['error' => 'Format file tidak didukung'], 422);
            }

            if ($file->getSize() > 2 * 1024 * 1024) { // > 2MB
                return response()->json(['error' => 'Ukuran file maksimal 2MB'], 422);
            }

            // Simpan file
            $filename = uniqid('pg_') . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('assets/file_pg/'), $filename);
            $pilihanValue = $filename;
        } else {
            // Kalau bukan file, ambil teksnya
            $pilihanValue = $req->pilihan;
        }

        // Simpan ke database
        $new = PG::create([
            'soal_pg_id' => $soal_pg_id,
            'pilihan' => $pilihanValue,
        ]);
        return response()->json($new);
    }

    public function change(Request $req)
    {
        $req->validate([
            'id' => 'required|string',
            'pilihan' => 'required',
        ]);
        $id = Crypt::decrypt(($req->id));
        $pilihanValue = null;

        // Jika ada file gambar
        if ($req->hasFile('pilihan')) {
            $file = $req->file('pilihan');

            // Validasi file secara manual (ukuran dan tipe)
            if (!$file->isValid()) {
                return response()->json(['error' => 'File tidak valid'], 422);
            }

            if (!in_array($file->getMimeType(), ['image/jpeg', 'image/jpg', 'image/png'])) {
                return response()->json(['error' => 'Format file tidak didukung'], 422);
            }

            if ($file->getSize() > 2 * 1024 * 1024) { // > 2MB
                return response()->json(['error' => 'Ukuran file maksimal 2MB'], 422);
            }

            // Simpan file
            $filename = uniqid('pg_') . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('assets/file_pg/'), $filename);
            $pilihanValue = $filename;
        } else {
            // Kalau bukan file, ambil teksnya
            $pilihanValue = $req->pilihan;
        }

        // Simpan ke database
        $new = PG::find(
            $id,
        );
        $new->update([
            'pilihan' => $pilihanValue,
        ]);
        return response()->json(
            $new
        );
    }

    public function delete(Request $req)
    {
        $rules = [
            'id' => 'required|string',
        ];

        $req->validate($rules);

        $id = Crypt::decrypt($req->id);
        $pg = PG::find($id);
        $pg->delete();

        return response()->json(['id' => $pg->id, 'soal_pg_id' => $pg->soal_pg_id]);
    }

    public static function inputPG($data, $id_bank_soal)
    {
        // dd($data, $data->text_pilihan, $data->foto_pilihan);
        // dd($id_bank_soal);
        $pg = [];
        $error = 1;
        // fetch Text PG
        if ($data->text_pilihan != null) {
            $i = 0;

            foreach ($data->text_pilihan as $id => $value) {
                // dd($id, $value);
                if ($value != null) {
                    if (!empty($value) && !$value == 0) {
                        // $noId_pilihan = $i;
                        $pg[] = [
                            'id' => $data->id[$i],
                            'kode_soal' => $id_bank_soal,
                            'id_pilihan' => $id + 1,
                            'pilihan' => $value,
                        ];
                    }
                }
                $i++;
            }
        }
        if ($data->foto_pilihan != null) {
            $i = 0;
            foreach ($data->foto_pilihan as $id => $value) {
                if (!empty($value) && !$value == 0) {
                    $noId_pilihan = $i;
                    if ($value != null) {
                        $filename = uniqid('pg_') . '.' . $value->getClientOriginalExtension();
                        $value->move(public_path('assets/file_pg/'), $filename);
                        $pilihan = $filename;
                    }
                    $pg[] = [
                        'id' => $data->id[$i],
                        'kode_soal' => $id_bank_soal,
                        'id_pilihan' => $id + 1,
                        'pilihan' => $pilihan,
                    ];
                }
                $i++;
            }
            // for ($i = 0; $i < count($data->foto_pilihan); $i++) {
            //     $noId_pilihan = 0;
            //     if (!empty($data->id_pilihan[$i]) && !$data->id_pilihan[$i] == 0) {
            //         $noId_pilihan = $data->id_pilihan[$i];
            //         if ($data->foto_pilihan[$i] != null) {
            //             $filename = uniqid('pg_') . '.' . $data->foto_pilihan[$i]->getClientOriginalExtension();
            //             $data->foto_pilihan[$i]->move(public_path('assets/file_pg/'), $filename);
            //             $pilihan = $filename;
            //         }
            //         $pg[] = [
            //             'id' => $noId_pilihan,
            //             'kode_soal' => $id_bank_soal,
            //             'pilihan' => $pilihan,
            //         ];
            //     }
            // }
        }

        if (count($pg) > 0) {
            $error = '';
        }
        if ($pg[0]['kode_soal'] != null) {
            PG::upsert($pg, ['id', 'kode_soal', 'id_pilihan'], ['pilihan']);
        }
        // dd($pg);
    }

    public function hapusPG($id_kar, $id_PG)
    {
        $id_kar = Crypt::decrypt($id_kar);
        $id_PG = Crypt::decrypt($id_PG);

        PG::find($id_PG)->delete();

        return back()->with('success', 'Satu Pilihan telah dihapus');
    }
}
