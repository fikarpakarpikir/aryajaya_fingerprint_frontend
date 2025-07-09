<!DOCTYPE html>
<html lang="en">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Laporan {{ $jenis }}/{{ $mulai }}/{{ $selesai }}</title>
    {{-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous"> --}}
    <style>
        body {
            /* font-family: Arial, Helvetica, sans-serif !important; */
            font-family: 'Times New Roman', Times, serif !important;
            /* line-height: 0.15cm; */
            font-size: 10pt;
            /* background-image: url('assets/bg-pdf.png');
            background-repeat: no-repeat;
            background-origin: content-box;
            background-size: cover; */
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        th {
            border: 1px solid #000;
            /* Thin borders */
            padding: 8px;
            text-align: center;
        }

        td {
            border: 1px solid #000;
            /* Thin borders */
            padding: 8px;
            text-align: left;
        }

        .text-center {
            text-align: center !important;
        }

        .text-start {
            text-align: start !important;
        }

        .text-end {
            text-align: end !important;
        }

        .col-10 {
            width: 10% !important;
        }

        .col-8 {
            width: 15% !important;
        }

        .col-4 {
            width: 35% !important;
        }

        .page-break {
            page-break-after: always;
            /* margin-top: 100px;  */
        }

        .a4 {
            width: 210mm;
            align-self: center;
            margin: auto
        }

        .borderless {
            border-width: 0 !important;
        }

        .fw-bold {
            font-weight: bold !important;
        }
    </style>
</head>

{{-- <body class="a4"> --}}

<body class="{{ $preview ? 'a4' : '' }}">
    @php
        if (!function_exists('tanggal')) {
            function tanggal($tgl)
            {
                return App\Http\Controllers\Controller::tanggal_indo($tgl);
            }
        }
        if (!function_exists('jam')) {
            function jam($tgl)
            {
                return App\Http\Controllers\Controller::jam_indo($tgl);
            }
        }

        if (!function_exists('check_div')) {
            function check_div($org)
            {
                if ($org->pegawai) {
                    switch ($org->pegawai->kode_status_kerja) {
                        case '1':
                            return ($org->pegawai->struktur ? $org->pegawai->struktur->title : '') .
                                ($org->pegawai->divisi ? ' - ' . $org->pegawai->divisi->div->title : '');
                            break;

                        case '2':
                            if ($org->pegawai->kontrak) {
                                if ($org->pegawai->kontrak->last()) {
                                    if ($org->pegawai->kontrak->last()->divisi) {
                                        return ($org->pegawai->kontrak->last()->struktur
                                            ? $org->pegawai->kontrak->last()->struktur->title
                                            : '') .
                                            ($org->pegawai->kontrak->last()->divisi
                                                ? ' - ' . $org->pegawai->kontrak->last()->divisi->div->title
                                                : '');
                                    }
                                }
                            }
                            return 'Karyawan ini belum terdaftar dalam divisi';
                            break;

                        default:
                            return 'Karyawan ini belum terdaftar dalam divisi';
                            break;
                    }
                }
                return 'Karyawan ini belum terdaftar dalam divisi';
            }
        }

        if (!function_exists('check_kerja')) {
            function check_kerja($date, $id_kar)
            {
                return App\Http\Controllers\API\UserController::getJadwalPresensi($id_kar, $date);
            }
        }
        if (!function_exists('kalkulasi_waktu')) {
            function kalkulasi_waktu($jam1, $jam2)
            {
                $data = date_diff(date_create($jam1), date_create($jam2));
                $jam = intval($data->format('%H'));
                $menit = intval($data->format('%i'));

                $total = $jam > 0 ? $jam * 60 + $menit : $menit;
                return [
                    'text' => $jam > 0 ? $jam . ' jam ' . $menit . ' menit' : $menit . ' menit ',
                    'total' => $total,
                ];
            }
        }
        if (!function_exists('bagi_waktu')) {
            function bagi_waktu($waktu)
            {
                $jam = floor($waktu / 60);
                $menit = $waktu % 60;
                return $jam > 0 ? $jam . ' jam ' . $menit . ' menit' : $menit . ' menit';
            }
        }
    @endphp
    <h3 class="text-center">
        Laporan {{ $jenis }}, {{ tanggal($mulai) }} - {{ tanggal($selesai) }}
    </h3>
    @forelse ($data as $item)
        @php
            $cuti_tahunan = 0;
            $cuti_khusus = 0;
            $sakit = 0;
            $izin = 0;
            $telat = 0;
            $total_lembur = 0;
            $izin_terlambat = 0;
            $tanpa_keterangan = 0;
            $cepat_pulang = 0;
            $skorsing = 0;
        @endphp
        <table style="margin-bottom: 10px;">
            <tr class="borderless">
                <td class="col-8 borderless">
                    ID Karyawan
                </td>
                <td class="col-4 borderless fw-bold">
                    {{ $item->id }}
                </td>
                <td class="col-8 borderless">
                    Tanggal Gabung
                </td>
                <td class="col-4 borderless fw-bold">
                    {{ $item->pegawai ? tanggal($item->pegawai->masuk) : '' }}
                </td>
                {{-- <td class="col-8 borderless">
                    Jabatan
                </td>
                <td class="col-4 borderless fw-bold">
                    {Jabatan}
                </td> --}}
            </tr>
            <tr>
                <td class="col-8 borderless">
                    Nama
                </td>
                <td class="col-4 borderless fw-bold">
                    {{ $item->nama }}
                </td>
                <td class="col-8 borderless">
                    Divisi
                </td>
                <td class="col-4 borderless fw-bold">
                    {{ check_div($item) }}
                    {{-- {{ $item->pegawai->struktur }} --}}
                </td>
            </tr>
        </table>
        <table style="margin-bottom: 10px;">
            <thead>
                <tr>
                    <th>
                        Hari/Tanggal
                    </th>
                    <th>
                        Kegiatan
                    </th>
                    <th>
                        Jam
                    </th>
                    <th>
                        Jam Masuk
                    </th>
                    <th>
                        Jam Keluar
                    </th>
                    <th>
                        Terlambat
                    </th>
                    <th>
                        Cepat Pulang
                    </th>
                    <th>
                        Lembur
                    </th>
                    <th>
                        Jumlah Jam
                    </th>
                    <th>
                        Catatan
                    </th>
                </tr>
            </thead>
            <tbody>
                @forelse ($date_range as $date)
                    {{-- {{ dd(check_kerja($date->format('Y-m-d'))['jadwal']) }} --}}
                    @php
                        $kerja = check_kerja($date->format('Y-m-d'), $item->id);
                    @endphp
                    <tr>
                        <td>{{ tanggal($date->format('Y-m-d')) }}</td>
                        @if ($kerja['jadwal'] != 'libur')
                            {{-- @dd ($kerja) --}}
                            @if (count($kerja['jadwal']) > 0)
                                @forelse ($kerja['jadwal'] as $items_i)
                                    {{-- @dd($items_i->absen['title'], $items_i->jenis_absen['title']) --}}
                                    <td>
                                        {{ $items_i->absen['title'] . ($items_i->macam_hadir != null ? ' - ' . $items_i->jenis_absen['title'] : '') }}
                                    </td>
                                    @if ($items_i['kode_ket'] == 1)
                                        <td>
                                            {{ jam($items_i['mulai']) . '-' . jam($items_i['selesai']) }}
                                        </td>
                                        @if (count($kerja['presensi']) > 0)
                                            @forelse ($kerja['presensi']->take(1) as $items_ii)
                                                <td>
                                                    {{ jam($items_ii['mulai']) }}
                                                </td>
                                                <td>
                                                    {{ jam($items_ii['selesai']) }}
                                                </td>
                                                <td>
                                                    @php
                                                        $diff = date_diff(
                                                            date_create(jam($items_i['mulai'])),
                                                            date_create(jam($items_ii['mulai'])),
                                                        );
                                                    @endphp
                                                    @if ($diff->format('%R') == '+' && ($diff->format('%h') > 0 || $diff->format('%i') > 5))
                                                        @php
                                                            $telat += 1;
                                                        @endphp
                                                        {{ $diff->format('%h jam %i menit') }}
                                                    @endif
                                                </td>
                                                <td>
                                                    @php
                                                        $diff = date_diff(
                                                            date_create(jam($items_i['selesai'])),
                                                            date_create(jam($items_ii['selesai'])),
                                                        );
                                                    @endphp
                                                    @if ($diff->format('%R') == '-' && ($diff->format('%h') > 0 || $diff->format('%i') > 5))
                                                        @php
                                                            $cepat_pulang += 1;
                                                        @endphp
                                                        {{ $diff->format('%h jam %i menit') }}
                                                    @endif
                                                </td>
                                            @empty
                                            @endforelse
                                        @else
                                            <td colspan="4">Tidak Presensi</td>
                                        @endif
                                    @else
                                        <td colspan="7">-</td>
                                    @endif
                                @empty
                                @endforelse
                            @else
                                <td colspan="6">Karyawan ini belum dijadwalkan kerja</td>
                            @endif
                        @else
                            <td>Libur</td>
                            <td colspan="5">-</td>
                        @endif

                        {{-- @dd(count($kerja['keterangan']) > 0) --}}
                        @if (count($kerja['keterangan']) > 0)
                            @php
                                $data_lembur = collect($kerja['keterangan'])->filter(function ($value, int $key) {
                                    return $value['kode_ket'] == 9;
                                });
                                $data_izin_terlambat = collect($kerja['keterangan'])->filter(function (
                                    $value,
                                    int $key,
                                ) {
                                    return $value['kode_ket'] == 10;
                                });
                            @endphp
                            @if (count($data_lembur) > 0)
                                @forelse ($data_lembur as $items_iii)
                                    @if (
                                        $items_iii['laporan'] &&
                                            $items_iii['laporan']['waktu_akhir'] != null &&
                                            $items_iii['laporan']['foto_akhir'] != null)
                                        @php
                                            $lembur = $items_iii['laporan'];

                                            $total_lembur += 1;

                                        @endphp
                                        <td>
                                            {{ kalkulasi_waktu($lembur['waktu_awal'], $lembur['waktu_akhir'])['text'] }}
                                        </td>
                                        @if ($kerja['jadwal'] != 'libur' && $kerja['jadwal'][0]['kode_ket'] == 1 && count($kerja['presensi']) > 0)
                                            <td>
                                                {{ bagi_waktu(kalkulasi_waktu($lembur['waktu_awal'], $lembur['waktu_akhir'])['total'] + kalkulasi_waktu($kerja['presensi'][0]['mulai'], $kerja['presensi'][0]['selesai'])['total']) }}
                                            </td>
                                        @else
                                            <td>
                                                {{ bagi_waktu(kalkulasi_waktu($lembur['waktu_awal'], $lembur['waktu_akhir'])['total']) }}
                                            </td>
                                        @endif
                                    @endif
                                @empty
                                @endforelse
                            @else
                                <td>
                                    -
                                </td>
                                <td>
                                    -
                                </td>
                            @endif
                            <td>
                                @if (count($data_izin_terlambat) > 0)
                                    {{-- {{ $data_izin_terlambat[1] }} --}}
                                    @forelse ($data_izin_terlambat as $items_iv)
                                        {{ $items_iv['absen']->title . ($items_iv['macam_hadir'] ? ' - ' . $items_iv['jenis_absen']->title : '') }}
                                        dari {{ jam($items_iv['mulai']) }} sampai
                                        {{ jam($items_iv['selesai']) }}
                                        @php

                                            $izin_terlambat += 1;

                                        @endphp
                                    @empty
                                    @endforelse
                                @else
                                    Normal
                                @endif
                            </td>
                        @else
                            <td>
                                -
                            </td>
                        @endif
                        @if ($kerja['jadwal'] != 'libur' && count($kerja['jadwal']) > 0 && count($kerja['keterangan']) < 1)
                            @if ($kerja['jadwal'][0]['kode_ket'] == 1 && count($kerja['presensi']) > 0)
                                <td>
                                    {{ bagi_waktu(kalkulasi_waktu($kerja['presensi'][0]['mulai'], $kerja['presensi'][0]['selesai'])['total']) }}
                                </td>
                                <td>
                                    Normal
                                </td>
                            @elseif(in_array($kerja['jadwal'][0]['kode_ket'], [2, 3, 4, 5, 8, 11, 12, 13]))
                                @php
                                    switch ($kerja['jadwal'][0]['kode_ket']) {
                                        case 2:
                                            $cuti_tahunan += 1;
                                            break;
                                        case 3:
                                            $cuti_khusus += 1;
                                            break;
                                        case 4:
                                            $izin += 1;
                                            break;
                                        case 5:
                                            $sakit += 1;
                                            break;
                                        case 8:
                                            $skorsing += 1;
                                            break;

                                        default:
                                            # code...
                                            break;
                                    }
                                @endphp
                            @else
                                <td>0</td>
                                <td>Tidak Hadir</td>
                            @endif
                        @else
                            @if (count($kerja['keterangan']) < 1)
                                <td colspan="2">
                                    -
                                </td>
                            @endif
                        @endif
                    </tr>

                @empty
                @endforelse
            </tbody>
        </table>
        <table>
            <tr>
                <td colspan="8" class="fw-bold">Rekapitulasi</td>
            </tr>
            <tr>
                <td class=" col-8">
                    Cuti Tahunan
                </td>
                <td class="text-start  col-10 fw-bold">
                    {{ $cuti_tahunan }}
                </td>
                <td class=" col-8">
                    Cuti Khusus
                </td>
                <td class="text-start  col-10 fw-bold">
                    {{ $cuti_khusus }}
                </td>
                <td class=" col-8">
                    Sakit
                </td>
                <td class="text-start  col-10 fw-bold">
                    {{ $sakit }}
                </td>
                <td class=" col-8">
                    Izin
                </td>
                <td class="text-start  col-10 fw-bold">
                    {{ $izin }}
                </td>
            </tr>
            <tr>
                <td class=" col-8">
                    Lembur
                </td>
                <td class="text-start  col-10 fw-bold">
                    {{ $total_lembur }}
                </td>
                <td class=" col-8">
                    Izin Terlambat
                </td>
                <td class="text-start  col-10 fw-bold">
                    {{ $izin_terlambat }}
                </td>
                <td class=" col-8">
                    Tanpa Keterangan
                </td>
                <td class="text-start  col-10 fw-bold">
                    {{ $tanpa_keterangan }}
                </td>
                <td class=" col-8">
                    Cepat Pulang
                </td>
                <td class="text-start  col-10 fw-bold">
                    {{ $cepat_pulang }}
                </td>
            </tr>
            <tr>
                <td class=" col-8">
                    Telat
                </td>
                <td class="text-start  col-10 fw-bold">
                    {{ $telat }}
                </td>
                <td class=" col-8">
                    Skorsing
                </td>
                <td class="text-start  col-10 fw-bold" colspan="5">
                    {{ $skorsing }}
                </td>
            </tr>
        </table>
        <div class="page-break"></div>
    @empty
    @endforelse
</body>

</html>
