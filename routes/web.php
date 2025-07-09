<?php

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AccessController;
use App\Http\Controllers\AlatController;
use App\Http\Controllers\SistemController;
use App\Http\Controllers\BirokrasiController;
use App\Http\Controllers\FaceRecognitionController;
use App\Http\Controllers\PresensiController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::group(['middleware' =>  'guest'], function () {
    // Route::get('/Login', [AccessController::class, 'Login'])->name('Login');
    Route::group(['controller' => AccessController::class], function () {
        Route::get('/Login', 'Login')->name('login');
        Route::post('/authenticate', 'authenticate')->name('authenticate');

        // Route::post('/lupaPassword', 'lupaPassword')->name('password.email');
        // Route::get('/reset-password/{token}', 'ResetPassword')->name('password.reset');
        // Route::post('/reset-password/{email}', 'UpdatePassword')->name('password.update');
    });
});


Route::group(['middleware' =>  'auth'], function () {
    Route::get('/', [Controller::class, 'home'])->name('home');

    Route::post('/logout', [AccessController::class, 'logout'])->name('logout');

    Route::group(['prefix' => 'Presensi', 'as' => 'Presensi.'], function () {
        Route::group(['prefix' => 'Face_Recognition', 'as' => 'face_rec.'], function () {
            Route::group(['controller' => FaceRecognitionController::class], function () {
                Route::get('/', 'index')->name('index');
                Route::post('/delete', 'delete')->name('delete');
                Route::post('/store', 'store_image')->name('store');
                // Route::delete('/face_rec/regist_face/delete/{id_kar}', 'delete_image')->name('face-rec.delete');
            });
        });
        Route::group(['controller' => PresensiController::class], function () {
            Route::post('/store', 'presensiStore')->name('store');
            Route::get('/presensi/riwayat/{id_kar}', 'Riwayat')->name('Riwayat');
        });
        // Route::group(['prefix' => 'Fingerprint', 'controller' => FingerprintController::class, 'as' => 'Fingerprint.'], function () {
        //     Route::get('/', 'FingerprintHome')->name('Home');
        //     Route::get('/dashboard', 'FingerprintDashboard')->name('Dashboard');
        //     Route::post('/presensiStore', 'presensiStore')->name('presensiStore');
        //     Route::post('/registStore', 'registStore')->name('registStore');
        // });
    });

    Route::group(['prefix' => 'Sistem', 'as' => 'Sistem.'], function () {
        Route::get('/{Sistem}', [SistemController::class, 'index'])->name('index');
        // Route::get('/ManageFile', [SistemController::class, 'ManageFile'])->name('ManageFile');
        //     Route::group(['as' => 'Tambah.'], function () {
        //         Route::post('/Peraturan', [PeraturanPerusahaanController::class, 'tambahPeraturan'])->name('Peraturan');
        //     });
        //     Route::group(['as' => 'Hapus.'], function () {
        //         Route::delete('/Peraturan', [PeraturanPerusahaanController::class, 'hapusPeraturan'])->name('Peraturan');
        //     });
        //     Route::group(['as' => 'Ganti.'], function () {
        //         Route::put('/Peraturan/{id_jaker}', [PeraturanPerusahaanController::class, 'gantiPeraturan'])->name('Peraturan');
        //     });
        //     Route::get('/Table/Database', [SistemController::class, 'Database'])->name('Database');
        //     Route::post('/TambahStatus', [SistemController::class, 'TambahStatus'])->name('TambahStatus');
        //     Route::post('/TambahAktifitas', [SistemController::class, 'TambahAktifitas'])->name('TambahAktifitas');
        //     Route::post('/TambahKehadiran', [SistemController::class, 'TambahKehadiran'])->name('TambahKehadiran');
        //     Route::post('/TambahStruktur', [SistemController::class, 'TambahStruktur'])->name('TambahStruktur');
        //     Route::post('/TambahFungsi', [SistemController::class, 'TambahFungsi'])->name('TambahFungsi');
        //     Route::post('/TambahFungsional', [SistemController::class, 'TambahFungsional'])->name('TambahFungsional');
        //     Route::post('/TambahDivisi', [SistemController::class, 'TambahDivisi'])->name('TambahDivisi');
        //     Route::post('/TambahPilihan', [SistemController::class, 'TambahPilihan'])->name('TambahPilihan');
        //     Route::delete('/HapusStatus/{id}', [SistemController::class, 'HapusStatus'])->name('HapusStatus');
        //     Route::delete('/HapusKehadiran/{id}', [SistemController::class, 'HapusKehadiran'])->name('HapusKehadiran');
        //     Route::delete('/HapusDivisi/{id}', [SistemController::class, 'HapusDivisi'])->name('HapusDivisi');
        //     Route::post('/TambahRole', [SistemController::class, 'TambahRole'])->name('TambahRole');
        //     Route::delete('/HapusRole/{id}', [SistemController::class, 'HapusRole'])->name('HapusRole');
        //     Route::delete('/HapusPengajuan', [SistemController::class, 'HapusPengajuan'])->name('HapusPengajuan');
        //     Route::get('/updateIDKaryawan/{nama_db}/{id}/{id_karyawan}', [SistemController::class, 'updateIDKaryawan'])->name('updateIDKaryawan');
        //     Route::group(['controller' => SistemController::class], function () {
        //         Route::get('/cache_clear/{id_kar}', 'cache_clear')->name('cache_clear');
        //         Route::put('/GantiPengajuan/{id_jaker}', 'GantiPengajuan')->name('GantiPengajuan');
        //     });
        Route::group(['prefix' => 'Alat', 'as' => 'Alat.', 'controller' => AlatController::class], function () {
            Route::post('/add', 'add')->name('add');
            Route::post('/change', 'change')->name('change');
            Route::post('/delete', 'delete')->name('delete');
        });
        Route::group(['prefix' => 'Biro', 'as' => 'Biro.', 'controller' => BirokrasiController::class], function () {
            Route::post('/change',  'change')->name('change');
        });
    });
});
