<?php

namespace App\Http\Controllers;

use App\Models\PeraturanPerusahaan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class PeraturanPerusahaanController extends Controller
{
    public function index()
    {
        // // COMP - Component:
        // // 1. livewire
        // // 2. JSX
        // return view('General.index', [
        //     'title' => 'Presensi',
        //     'subtitle' => 'Presensi Harian',
        //     'comp' => 2,
        // ]);

        return Inertia::render('PeraturanPerusahaan/index', [
            'title' => 'Peraturan Perusahaan',
            // 'subtitle' => $data->title,
            'docs' => PeraturanPerusahaan::all()
        ]);
    }
    public function add(Request $req)
    {
        $req->validate([
            'title' => 'required|string',
            'document' => 'required|file|mimes:pdf'
        ]);

        if ($req->hasFile('document')) {
            $name_doc = $this->storeDoc($req->file('document'), 'peraturan_perusahaan');
            $new = PeraturanPerusahaan::create([
                'title' => $req->title,
                'document' => $name_doc,
            ]);
            return response()->json($new);
        }
        return response()->json(['error', 'Peraturan gagal ditambahkan'], 400);
    }

    public function delete(Request $req)
    {
        try {
            $req->validate([
                'id' => 'required|string',
            ]);

            $id = Crypt::decrypt($req->id);
            $data = PeraturanPerusahaan::findOrFail($id);
            $oldPath = public_path('assets/peraturan_perusahaan/' . $data->document);
            if ($data->document && File::exists($oldPath)) {
                File::delete($oldPath);
            }
            $data->delete();
            return response()->json($data);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Gagal menghapus data.',
                'error' => $th->getMessage()
            ], 500);
        }
        // dd($id);
    }

    public function change(Request $req)
    {
        $req->validate([
            'id' => 'required|string',
            'key' => 'required|string'
        ]);

        $key = $req->key;

        // Tambahan validasi untuk key tertentu
        $rules = [];
        if ($req->filled('key')) {
            $rules[$key] = $key === 'document' ? 'required|file|mimes:pdf' : 'required|string';
            $req->validate($rules);
        }

        try {
            $id = Crypt::decrypt($req->id);
            $data = PeraturanPerusahaan::findOrFail($id);

            $isDoc = $key === 'document';
            $value = null;

            if ($isDoc && $req->hasFile('document')) {
                // Hapus file lama jika ada
                $oldPath = public_path('assets/peraturan_perusahaan/' . $data->document);
                if ($data->document && File::exists($oldPath)) {
                    File::delete($oldPath);
                }

                // Simpan file baru
                $value = $this->storeDoc($req->file('document'), 'peraturan_perusahaan');
            } else {
                $value = $req->input($key);
            }

            $data->update([$key => $value]);

            return response()->json(
                $this->getData($key, $value, null, $id)
            );
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Gagal mengubah data.',
                'error' => $th->getMessage()
            ], 500);
        }
    }
}
