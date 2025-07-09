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
        Schema::create('p_k_w_t_s', function (Blueprint $table) {
            $table->id();
            $table->integer('id_karyawan');
            $table->date('mulai');
            $table->date('selesai');
            $table->integer('kode_golongan');
            $table->integer('kode_struktural');
            $table->integer('fungsional');
            $table->integer('kode_fungsional');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p_w_k_t_s');
    }
};
