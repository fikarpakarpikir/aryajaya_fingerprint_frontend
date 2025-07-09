<?php

namespace App\Http\Controllers\LMS;

use App\Http\Controllers\Controller;
use App\Models\Karyawan;
use App\Models\LMS\BankSoal;
use App\Models\LMS\HasilJawabanEssay;
use App\Models\LMS\HasilJawabanPG;
use App\Models\LMS\Level;
use App\Models\LMS\LMS;
use App\Models\LMS\Peserta;
use App\Models\LMS\PG;
use App\Models\LMS\Skill;
use App\Models\LMS\SoalEssay;
use App\Models\LMS\SoalPG;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Validation\Rule;

class LevelController extends Controller
{
    // public function index($id_kar, $kode_lms)
    // {
    //     $id_kar = Crypt::decrypt($id_kar);
    //     $kode_lms = Crypt::decrypt($kode_lms);
    //     $lms = LMS::find($kode_lms);
    //     return view('LMS.Level', [
    //         'title' => 'LMS',
    //         'subtitle' => $lms->title,
    //         'lms' => $lms,
    //         'levels' => Level::where('kode_lms', $kode_lms)->get(),
    //         'org' => Karyawan::find($id_kar),
    //     ]);
    // }

    public function add(Request $req)
    {

        $req->validate([
            'lms_id' => 'required|string',
            'title' => 'required|unique:levels,title'
        ]);
        $lms_id = Crypt::decrypt($req->lms_id);

        $new = Level::create([
            'lms_id' => $lms_id,
            'title' => $req->title,
        ]);

        return response()->json($new);
    }
    public function change(Request $req)
    {

        $req->validate([
            'id' => 'required|string',
            'title' => [
                'required',
                Rule::unique('levels', 'title')->ignore(Crypt::decrypt($req->id)),
            ],
        ]);
        $id = Crypt::decrypt($req->id);
        $level = Level::findOrFail($id);
        $level->update([
            'title' => $req->title,
        ]);

        return response()->json($level);
    }

    public function delete(Request $req)
    {

        $req->validate([
            'id' => 'required|string',
        ]);
        $id = Crypt::decrypt($req->id);

        $level = Level::find($id);
        if (!$level) {
            return response()->json(['error' => 'Level tidak ditemukan'], 404);
        }

        $skills = Skill::where('level_id', $id)->get();

        foreach ($skills as $skill) {
            HasilJawabanPG::where('skill_id', $skill->id)->delete();
            // HasilJawabanEssay::where('kode_skill', $skill->id)->delete();
            Peserta::where('skill_id', $skill->id)->delete();
            // SoalEssay::where('kode_skill', $skill->id)->delete();

            $soalIds = SoalPG::where('skill_id', $skill->id)->pluck('id');
            PG::whereIn('soal_pg_id', $soalIds)->delete();
            SoalPG::where('skill_id', $skill->id)->delete();

            $skill->delete();
        }

        $level->delete();

        return response()->json($level);
    }
}
