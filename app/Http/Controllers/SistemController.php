<?php

namespace App\Http\Controllers;

// System
use App\Models\Agama;
use App\Models\Aktifitas;
use App\Models\Bank;
use App\Models\Sistem\Birokrasi;
use App\Models\City;
use App\Models\Divisi;
use App\Models\Fitur;
use App\Models\Fungsional;
use App\Models\Golongan;
use App\Models\JabatanFungsional;
use App\Models\JabatanStruktural;
use App\Models\Kehadiran;
use App\Models\MacamKehadiran;
use App\Models\Nikah;
use App\Models\Province;
use App\Models\Role;
use App\Models\Record;
use App\Models\Status;
use App\Models\StatusKaryawan;

// User
use App\Models\Alamat;
use App\Models\Dokumen;
use App\Models\JabatanDivisi;
use App\Models\JadwalKerja;
use App\Models\Karyawan;
use App\Models\Kepegawaian;
use App\Models\LaporanLembur;
use App\Models\Nilai;
use App\Models\Notification as ModelNotif;
use App\Models\Pendidikan;
use App\Models\Peringatan;
use App\Models\RiwayatKerja;
use App\Models\PHK;
use App\Models\PKWT;
use App\Models\RiwayatJabatan;
use App\Models\RiwayatPendidikan;
use App\Models\Rekening;
use App\Models\Sertifikat;
use App\Models\User;

// LMS
use App\Models\LMS\BankSoal;
use App\Models\LMS\HasilJawabanEssay;
use App\Models\LMS\HasilJawabanPG;
use App\Models\LMS\JenisJawaban;
use App\Models\LMS\LaporanJawaban;
use App\Models\LMS\Level;
use App\Models\LMS\LMS;
use App\Models\LMS\Peserta;
use App\Models\LMS\PG;
use App\Models\LMS\Skill;
use App\Models\LMS\SoalEssay;
use App\Models\LMS\SoalPG;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Crypt;
use App\Http\Controllers\RecordController;
use App\Models\Sistem\Alat;
use App\Notifications\Notification as NotifNotification;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SistemController extends Controller
{
    public $title = 'Sistem';
    public function index($encSistem)
    {
        try {
            $comp = 1;
            $sistem = Crypt::decrypt($encSistem);
            if (auth()->user()->kode_role === 1) {
                switch ($sistem) {
                    case 'Atur Akses':
                        return $this->AturAkses();
                        break;
                    case 'Manage File':
                        return $this->ManageFile();
                        break;
                    case 'Manage Alat':
                        return $this->ManageAlat();
                        break;
                    default:
                        return redirect()->route('home')->with('error', "Halaman yang Anda kunjungi tidak tersedia");
                        break;
                }
                switch ($sistem) {
                    case 'Sistem':
                        $page = 'index';
                        $subtitle = '';
                        break;
                    case 'Record':
                        $page = 'Record';
                        $subtitle = 'Record';
                        break;
                    case 'Aktifitas':
                        $page = 'Aktifitas';
                        $subtitle = 'Aktifitas';
                        break;
                    case 'Pilihan':
                        $page = 'Pilihan';
                        $subtitle = 'Pilihan';
                        break;
                    case 'Role':
                        $page = 'Role';
                        $subtitle = 'Role';
                        break;
                    case 'Status':
                        $page = 'Status';
                        $subtitle = 'Status';
                        break;
                    case 'Jabatan':
                        $page = 'Jabatan';
                        $subtitle = 'Jabatan';
                        break;
                    case 'Kehadiran':
                        $page = 'Kehadiran';
                        $subtitle = 'Kehadiran';
                        break;
                    case 'Akses':
                        $page = 'Akses';
                        $subtitle = 'Akses';
                        break;
                    case 'Akun':
                        $page = 'Akun';
                        $subtitle = 'Akun';
                        break;
                    case 'Pengajuan':
                        $page = 'Pengajuan';
                        $subtitle = 'Pengajuan';
                        break;
                    case 'Peraturan':
                        $page = 'PeraturanPerusahaan';
                        $subtitle = 'PeraturanPerusahaan';
                        break;
                    case 'Alat':
                        $page = 'Alat';
                        $subtitle = 'Alat';
                        $comp = 2;
                        break;
                    case 'ListAkun':
                        $page = 'ListAkun';
                        $subtitle = 'List Akun';
                        $comp = 2;
                        break;

                    default:
                        # code...
                        break;
                }
                switch ($comp) {
                    case 1:
                        return view('Sistem.' . $page, [
                            'title' => 'Sistem',
                            'subtitle' => $subtitle,
                            'accounts' => User::all()
                                ->whereNotIn('id', 1)
                                ->load([
                                    'org' => with([
                                        'pegawai' => with(['struktur', 'fungsi']),
                                    ]),
                                    'role'
                                ]),
                            'records' => Record::all()->load([
                                'act',
                                'org',
                            ]),
                            'karyawans' => Karyawan::all()
                                ->sortBy('nama'),
                            'roles' => Role::all(),
                            'hadirs' => Kehadiran::all(),
                            'macam_hadirs' => MacamKehadiran::all(),
                            'statuses' => Status::all(),
                            'aktifs' => Aktifitas::all(),
                            'strukturs' => JabatanStruktural::all(),
                            'fungsi' => Fungsional::all(),
                            'fungsionals' => JabatanFungsional::all(),
                            'divisis' => Divisi::all(),
                            'pengajuans' => JadwalKerja::all(),
                        ]);
                        break;
                    case 2:
                        return view('General.index', [
                            'title' => 'Sistem',
                            'subtitle' => $subtitle,
                            'comp' => $comp,
                        ]);
                        break;

                    default:
                        # code...
                        break;
                }
            } else {
                return redirect()->route('home')->with('error', "Anda tidak memiliki akses ke halaman ini");
            }
        } catch (\Throwable $th) {
            return redirect()->route('home')->with('error', "Anda melakukan kesalahan");
        }
        // dd(Crypt::decrypt($sistem));
    }

    public function AturAkses()
    {
        return Inertia::render('Sistem/AturAkses', [
            'title' => $this->title,
            'subtitle' => 'Manage File',
            'karyawans' => Karyawan::whereNotIn('id', [1])
                ->with(
                    ['pegawai' => with(['struktur', 'fungsi', 'golongan', 'kerja', 'kontrak', 'riw_jabs', 'divisi'])]
                )
                ->get(),
            // 'roles' => Role::all(),
            'divisis' => Divisi::all(),
            'birokrasis' => Birokrasi::all(),
        ]);
    }
    public function ManageFile()
    {
        $extAllowed = ['png', 'heic', 'jpg', 'jpeg', 'pdf'];
        return Inertia::render('Sistem/ManageFile', [
            'title' => $this->title,
            'subtitle' => 'Manage File',
            'folder' => [
                [
                    'title' => 'Pengajuan',
                    'folder' => 'absen',
                    'files' => JadwalKerja::where(function ($query) use ($extAllowed) {
                        foreach ($extAllowed as $ext) {
                            $query->orWhere('bukti', 'like', "%.$ext");
                        }
                    })
                        ->setEagerLoads([])
                        ->get()
                        ->map(function ($item) {
                            return [
                                'id' => $item->id,
                                'file' => $item->bukti,
                                'file_size' => $this->getFileSize($item->bukti, '/assets/absen/'),
                                'created_at' => $item->created_at,
                            ];
                        }),
                ],
                [
                    'title' => 'Laporan Lembur',
                    'folder' => 'laporan_lembur',
                    'files' => LaporanLembur::select('id', 'foto_awal', 'foto_akhir', 'created_at')->get()
                        ->map(function ($item) {
                            return [
                                'id' => $item->id,
                                'foto_awal' => $item->foto_awal,
                                'foto_awal_size' => $this->getFileSize($item->foto_awal, '/assets/laporan_lembur/'),
                                'foto_akhir' => $item->foto_akhir,
                                'foto_akhir_size' => $this->getFileSize($item->foto_akhir, '/assets/laporan_lembur/'),
                                'created_at' => $item->created_at,
                            ];
                        }),
                ],
            ]
        ]);
    }

    public function ManageAlat()
    {
        try {
            $ipAddress = request()->ip();
            $port = request()->getPort();

            $fullAddress = $ipAddress . ':' . $port;

            return Inertia::render('Sistem/Alat', [
                'title' => $this->title,
                'subtitle' => 'Manage Alat',
                'ipDevice' => $fullAddress,
                'alats' => Alat::all()
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function updateStatus(Request $request, $id_status)
    {
        $id_status = Crypt::decrypt($id_status);

        if ($request->title == null) {
            return back()->with('error', 'Data gagal diupdate');
        } else {
            Status::find($id_status)
                ->update(['title' => $request->title]);

            return back()->with('success', 'Data berhasil diupdate');
        }
    }
    public function updateAktifitas(Request $request, $id_aktifitas)
    {
        $id_aktifitas = Crypt::decrypt($id_aktifitas);

        if ($request->title == null) {
            return back()->with('error', 'Data gagal diupdate');
        } else {
            Aktifitas::find($id_aktifitas)
                ->update(['title' => $request->title]);

            return back()->with('success', 'Data berhasil diupdate');
        }
    }
    public function updateRole(Request $request, $id_status)
    {
        $id_status = Crypt::decrypt($id_status);

        if ($request->title == null) {
            return back()->with('error', 'Data gagal diupdate');
        } else {
            Role::find($id_status)
                ->update(['title' => $request->title]);

            return back()->with('success', 'Data berhasil diupdate');
        }
    }
    public function updateKehadiran(Request $request, $id_status)
    {
        $id_status = Crypt::decrypt($id_status);

        if ($request->title == null) {
            return back()->with('error', 'Data gagal diupdate');
        } else {
            Kehadiran::find($id_status)
                ->update(['title' => $request->title]);

            return back()->with('success', 'Data berhasil diupdate');
        }
    }
    public function updateDivisi(Request $request, $id_status)
    {
        $id_status = Crypt::decrypt($id_status);

        if ($request->title == null) {
            return back()->with('error', 'Data gagal diupdate');
        } else {
            Divisi::find($id_status)
                ->update(['title' => $request->title]);

            return back()->with('success', 'Data berhasil diupdate');
        }
    }

    public function TambahAktifitas(Request $request)
    {
        $valid = $request->validate([
            'title' => 'required|unique:aktifitas,title',
        ]);

        Aktifitas::create($valid);
        return back()->with('success', 'Data berhasil ditambahkan');
    }

    public function TambahKehadiran(Request $request)
    {
        $valid = $request->validate([
            'title' => 'required|unique:aktifitas,title',
        ]);

        Kehadiran::create(['title' => $valid['title']]);
        return back()->with('success', 'Data berhasil ditambahkan');
    }

    public function TambahStatus(Request $request)
    {
        $valid = $request->validate([
            'title' => 'required|unique:statuses,title',
        ]);

        Status::create($valid);
        return back()->with('success', 'Data berhasil ditambahkan');
    }

    public function TambahStruktur(Request $request)
    {
        $valid = $request->validate([
            'title' => 'required|unique:jabatan_strukturals,title',
        ]);

        JabatanStruktural::create($valid);
        return back()->with('success', 'Data berhasil ditambahkan');
    }
    public function TambahFungsi(Request $request)
    {
        $valid = $request->validate([
            'id_struktural' => 'required',
            'title' => 'required|unique:fungsionals,title',
        ]);

        Fungsional::create($valid);
        return back()->with('success', 'Data berhasil ditambahkan');
    }
    public function TambahFungsional(Request $request)
    {
        $valid = $request->validate([
            'id_struktural' => 'required',
            'id_fungsional' => 'required',
            'title' => 'required|unique:jabatan_fungsionals,title',
        ]);

        JabatanFungsional::create($valid);
        return back()->with('success', 'Data berhasil ditambahkan');
    }
    public function TambahDivisi(Request $request)
    {
        $valid = $request->validate([
            'title' => 'required|unique:divisis,title',
        ]);

        Divisi::create($valid);
        return back()->with('success', 'Data berhasil ditambahkan');
    }
    public function TambahPilihan(Request $request)
    {
        $valid = $request->validate([
            'kode_hadir' => 'required',
            'title' => 'required|unique:fungsionals,title',
        ]);

        MacamKehadiran::create($valid);
        return back()->with('success', 'Data berhasil ditambahkan');
    }

    public function HapusStatus($id_status)
    {
        $id_status = Crypt::decrypt($id_status);

        Status::find($id_status)->delete();
        return back()->with('success', 'Data berhasil dihapus');
    }

    public function TambahRole(Request $request)
    {
        $valid = $request->validate([
            'title' => 'required|unique:roles,title',
        ]);

        Role::create($valid);
        return back()->with('success', 'Data berhasil ditambahkan');
    }

    public function HapusRole($id_role)
    {
        $id_role = Crypt::decrypt($id_role);

        Role::find($id_role)->delete();
        return back()->with('success', 'Data berhasil dihapus');
    }

    public function HapusKehadiran($id_kehadiran)
    {
        $id_kehadiran = Crypt::decrypt($id_kehadiran);

        Kehadiran::find($id_kehadiran)->delete();
        return back()->with('success', 'Data berhasil dihapus');
    }
    public function HapusDivisi($id_divisi)
    {
        $id_divisi = Crypt::decrypt($id_divisi);

        Divisi::find($id_divisi)->delete();
        return back()->with('success', 'Data berhasil dihapus');
    }

    public function Pelanggaran($id_kar, $kode_aktifitas)
    {
        $id_kar = Crypt::decrypt($id_kar);
        $kode_aktifitas = Crypt::decrypt($kode_aktifitas);

        // dd($id_kar, $kode_aktifitas);
        RecordController::RecordAct($id_kar, $kode_aktifitas);
    }

    public function updateIDKaryawan($nama_db, $id, $akun)
    {
        $nama_db = Crypt::decrypt($nama_db);
        $id = Crypt::decrypt($id);
        $akun = Crypt::decrypt($akun);

        switch ($nama_db) {
            case 'Alamat':
                $data = Alamat::find($id);
                break;

            default:
                # code...
                break;
        }

        dd($data);
    }

    public function Database()
    {
        $table = [
            [
                'nama' => 'Agama',
                'nama2' => 'Agama2',
            ],
            [
                'nama' => 'Aktifitas',
            ],
        ];
        $tables = DB::select('SHOW TABLES');
        // $tableNames = DB::connection()->getDoctrineSchemaManager()->listTableNames();
        $tableNames = array_map('current', $tables);

        $tableDataArray = [];

        // Loop through each table
        foreach ($tableNames as $tableName) {
            // Get the column names for the current table
            $columns = Schema::getColumnListing($tableName);

            // Fetch data for each table
            $tableData = DB::table($tableName)->get();

            // Initialize an array to hold the table's data
            $tableArray = [];

            foreach ($tableData as $row) {
                $rowData = [];

                foreach ($columns as $column) {
                    $rowData[$column] = $row->{$column};
                }

                $tableArray[] = $rowData;
            }

            // Store the table data in the main array
            $tableDataArray[$tableName] = $tableArray;
        }
        // dd($tableDataArray);
        return view('Sistem.Database', [
            'title' => 'Sistem',
            'subtitle' => 'Database',
            'tableDataArray' => $tableDataArray,
            // 'Agama' => Agama::all(),
            // 'Aktifitas' => Aktifitas::all(),
            // 'Alamat' => Alamat::all(),
            // 'Bank' => Bank::all(),
            // 'BankSoal' => BankSoal::all(),
            // 'HasilJawabanEssay' => HasilJawabanEssay::all(),
            // 'HasilJawabanPG' => HasilJawabanPG::all(),
            // 'JenisJawaban' => JenisJawaban::all(),
            // 'LaporanJawaban' => LaporanJawaban::all(),
            // 'Level' => Level::all(),
            // 'LMS' => LMS::all(),
            // 'Peserta' => Peserta::all(),
            // 'PG' => PG::all(),
            // 'Skill' => Skill::all(),
            // 'SoalEssay' => SoalEssay::all(),
            // 'SoalPG' => SoalPG::all(),
            // 'Birokrasi' => Birokrasi::all(),
            // 'City' => City::all(),
            // 'Divisi' => Divisi::all(),
            // 'Dokumen' => Dokumen::all(),
            // 'Fitur' => Fitur::all(),
            // 'Fungsional' => Fungsional::all(),
            // 'Golongan' => Golongan::all(),
            // 'JabatanDivisi' => JabatanDivisi::all(),
            // 'JabatanFungsional' => JabatanFungsional::all(),
            // 'JabatanStruktural' => JabatanStruktural::all(),
            // 'JadwalKerja' => JadwalKerja::all(),
            // 'Karyawan' => Karyawan::all(),
            // 'Kehadiran' => Kehadiran::all(),
            // 'Kepegawaian' => Kepegawaian::all(),
            // 'LaporanLembur' => LaporanLembur::all(),
            // 'MacamKehadiran' => MacamKehadiran::all(),
            // 'Nikah' => Nikah::all(),
            // 'Nilai' => Nilai::all(),
            // // 'Notification' => ModelNotif::all(),
            // 'Pendidikan' => Pendidikan::all(),
            // 'Peringatan' => Peringatan::all(),
            // 'PHK' => PHK::all(),
            // 'PKWT' => PKWT::all(),
            // 'Province' => Province::all(),
            // 'Record' => Record::all(),
            // 'Rekening' => Rekening::all(),
            // 'RiwayatJabatan' => RiwayatJabatan::all(),
            // 'RiwayatKerja' => RiwayatKerja::all(),
            // 'RiwayatPendidikan' => RiwayatPendidikan::all(),
            // 'Role' => Role::all(),
            // 'Sertifikat' => Sertifikat::all(),
            // 'Status' => Status::all(),
            // 'StatusKaryawan' => StatusKaryawan::all(),
            // 'User' => User::all(),
        ]);
    }

    public function cache_clear($id_role)
    {
        $id_role = Crypt::decrypt($id_role);

        if ($id_role == 1 || $id_role == 3) {
            try {
                // dd($id_role);
                // Clear the configuration cache
                Artisan::call('config:cache');

                // You can also clear the application cache if needed
                Artisan::call('cache:clear');
                Artisan::call('view:clear');

                // Display a success message or log it
                // echo "success";
                // return back()->with('success', 'Data berhasil dihapus');
                return back()->with('success', 'Clearing Cache was successfull');
            } catch (\Exception $e) {
                // Handle any exceptions that may occur
                return back()->with('error', $e->getMessage());
                // echo "Error: " . $e->getMessage();
            }
        } else {
            return back()->with('error', 'Maaf anda tidak boleh melakukan clearing');
        }
    }

    public function HapusPengajuan(Request $req)
    {
        if ($req->id != null) {

            $data = JadwalKerja::whereIn('id', $req->id)->get();
            $id = [];
            foreach ($data as $item) {
                // $foto[] =  asset('assets/absen/' . $item->bukti);
                $id[] = $item->id;
                if (pathinfo($item->bukti, PATHINFO_EXTENSION) != null) {
                    if (File::exists(public_path('assets/absen/' . $item->bukti)))
                        File::delete(public_path('assets/absen/' . $item->bukti));
                };
                JadwalKerja::find($item->id)->delete();
            }
            return back()->with('success', 'Pengajuan telah berhasil dihapus');
        } else {
            return back()->with('error', 'Tidak ada ID yang dipilih');
        }
        // dd($id);
    }

    public function GantiPengajuan(Request $req, $id_jaker)
    {
        $id_jaker = Crypt::decrypt($id_jaker);
        JadwalKerja::find($id_jaker)
            ->update([
                'kode_ket' => $req->kode_ket,
                'macam_hadir' => $req->macam_hadir,
                'mulai' => $req->mulai . ' ' . $req->mulai_jam,
                'selesai' => $req->selesai . ' ' . $req->selesai_jam,
            ]);
        // dd($id_jaker, $req);
        return back()->with('success', 'ID #' . $id_jaker . ' berhasil diubah');
    }

    public function getAlat()
    {
        return Alat::all();
    }

    public function getClientIp(Request $request)
    {
        // Retrieve the client's IP address
        $ipAddress = $request->ip();


        return response()->json(['ip' => $ipAddress]);
    }
    /**
     * Show the form for creating a new resource.
     */

    private function getFilesByExtensions($model, $column, $extensions)
    {
        return $model::where(function ($query) use ($column, $extensions) {
            foreach ($extensions as $ext) {
                $query->orWhere($column, 'like', "%.$ext");
            }
        })
            ->setEagerLoads([])->select('id', $column, 'created_at')->get();
    }

    private function getFileSize($file, $parentPath = '/assets/')
    {
        if (!$file) return 0;

        $filePath = public_path($parentPath . $file);

        if (!file_exists($filePath)) return 0;
        return filesize($filePath);
    }
}
