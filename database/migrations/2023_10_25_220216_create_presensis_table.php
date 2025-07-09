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
        Schema::create('presensis', function (Blueprint $table) {
            $table->id();
            $table->integer('id_karyawan');
            $table->integer('id_jaker');
            $table->dateTime('mulai');
            $table->text('lokasi_longitude_mulai');
            $table->text('lokasi_latitude_mulai');
            $table->dateTime('selesai');
            $table->text('lokasi_longitude_selesai')->nullable();
            $table->text('lokasi_latitude_selesai')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('presensis');
    }
};
