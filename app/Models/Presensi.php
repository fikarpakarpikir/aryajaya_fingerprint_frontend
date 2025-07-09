<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// use ApiPlatform\Metadata\ApiResource;
// use ApiPlatform\Metadata\Post;
// use ApiPlatform\Laravel\Http\ApiResource\Metadata\Operation;
use App\Http\Controllers\FingerprintController;
use Laravel\Sanctum\HasApiTokens;

// #[ApiResource(
//     operations: [
//         new Post(
//             uriTemplate: '/Karyawan/Presensi/Fingerprint/registStore',
//             controller: FingerprintController::class,
//             name: 'registStore'
//         ),
//         new Post(
//             uriTemplate: '/Karyawan/Presensi/Fingerprint/delete',
//             controller: FingerprintController::class,
//             name: 'delete'
//         ),
//         new Post(
//             uriTemplate: '/Karyawan/Presensi/Fingerprint/getTemplateId',
//             controller: FingerprintController::class,
//             name: 'getTemplateId'
//         ),
//         new Post(
//             uriTemplate: '/Karyawan/Presensi/Fingerprint/getAlat',
//             controller: FingerprintController::class,
//             name: 'getAlat'
//         ),
//         new Post(
//             uriTemplate: '/Karyawan/Presensi/Fingerprint/presensiStore',
//             controller: FingerprintController::class,
//             name: 'presensiStore',
//             deserialize: false,
//             processor: null
//         )
//     ]
// )]
class Presensi extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $with = ['org'];
    protected $appends = ['jaker'];

    public function getJakerAttribute()
    {
        if (!$this->findJaker) return null;
        $jaker = $this->findJaker()->without('org')->first();

        return $this->id_karyawan == $jaker?->id_karyawan ? $jaker : null;
    }

    public function org()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan', 'id')->select('id', 'nama')
            ->setEagerLoads([])
            ->with(['dokumen' => function ($q) {
                return $q->where('jenis_data_id', 1)->without('jenis');
            }]);
    }

    public function findJaker()
    {
        return $this->belongsTo(JadwalKerja::class, 'id_jaker', 'id')->setEagerLoads([]);
    }
}
