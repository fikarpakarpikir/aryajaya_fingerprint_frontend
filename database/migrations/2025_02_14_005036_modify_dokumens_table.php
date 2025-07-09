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
        Schema::table('dokumens', function (Blueprint $table) {
            $table->renameColumn('id_karyawan', 'karyawan_id');
            $table->dropColumn(['foto', 'waktu_foto', 'file_ktp', 'npwp', 'file_npwp', 'bpjs', 'file_bpjs']);
            $table->integer('jenis_dokumen_id')->after('karyawan_id');
            $table->text('file')->after('jenis_dokumen_id');
            $table->string('no_identity')->nullable()->after('file');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dokumens', function (Blueprint $table) {
            $table->renameColumn('karyawan_id', 'id_karyawan');
            $table->dropColumn(['jenis_dokumen_id', 'file', 'no_identity']);
            $table->text('foto')->nullable();
            $table->dateTime('waktu_foto')->nullable();
            $table->text('file_ktp')->nullable();
            $table->string('npwp')->nullable();
            $table->text('file_npwp')->nullable();
            $table->string('bpjs')->nullable();
            $table->text('file_bpjs')->nullable();
        });
    }
};
