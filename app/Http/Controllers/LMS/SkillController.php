<?php

namespace App\Http\Controllers\LMS;

use App\Http\Controllers\Controller;
use App\Models\Karyawan;
use App\Models\LMS\BankSoal;
use App\Models\LMS\HasilJawabanEssay;
use App\Models\LMS\HasilJawabanPG;
use App\Models\LMS\JenisJawaban;
use App\Models\LMS\Level;
use App\Models\LMS\Peserta;
use App\Models\LMS\PG;
use App\Models\LMS\Skill;
use App\Models\LMS\SoalEssay;
use App\Models\LMS\SoalPG;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Validation\Rule;

class SkillController extends Controller
{
    // public function index($id_kar, $kode_level)
    // {
    //     $id_kar = Crypt::decrypt($id_kar);
    //     $kode_level = Crypt::decrypt($kode_level);
    //     $level = Level::find($kode_level);
    //     if (auth()->user()->kode_role == 1 || auth()->user()->kode_role == 5) {
    //         $skills = Skill::where('kode_level', $kode_level)->get();
    //     } else {
    //         $skills = Skill::whereHas('karyawans', function ($q) use ($id_kar) {
    //             $q->where('id_karyawan', $id_kar);
    //         })->get();
    //     }
    //     return view('LMS.Skill', [
    //         'title' => 'LMS',
    //         'subtitle' => $level->lms->title . ' - Level: ' . $level->title,
    //         // 'subtitle' => 'Level',
    //         'level' => $level,
    //         'skills' => $skills,
    //         'org' => Karyawan::find($id_kar),
    //     ]);
    // }

    public function add(Request $req)
    {
        $req->validate([
            'level_id' => 'required|string',
            'title' => 'required|unique:skills,title',
            'min_nilai' => 'required|numeric',
            'waktu' => 'required|numeric',
        ]);
        $level_id = Crypt::decrypt($req->level_id);

        $new = Skill::create([
            'level_id' => $level_id,
            'title' => $req->title,
            'min_nilai' => $req->min_nilai,
            'waktu' => $req->waktu * 60,
        ]);
        $new->load('level.lms');
        return response()->json($new);
    }

    public function change(Request $req)
    {

        $req->validate([
            'id' => 'required|string',
            'title' => [
                'required',
                Rule::unique('skills', 'title')->ignore(Crypt::decrypt($req->id)),
            ],
            'min_nilai' => 'required|numeric',
            'waktu' => 'required|numeric',
        ]);
        $id = Crypt::decrypt($req->id);
        $skill = Skill::findOrFail($id);
        $skill->update([
            'title' => $req->title,
            'min_nilai' => $req->min_nilai,
            'waktu' => $req->waktu * 60,
        ]);

        $skill->load('level.lms');
        return response()->json($skill);
    }

    public function delete(Request $req)
    {

        $req->validate([
            'id' => 'required|string',
        ]);
        $id = Crypt::decrypt($req->id);

        $skill = Skill::findOrFail($id);
        if ($skill) {
            HasilJawabanPG::where('skill_id', $skill->id)->delete();
            // HasilJawabanEssay::where('kode_skill', $skill->id)->delete();
            Peserta::where('skill_id', $skill->id)->delete();
            // SoalEssay::where('kode_skill', $skill->id)->delete();
            $soalIds = SoalPG::where('skill_id', $skill->id)->pluck('id');
            PG::whereIn('soal_pg_id', $soalIds)->delete();
            SoalPG::where('skill_id', $skill->id)->delete();
            $data = $skill->load(['level.lms']);
            $skill->delete();

            return response()->json($data);
        } else {
            return response()->json(['error' => "Data Tidak Ditemukan"]);
        }
    }
}
