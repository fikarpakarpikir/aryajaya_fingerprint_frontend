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
        Schema::create('kasuses', function (Blueprint $table) {
            $table->id();
            $table->string('masalah');
            $table->text('dokumen')->nullable();
            $table->integer('privasi');
            $table->integer('kode_status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kasuses');
    }
};
