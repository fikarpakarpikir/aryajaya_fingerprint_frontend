<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Alamat;
use App\Models\Dokumen;
use App\Models\Karyawan;
use App\Models\Kepegawaian;
use App\Models\RiwayatJabatan;
use App\Models\RiwayatKerja;
use App\Models\RiwayatPendidikan;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        $this->call([
            // LocationsTableSeeder::class,
            FoundationSeeder::class,
            ProvincesSeeder::class,
            CitiesSeeder::class,
        ]);


        Karyawan::create([
            'nama' => 'Fikar Mohammad',
            'tempat_lahir' => 'Garut',
            'tanggal_lahir' => '2001-08-16',
            'no_hp' => '89646615484',
            'jenis_kelamin' => 'Laki-laki',
            'kode_agama' => 1,
            'kode_nikah' => 1,
        ]);

        Alamat::create([
            'id_karyawan' => 1,
            'province_id' => 9,
            'city_id' => 126,
            'kode_pos' => 44181,
            'detail' => 'Darul Arqam',
            'nama_dkt' => 'Aji',
            'no_hp_dkt' => '85351531130'
        ]);

        Dokumen::create([
            'id_karyawan' => 1,
            'foto' => 'public\foto-profil\XfmrKvbQqLDEGHlBcj5zVJDRLI1u63jrGdGFAGnq.jpg',
            'waktu_foto' => now(),
            'nik' => '3205191508010001',
            'file_ktp' => 'public\file-ktp\QT1h1PhajokRes6BbhPQbUpanCRtpf9IMS4RxDgY.png',
        ]);

        RiwayatPendidikan::create([
            'id_karyawan' => 1,
            'pendidikan' => 5,
            'nama_institusi' => 'Telkom University',
            'prodi' => 'Teknik Telekomunikasi'
        ]);

        RiwayatKerja::create([
            'id_karyawan' => 1,
            'nama_instansi' => 'Darul Arqam',
            'sebagai' => 'Mo-Grapher',
        ]);

        User::create([
            'id_karyawan' => 1,
            'kode_role' => 1,
            'username' => 'fikar1',
            'email' => 'fikar.1@gmail.com',
            'password' => bcrypt('aryajaya123'),
        ]);

        Kepegawaian::create([
            'id_karyawan' => 1,
            'masuk' => '2019-05-10',
            'kode_status_kerja' => 1,
            'kode_golongan' => 8,
            'kode_struktural' => 6,
            'fungsional' => 1,
            'kode_fungsional' => 9
        ]);
        RiwayatJabatan::create([
            'id_karyawan' => 1,
            'tanggal_update' => now(),
            'kode_golongan' => 8,
            'kode_struktural' => 6,
            'fungsional' => 1,
            'kode_fungsional' => 9
        ]);

        // Karyawan::create([
        //     'nama' => 'Fikar 2',
        //     'tempat_lahir' => 'Garut',
        //     'tanggal_lahir' => '2001-08-16',
        //     'no_hp' => '89646615484',
        //     'jenis_kelamin' => 'Laki-laki',
        //     'kode_agama' => 1,
        //     'kode_nikah' => 1,
        // ]);

        // Alamat::create([
        //     'id_karyawan' => 2,
        //     'province_id' => 9,
        //     'city_id' => 126,
        //     'kode_pos' => 44181,
        //     'detail' => 'Darul Arqam',
        //     'nama_dkt' => 'Aji',
        //     'no_hp_dkt' => '85351531130'
        // ]);

        // Dokumen::create([
        //     'id_karyawan' => 2,
        //     'foto' => 'public\foto-profil\XfmrKvbQqLDEGHlBcj5zVJDRLI1u63jrGdGFAGnq.jpg',
        //     'waktu_foto' => now(),
        //     'nik' => '3205191508010001',
        //     'file_ktp' => 'public\file-ktp\QT1h1PhajokRes6BbhPQbUpanCRtpf9IMS4RxDgY.png',
        // ]);

        // RiwayatPendidikan::create([
        //     'id_karyawan' => 2,
        //     'pendidikan' => 5,
        //     'nama_institusi' => 'Telkom University',
        //     'prodi' => 'Teknik Telekomunikasi'
        // ]);

        // RiwayatKerja::create([
        //     'id_karyawan' => 2,
        //     'nama_instansi' => 'Darul Arqam',
        //     'sebagai' => 'Mo-Grapher',
        // ]);

        // User::create([
        //     'id_karyawan' => 2,
        //     'kode_role' => 2,
        //     'username' => 'fikar2',
        //     'email' => 'fikar.2@gmail.com',
        //     'password' => bcrypt('aryajaya123'),
        // ]);

        // Kepegawaian::create([
        //     'id_karyawan' => 2,
        //     'masuk' => '2019-05-10',
        //     'kode_status_kerja' => 1,
        //     'kode_golongan' => 8,
        //     'kode_struktural' => 8,
        //     'fungsional' => 1,
        //     'kode_fungsional' => 9
        // ]);

        // Karyawan::create([
        //     'nama' => 'Fikar 3',
        //     'tempat_lahir' => 'Garut',
        //     'tanggal_lahir' => '2001-08-16',
        //     'no_hp' => '89646615484',
        //     'jenis_kelamin' => 'Laki-laki',
        //     'kode_agama' => 1,
        //     'kode_nikah' => 1,
        // ]);

        // Alamat::create([
        //     'id_karyawan' => 3,
        //     'province_id' => 9,
        //     'city_id' => 126,
        //     'kode_pos' => 44181,
        //     'detail' => 'Darul Arqam',
        //     'nama_dkt' => 'Aji',
        //     'no_hp_dkt' => '85351531130'
        // ]);

        // Dokumen::create([
        //     'id_karyawan' => 3,
        //     'foto' => 'public\foto-profil\XfmrKvbQqLDEGHlBcj5zVJDRLI1u63jrGdGFAGnq.jpg',
        //     'waktu_foto' => now(),
        //     'nik' => '3205191508010001',
        //     'file_ktp' => 'public\file-ktp\QT1h1PhajokRes6BbhPQbUpanCRtpf9IMS4RxDgY.png',
        // ]);

        // RiwayatPendidikan::create([
        //     'id_karyawan' => 3,
        //     'pendidikan' => 5,
        //     'nama_institusi' => 'Telkom University',
        //     'prodi' => 'Teknik Telekomunikasi'
        // ]);

        // RiwayatKerja::create([
        //     'id_karyawan' => 3,
        //     'nama_instansi' => 'Darul Arqam',
        //     'sebagai' => 'Mo-Grapher',
        // ]);

        // User::create([
        //     'id_karyawan' => 3,
        //     'kode_role' => 2,
        //     'username' => 'fikar3',
        //     'email' => 'fikar.3@gmail.com',
        //     'password' => bcrypt('aryajaya123'),
        // ]);

        // Kepegawaian::create([
        //     'id_karyawan' => 3,
        //     'masuk' => '2019-05-10',
        //     'kode_status_kerja' => 1,
        //     'kode_golongan' => 8,
        //     'kode_struktural' => 8,
        //     'fungsional' => 1,
        //     'kode_fungsional' => 9
        // ]);

        //     ->sequence(
        //         ['jenis_kelamin' => 'Laki-laki'],
        //         ['jenis_kelamin' => 'Perempuan'],
        //     )
        //     ->create();
        // Alamat::factory(10)->create();
        // Dokumen::factory(10)->create();
        // RiwayatPendidikan::factory(10)->create();
        // RiwayatKerja::factory(15)->create();
        // User::factory(10)->create();
        // Kepegawaian::factory(10)->create();
    }
}
