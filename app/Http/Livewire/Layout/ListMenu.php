<?php

namespace App\Http\Livewire\Layout;

use App\Models\PeraturanPerusahaan;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Crypt;
use Livewire\Component;

class ListMenu extends Component
{
    public $try = 1;
    public $title, $subtitle;

    public
    function transformDatalistMenu(Collection $dataCollection)
    {
        return $dataCollection->map(function ($data) {
            return [
                'sub_id' => $data['id'],
                'subtitle' => $data['title'],
                'text' => $data['title'], // assuming you want the same value for `text`
                'route' => route('Peraturan.show', [Crypt::encrypt($data['id'])]),
            ];
        });
    }

    public function render()
    {
        $role = auth()->user() != null ? auth()->user()->kode_role : '';
        // dd($this->title, $this->subtitle);
        // dd(PeraturanPerusahaan::all());
        $menus = [
            [
                'id' => 1,
                'title' => 'Presensi',
                'icon' => 'fingerprint',
                'list' => [
                    [
                        'sub_id' => 1,
                        'route' => route('Kar.Presensi.face-rec', Crypt::encrypt(auth()->user()->id_karyawan)),
                        'subtitle' => 'faceRec',
                        'text' =>
                        auth()->user()->face_neutral != null && auth()->user()->face_happy != null
                            ? 'Presensi'
                            : 'Pendaftaran Face ID',
                    ],
                    [
                        'sub_id' => 2,
                        'route' => route('Kar.Presensi.Fingerprint.Home'),
                        'subtitle' => 'home',
                        'text' => 'Fingerprint',
                    ],
                    [
                        'sub_id' => 3,
                        'route' => route('Kar.Presensi.Fingerprint.Dashboard'),
                        'subtitle' => 'dashboard',
                        'text' => 'Kehadiran Hari ini',
                    ],
                ],
            ],
            [
                'id' => 3,
                'title' => 'Kekaryawanan',
                'icon' => 'users',
                'list' => [
                    [
                        'sub_id' => 1,
                        'route' => route('Kar.index', [Crypt::encrypt('index')]),
                        'subtitle' => 'index',
                        'text' => 'List Karyawan',
                    ],
                    [
                        'sub_id' => 2,
                        'route' => route('Kar.index', [Crypt::encrypt('peringatan')]),
                        'subtitle' => 'peringatan',
                        'text' => 'List Peringatan',
                    ],
                ],
            ],
            [
                'id' => 4,
                'title' => 'Jadwal Kerja',
                'icon' => 'calendar',
                'list' => [
                    [
                        'sub_id' => 1,
                        'route' => route('Jaker.index', [
                            'Kalender',
                            Crypt::encrypt(auth()->user()->id_karyawan),
                        ]),
                        'subtitle' => 'Kalender',
                        'text' => 'Kalender',
                    ],
                    [
                        'sub_id' => 2,
                        'route' => route('Jaker.Lembur', [Crypt::encrypt(auth()->user()->id_karyawan)]),
                        'subtitle' => 'Lembur',
                        'text' => 'Lembur',
                    ],
                    [
                        'sub_id' => 3,
                        'route' => route('Jaker.LaporanLembur', [Crypt::encrypt(auth()->user()->id_karyawan)]),
                        'subtitle' => 'Laporan Lembur',
                        'text' => 'Laporan Lembur',
                    ],
                    [
                        'sub_id' => 4,
                        'route' => route('Jaker.index', [
                            'Atur Jadwal Kerja',
                            Crypt::encrypt(auth()->user()->id_karyawan),
                        ]),
                        'subtitle' => 'Atur Jadwal Kerja',
                        'text' => 'Atur Jadwal Kerja',
                    ],
                ],
            ],
            [
                'id' => 5,
                'title' => 'Pengajuan',
                'icon' => 'file-contract',
                'list' => [
                    [
                        'sub_id' => 1,
                        'route' => route('Jaker.index', [
                            'Pengajuan',
                            Crypt::encrypt(auth()->user()->id_karyawan),
                        ]),
                        'subtitle' => 'index',
                        'text' => 'Semua',
                    ],
                    [
                        'sub_id' => 2,
                        'route' => route('Jaker.index', [
                            'Pribadi',
                            Crypt::encrypt(auth()->user()->id_karyawan),
                        ]),
                        'subtitle' => 'Pribadi',
                        'text' => 'Ajuan Pribadi',
                    ],
                ],
            ],
            [
                'id' => 6,
                'title' => 'Rekapitulasi',
                'icon' => 'file-lines',
                'list' => [
                    [
                        'sub_id' => 1,
                        'route' => route('Jaker.index', [
                            'Rekapitulasi',
                            Crypt::encrypt(auth()->user()->id_karyawan),
                        ]),
                        'subtitle' => 'Rekapitulasi',
                        'text' => 'Pengajuan',
                    ],
                    [
                        'sub_id' => 2,
                        'route' => route('Jaker.RekapitulasiPresensi', [
                            Crypt::encrypt(auth()->user()->id_karyawan),
                        ]),
                        'subtitle' => 'Rekapitulasi Presensi',
                        'text' => 'Presensi',
                    ],
                    [
                        'sub_id' => 3,
                        'route' => route('Data.RekapitulasiPerKaryawan'),
                        'subtitle' => 'index',
                        'text' => 'Per Karyawan',
                    ],
                    [
                        'sub_id' => 4,
                        'route' => route('Data.Rekapitulasi.Lembur'),
                        'subtitle' => 'Lembur',
                        'text' => 'Lembur',
                    ],
                    [
                        'sub_id' => 5,
                        'route' => route('Data.Rekapitulasi.LaporanLembur'),
                        'subtitle' => 'Laporan Lembur',
                        'text' => 'Laporan Lembur',
                    ],
                ],
            ],
            [
                'id' => 7,
                'title' => 'LMS',
                'icon' => 'file-signature',
                'list' => [
                    [
                        'sub_id' => 1,
                        'route' => '/LMS/' . Crypt::encrypt(auth()->user()->id_karyawan),
                        'subtitle' => 'LMS',
                        'text' => 'LMS',
                    ],
                ],
            ],
            [
                'id' => 8,
                'title' => 'FAQ',
                'icon' => 'circle-question',
                'list' => [
                    [
                        'sub_id' => 1,
                        'route' => route('FAQ.index'),
                        'subtitle' => 'Bantuan FAQ',
                        'text' => 'Panduan',
                    ],
                    // [
                    //     'sub_id' => 2,
                    //     'route' => route('FAQ.Lapor'),
                    //     'subtitle' => 'Laporan',
                    //     'text' => 'Lapor Error',
                    // ],
                ],
            ],
            [
                'id' => 9,
                'title' => 'Sistem',
                'icon' => 'gear',
                'list' => [
                    [
                        'sub_id' => 1,
                        'route' => route('System.index', Crypt::encrypt('Sistem')),
                        'subtitle' => 'Sistem',
                        'text' => 'System Page',
                    ],
                    [
                        'sub_id' => 2,
                        'route' => route('System.index', Crypt::encrypt('Record')),
                        'subtitle' => 'Record',
                        'text' => 'Aktifitas User',
                    ],
                    [
                        'sub_id' => 3,
                        'route' => route('System.index', Crypt::encrypt('Akses')),
                        'subtitle' => 'Akses',
                        'text' => 'Atur Akses',
                    ],
                    [
                        'sub_id' => 4,
                        'route' => route('System.index', Crypt::encrypt('Aktifitas')),
                        'subtitle' => 'Aktifitas',
                        'text' => 'Atur Aktifitas',
                    ],
                    [
                        'sub_id' => 5,
                        'route' => route('System.index', Crypt::encrypt('Kehadiran')),
                        'subtitle' => 'Kehadiran',
                        'text' => 'Atur Kehadiran',
                    ],
                    [
                        'sub_id' => 6,
                        'route' => route('System.index', Crypt::encrypt('Pilihan')),
                        'subtitle' => 'Pilihan',
                        'text' => 'Atur Pilihan',
                    ],
                    [
                        'sub_id' => 7,
                        'route' => route('System.index', Crypt::encrypt('Role')),
                        'subtitle' => 'Role',
                        'text' => 'Atur Role',
                    ],
                    [
                        'sub_id' => 7,
                        'route' => route('System.index', Crypt::encrypt('Status')),
                        'subtitle' => 'Status',
                        'text' => 'Atur Status',
                    ],
                    [
                        'sub_id' => 8,
                        'route' => route('System.index', Crypt::encrypt('Jabatan')),
                        'subtitle' => 'Jabatan',
                        'text' => 'Atur Jabatan',
                    ],
                    [
                        'sub_id' => 9,
                        'route' => route('System.Database'),
                        'subtitle' => 'Database',
                        'text' => 'Database',
                    ],
                    [
                        'sub_id' => 10,
                        'route' => route('System.index', Crypt::encrypt('Pengajuan')),
                        'subtitle' => 'Pengajuan',
                        'text' => 'Manage Pengajuan',
                    ],
                    [
                        'sub_id' => 11,
                        'route' => route('System.index', Crypt::encrypt('Peraturan')),
                        'subtitle' => 'Peraturan',
                        'text' => 'Manage Peraturan Perusahaan',
                    ],
                    [
                        'sub_id' => 12,
                        'route' => route('System.index', Crypt::encrypt('Alat')),
                        'subtitle' => 'Alat',
                        'text' => 'Manage Alat',
                    ],
                    [
                        'sub_id' => 13,
                        'route' => route('System.index', Crypt::encrypt('ListAkun')),
                        'subtitle' => 'ListAkun',
                        'text' => 'List Akun',
                    ],
                ],
            ],
            [
                'id' => 10,
                'title' => 'Peraturan Perusahaan',
                'icon' => 'file-contract',
                'list' => $this->transformDatalistMenu(PeraturanPerusahaan::all()),
            ],
        ];
        return view('livewire.layout.list-menu', ['menus' => $menus, 'role' => $role]);
    }
}
