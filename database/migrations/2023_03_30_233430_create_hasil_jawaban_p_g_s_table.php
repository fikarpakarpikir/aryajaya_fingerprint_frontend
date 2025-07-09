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
        Schema::create('hasil_jawaban_p_g_s', function (Blueprint $table) {
            $table->id();
            $table->integer('peserta_id');
            $table->integer('kode_skill');
            $table->integer('kode_soal');
            $table->integer('kode_jawaban')->nullable();
            $table->float('nilai');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hasil_jawaban_p_g_s');
    }
};
