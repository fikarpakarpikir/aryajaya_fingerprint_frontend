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
        Schema::create('jadwal_kerjas', function (Blueprint $table) {
            $table->id();
            $table->integer('id_karyawan');
            $table->integer('kode_ket');
            $table->integer('macam_hadir')->nullable();
            $table->text('bukti')->nullable();
            $table->dateTime('mulai');
            $table->dateTime('selesai');
            $table->integer('kode_status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal_kerjas');
    }
};
