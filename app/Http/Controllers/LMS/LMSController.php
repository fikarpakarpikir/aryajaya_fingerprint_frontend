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
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class LMSController extends Controller
{
    public function index()
    {
        return Inertia::render('LMS/List', [
            'title' => 'LMS',
            'subtitle' => 'Ujian',
            'list_ujian' => Peserta::with([
                'skill.level.lms',
                'skill' => with(['soals' => function ($query) {
                    $query->select(['id', 'pg_id_benar', 'skill_id']);
                }]),
                'jawaban_pg',
            ])
                ->where('id_karyawan', auth()->user()->id_karyawan)
                ->get(),
            // 'soals' => BankSoal::with(['soal_pg' => with(['pgs'])])->get(),
        ]);
    }
    public function admin()
    {
        return Inertia::render('LMS/Admin/index', [
            'title' => 'LMS',
            'subtitle' => 'Admin',
            'categories' => LMS::with(['levels.skills'])->get(),
            'karyawans' => Karyawan::whereNotIn('id', [1])->where('status_aktif', 1)->select(['id', 'nama'])->get(),
            // 'soals' => BankSoal::with(['soal_pg' => with(['pgs'])])->get(),
        ]);
    }

    public function hasil($skill_id)
    {
        $skill_id = Crypt::decrypt($skill_id);

        return response()->json([
            'hasil_pg' => HasilJawabanPG::where('skill_id', $skill_id)->get(),
            'soals' => SoalPG::where('skill_id', $skill_id)->with(['pgs'])->get(),
            'pesertas' => Peserta::where('skill_id', $skill_id)
                ->whereHas('org')
                ->with(['org' => function ($query) {
                    $query->setEagerLoads([])->select(['id', 'nama', 'no_hp', 'role']);
                }])->get(),
        ]);
    }

    public function add(Request $req)
    {
        $validated = $req->validate([
            'title' => 'required|unique:l_m_s,title',
        ]);

        // Gunakan $validated untuk keamanan
        $new = LMS::create($validated);
        $new->load(['levels.skills']);

        return response()->json($new);
    }

    public function change(Request $req)
    {

        $req->validate([
            'id' => 'required|string',
            'title' => [
                'required',
                Rule::unique('l_m_s', 'title')->ignore(Crypt::decrypt($req->id)),
            ],
        ]);
        $id = Crypt::decrypt($req->id);
        $cat = LMS::findOrFail($id);
        $cat->update([
            'title' => $req->title,
        ]);

        return response()->json($cat);
    }

    public function delete(Request $req)
    {

        $req->validate([
            'id' => 'required|string',
        ]);
        $id = Crypt::decrypt($req->id);

        $cat = LMS::find($id);
        if (!$cat) {
            return response()->json(['error' => 'Data tidak ditemukan'], 404);
        }
        DB::beginTransaction();
        try {
            $levels = Level::where('lms_id', $id)->get();

            foreach ($levels as $level) {
                $skills = Skill::where('level_id', $level->id)->get();

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
            }

            $cat->delete();

            DB::commit();
            return response()->json($cat);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Gagal menghapus data', 'detail' => $e->getMessage()], 500);
        }
    }
}
