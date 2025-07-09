<?php

namespace App\Http\Controllers\LMS;

use App\Http\Controllers\Controller;
use App\Models\LMS\HasilJawabanPG;
use App\Models\LMS\Peserta;
use App\Models\LMS\Skill;
use App\Models\LMS\SoalPG;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UjianController extends Controller
{
    public function index($encIdOrToken)
    {
        $encIdOrToken = Crypt::decrypt($encIdOrToken);
        $peserta = Peserta::where('id', $encIdOrToken)->orWhere('token', $encIdOrToken)->first();
        if (!$peserta) {
            return redirect()->route('LMS.index')->with('error', 'Anda tidak berhak mengikuti ujian ini');
        }
        if ($peserta->finished_at) {
            return redirect()->route('LMS.index')->with('error', 'Anda telah selesai mengikuti ujian ini');
        }
        // try {
        try {
            return Inertia::render('LMS/Ujian/index', [
                'title' => 'Ujian',
                'peserta' => $peserta,
                'skill' => Skill::with(['level.lms'])->find($peserta->skill_id),
                'soals' => SoalPG::where('skill_id', $peserta->skill_id)
                    ->whereHas('pgs')
                    ->with(['pgs'])
                    ->inRandomOrder()
                    ->get()
                    ->map(function ($soal) {
                        $soal->pgs = $soal->pgs->shuffle(); // acak urutan pilihan
                        return $soal;
                    }),
                'hasil_pg' => HasilJawabanPG::where('skill_id', $peserta->skill_id)
                    ->where('peserta_id', $peserta->id)
                    ->get(),
            ]);
        } catch (\Throwable $e) {
            // Log untuk server
            Log::error('Gagal load ujian: ' . $e->getMessage());

            // Kirim pesan error ke frontend
            return Inertia::render('LMS/Ujian/index', [
                'title' => 'Ujian',
                'error' => app()->isLocal() ? $e->getMessage() : 'Terjadi kesalahan saat memuat ujian.'

            ]);
        }
        // } catch (\Throwable $th) {
        //     return response()->json([$th], 500);
        // }
        // dd($peserta);
    }
    public function join(Request $req)
    {
        $req->validate([
            'id' => 'required|string',
            'skill_id' => 'required|string',
            'token' => 'required|string',
        ]);
        $id = Crypt::decrypt($req->id);
        $skill_id = Crypt::decrypt($req->skill_id);

        $token = (int)Crypt::decrypt($req->token);
        $peserta = Peserta::find($id);

        // dd((int)$peserta->token === $token, (int)$peserta->token, $token);
        if (!$peserta) {
            return response()->json(['error', 'Apa benar ini kode token anda?'], 400);
        }
        if ((int)$peserta->token === $token && $peserta->skill_id === $skill_id) {
            if ($peserta->started_at != null) {
                return response()->json(['error', 'Kode Token ini sudah dipakai'], 400);
            }
            $peserta->update(['started_at' => now()]);
            return response()->json($peserta);
        } else {
            return response()->json(['error', 'Cek lagi kode token anda'], 400);
        }
    }

    public function jawab(Request $req)
    {
        $req->validate([
            'peserta_id' => 'required|string',
            'skill_id' => 'required|string',
            'soal_pg_id' => 'required|string',
            'pg_id' => 'required|string',
        ]);
        try {
            $peserta_id = Crypt::decrypt($req->peserta_id);
            $skill_id = Crypt::decrypt($req->skill_id);
            $soal_pg_id = Crypt::decrypt($req->soal_pg_id);
            $pg_id = Crypt::decrypt($req->pg_id);
        } catch (DecryptException $e) {
            return response()->json(['error' => 'Data tidak valid.'], 400);
        }
        $soal = SoalPG::findOrFail($soal_pg_id);
        $nilai = $soal?->pg_id_benar == $pg_id ? $soal?->nilai : 0;

        $new = HasilJawabanPG::updateOrCreate(
            [
                'peserta_id' => $peserta_id,
                'skill_id' => $skill_id,
                'soal_pg_id' => $soal_pg_id,
            ],
            [
                'nilai' => $nilai,
                'pg_id' => $pg_id,
            ]
        );

        return response()->json($new);
    }

    public function selesai(Request $req)
    {
        $req->validate([
            'peserta_id' => 'required|string',
        ]);

        try {
            $peserta_id = Crypt::decrypt($req->peserta_id);
        } catch (DecryptException $e) {
            return response()->json(['error' => 'Data tidak valid.'], 400);
        }

        $peserta = Peserta::find($peserta_id);
        $peserta->update(['finished_at' => now()]);
        return response()->json($peserta);
    }

    public function Test($id_kar, $kode_skill, $kode_soal)
    {
        $id_kar = Crypt::decrypt($id_kar);
        $kode_skill = Crypt::decrypt($kode_skill);
        $kode_soal = Crypt::decrypt($kode_soal);
        $skill = Skill::find($kode_skill);
        $soal_next = BankSoal::where('kode_skill', $kode_skill)
            ->where('id', '>', $kode_soal)->first();

        return view('LMS.Ujian.Test', [
            'title' => 'Ujian',
            'subtitle' => $skill->title,
            'skill' => $skill,
            'org' => Peserta::where('id_karyawan', $id_kar)->where('kode_skill', $kode_skill)->first(),
            'soals' => BankSoal::where('kode_skill', $kode_skill)->get(),
            'nomor' => BankSoal::find($kode_soal),
            'jawab_pg' => HasilJawabanPG::where('id_karyawan', $id_kar)
                ->where('kode_skill', $kode_skill)->where('kode_soal', $kode_soal)->first(),
            'jawab_essay' => HasilJawabanPG::where('kode_soal', $kode_soal)->first(),
            'soal_next' => BankSoal::where('kode_skill', $kode_skill)
                ->where('id', '>', $kode_soal)->first(),
        ]);
    }

    public function inputJawaban($id_kar, $kode_skill, $kode_soal, $jawaban)
    {
        $id_kar = Crypt::decrypt($id_kar);
        $kode_skill = Crypt::decrypt($kode_skill);
        $kode_soal = Crypt::decrypt($kode_soal);

        $soal = BankSoal::find($kode_soal);

        $skill = Skill::find($kode_skill);

        $selesai = date_add(
            date_create(
                Karyawan::find($id_kar)
                    ->peserta
                    ->started_at
            ),
            date_interval_create_from_date_string($skill->waktu . 'seconds')
        );
        $simbol_submit = date_diff(now(), $selesai)->format('%R');

        // dd($simbol_submit);
        // dd(
        //     $simbol_submit == '-',

        // );
        $soal_next = BankSoal::where('kode_skill', $kode_skill)
            ->where('id', '>', $kode_soal)->first();
        switch ($soal->kode_jenis_jawaban) {
            case '1':
                HasilJawabanPGController::inputJawaban($jawaban, $id_kar, $kode_skill, $kode_soal);
                break;
            case '2':
                HasilJawabanEssayController::inputJawaban($jawaban, $id_kar, $kode_skill, $kode_soal);
                break;

            default:
                # code...
                break;
        }
    }
}
