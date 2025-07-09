<?php

namespace App\Http\Controllers\LMS;

use App\Http\Controllers\Controller;
use App\Models\Karyawan;
use App\Models\Kepegawaian;
use App\Models\LMS\BankSoal;
use App\Models\LMS\HasilJawabanEssay;
use App\Models\LMS\HasilJawabanPG;
use App\Models\LMS\Peserta;
use App\Models\LMS\Skill;
use Barryvdh\DomPDF\Facade\Pdf;
// use Barryvdh\DomPDF\PDF;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class TestController extends Controller
{

    public function logintest(Request $request, $id_kar, $kode_skill)
    {
        $id_kar = Crypt::decrypt($id_kar);
        $kode_skill = Crypt::decrypt($kode_skill);

        $kode_soal = BankSoal::where('kode_skill', $kode_skill)->first();

        $peserta = Peserta::where('id_karyawan', $id_kar)
            ->where('kode_skill', $kode_skill)
            ->where('token', $request->kode_token)
            ->first();

        // dd($request, $peserta);
        if ($peserta != null) {
            if ($peserta->token == $request->kode_token) {
                // dd($peserta->started_at);
                if ($peserta->started_at == null) {
                    $peserta->update(['started_at' => now()]);
                    return redirect('/LMS/Test/' . Crypt::encrypt($id_kar) . '/' . Crypt::encrypt($kode_skill) . '/' . Crypt::encrypt($kode_soal->id));
                } else {
                    return back()->with('error', 'Kode Token ini sudah dipakai');
                }
            } else {
                return back()->with('error', 'Cek lagi kode token anda');
            }
        } else {
            return back()->with('error', 'Apa benar ini kode token anda?');
        }
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
    public function Selesai(Request $request, $id_kar, $kode_skill, $kode_soal)
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
                HasilJawabanPGController::inputJawaban($request['kode_jawaban'], $id_kar, $kode_skill, $kode_soal);
                break;
            case '2':
                HasilJawabanEssayController::inputJawaban($request['jawaban'], $id_kar, $kode_skill, $kode_soal);
                break;

            default:
                # code...
                break;
        }

        Peserta::where('id_karyawan', $id_kar)
            ->update(['finished_at' => now()]);
        return redirect()->route('LMS.Skill.index', [Crypt::encrypt($id_kar), Crypt::encrypt($skill->level->id)])->with('success', 'Selesai');
    }

    public function Hasil($id_kar, $kode_skill)
    {
        $kode_skill = Crypt::decrypt($kode_skill);
        $skill = Skill::find($kode_skill);

        return view('LMS.Ujian.Hasil', [
            'title' => 'LMS',
            'subtitle' => $skill->title,
            'skill' => $skill,
            'org' => Karyawan::find($id_kar),
            'pesertas' => Peserta::where('kode_skill', $skill->id)->get(),
            'hasilPG' => HasilJawabanPG::where('kode_skill', $skill->id)->get(),
            'hasilEssay' => HasilJawabanEssay::where('kode_skill', $skill->id)->get(),
        ]);
    }

    public function RingkasanJawaban($id_kar, $kode_skill)
    {
        $kode_skill = Crypt::decrypt($kode_skill);
        $skill = Skill::find($kode_skill);

        return view('LMS.Ujian.RingkasanJawaban', [
            'title' => 'LMS',
            'subtitle' => $skill->title,
            'skill' => $skill,
            'org' => Karyawan::find($id_kar),
            'pesertas' => Peserta::where('kode_skill', $skill->id)->get(),
            'hasilPG' => HasilJawabanPG::where('kode_skill', $skill->id)->get(),
            'hasilEssay' => HasilJawabanEssay::where('kode_skill', $skill->id)->get(),
        ]);
    }

    public function PDF($kode_skill)
    {

        $kode_skill = Crypt::decrypt($kode_skill);
        $skill = Skill::find($kode_skill);

        $title = 'Hasil';
        $subtitle = $skill->title;
        $skill = $skill;
        $pesertas = Peserta::where('kode_skill', $skill->id)->get();
        $hasilPG = HasilJawabanPG::where('kode_skill', $skill->id)->get();
        $hasilEssay = HasilJawabanEssay::where('kode_skill', $skill->id)->get();


        view()->share('title', $title);
        view()->share('subtitle', $subtitle);
        view()->share('skill', $skill);
        view()->share('pesertas', $pesertas);
        view()->share('hasilPG', $hasilPG);
        view()->share('hasilEssay', $hasilEssay);
        $pdf = PDF::loadView('LMS.PDF.Hasil')->setPaper('a4', 'potrait');
        return $pdf->stream();
    }

    public static function Kelulusan($skill, $org)
    {
        $min_nilai = $skill->min_nilai;
        $min_soal =  $skill->min_soal;
        $total_nilai_soal = $skill->semua_soal_pg->sum('nilai') + $skill->semua_soal_essay->sum('nilai');
        $peserta = $org;
        $nilai_pg = $peserta->org->jawab_pg->where('kode_skill', $skill->id)->whereNotNull('kode_jawaban');
        $nilai_essay =  $peserta->org->jawab_essay->where('kode_skill', $skill->id)->whereNotNull('jawaban');

        $total_nilai_peserta = 0;
        foreach ($nilai_pg as $item) {
            // $total_nilai_peserta += $item->kode_soal_pg;
            if ($item->kode_jawaban == $item->kode_soal_pg->kode_jawaban_benar) {
                $total_nilai_peserta += $item->kode_soal_pg->nilai;
            }
        }

        $total_nilai = number_format($total_nilai_peserta / $total_nilai_soal * 100, 2);
        // dd($skill->semua_soal_pg);
        // dd($skill, $peserta->id, $nilai_pg->sum('nilai'), $nilai_essay->sum('nilai'), $total_nilai_peserta, $total_nilai_soal, $total_nilai);
        // dd($min_nilai, $min_soal, $peserta, $nilai_pg, $nilai_essay, $total_nilai_soal);
        if ($peserta->started_at != null && $peserta->finished_at != null) {
            if ($nilai_pg->first() != null || $nilai_essay->first() != null) {
                if ($nilai_pg->count() + $nilai_essay->count() >= $min_soal) {
                    $data = 'Remedial';
                    $text = 'warning';
                    $status = 'warning';
                    if ($total_nilai >= $min_nilai) {
                        $data = 'lulus';
                        $text = 'warning';
                        $status = 'success';
                    }
                    echo '<span
                    class="fw-bold text-md text-capitalize me-2 text-shadow py-1 px-2 rounded-pill border border-' . $text . '">Nilai: ' . $total_nilai . '</span>';
                } else {
                    $data = 'Belum Lulus';
                    $text = 'warning';
                    $status = 'danger';
                }
                // $nilai = $total_nilai;
            } else {
                $data = 'Gagal';
                $status = 'danger';
            }
        } else {
            $data = 'Belum Dikerjakan';
            $status = 'secondary';
        }

        $badge = '<span
        class="badge badge-lg fw-bold text-capitalize bg-gradient-' . $status . '">' . $data . '</span>';
        echo $badge;
    }
}
