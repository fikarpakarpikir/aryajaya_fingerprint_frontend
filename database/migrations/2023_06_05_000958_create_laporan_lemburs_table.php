<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('laporan_lemburs', function (Blueprint $table) {
            $table->id();
            $table->integer('jaker_id');
            $table->integer('id_karyawan');
            $table->text('lokasi_longitude')->nullable();
            $table->text('lokasi_latitude')->nullable();
            $table->dateTime('waktu_awal');
            $table->dateTime('waktu_akhir')->nullable();
            $table->text('foto_awal');
            $table->text('foto_akhir')->nullable();
            $table->text('pekerjaan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_lemburs');
    }
};
