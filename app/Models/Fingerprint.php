<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use ApiPlatform\Metadata\ApiResource;
// use ApiPlatform\Metadata\Post;
// use ApiPlatform\Laravel\Http\ApiResource\Metadata\Operation;
use Laravel\Sanctum\HasApiTokens;

// #[ApiResource(
//     operations: [
//         new Post(
//             uriTemplate: '/Karyawan/Presensi/Fingerprint/registStore',
//             controller: App\Http\Controllers\FingerprintController::class,
//             name: 'registStore',
//             // openapiContext: [
//             //     'summary' => 'Store fingerprint registration data',
//             // ]
//         ),
//         new Post(
//             uriTemplate: '/Karyawan/Presensi/Fingerprint/delete',
//             controller: App\Http\Controllers\FingerprintController::class,
//             name: 'delete'
//         ),
//         new Post(
//             uriTemplate: '/Karyawan/Presensi/Fingerprint/getTemplateId',
//             controller: App\Http\Controllers\FingerprintController::class,
//             name: 'getTemplateId'
//         ),
//         new Post(
//             uriTemplate: '/Karyawan/Presensi/Fingerprint/getAlat',
//             controller: App\Http\Controllers\FingerprintController::class,
//             name: 'getAlat'
//         ),
//         new Post(
//             uriTemplate: '/Karyawan/Presensi/Fingerprint/presensiStore',
//             controller: App\Http\Controllers\FingerprintController::class,
//             name: 'presensiStore',
//         )
//     ]
// )]
class Fingerprint extends Model
{
    use HasApiTokens, HasFactory;

    // protected $fillable = ['ip_alat', 'template_id'];
    protected $guarded = ['id'];

    public function org()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan', 'id');
    }
}
