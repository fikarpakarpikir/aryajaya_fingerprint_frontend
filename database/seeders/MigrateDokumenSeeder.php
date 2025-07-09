<?php

namespace Database\Seeders;

use App\Models\BagianData;
use App\Models\JenisData;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MigrateDokumenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bagianData = [
            'Dokumen' => 1
        ];
        $JenisDataTypes = [
            'Foto' => 1,
            'KTP' => 2,
            'NPWP' => 3,
            'BPJS' => 4,
        ];

        // BagianData::create(['title' => 'Dokumen']);

        // Insert document types into 'jenis_dokumens' table
        // foreach ($JenisDataTypes as $title => $id) {
        //     JenisData::insert(['bagian_data_id' => 1, 'title' => $title, 'created_at' => now(), 'updated_at' => now()]);
        // }

        // Retrieve old dokumen records
        $oldDokumens = DB::table('dokumens')->get();

        // Insert transformed data into new schema
        $newDokumens = [];
        foreach ($oldDokumens as $dokumen) {
            $newDokumens[] = [
                'karyawan_id' => $dokumen->karyawan_id,
                'jenis_data_id' => 1,
                'file' => $dokumen->foto,
                'no_identity' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
            $newDokumens[] = [
                'karyawan_id' => $dokumen->karyawan_id,
                'jenis_data_id' => 2,
                'file' => $dokumen->file_ktp,
                'no_identity' => $dokumen->nik,
                'created_at' => now(),
                'updated_at' => now(),
            ];
            if ($dokumen->file_npwp) {
                $newDokumens[] = [
                    'karyawan_id' => $dokumen->karyawan_id,
                    'jenis_data_id' => 3,
                    'file' => $dokumen->file_npwp,
                    'no_identity' => $dokumen->npwp,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            if ($dokumen->file_bpjs) {
                $newDokumens[] = [
                    'karyawan_id' => $dokumen->karyawan_id,
                    'jenis_data_id' => 4,
                    'file' => $dokumen->file_bpjs,
                    'no_identity' => $dokumen->bpjs,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        // Insert into new dokumens table
        DB::table('bu_dokumens')->insert($newDokumens);
    }
}
