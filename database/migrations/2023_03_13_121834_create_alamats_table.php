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
        Schema::create('alamats', function (Blueprint $table) {
            $table->id();
            $table->integer('id_karyawan')->unique();
            $table->integer('province_id');
            $table->integer('city_id');
            $table->integer('kode_pos');
            $table->text('detail');
            $table->string('nama_dkt');
            $table->string('no_hp_dkt');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alamats');
    }
};
