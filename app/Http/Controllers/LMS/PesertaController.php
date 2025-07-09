<?php

namespace App\Http\Controllers\LMS;

use App\Http\Controllers\Controller;
use App\Models\Karyawan;
use App\Models\LMS\BankSoal;
use App\Models\LMS\Peserta;
use App\Models\LMS\Skill;
use Faker\Factory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class PesertaController extends Controller
{
    public function TambahPeserta($id_kar, $kode_skill)
    {
        $id_kar = Crypt::decrypt($id_kar);
        $kode_skill = Crypt::decrypt($kode_skill);
        $skill = Skill::find($kode_skill);
        $soals = BankSoal::where('kode_skill', $skill->id)->get();


        // $cek = Karyawan::whereDoesntHave(
        //     'peserta'
        // )->get();


        if ($soals != null) {
            return view('LMS.TambahPeserta', [
                'title' => 'LMS',
                'subtitle' => $skill->title,
                'skill' => $skill,
                'org' => Karyawan::find($id_kar),
                'karyawans' => Karyawan::whereDoesntHave('pesertas', fn($builder) => $builder->where('kode_skill', $kode_skill))->get(),
                // 'pesertas' => Karyawan::whereHas('pesertas')->get(),
                'pesertas' => Peserta::where('kode_skill', $kode_skill)->get(),
            ]);
        } else {
            return back()->with('error', 'Sebelum anda menambahkan peserta, silakan buat soal terlebih dahulu');
        }
    }

    public function add(Request $req)
    {
        $skill_id = Crypt::decrypt($req->skill_id);
        $faker = Factory::create();
        $data = [];
        $id_karyawans = []; // Untuk menyimpan id_karyawan yang akan dimasukkan

        for ($i = 0; $i < count($req->id_kar); $i++) {
            $id_karyawan = $req->id_kar[$i];
            $id_karyawans[] = $id_karyawan;

            $data[] = [
                'id_karyawan' => $id_karyawan,
                'skill_id' => $skill_id,
                'token' => $faker->unique()->numerify('######'),
            ];
        }

        Peserta::insert($data);

        // Ambil ulang data berdasarkan id_karyawan yang baru dimasukkan
        $new = Peserta::where('skill_id', $skill_id)
            ->whereIn('id_karyawan', $id_karyawans)
            ->whereHas('org')
            ->with(['org' => function ($query) {
                $query->setEagerLoads([])->select(['id', 'nama', 'no_hp', 'role']);
            }])
            ->get();
        return response()->json($new);
    }

    public function hapusPeserta($id_kar, $id_peserta)
    {
        $id_kar = Crypt::decrypt($id_kar);
        $id_peserta = Crypt::decrypt($id_peserta);

        $pst = Peserta::find($id_peserta);
        $pst->delete();

        return back()->with('success', $pst->org->nama . ' telah dihapus dari Peserta ' . $pst->skill->title);
    }
}
