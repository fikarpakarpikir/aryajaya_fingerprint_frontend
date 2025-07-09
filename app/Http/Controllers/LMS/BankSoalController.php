<?php

namespace App\Http\Controllers\LMS;

use App\Http\Controllers\Controller;
use App\Models\Karyawan;
use App\Models\LMS\BankSoal;
use App\Models\LMS\JenisJawaban;
use App\Models\LMS\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class BankSoalController extends Controller
{

    public function BuatSoal($id_kar, $kode_skill, $id_bank_soal)
    {
        $id_kar = Crypt::decrypt($id_kar);
        $kode_skill = Crypt::decrypt($kode_skill);
        $id_bank_soal = Crypt::decrypt($id_bank_soal);
        $skill = Skill::find($kode_skill);

        // if ($id_bank_soal == 0) {
        //     $id_bank_soal = '';
        // } else {
        //     $id_bank_soal = $id_bank_soal;
        // }
        // dd($id_bank_soal);
        return view('LMS.Ujian.Soal.BuatSoal', [
            'title' => 'LMS',
            'subtitle' => $skill->title,
            'skill' => $skill,
            'id_bank_soal' => BankSoal::find($id_bank_soal),
            'soals' => BankSoal::where('kode_skill', $kode_skill)->get(),
            'org' => Karyawan::find($id_kar),
            'jenis_jaw' => JenisJawaban::all(),
        ]);
    }

    // public function add(Request $req)
    // {

    //     $valid = $req->validate([
    //         'kode_skill' => 'required|string',
    //         'id' => 'required|string',
    //         'kode_jenis_jawaban' => 'required|numeric',
    //         'pertanyaan' => 'required',
    //         'kode_jawaban_benar' => $req->kode_jenis_jawaban == 1 ? 'required|numeric' : '',
    //     ]);

    //     $kode_skill = Crypt::decrypt($req->kode_skill);
    //     $id_bank_soal = Crypt::decrypt($req->id);

    //     $valid['kode_skill'] = $kode_skill;
    //     $valid['updated_at'] = now();

    //     $soal = BankSoal::updateOrCreate(
    //         [
    //             'id' => $id_bank_soal,
    //         ],
    //         [
    //             'kode_skill' => $valid['kode_skill'],
    //             'kode_jenis_jawaban' => $valid['kode_jenis_jawaban'],
    //             'updated_at' => $valid['updated_at'],
    //         ]
    //     );

    //     if ($id_bank_soal == 0) {

    //         $soal = BankSoal::where('created_at', now())->first();
    //         $message = 'Soal berhasil ditambahkan';
    //     } else {
    //         $soal = BankSoal::find($id_bank_soal);
    //         $message = 'Soal berhasil diupdate';
    //     }

    //     // dd($soal);
    //     switch ($valid['kode_jenis_jawaban']) {
    //         case '1':
    //             SoalPGController::add($req, $soal->id);
    //             break;
    //         case '2':
    //             SoalEssayController::inputSoal($req, $soal->id);
    //             break;

    //         default:
    //             # code...
    //             break;
    //     }
    //     return $soal->with(['pgs'])->get();
    // }

    public function uploadImageTrix(Request $request)
    {
        // Validasi file
        $request->validate([
            'blob' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        // Simpan file ke storage (misal: public/uploads/images)
        $file = $request->file('blob');
        $filename = uniqid('soal_') . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('assets/soal/'), $filename);
        $url = '/assets/soal/' . $filename;

        // Return format sesuai Trix expectations
        // return response()->json(asset('assets/soal/' . $filename));
        return response($url);
        // return response()->json([
        //     'success' => true,
        //     'url' => $url,
        // ]);
    }


    public function RingkasanSoal($id_kar, $kode_skill)
    {
        $id_kar = Crypt::decrypt($id_kar);
        $kode_skill = Crypt::decrypt($kode_skill);

        // dd($id_kar, $kode_skill);
        return view(
            'LMS.RingkasanSoal',
            [
                'title' => 'LMS',
                'subtitle' => 'Ringkasan Soal',
                'skill' => Skill::find($kode_skill),
                'soals' => BankSoal::where('kode_skill', $kode_skill)->get(),

            ]
        );
    }
}
