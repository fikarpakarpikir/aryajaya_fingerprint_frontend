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
        Schema::create('dokumens', function (Blueprint $table) {
            $table->id();
            $table->integer('id_karyawan')->unique();
            $table->text('foto');
            $table->dateTime('waktu_foto');
            $table->string('nik');
            $table->text('file_ktp');
            $table->string('npwp')->nullable();
            $table->text('file_npwp')->nullable();
            $table->string('bpjs')->nullable();
            $table->text('file_bpjs')->nullable();
            // Comment dihidupkan hanya saat factory
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dokumens');
    }
};
