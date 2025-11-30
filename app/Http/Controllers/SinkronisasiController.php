<?php

namespace App\Http\Controllers;

use App\Events\SyncProgressEvent;
use App\Models\Auth\FaceRecognition;
use App\Models\Fingerprint;
use App\Models\Sinkronisasi;
use App\Http\Controllers\FingerprintController;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class SinkronisasiController extends Controller
{
    private $status_pending = 'pending',
        $status_success = 'success',
        $status_partial = 'success not all',
        $status_failed = 'failed';

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

        DB::beginTransaction();
        try {
            $url = "$this->apiServer/sync_data";
            $res = Http::post($url, $req);
            $sync = Sinkronisasi::create([
                'jenis_data' => $req->jenis_data,
                'mulai' => $req->mulai,
                'selesai' => $req->selesai,
                'started_at' => now(),
            ]);
            if ($res->successful()) {
                $data = $res->json();
                $total = count($data);
                $done = 0;
                $unreg = [];
                $step = 1;
                switch ($req->jenis_data) {
                    case 1:
                        $ids = collect($data)->map(fn($item) => [
                            'id_karyawan'       => $item['id_karyawan'],
                            'jari_id'       => $item['jari_id'],
                            'template_id'       => $item['template_id'],
                            'template_dat'      => $item['template_dat'],
                            'alat_id'      => $item['alat_id'],
                            'dat_url'      => $item['dat_url'],
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
                        // dd(($unreg));
                        foreach ($unreg as $item) {
                            $id = $item['id_karyawan'];
                            $template = $item['template_dat'];
                            $template_id = $item['template_id'];
                            $alat_id = $item['alat_id'];
                            $jari = $item['jari_id'];
                            $path = public_path("assets/fingerprint");
                            if (!file_exists($path)) {
                                mkdir($path, 0777, true);
                            }

                            $dat = Http::get($item['dat_url']);
                            if ($dat->successful()) {
                                broadcast(new SyncProgressEvent([
                                    'jenis_data'        => 1,
                                    'done'              => $done,
                                    'total'             => count($unreg),
                                    'id_karyawan'       => $id,
                                    'step'              => 1,
                                ]));
                                file_put_contents("$path/$template", $dat->body());


                                Fingerprint::updateOrCreate(
                                    [
                                        'id_karyawan' => $id,
                                        'jari_id' => $jari,
                                    ],
                                    [
                                        'alat_id' =>  $alat_id,
                                        'template_id' =>  $template_id,
                                        'template_dat' =>  $template,
                                        'updated_at' => $item['updated_at'],
                                    ]
                                );
                                $done++;
                            }
                            broadcast(new SyncProgressEvent([
                                'jenis_data'        => 1,
                                'done'              => $done,
                                'total'             => count($unreg),
                                'id_karyawan'       => $id,
                                'step'              => 2,
                            ]));
                        }
                        broadcast(new SyncProgressEvent([
                            'jenis_data'        => 1,
                            'done'              => $done,
                            'total'             => count($unreg),
                            'id_karyawan'       => $id,
                            'step'              => 3,
                        ]));
                        try {
                            (new FingerprintController())->getFitur(4);
                            $step = 2;
                        } catch (\Throwable $th) {
                            return $th->getMessage();
                        }

                        break;
                    case 2:
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
                                broadcast(new SyncProgressEvent([
                                    'jenis_data'        => 2,
                                    'done'              => $done,
                                    'total'             => count($unreg),
                                    'id_karyawan'       => $id,
                                    'ekspresi_wajah_id' => $exp,
                                    'step'              => 1,
                                ]));
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
                                'step'              => 2,
                            ]));
                        }
                        broadcast(new SyncProgressEvent([
                            'jenis_data'        => 2,
                            'done'              => $done,
                            'total'             => count($unreg),
                            'id_karyawan'       => $id,
                            'ekspresi_wajah_id' => $exp,
                            'step'              => 3,
                        ]));

                        break;

                    default:

                        return response()->json($data);
                        break;
                }


                $totalUnreg  = count($unreg);
                if ($done < $totalUnreg) {
                    $sync->update([
                        'status' => $this->status_partial,
                        'finished_at' => now(),
                        'done' => $done,
                        'total' => $totalUnreg,
                    ]);

                    DB::commit();
                    return response()->json([
                        'status' => $this->status_partial,
                        'message' => "Sinkronisasi selesai tapi tidak semua",
                        'finished_at' => now(),
                        'total' => $totalUnreg,
                        'done' => $done,
                    ]);
                }
                $sync->update([
                    'status' => $this->status_success,
                    'finished_at' => now(),
                    'done' => $done,
                    'total' => $totalUnreg,
                ]);

                DB::commit();
                return response()->json([
                    'status' => $this->status_success,
                    'message' => "Sinkronisasi selesai",
                    'finished_at' => now(),
                    'total' => $totalUnreg,
                    'done' => $done,
                ]);
            }
            if ($res->failed()) {
                $sync->update([
                    'status' => $this->status_failed,
                    'finished_at' => now(),
                    'done' => 0,
                    'total' => 0,
                ]);
                DB::commit();

                return response()->json([
                    'status' => $this->status_failed,
                    'message' => "Gagal sinkronisasi ke server",
                    'finished_at' => now(),
                    'error' => $res->body(),
                ], $res->status());
            }
        } catch (\Throwable $th) {
            $sync = Sinkronisasi::create([
                'jenis_data' => $req->jenis_data,
                'mulai' => $req->mulai,
                'selesai' => $req->selesai,
                'started_at' => now(),
                'finished_at' => now(),
                'status' => $this->status_failed,
            ]);
            return response()->json([
                'status' => $this->status_failed,
                'jenis_data' => $req->jenis_data,
                'message' => "Gagal sinkronisasi ke server",
                'error' => $th->getMessage(),
            ]);
            // throw $th;
        }
        // Sinkronisasi::create($req);
    }

    public function sync_file() {}
}
