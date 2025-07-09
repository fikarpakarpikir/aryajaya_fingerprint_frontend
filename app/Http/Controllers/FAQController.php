<?php

namespace App\Http\Controllers;

use App\Models\FAQ;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class FAQController extends Controller
{
    public function index()
    {
        return view('FAQ.index', [
            'title' => 'FAQ',
            'subtitle' => 'Panduan',
            'role' => auth()->user()->kode_role,
        ]);
    }

    public function Tambah()
    {
        return view('FAQ.Tambah', [
            'title' => 'FAQ',
            'subtitle' => 'Tambah FAQ',
            'role' => auth()->user()->kode_role,
        ]);
    }

    public function store(Request $req)
    {
        $req->validate(
            [
                'title' => 'required',
                'jawaban' => 'required'
            ]
        );
        // dd(Crypt::decrypt($req->id_faq));
        if ($req->id_faq) {
            FAQ::updateOrCreate([
                'id' => Crypt::decrypt($req->id_faq),
            ], [
                'title' => $req->title,
                'jawaban' => $req->jawaban
            ]);
            return redirect()->route('FAQ.index')->with('success', 'FAQ berhasil diupdate');
        } else {
            FAQ::create([
                'title' => $req->title,
                'jawaban' => $req->jawaban
            ]);
            return redirect()->route('FAQ.index')->with('success', 'FAQ berhasil ditambahkan');
        }
    }

    public function EditFAQ($id_pertanyaan)
    {
        $id_pertanyaan = Crypt::decrypt($id_pertanyaan);
        return view('FAQ.Tambah', [
            'title' => 'FAQ',
            'subtitle' => 'Edit FAQ',
            'faq' => FAQ::find($id_pertanyaan),
            'role' => auth()->user()->kode_role,
        ]);
    }

    public function delete($id_faq)
    {
        $id_faq = Crypt::decrypt($id_faq);

        try {
            FAQ::find($id_faq)->delete();
            return back()->with('success', 'FAQ berhasil dihapus');
        } catch (\Throwable $th) {
            return back()->with('error', $th);
        }
    }
}
