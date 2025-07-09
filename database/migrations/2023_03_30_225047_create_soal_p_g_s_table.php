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
        Schema::create('soal_p_g_s', function (Blueprint $table) {
            $table->id();
            $table->integer('kode_soal');
            $table->text('pertanyaan');
            $table->string('dokumen')->nullable();
            $table->integer('kode_jawaban_benar');
            $table->float('nilai')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('soal_p_g_s');
    }
};
