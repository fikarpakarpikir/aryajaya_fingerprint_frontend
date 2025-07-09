<?php

namespace Database\Seeders;

use App\Models\Alamat;
use App\Models\Dokumen;
use App\Models\Karyawan;
use App\Models\Kepegawaian;
use App\Models\RiwayatKerja;
use App\Models\RiwayatPendidikan;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DummyAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // struktur
        for ($a = 1; $a <= 8; $a++) {
            switch ($a) {
                case 1:
                    $fungsi_awal = 1;
                    $fungsi_akhir = 1;
                    $fungsi1_awal = 1;
                    $fungsi1_akhir = 1;
                    $gol_awal = 1;
                    $gol_akhir = 1;
                    break;
                case 2:
                    $fungsi_awal = 1;
                    $fungsi_akhir = 1;
                    $fungsi1_awal = 1;
                    $fungsi1_akhir = 1;
                    $gol_awal = 1;
                    $gol_akhir = 2;
                    break;
                case 3:
                    $fungsi_awal = 1;
                    $fungsi_akhir = 1;
                    $fungsi1_awal = 2;
                    $fungsi1_akhir = 3;
                    $gol_awal = 3;
                    $gol_akhir = 5;
                    break;
                case 4:
                    $fungsi_awal = 1;
                    $fungsi_akhir = 5;
                    $fungsi1_awal = 4;
                    $fungsi1_akhir = 8;
                    $gol_awal = 6;
                    $gol_akhir = 7;
                    break;
                case 5:
                    $fungsi_awal = 1;
                    $fungsi_akhir = 5;
                    $fungsi1_awal = 9;
                    $fungsi1_akhir = 13;
                    $gol_awal = 8;
                    $gol_akhir = 9;
                    break;
                case 6:
                    $fungsi_awal = 1;
                    $fungsi_akhir = 5;
                    $fungsi1_awal = 14;
                    $fungsi1_akhir = 18;
                    $gol_awal = 10;
                    $gol_akhir = 11;
                    break;
                case 7:
                    $fungsi_awal = 1;
                    $fungsi_akhir = 5;
                    $fungsi1_awal = 19;
                    $fungsi1_akhir = 23;
                    $gol_awal = 12;
                    $gol_akhir = 13;
                    break;
                case 8:
                    $fungsi_awal = 1;
                    $fungsi_akhir = 5;
                    $fungsi1_awal = 24;
                    $fungsi1_akhir = 34;
                    $gol_awal = 14;
                    $gol_akhir = 17;
                    break;

                default:
                    # code...
                    break;
            }
            for ($b = $fungsi_awal; $b <= $fungsi_akhir; $b++) {
                for ($c = $fungsi1_awal; $c <= $fungsi1_akhir; $c++) {
                    for ($d = $gol_awal; $d <= $gol_akhir; $d++) {
                        Karyawan::create([
                            'id' => $a . $b . $c . $d,
                            'nama' => 'Fikar ' . $a . $b . $c . $d,
                            'tempat_lahir' => 'Garut',
                            'tanggal_lahir' => '2001-08-15',
                            'no_hp' => '89646615484',
                            'jenis_kelamin' => 'Laki-laki',
                            'kode_agama' => 1,
                            'kode_nikah' => 1,
                        ]);

                        Alamat::create([
                            'id_karyawan' => $a . $b . $c . $d,
                            'province_id' => 9,
                            'city_id' => 126,
                            'kode_pos' => 44181,
                            'detail' => 'Darul Arqam',
                            'nama_dkt' => 'Aji',
                            'no_hp_dkt' => '85351531130'
                        ]);

                        Dokumen::create([
                            'id_karyawan' => $a . $b . $c . $d,
                            'foto' => '1-foto_profil.png',
                            'waktu_foto' => now(),
                            'nik' => '3205191508010001',
                            'file_ktp' => '1-file_ktp.png',
                        ]);

                        RiwayatPendidikan::create([
                            'id_karyawan' => $a . $b . $c . $d,
                            'pendidikan' => 5,
                            'nama_institusi' => 'Telkom University',
                            'prodi' => 'Teknik Telekomunikasi'
                        ]);

                        RiwayatKerja::create([
                            'id_karyawan' => $a . $b . $c . $d,
                            'nama_instansi' => 'Darul Arqam',
                            'sebagai' => 'Mo-Grapher',
                        ]);

                        User::create([
                            'id_karyawan' => $a . $b . $c . $d,
                            'username' => 'fikarpakarpikir' . $a . $b . $c . $d,
                            'email' => 'fikar.' . $a . $b . $c . $d . '@gmail.com',
                            'password' => bcrypt('aryajaya123'),
                        ]);

                        Kepegawaian::create([
                            'id_karyawan' => $a . $b . $c . $d,
                            'masuk' => '2019-05-10',
                            'kode_status_kerja' => 1,
                            'kode_golongan' => $d,
                            'kode_struktural' => $a,
                            'fungsional' => $b,
                            'kode_fungsional' => $c
                        ]);
                    }
                }
            }
        }
    }
}
