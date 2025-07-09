<?php

namespace App\Http\Controllers\LMS;

use App\Http\Controllers\Controller;
use App\Models\LMS\BankSoal;
use App\Models\LMS\HasilJawabanEssay;
use App\Models\LMS\SoalEssay;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class HasilJawabanEssayController extends Controller
{

    public static function inputJawaban($data, $id_kar, $kode_skill, $kode_soal)
    {
        if ($data != null) {
            $soal = SoalEssay::where('kode_soal', $kode_soal)->first();
            HasilJawabanEssay::updateOrCreate(
                [
                    'id_karyawan' => $id_kar,
                    'kode_skill' => $kode_skill,
                    'kode_soal' => $kode_soal,
                ],
                [
                    'jawaban' => $data,
                ]
            );
        } else {
            return back()->with('error', 'Isi jawaban terlebih dahulul');
        }
    }
}
