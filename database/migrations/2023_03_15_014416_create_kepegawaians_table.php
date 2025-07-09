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
        Schema::create('kepegawaians', function (Blueprint $table) {
            $table->id();
            $table->integer('id_karyawan')->unique();
            $table->date('masuk');
            $table->integer('kode_status_kerja');
            $table->integer('kode_golongan');
            $table->integer('kode_struktural');
            $table->integer('fungsional');
            $table->integer('kode_fungsional')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kepegawaians');
    }
};
