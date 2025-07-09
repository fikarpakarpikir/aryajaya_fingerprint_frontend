<?php

namespace App\Http\Controllers\LMS;

use App\Models\LMS\HasilJawabanPG;
use App\Http\Controllers\Controller;
use App\Models\LMS\BankSoal;
use App\Models\LMS\SoalPG;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class HasilJawabanPGController extends Controller
{
    public static function inputJawaban($data, $id_kar, $kode_skill, $kode_soal)
    {
        if ($data != null) {
            $soal = SoalPG::where('kode_soal', $kode_soal)->first();
            if ($soal->kode_jawaban_benar == $data) {
                $nilai = $soal->nilai;
            } else {
                $nilai = 0;
            }

            HasilJawabanPG::updateOrCreate(
                [
                    'id_karyawan' => $id_kar,
                    'kode_skill' => $kode_skill,
                    'kode_soal' => $kode_soal,
                ],
                [
                    'kode_jawaban' => $data,
                    'nilai' => $nilai,
                ]
            );
        } else {
            return back()->with('error', 'Isi jawaban terlebih dahulul');
        }
    }
}
