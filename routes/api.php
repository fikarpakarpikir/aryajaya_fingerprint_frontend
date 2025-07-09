<?php

use App\Http\Controllers\API\UserController;
use App\Http\Controllers\FingerprintController;
use App\Http\Controllers\PresensiController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:api')->get('/user', function () {
    return auth()->user();
});
// Route::prefix('api')->group(function () {api/Karyawan/Presensi/Fingerprint

Route::group(['prefix' => 'Karyawan', 'as' => 'Kar.'], function () {
    Route::group(['prefix' => 'Presensi', 'as' => 'Presensi.'], function () {
        Route::group(['prefix' => 'Fingerprint', 'controller' => FingerprintController::class, 'as' => 'Fingerprint.'], function () {
            Route::get('/', 'getKaryawanFingerprint')->name('getKaryawanFingerprint');
            Route::post('/registStore', 'registStore')->name('registStore');
            Route::post('/delete', 'delete')->name('delete');
            Route::post('/getTemplateId', 'getTemplateId')->name('getTemplateId');
            Route::post('/getAlat', 'getAlat')->name('getAlat');
            // Route::post('/getIdKaryawan', 'getIdKaryawan')->name('getKaryawanId');
            Route::post('/presensiStore', 'presensiStore')->name('presensiStore');
        });
    });
});
// Route::group(['as' => 'api.'], function () {
//     Route::group(['prefix' => 'LMS'], function () {
//         Route::group(['as' => 'LMS.'], function () {
//             Route::group(['controller' => LMSController::class], function () {
//                 Route::get('/hasil', 'hasil')->name('hasil');
//             });
//         });
//     });
// });
// });

Route::get('/syncJadwalKerja', [PresensiController::class, 'syncJadwalKerja']);
