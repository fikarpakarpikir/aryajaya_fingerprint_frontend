<?php

namespace App\Http\Controllers;

use App\Events\SyncProgressEvent;
use App\Models\Auth\FaceRecognition;
use App\Models\Fingerprint;
use App\Models\Sinkronisasi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB as FacadesDB;
use Illuminate\Support\Facades\Http;

class SinkronisasiController extends Controller
{

    public function sync_data(Request $req)
    {
        // *Jenis Data
        // 1 - Fingerprint
        // 2 - Face ID

        $req->validate([
            'jenis_data' => 'required|numeric',
            'mulai' => 'nullable|date',
            'selesai' => 'nullable|date|after_or_equal:mulai',
            'started_at' => 'nullable|date',
            'finished_at' => 'nullable|date|after_or_equal:started_at',
        ]);

        try {
            $url = "$this->apiServer/sync_data";
            $res = Http::post($url, $req);
            if ($res->successful()) {

                $sync = Sinkronisasi::create([
                    'jenis_data' => $req->jenis_data,
                    'mulai' => $req->mulai,
                    'selesai' => $req->selesai,
                    'started_at' => now(),
                ]);
                $data = $res->json();
                $total = count($data);
                $done = 0;
                $unreg = [];
                switch ($req->jenis_data) {
                    case 1:
                        $ids = collect($data)->map(fn($item) => [
                            'id_karyawan'       => $item['id_karyawan'],
                            'template_id'       => $item['template_id'],
                            'template_dat'      => $item['template_dat'],
                            'updated_at'        => Carbon::parse($item['updated_at']),
                        ]);

                        $registered = Fingerprint::whereIn('id_karyawan', $ids->pluck('id_karyawan'))
                            ->whereIn('template_id', $ids->pluck('template_id'))
                            ->get(['id_karyawan', 'template_id', 'template_dat', 'updated_at']);

                        $unreg = $ids->reject(function ($item) use ($registered, $req) {
                            $found = $registered->first(function ($r) use ($item) {
                                return $r->id_karyawan == $item['id_karyawan']
                                    && $r->template_id == $item['template_id']
                                    && $r->template_dat == $item['template_dat'];
                            });

                            if (!$found) {
                                return false; // artinya item belum ada → jangan reject
                            }

                            return Carbon::parse($found->updated_at)->greaterThanOrEqualTo($req['mulai']);
                            // return Carbon::parse($found->updated_at)->greaterThanOrEqualTo($item['updated_at']);
                        })->values()->all();

                        foreach ($unreg as $item) {
                            $id = $item['id_karyawan'];
                            $template = $item['template_dat'];
                            $path = public_path("assets/fingerprint");

                            if (!file_exists($path)) {
                                mkdir($path, 0777, true);
                            }

                            $dat = Http::get($item['dat_url']);
                            // dd($foto->successful());
                            if ($dat->successful()) {
                                file_put_contents("$path/$template.png", $dat->body());

                                Fingerprint::updateOrCreate(
                                    [
                                        'id_karyawan' => $id,
                                    ],
                                    [
                                        'template' =>  $template,
                                        'updated_at' => $item['updated_at'],
                                    ]
                                );
                                $done++;
                            }


                            // Broadcast progress event
                            // \Log::info("Broadcast progress: done=$done, total=" . count($unreg));
                            broadcast(new SyncProgressEvent([
                                'jenis_data'        => 1,
                                'done'              => $done,
                                'total'             => count($unreg),
                                'id_karyawan'       => $id,
                            ]));
                        }
                        break;
                    case 2:
                        // Ambil semua kombinasi id_karyawan & ekspresi_wajah_id dari API
                        $ids = collect($data)->map(fn($item) => [
                            'id_karyawan'       => $item['id_karyawan'],
                            'ekspresi_wajah_id' => $item['ekspresi_wajah_id'],
                            'foto_url'          => $item['foto_url'],
                            'updated_at'        => Carbon::parse($item['updated_at']),
                        ]);

                        // Ambil semua data yang sudah terdaftar dari DB
                        $registered = FaceRecognition::whereIn('id_karyawan', $ids->pluck('id_karyawan'))
                            ->whereIn('ekspresi_wajah_id', $ids->pluck('ekspresi_wajah_id'))
                            ->get(['id_karyawan', 'ekspresi_wajah_id', 'updated_at']);
                        // Filter: ambil yang BELUM ada, atau ada tapi updated_at dari API lebih baru
                        // $unreg = $ids->reject(function ($item) use ($registered) {
                        //     $found = $registered->firstWhere(function ($r) use ($item) {
                        //         return $r->id_karyawan == $item['id_karyawan']
                        //             && $r->ekspresi_wajah_id == $item['ekspresi_wajah_id'];
                        //     });

                        //     if (!$found) {
                        //         return false;
                        //     }

                        //     return Carbon::parse($found->updated_at)->greaterThanOrEqualTo($item['updated_at']);
                        // })->values()->all();
                        $unreg = $ids->reject(function ($item) use ($registered, $req) {
                            $found = $registered->first(function ($r) use ($item) {
                                return $r->id_karyawan == $item['id_karyawan']
                                    && $r->ekspresi_wajah_id == $item['ekspresi_wajah_id'];
                            });

                            if (!$found) {
                                return false; // artinya item belum ada → jangan reject
                            }

                            return Carbon::parse($found->updated_at)->greaterThanOrEqualTo($req['mulai']);
                            // return Carbon::parse($found->updated_at)->greaterThanOrEqualTo($item['updated_at']);
                        })->values()->all();
                        // $unreg = $ids->filter(function ($item) use ($registered, $req) {
                        //     $found = $registered->firstWhere(function ($r) use ($item) {
                        //         return $r->id_karyawan == $item['id_karyawan']
                        //             && $r->ekspresi_wajah_id == $item['ekspresi_wajah_id'];
                        //     });

                        //     if (!$found) {
                        //         // Case 3
                        //         // dump("Case 3 (belum di RPi)", $item);
                        //         return true;
                        //     }

                        //     $serverUpdated = Carbon::parse($found->updated_at);
                        //     $filterDate    = Carbon::parse($req->mulai_tanggal_filter);

                        //     // dump("Comparing:", [
                        //     //     'id_karyawan'      => $item['id_karyawan'],
                        //     //     'ekspresi_wajah_id' => $item['ekspresi_wajah_id'],
                        //     //     'server_updated'   => $serverUpdated->toDateTimeString(),
                        //     //     'filter_date'      => $filterDate->toDateTimeString(),
                        //     //     'is_newer'         => $serverUpdated->greaterThan($filterDate),
                        //     // ]);

                        //     if ($serverUpdated->greaterThan($filterDate)) {
                        //         // Case 2
                        //         return true;
                        //     }

                        //     // Case 1
                        //     return false;
                        // })->values()->all();
                        // dd($unreg);

                        // 🚀 Proses download & simpan file
                        foreach ($unreg as $item) {
                            $id = $item['id_karyawan'];
                            $exp = $item['ekspresi_wajah_id'];
                            $path = public_path("assets/face_rec/$id");

                            if (!file_exists($path)) {
                                mkdir($path, 0777, true);
                            }

                            $foto = Http::get($item['foto_url']);
                            // dd($foto->successful());
                            if ($foto->successful()) {
                                file_put_contents("$path/$exp.png", $foto->body());

                                FaceRecognition::updateOrCreate(
                                    [
                                        'id_karyawan' => $id,
                                        'ekspresi_wajah_id' => $exp,
                                    ],
                                    [
                                        'foto' =>  $exp,
                                        'updated_at' => $item['updated_at'],
                                    ]
                                );
                                $done++;
                            }


                            // Broadcast progress event
                            // \Log::info("Broadcast progress: done=$done, total=" . count($unreg));
                            broadcast(new SyncProgressEvent([
                                'jenis_data'        => 2,
                                'done'              => $done,
                                'total'             => count($unreg),
                                'id_karyawan'       => $id,
                                'ekspresi_wajah_id' => $exp,
                            ]));
                        }

                        break;

                    default:

                        return response()->json($data);
                        break;
                }

                $sync->update([
                    'finished_at' => now(),
                    'done' => $done,
                    'total' => count($unreg),
                ]);

                return response()->json([
                    'status' => 'success',
                    'message' => "Sinkronisasi selesai",
                    'total' => count($unreg),
                    'done' => $done,
                ]);
            }
            if ($res->failed()) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Gagal sinkronisasi ke server",
                    'error' => $res->body(),
                ], $res->status());
            }
        } catch (\Throwable $th) {
            throw $th;
        }
        // Sinkronisasi::create($req);
    }

    public function sync_file() {}
}
