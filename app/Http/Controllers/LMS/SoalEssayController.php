<?php

namespace App\Http\Controllers\LMS;

use App\Http\Controllers\Controller;
use App\Models\LMS\SoalEssay;
use Illuminate\Http\Request;

class SoalEssayController extends Controller
{
    public static function inputSoal($data, $id_bank_soal)
    {
        // dd($data, $id_bank_soal);
        if ($data['nilai'] != null) {
            $data['nilai'] = $data['nilai'];
        } else {
            $data['nilai'] = 1;
        }
        if ($data->hasFile('pertanyaan')) {
            dd($data);
        }
        SoalEssay::updateOrCreate(
            ['kode_soal' => $id_bank_soal],
            [
                'pertanyaan' => $data['pertanyaan'],
                'dokumen' => $data['dokumen'],
                'nilai' => $data['nilai'],
            ]
        );
    }
}
