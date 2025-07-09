<?php

namespace App\Http\Controllers;

use App\Models\Agama;
use App\Models\Alamat;
use App\Models\Bank;
use App\Models\City;
use App\Models\Divisi;
use App\Models\Dokumen;
use App\Models\Fungsional;
use App\Models\Golongan;
use App\Models\JabatanFungsional;
use App\Models\JabatanStruktural;
use App\Models\JadwalKerja;
use App\Models\JenisData;
use App\Models\Karyawan;
use App\Models\Kepegawaian;
use App\Models\Nikah;
use App\Models\Nilai;
use App\Models\Pendidikan;
use App\Models\Peringatan;
use App\Models\PKWT;
use App\Models\Province;
use App\Models\Rekening;
use App\Models\RiwayatJabatan;
use App\Models\RiwayatKerja;
use App\Models\RiwayatPendidikan;
use App\Models\Role;
use App\Models\Sertifikat;
use App\Models\StatusKaryawan;
use App\Models\User;
use App\Notifications\GeneralNotif;
use App\Notifications\PengajuanIzinNotif;
use Barryvdh\DomPDF\Facade\Pdf;
// use Barryvdh\DomPDF\Facade as PDF;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class KaryawanController extends Controller
{

    public function index()
    {

        // dd($page);
        return Inertia::render('Kekaryawanan/index', [
            'title' => 'Kekaryawanan',
            'subtitle' => 'List Karyawan',
            'karyawans' => Karyawan::whereNot('id', 1)
                ->with([
                    'dokumen',
                    'akun' => with(['face']),
                    'pegawai' => with(['struktur', 'fungsi', 'golongan', 'kerja', 'kontrak', 'riw_jabs', 'divisi']),
                    'kerja',
                    'kerjaan',
                    'ingats',
                    'absens',
                ])->get()

            // 'karyawans' => Karyawan::all()
            // variable karyawans dideklarasikan dalam model livewire
            // 'peringatans' => Peringatan::whereDoesntHave('diproses')->get(),
            // 'peringatans' => Peringatan::all(),
        ]);
    }
    public function ListKaryawan()
    {

        // dd($page);
        return Inertia::render('Kekaryawanan/index', [
            'title' => 'Kekaryawanan',
            'subtitle' => 'List Karyawan',
            'karyawans' => Karyawan::whereNot('id', 1)
                ->with([
                    'dokumen',
                    'akun' => with(['face']),
                    'pegawai' => with(['kerja', 'kontrak', 'riw_jabs', 'divisi']),
                    'ingats',
                ])->get(),
            'agama' => Agama::all(),
            'nikah' => Nikah::all(),
            'provinces' => Province::all(),
            'cities' => City::all(),
            // variable karyawans dideklarasikan dalam model livewire
            // 'peringatans' => Peringatan::whereDoesntHave('diproses')->get(),
            // 'peringatans' => Peringatan::all(),
        ]);
    }

    public function Karyawan($id_kar)
    {
        $id_kar = Crypt::decrypt($id_kar);
        // $id_kar = Crypt::decrypt("eyJpdiI6InBRVEtMVld4ei8raVF4ZW1CaytZMWc9PSIsInZhbHVlIjoicVBYWnNWdTJHeTVqUXBxYi9keU9oUT09IiwibWFjIjoiSjdRa0J6ZkNxQU45c3JheTZaRFJtYnZuVys1WlhBWGRRdWJWbTFQOGVRTT0ifQ==");
        // return $id_kar;
        if ($id_kar != auth()->user()->id_karyawan) {
            if (auth()->user()->kode_role != 1 && auth()->user()->kode_role != 2 && auth()->user()->kode_role != 5) {
                RecordController::RecordAct(auth()->user()->id, 6);
                return redirect('/')->with('error', 'Anda telah mencoba mengakses akun lain. Tindakan Anda telah tercatat dalam sistem!');
            }
        }
        // $pegawai = Kepegawaian::where('id_karyawan', $id_kar)->first();

        // return view('General.Profil.index', [
        return Inertia::render('Profile/index', [
            'title' => 'Profil',
            'subtitle' => '',
            'org' => Karyawan::with([
                'dokumen',
                'alamat' => with(['kota', 'provinsi']),
                'akun',
                'face',
                'pegawai' => with(['struktur', 'fungsi', 'golongan', 'kerja', 'kontrak', 'riw_jabs', 'divisi']),
                'agama',
                'nikah',
                'sekolah' => with(['tingkat']),
                'kerja',
                'kerjaan',
                'kontrak',
                'ingats',
                'acts' => with(['act']),
                'sertifs',
                'absens',
                'rek',
            ])->find($id_kar),
            'agama' => Agama::all(),
            'nikah' => Nikah::all(),
            'provinces' => Province::all(),
            'cities' => City::all(),
            'pendidikan' => Pendidikan::all(),
            'status_kerja' => StatusKaryawan::all(),
            'golongan' => Golongan::all(),
            'struktural' => JabatanStruktural::all(),
            'fungsional' => JabatanFungsional::all(),
            'fungsi' => Fungsional::all(),
            'peringatans' => Nilai::all(),
            'banks' => Bank::all(),
            'divisis' => Divisi::all(),
            'jenis_data' => JenisData::all(),
        ]);
    }

    public function change(Request $req)
    {
        $rules = [
            'id' => 'required',
            'key' => 'required',
        ];

        if ($req->filled('key') && $req->key) {
            $rules[$req->key] = 'required'; // Add dynamic validation rule safely
        }

        $req->validate($rules);
        $id = Crypt::decrypt($req->id);

        Karyawan::find($id)
            ->update([
                $req->key => $req[$req->key]
            ]);

        return response()->json(
            $this->getData($req->key, $req[$req->key], null, $id),
        );
    }

    public function Tambah($step, $id_kar)
    {
        $step = Crypt::decrypt($step);
        $id_kar = Crypt::decrypt($id_kar);
        switch ($step) {
            case (1):
                $page = '1';
                break;
            case (2):
                $page = '2';
                break;
            case (3):
                $page = '3';
                break;
            case (4):
                $page = '4';
                break;
            case (5):
                $page = '5';
                break;
            case (6):
                $page = '6';
                break;
            case (7):
                $page = '7';
                break;

            default:
                # code...
                break;
        }
        return view('HC.Karyawan.Form.' . $page, [
            'title' => 'Tambah Karyawan',
            'subtitle' => '',
            'karyawan' => Karyawan::find($id_kar),
            'alamat' => Alamat::where('id_karyawan', $id_kar)->first(),
            'dokumen' => Dokumen::where('id_karyawan', $id_kar)->first(),
            'riw_pend' => RiwayatPendidikan::where('id_karyawan', $id_kar)->first(),
            'riw_kerja' => RiwayatKerja::where('id_karyawan', $id_kar)->get(),
            'user' => User::where('id_karyawan', $id_kar)->first(),
            'pegawai' => Kepegawaian::where('id_karyawan', $id_kar)->first(),
            'sertifs' => Sertifikat::where('id_karyawan', $id_kar)->get(),
            'reks' => Rekening::where('id_karyawan', $id_kar)->first(),
            'step' => $step,
            'agama' => Agama::all(),
            'nikah' => Nikah::all(),
            'provinces' => Province::all(),
            'cities' => City::all(),
            'pendidikan' => Pendidikan::all(),
            'status_kerja' => StatusKaryawan::all(),
            'struktural' => JabatanStruktural::all(),
            'golongan' => Golongan::all(),
            'roles' => Role::all(),
        ]);
        // }
    }

    public function add(Request $req)
    {
        $req->validate(['step' => 'required|numeric']);
        $step = $req->step;
        // dd($id_user);
        switch ($step) {
            case '1':
                $valid = $req->validate([
                    'nama' => 'required|string',
                    'tempat_lahir' => 'required|string',
                    'tanggal_lahir' => 'required|date',
                    'no_hp' => 'required|numeric',
                    'jenis_kelamin' => 'required|string',
                    'kode_agama' => 'required|numeric',
                    'kode_nikah' => 'required|numeric',
                    'anak' => 'nullable|numeric|min:0',
                ]);

                $cek = Karyawan::where([
                    'nama' => $valid['nama'],
                    'tempat_lahir' => $valid['tempat_lahir'],
                    'tanggal_lahir' => $valid['tanggal_lahir'],
                ])->first();
                if ($cek) {
                    return response()->json(['message' => 'Karyawan sudah pernah ditambahkan'], 400);
                }

                // $new = Karyawan::create(
                //     [
                //         'nama' => $valid['nama'],
                //         'tempat_lahir' => $valid['tempat_lahir'],
                //         'tanggal_lahir' => $valid['tanggal_lahir'],
                //         'no_hp' => $valid['no_hp'],
                //         'jenis_kelamin' => $valid['jenis_kelamin'],
                //         'kode_agama' => $valid['kode_agama'],
                //         'kode_nikah' => $valid['kode_nikah'],
                //         'anak' => $valid['anak'],
                //     ],
                // );

                // RecordController::RecordAct($karyawan->id, 1);
                // dd($data);
                try {
                    $new = Karyawan::create($valid);
                    return response()->json($new);
                } catch (\Exception $e) {
                    return response()->json(['message' => 'Gagal menambahkan karyawan', 'error' => $e->getMessage()], 500);
                }
                break;

                // case '2':
                //     $valid = $req->validate([
                //         'province_id' => 'required|numeric',
                //         'city_id' => 'required|numeric',
                //         'kode_pos' => 'required|numeric',
                //         'detail' => 'required',
                //         'nama_dkt' => 'required',
                //         'no_hp_dkt' => 'required',
                //     ]);
                //     $valid['id_karyawan'] = $id_user;

                //     // dd($valid);
                //     Alamat::updateOrCreate(
                //         ['id_karyawan' => $valid['id_karyawan']],
                //         [
                //             'province_id' => $valid['province_id'],
                //             'city_id' => $valid['city_id'],
                //             'kode_pos' => $valid['kode_pos'],
                //             'detail' => $valid['detail'],
                //             'nama_dkt' => $valid['nama_dkt'],
                //             'no_hp_dkt' => $valid['no_hp_dkt'],
                //         ]
                //     );
                //     return redirect('/Karyawan/Tambah/' . Crypt::encrypt('3') . '/' . Crypt::encrypt($valid['id_karyawan']));

                //     break;

                // case '3':
                //     if ($user->dokumen != null) {
                //         if ($user->dokumen->foto != null) {
                //             $valid = $req->validate([
                //                 'foto' => 'required' . $req,
                //                 'nik' => 'required|numeric',
                //                 'file_ktp' => 'image|file',
                //                 'npwp' => 'numeric|nullable',
                //                 'file_npwp' => 'image|file',
                //                 'bpjs' => 'numeric|nullable',
                //                 'file_bpjs' => 'image|file',
                //             ]);
                //         }
                //     } else {
                //         $valid = $req->validate([
                //             'foto' => 'required',
                //             'nik' => 'required|numeric',
                //             'file_ktp' => 'image|file',
                //             'npwp' => 'numeric|nullable',
                //             'file_npwp' => 'image|file',
                //             'bpjs' => 'numeric|nullable',
                //             'file_bpjs' => 'image|file',
                //         ]);
                //     }
                //     $valid['id_karyawan'] = $id_user;

                //     $data = Dokumen::where('id_karyawan', $id_user)->first();

                //     // dd($req->hasFile('foto'));
                //     if ($req->hasFile('foto')) {
                //         $name_foto_profil = uniqid('foto_profil_') . '.' . $valid['foto']->getClientOriginalExtension();
                //     }
                //     if (req('file_ktp')) {
                //         $name_file_ktp = uniqid('file_ktp_') . '.' . $valid['file_ktp']->getClientOriginalExtension();
                //     }
                //     if (req('file_npwp')) {
                //         $name_file_npwp = uniqid('file_npwp_') . '.' . $valid['file_npwp']->getClientOriginalExtension();
                //     }
                //     if (req('file_bpjs')) {
                //         $name_file_bpjs = uniqid('file_bpjs_') . '.' . $valid['file_bpjs']->getClientOriginalExtension();
                //     }

                //     if ($req->hasFile('foto') && $data == null) {
                //         $req->file('foto')->move(public_path('assets/foto_profil'), $name_foto_profil);
                //         $valid['foto'] = $name_foto_profil;
                //     } elseif ($req->hasFile('foto') && $data != null) {
                //         $req->file('foto')->move(public_path('assets/foto_profil'), $name_foto_profil);
                //         $valid['foto'] = $name_foto_profil;
                //     } elseif (!$req->hasFile('foto') && $data != null) {
                //         $valid['foto'] = $data['foto'];
                //     }

                //     if (req('file_ktp') && $data == null) {
                //         $req->file('file_ktp')->move(public_path('assets/file_ktp'), $name_file_ktp);
                //         $valid['file_ktp'] = $name_file_ktp;
                //     } elseif (req('file_ktp') && $data != null) {
                //         $req->file('file_ktp')->move(public_path('assets/file_ktp'), $name_file_ktp);
                //         $valid['file_ktp'] = $name_file_ktp;
                //     } elseif (!req('file_ktp') && $data != null) {
                //         $valid['file_ktp'] = $data['file_ktp'];
                //     }

                //     if (req('file_npwp') && $data == null) {
                //         $req->file('file_npwp')->move(public_path('assets/file_npwp'), $name_file_npwp);
                //         $valid['file_npwp'] = $name_file_npwp;
                //     } elseif (req('file_npwp') && $data != null) {
                //         $req->file('file_npwp')->move(public_path('assets/file_npwp'), $name_file_npwp);
                //         $valid['file_npwp'] = $name_file_npwp;
                //     } elseif (!req('file_npwp') && $data != null) {
                //         $valid['file_npwp'] = $data['file_npwp'];
                //     } elseif (!req('file_npwp')) {
                //         $valid['file_npwp'] = null;
                //     }

                //     if (req('file_bpjs') && $data == null) {
                //         $req->file('file_bpjs')->move(public_path('assets/file_bpjs'), $name_file_bpjs);
                //         $valid['file_bpjs'] = $name_file_bpjs;
                //     } elseif (req('file_bpjs') && $data != null) {
                //         $req->file('file_bpjs')->move(public_path('assets/file_bpjs'), $name_file_bpjs);
                //         $valid['file_bpjs'] = $name_file_bpjs;
                //     } elseif (!req('file_bpjs') && $data != null) {
                //         $valid['file_bpjs'] = $data['file_bpjs'];
                //     } elseif (!req('file_bpjs')) {
                //         $valid['file_bpjs'] = null;
                //     }
                //     // dd($valid, $data);
                //     Dokumen::updateOrCreate(
                //         ['id_karyawan' => $valid['id_karyawan']],
                //         [
                //             'foto' => $valid['foto'],
                //             'waktu_foto' => now(),
                //             'nik' => $valid['nik'],
                //             'file_ktp' => $valid['file_ktp'],
                //             'npwp' => $valid['npwp'],
                //             'file_npwp' => $valid['file_npwp'],
                //             'bpjs' => $valid['bpjs'],
                //             'file_bpjs' => $valid['file_bpjs'],
                //         ]
                //     );
                //     return redirect('/Karyawan/Tambah/' . Crypt::encrypt('4') . '/' . Crypt::encrypt($valid['id_karyawan']));
                //     break;
                // case '4':
                //     // $data = RiwayatPendidikan::where('id_karyawan', $id_user)->first();

                //     // dd($req);
                //     RiwayatPendidikan::updateOrCreate(
                //         ['id_karyawan' => $id_user],
                //         [
                //             'pendidikan' => $req['pendidikan'],
                //             'nama_institusi' => $req['nama_institusi'],
                //             'prodi' => $req['prodi'],
                //             'nilai' => $req['nilai'],
                //             'lulus' => $req['lulus'],
                //         ]
                //     );

                //     $kerja = [];
                //     $error = 1;
                //     for ($i = 0; $i < count($req->nama_instansi); $i++) {
                //         $noId = 0;
                //         if (!empty($req->id[$i]) && !$req->id[$i] == 0) {
                //             $noId = $req->id[$i];
                //         }
                //         $kerja[] = [
                //             'id' => $noId,
                //             'id_karyawan' => $id_user,
                //             'nama_instansi' => $req->nama_instansi[$i],
                //             'sebagai' => $req->sebagai[$i],
                //             'selesai' => $req->selesai[$i],
                //         ];
                //     }
                //     if (count($kerja) > 0) {
                //         $error = '';
                //     }
                //     if ($kerja[0]['nama_instansi'] != null) {
                //         RiwayatKerja::upsert($kerja, ['id', 'id_karyawan', 'nama_instansi', 'sebagai', 'selesai']);
                //     }
                //     return redirect('/Karyawan/Tambah/' . Crypt::encrypt('5') . '/' . Crypt::encrypt($id_user));
                //     break;

                // case '5':

                //     $karyawan = Dokumen::where('id_karyawan', $id_user)->first();
                //     // dd($karyawan->nik);
                //     $valid = $req->validate([
                //         'username' => 'required|unique:users,id_karyawan,' . $id_user,
                //         'email' => 'sometimes|required|email|unique:users,id_karyawan,' . $id_user,
                //     ]);
                //     $data = [
                //         'id_karyawan' => $id_user,
                //         'username' => $valid['username'],
                //         'email' => $valid['email'],
                //         'password' => bcrypt($req->password),
                //         'kode_role' => $req->kode_role,
                //     ];
                //     if ($req->password == null) {
                //         $data['password'] = bcrypt($karyawan->nik);
                //     }
                //     if ($req->kode_role == null) {
                //         $data['kode_role'] = 7;
                //     }

                //     User::updateOrCreate(
                //         [
                //             'id_karyawan' => $data['id_karyawan'],
                //         ],
                //         [
                //             'username' => $data['username'],
                //             'email' => $data['email'],
                //             'password' => $data['password'],
                //             'kode_role' => $data['kode_role'],
                //         ]
                //     );
                //     return redirect('/Karyawan/Tambah/' . Crypt::encrypt('6') . '/' . Crypt::encrypt($id_user));
                //     break;

                // case '6':
                //     if ($req['kode_status_kerja'] == 1) {
                //         $valid = $req->validate([
                //             'masuk' => 'required|date',
                //             'kode_status_kerja' => 'required|numeric',
                //             'kode_golongan' => 'numeric',
                //             'kode_struktural' => 'required|numeric',
                //             'fungsional' => 'required|numeric',
                //             // 'kode_fungsional' => 'numeric',
                //             'kode_fungsional' => 'required',
                //         ]);
                //         $valid['id_karyawan'] = $id_user;

                //         // dd($valid);
                //         Kepegawaian::updateOrCreate(
                //             ['id_karyawan' => $valid['id_karyawan']],
                //             [
                //                 'masuk' => $valid['masuk'],
                //                 'kode_status_kerja' => $valid['kode_status_kerja'],
                //                 'kode_golongan' => $valid['kode_golongan'],
                //                 'kode_struktural' => $valid['kode_struktural'],
                //                 'fungsional' => $valid['fungsional'],
                //                 'kode_fungsional' => $valid['kode_fungsional'],
                //             ]
                //         );
                //     } elseif ($req['kode_status_kerja'] == 2) {
                //         $valid = $req->validate([
                //             'mulai' => 'required|date',
                //             'selesai' => 'required|date',
                //             'kode_status_kerja' => 'required|numeric',
                //             'kode_golongan' => 'numeric',
                //             'kode_struktural' => 'required|numeric',
                //             'fungsional' => 'required|numeric',
                //             // 'kode_fungsional' => 'numeric',
                //             'kode_fungsional' => 'required',
                //         ]);
                //         $valid['id_karyawan'] = $id_user;

                //         // dd($valid);
                //         Kepegawaian::updateOrCreate(
                //             ['id_karyawan' => $valid['id_karyawan']],
                //             [
                //                 'masuk' => $valid['mulai'],
                //                 'kode_status_kerja' => $valid['kode_status_kerja'],
                //                 'kode_golongan' => $valid['kode_golongan'],
                //                 'kode_struktural' => $valid['kode_struktural'],
                //                 'fungsional' => $valid['fungsional'],
                //                 'kode_fungsional' => $valid['kode_fungsional'],
                //             ]
                //         );
                //         PKWT::create([
                //             'id_karyawan' => $valid['id_karyawan'],
                //             'mulai' => $valid['mulai'],
                //             'selesai' => $valid['selesai'],
                //             'kode_golongan' => $valid['kode_golongan'],
                //             'kode_struktural' => $valid['kode_struktural'],
                //             'fungsional' => $valid['fungsional'],
                //             'kode_fungsional' => $valid['kode_fungsional'],
                //         ]);
                //     }

                //     RiwayatJabatan::updateOrCreate(
                //         [
                //             'id_karyawan' => $valid['id_karyawan'],
                //             'kode_golongan' => $valid['kode_golongan'],
                //         ],
                //         [
                //             'tanggal_update' => now(),
                //             'kode_struktural' => $valid['kode_struktural'],
                //             'fungsional' => $valid['fungsional'],
                //             'kode_fungsional' => $valid['kode_fungsional'],
                //         ]
                //     );
                //     // return redirect('/Karyawan')->with('success', 'Data Karyawan berhasil ditambahkan');
                //     return redirect('/Karyawan/Tambah/' . Crypt::encrypt('7') . '/' . Crypt::encrypt($id_user));

                //     break;

                // case '7':
                //     $sertif = [];
                //     $error = 1;
                //     if ($req->id[0] != null) {
                //         for ($i = 0; $i < count($req->no_sertif); $i++) {
                //             $noId = 0;
                //             if (!empty($req->id[$i]) && !$req->id[$i] == 0) {
                //                 $noId = $req->id[$i];
                //             }
                //             $sertif[] = [
                //                 'id' => $noId,
                //                 'id_karyawan' => $id_user,
                //                 'no_sertif' => $req->no_sertif[$i],
                //                 'tanggal_berlaku' => $req->tanggal_berlaku[$i],
                //                 'bukti' => $req->bukti[$i],
                //             ];

                //             $filename = uniqid('sertif_') . '.' . $req->bukti[$i]->getClientOriginalExtension();
                //             if ($req->hasFile('bukti')) {
                //                 $sertif[$i]['bukti']->move(public_path('assets/file_sertif/'), $filename);
                //                 $sertif[$i]['bukti'] = $filename;
                //             }
                //         }
                //         if (count($sertif) > 0) {
                //             $error = '';
                //         }
                //         if ($sertif[0]['no_sertif'] != null) {
                //             Sertifikat::upsert($sertif, ['id', 'id_karyawan', 'no_sertif', 'tanggal_berlaku', 'bukti']);
                //         }
                //         # code...
                //     }

                //     return redirect()->route('Kar.index', [Crypt::encrypt('index')])->with('success', 'Data Karyawan berhasil ditambahkan');
                //     // return redirect('/Karyawan')->with('success', 'Data Karyawan berhasil ditambahkan');

                //     break;
                // case '8':
                $valid = $req->validate([
                    'mulai' => 'required|date',
                    'selesai' => 'required|date',
                    'kode_golongan' => 'required|numeric',
                    'kode_struktural' => 'required|numeric',
                    'fungsional' => 'numeric',
                    'kode_fungsional' => 'numeric',
                ]);
                $valid['id_karyawan'] = $id_user;

                // dd($valid);
                PKWT::create([
                    'id_karyawan' => $valid['id_karyawan'],
                    'mulai' => $valid['mulai'],
                    'selesai' => $valid['selesai'],
                    'kode_golongan' => $valid['kode_golongan'],
                    'kode_struktural' => $valid['kode_struktural'],
                    'fungsional' => $valid['fungsional'],
                    'kode_fungsional' => $valid['kode_fungsional'],
                ]);
                RecordController::RecordAct($valid['id_karyawan'], 19);
                return back()->with('success', 'Kontrak Karyawan berhasil ditambahkan');
                break;
            default:
                # code...
                break;
        }
    }

    public function getCities($id)
    {
        $cities = City::where('province_id', $id)
            ->pluck('title', 'city_id');
        return json_encode($cities);
    }

    public function getFungsional()
    {
        $fungsional = Fungsional::all()
            ->pluck('title', 'id');
        return json_encode($fungsional);
    }

    public function getJabatanFungsional($struktur, $fungsi)
    {
        // $jabatan = JabatanFungsional::where('id_struktural', $struktur)
        //     ->where('id_fungsional', $fungsi)
        $jabatan = JabatanFungsional::where('id_fungsional', $fungsi)
            ->pluck('title', 'id');
        // return redirect()->route('Kar.index', [Crypt::encrypt('index')]);
        return json_encode($jabatan);
    }

    public function getGolongan($struktur)
    {
        $gol = Golongan::where('id_struktural', $struktur)
            ->pluck('title', 'id');
        return json_encode($gol);
    }


    public function edit(Request $request, $step, $id_kar)
    {
        $step = Crypt::decrypt($step);
        $id_user = Crypt::decrypt($id_kar);
        // dd($id_user);
        switch ($step) {
            case '1':
                $valid_bio = $request->validate([
                    'nama' => 'required',
                    'tempat_lahir' => 'required',
                    'tanggal_lahir' => 'required',
                    'no_hp' => 'required|numeric',
                    'jenis_kelamin' => 'required',
                    'agama' => 'required',
                    'kode_nikah' => 'required',
                    'anak' => ''
                ]);

                $data_bio = [
                    'nama' => $valid_bio['nama'],
                    'tempat_lahir' => $valid_bio['tempat_lahir'],
                    'tanggal_lahir' => $valid_bio['tanggal_lahir'],
                    'no_hp' => $valid_bio['no_hp'],
                    'jenis_kelamin' => $valid_bio['jenis_kelamin'],
                    'agama' => $valid_bio['agama'],
                    'kode_nikah' => $valid_bio['kode_nikah'],
                    'anak' => $valid_bio['anak'],
                ];

                $valid_alamat = $request->validate([
                    'province_id' => 'required|numeric',
                    'city_id' => 'required|numeric',
                    'kode_pos' => 'required|numeric',
                    'detail' => 'required',
                    'nama_dkt' => 'required',
                    'no_hp_dkt' => 'required',
                ]);
                $data_alamat = [
                    'province_id' => $valid_alamat['province_id'],
                    'city_id' => $valid_alamat['city_id'],
                    'kode_pos' => $valid_alamat['kode_pos'],
                    'detail' => $valid_alamat['detail'],
                    'nama_dkt' => $valid_alamat['nama_dkt'],
                    'no_hp_dkt' => $valid_alamat['no_hp_dkt'],
                ];

                // dd($valid);
                Alamat::where('id_karyawan', $id_user)->first()->update($data_alamat);
                Karyawan::find($id_user)->update($data_bio);
                RecordController::RecordAct($id_user, 6);

                // dd($data);
                return back()->with('success', "Data berhasil diupdate");
                break;

            case '2':
                $valid = $request->validate([
                    'masuk' => 'required|date',
                    'kode_status_kerja' => 'required|numeric',
                    'kode_golongan' => 'required|numeric',
                    'kode_struktural' => 'required|numeric',
                    'fungsional' => 'required|numeric',
                    'kode_fungsional' => 'required|numeric',
                ]);

                Kepegawaian::where('id_karyawan', $id_user)->update(
                    [
                        'masuk' => $valid['masuk'],
                        'kode_status_kerja' => $valid['kode_status_kerja'],
                        'kode_golongan' => $valid['kode_golongan'],
                        'kode_struktural' => $valid['kode_struktural'],
                        'fungsional' => $valid['fungsional'],
                        'kode_fungsional' => $valid['kode_fungsional'],
                    ]
                );

                RiwayatJabatan::updateOrCreate(
                    [
                        'id_karyawan' => $id_user,
                        'kode_golongan' => $valid['kode_golongan'],
                    ],
                    [
                        'tanggal_update' => now(),
                        'kode_struktural' => $valid['kode_struktural'],
                        'fungsional' => $valid['fungsional'],
                        'kode_fungsional' => $valid['kode_fungsional'],
                    ]
                );
                RecordController::RecordAct($id_user, 8);

                $user = User::find($id_user);

                $notif = [
                    'kode_aktifitas' => 10,
                    'id_karyawan' => $id_user,
                    'pesan_notif' => 'Data karyawan anda telah diupdate, silakan cek di halaman Profil.'
                ];
                // Notification::send($user, new GeneralNotif($notif));
                return back()->with('success', "Data berhasil diupdate");
                break;
            case '3':
                // $data = RiwayatPendidikan::where('id_karyawan', $id_user)->first();

                // dd($request);
                RiwayatPendidikan::updateOrCreate(
                    ['id_karyawan' => $id_user],
                    [
                        'pendidikan' => $request['pendidikan'],
                        'nama_institusi' => $request['nama_institusi'],
                        'prodi' => $request['prodi'],
                        'nilai' => $request['nilai'],
                        'lulus' => $request['lulus'],
                    ]
                );
                RecordController::RecordAct($id_user, 9);


                $kerja = [];
                $error = 1;
                for ($i = 0; $i < count($request->nama_instansi); $i++) {
                    $noId = 0;
                    if (!empty($request->id[$i]) && !$request->id[$i] == 0) {
                        $noId = $request->id[$i];
                    }
                    $kerja[] = [
                        'id' => $noId,
                        'id_karyawan' => $id_user,
                        'nama_instansi' => $request->nama_instansi[$i],
                        'sebagai' => $request->sebagai[$i],
                        'selesai' => $request->selesai[$i],
                    ];
                }
                if (count($kerja) > 0) {
                    $error = '';
                }
                if ($kerja[0]['nama_instansi'] != null) {
                    RiwayatKerja::upsert($kerja, ['id', 'id_karyawan', 'nama_instansi', 'sebagai', 'selesai']);
                    RecordController::RecordAct($id_user, 10);
                }

                return back()->with('success', "Data berhasil diupdate");

                break;
            case '4':

                $data = [
                    'id_karyawan' => $id_user,
                    'username' => $request->username,
                    'email' => $request->email,
                ];
                $cek_password = User::where('id_karyawan', $id_user)->first();

                // dd(Hash::check($request->password_lama, $cek_password->password));
                // dd($request->password);

                if ($request->password == null) {
                    // $data['password'] = bcrypt('aryajaya123');
                    $data['password'] = $cek_password->password;
                } elseif (request('password')) {
                    if (Hash::check($request->password_lama, $cek_password->password)) {
                        $data['password'] = bcrypt($request->password);
                        RecordController::RecordAct($id_user, 4);
                    } else {
                        return back()->with('error', 'Password lama Anda salah, password gagal diganti');
                    }
                }

                User::updateOrCreate(
                    ['id_karyawan' => $data['id_karyawan']],
                    [
                        'username' => $data['username'],
                        'email' => $data['email'],
                        'password' => $data['password'],
                    ]
                );
                RecordController::RecordAct($id_user, 11);
                return back()->with('success', "Data berhasil diupdate");
                break;

            case '5':
                $valid = $request->validate([
                    'foto' => 'required',
                    'nik' => 'required|numeric',
                    'file_ktp' => 'image|file',
                    'npwp' => 'numeric|nullable',
                    'file_npwp' => 'image|file',
                    'bpjs' => 'numeric|nullable',
                    'file_bpjs' => 'image|file',
                ]);
                $valid['id_karyawan'] = $id_user;

                $data = Dokumen::where('id_karyawan', $id_user)->first();

                if ($request->hasFile('foto')) {
                    $name_foto_profil = uniqid('foto_profil') . '.' . $valid['foto']->getClientOriginalExtension();
                }
                if (request('file_ktp')) {
                    $name_file_ktp = uniqid('file_ktp') . '.' . $valid['file_ktp']->getClientOriginalExtension();
                }
                if (request('file_npwp')) {
                    $name_file_npwp = uniqid('file_npwp') . '.' . $valid['file_npwp']->getClientOriginalExtension();
                }
                if (request('file_bpjs')) {
                    $name_file_bpjs = uniqid('file_bpjs') . '.' . $valid['file_bpjs']->getClientOriginalExtension();
                }

                // dd($valid);
                if ($request->hasFile('foto') && $data == null) {
                    $request->file('foto')->move(public_path('assets/foto_profil'), $name_foto_profil);
                    $valid['foto'] = $name_foto_profil;
                } elseif ($request->hasFile('foto') && $data != null) {
                    $request->file('foto')->move(public_path('assets/foto_profil'), $name_foto_profil);
                    $valid['foto'] = $name_foto_profil;
                } elseif (!$request->hasFile('foto') && $data != null && $request->foto) {
                    $valid['foto'] = $valid['foto'];
                } elseif (!$request->hasFile('foto') && $data == null) {
                    $valid['foto'] = $data['foto'];
                }

                if (request('file_ktp') && $data == null) {
                    $request->file('file_ktp')->move(public_path('assets/file_ktp'), $name_file_ktp);
                    $valid['file_ktp'] = $name_file_ktp;
                } elseif (request('file_ktp') && $data != null) {
                    $request->file('file_ktp')->move(public_path('assets/file_ktp'), $name_file_ktp);
                    $valid['file_ktp'] = $name_file_ktp;
                } elseif (!request('file_ktp') && $data != null) {
                    $valid['file_ktp'] = $data['file_ktp'];
                }

                if (request('file_npwp') && $data == null) {
                    $request->file('file_npwp')->move(public_path('assets/file_npwp'), $name_file_npwp);
                    $valid['file_npwp'] = $name_file_npwp;
                } elseif (request('file_npwp') && $data != null) {
                    $request->file('file_npwp')->move(public_path('assets/file_npwp'), $name_file_npwp);
                    $valid['file_npwp'] = $name_file_npwp;
                } elseif (!request('file_npwp') && $data != null) {
                    $valid['file_npwp'] = $data['file_npwp'];
                } elseif (!request('file_npwp')) {
                    $valid['file_npwp'] = null;
                }

                if (request('file_bpjs') && $data == null) {
                    $request->file('file_bpjs')->move(public_path('assets/file_bpjs'), $name_file_bpjs);
                    $valid['file_bpjs'] = $name_file_bpjs;
                } elseif (request('file_bpjs') && $data != null) {
                    $request->file('file_bpjs')->move(public_path('assets/file_bpjs'), $name_file_bpjs);
                    $valid['file_bpjs'] = $name_file_bpjs;
                } elseif (!request('file_bpjs') && $data != null) {
                    $valid['file_bpjs'] = $data['file_bpjs'];
                } elseif (!request('file_bpjs')) {
                    $valid['file_bpjs'] = null;
                }
                // dd($valid, $data);
                Dokumen::updateOrCreate(
                    ['id_karyawan' => $valid['id_karyawan']],
                    [
                        'foto' => $valid['foto'],
                        'waktu_foto' => now(),
                        'nik' => $valid['nik'],
                        'file_ktp' => $valid['file_ktp'],
                        'npwp' => $valid['npwp'],
                        'file_npwp' => $valid['file_npwp'],
                        'bpjs' => $valid['bpjs'],
                        'file_bpjs' => $valid['file_bpjs'],
                    ]
                );
                RecordController::RecordAct($id_user, 12);
                return back()->with('success', "Data berhasil diupdate");
                break;


            case '6':
                // dd($request->bukti);
                $sertif = [];
                $error = 1;
                for ($i = 0; $i < count($request->id); $i++) {
                    $noId = 0;
                    if (!empty($request->id[$i]) && !$request->id[$i] == 0) {
                        $noId = $request->id[$i];
                    }
                    $data = Sertifikat::find($request->id[$i]);

                    // dd($data['bukti']);
                    $sertif[] = [
                        'id' => $noId,
                        'id_karyawan' => $id_user,
                        'no_sertif' => $request->no_sertif[$i],
                        'tanggal_berlaku' => $request->tanggal_berlaku[$i],
                        'bukti' => '',
                        // 'bukti' => $request->bukti[$i],
                    ];
                    if (!empty($request->bukti[$i])) {
                        $name_file_sertif = Crypt::encrypt($id_user) . '-sertif.' . request('bukti')[$i]->getClientOriginalExtension();

                        if (request('bukti')[$i] && $data == null) {
                            $request->file('bukti')[$i]->move(public_path('assets/file_sertif'), $name_file_sertif);
                            $sertif[$i]['bukti'] = $name_file_sertif;
                        } elseif (request('bukti')[$i] && $data != null) {
                            $request->file('bukti')[$i]->move(public_path('assets/file_sertif'), $name_file_sertif);
                            $sertif[$i]['bukti'] = $name_file_sertif;
                        } elseif (!request('bukti')[$i] && $data != null) {
                            $sertif[$i]['bukti'] = $data['bukti'];
                        } elseif (!request('bukti')[$i]) {
                            $sertif[$i]['bukti'] = null;
                        }
                    } else {
                        $sertif[$i]['bukti'] = $data['bukti'];
                    }


                    // if ($request->hasFile('bukti')) {
                    //     $sertif[$i]['bukti']->move(public_path('assets/file_sertif/'), $name_file_sertif);
                    //     $sertif[$i]['bukti'] = $name_file_sertif;
                    // }
                }
                if (count($sertif) > 0) {
                    $error = '';
                }
                if ($sertif[0]['no_sertif'] != null) {
                    Sertifikat::upsert($sertif, ['id', 'id_karyawan', 'no_sertif', 'tanggal_berlaku', 'bukti']);
                    RecordController::RecordAct($id_user, 13);
                }
                return back()->with('success', "Data berhasil diupdate");
                break;
            case '7':
                $valid = $request->validate([
                    'kode_nilai' => 'required',
                    'detail' => 'required',
                ]);

                // dd($valid);
                Peringatan::updateOrCreate(
                    ['id_karyawan' => $id_user],
                    [
                        'detail' => $valid['detail'],
                        'kode_nilai' => $valid['kode_nilai'],
                    ]
                );
                RecordController::RecordAct($id_user, 20);

                return back()->with('success', "Data berhasil diupdate");
                break;
            default:
                # code...
                break;
        }
    }
    public function hapus($id_kar)
    {
        $id_kar = Crypt::decrypt($id_kar);
        Karyawan::find($id_kar)->delete();
        Alamat::where('id_karyawan', $id_kar)->delete();
        Dokumen::where('id_karyawan', $id_kar)->delete();
        RiwayatPendidikan::where('id_karyawan', $id_kar)->delete();
        RiwayatKerja::where('id_karyawan', $id_kar)->delete();
        User::where('id_karyawan', $id_kar)->delete();
        Kepegawaian::where('id_karyawan', $id_kar)->delete();
        Sertifikat::where('id_karyawan', $id_kar)->delete();
        RiwayatJabatan::where('id_karyawan', $id_kar)->delete();
        return back()->with('success', 'Data Karyawan berhasil dihapus');
    }

    public function KaryawanPDF($id_kar)
    {
        $id_kar = Crypt::decrypt($id_kar);

        $org = Karyawan::with([
            'dokumen',
            'alamat' => with(['kota', 'provinsi']),
            'akun',
            'pegawai' => with(['struktur', 'fungsi', 'golongan', 'kerja', 'kontrak', 'riw_jabs']),
            'agama',
            'nikah',
            'sekolah' => with(['tingkat']),
            'kerja',
            'kerjaan',
            'acts' => with(['act']),
            'sertifs',
            'absens',
        ])->find($id_kar);
        // $org = Karyawan::find($id_kar);

        view()->share('org', $org);
        $pdf = PDF::loadView('HC.Karyawan.PDF.index')->setPaper('a4', 'potrait');
        return $pdf->stream();

        // return $pdf->download($org->nama . '.pdf');

        // return view('HC.Karyawan.PDF.index', ['org' => $org]);
    }

    public static function TotalSisaCutiBaruSetahunKerja($id_kar)
    {
        $org = Karyawan::find($id_kar);
        $start = date_create($org->pegawai->masuk, timezone_open('Asia/Jakarta'));

        $tanggal_sekarang = date("Y-m-d");

        // Tanggal akhir tahun
        $tanggal_akhir_tahun = date("Y-12-31");
        // dd($start, $tanggal_akhir_tahun);

        // Menghitung selisih bulan
        $selisih_bulan = (int)date_diff($start, date_create($tanggal_akhir_tahun))->format('%m') + 1;
        return $selisih_bulan;
    }

    public function getKaryawan()
    {
        return Karyawan::whereNotIn('id', [1])
            ->with([
                'dokumen',
                'alamat' => with(['kota', 'provinsi']),
                'akun' => with(['role']),
                'pegawai' => with(['kerja', 'golongan', 'struktur', 'bagian', 'fungsi', 'kontrak', 'divisi']),
                'agama',
                'nikah',
                'sekolah' => with(['tingkat']),
                'kerja',
                'kerjaan',
                'sertifs',
                'rek' => with(['bank']),
            ])
            ->get();
    }
}
