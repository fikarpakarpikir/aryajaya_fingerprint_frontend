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
        Schema::create('hasil_jawaban_essays', function (Blueprint $table) {
            $table->id();
            $table->integer('id_karyawan');
            $table->integer('kode_skill');
            $table->integer('kode_soal');
            $table->longText('jawaban');
            $table->float('nilai')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hasil_jawaban_essays');
    }
};
