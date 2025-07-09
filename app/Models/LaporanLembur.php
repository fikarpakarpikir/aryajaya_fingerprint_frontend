<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class LaporanLembur extends Model
{
    use HasFactory;

    protected $guarded = ['id'];
    protected $appends = ['encId'];

    public function getEncIdAttribute()
    {
        return Crypt::encrypt($this->id);
    }

    public function org()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan', 'id');
    }

    public function jadwal()
    {
        return $this->belongsTo(JadwalKerja::class, 'jaker_id', 'id');
    }

    // Later Month
    // public function checkExpired() {
    //     $currentDate = Carbon::now();

    //     // Check if the date is between the 21st of the previous month and the 20th of the current month
    //     if ($currentDate->day >= 21) {
    //         $startDate = Carbon::create($currentDate->year, $currentDate->month, 21)->subMonth();
    //         $endDate = Carbon::create($currentDate->year, $currentDate->month, 20);
    //     } else {
    //         $startDate = Carbon::create($currentDate->year, $currentDate->subMonth()->month, 21);
    //         $endDate = Carbon::create($currentDate->year, $currentDate->month, 20);
    //     }

    //     // Example: Check if a specific date is within the range
    //     $specificDate = Carbon::parse($this->waktu_awal);
    //     dd('now', $specificDate,'start',$startDate,'end',$endDate);
    //     if ($specificDate->greaterThanOrEqualTo($startDate) && $specificDate->lessThanOrEqualTo($endDate)) {
    //         dd("The date is within the range.");
    //     } else {
    //         dd("The date is outside the range.");
    //     }
    // }
    //  Present Month

    public function totalDurasi()
    {
        if ($this->org->pegawai != null) {
            $minimal_jam = $this->org->pegawai->fungsional == 3 ? 7 : 8;

            $total_hari = number_format(date_diff(date_create($this->waktu_awal), date_create($this->waktu_akhir))->format('%a')) + 1;
            $total_jam = number_format(date_diff(date_create($this->waktu_awal), date_create($this->waktu_akhir))->format('%h'));
            $total_durasi = $total_hari * $total_jam;

            return $total_durasi >= $minimal_jam;
        } else {
            return false;
        }
    }
    public function sudahDiajukanBelumDiproses()
    {
        // dd($this->kode_jadwal_kerja);
        return JadwalKerja::where('macam_hadir', $this->jaker_id)
            ->where('kode_ket', 11)
            ->whereIn('kode_status', [1, 2])
            ->first();
    }

    public function checkExpired()
    {
        $currentDate = Carbon::now();
        // $currentDate = Carbon::create(2024, 3, 21);

        // Check if the date is between the 21st of the current month and the 20th of the next month
        $startDate = Carbon::create($currentDate->year, $currentDate->day < 21 ? $currentDate->submonth()->month : $currentDate->month, 21);
        // $startDate = Carbon::create($currentDate->year, $currentDate->month, 21);
        $endDate = $startDate->copy()->addMonth()->subDay();

        // Example: Check if a specific date is within the range
        $specificDate = Carbon::parse($this->waktu_awal);
        // $specificDate = Carbon::create(2024, 3, 15);
        $specificDate->setTimezone($startDate->timezone);

        // Debugging statements
        // dd('now', $currentDate->day, 'start', $startDate, 'end', $endDate,  'specificDate', $specificDate);

        return ($specificDate->greaterThanOrEqualTo($startDate) && $specificDate->lessThanOrEqualTo($endDate));
    }

    public function checkOvertime()
    {
        $data = $this->total_menit($this->jadwal->mulai, $this->jadwal->selesai);
        $target = $this->total_menit($this->waktu_awal, $this->waktu_akhir);
        // dd('jadwal mulai',$this->jadwal->mulai,'jadwal selesai',$this->jadwal->selesai,'laporan awal', $this->waktu_awal, 'laporan akhir', $this->waktu_akhir,'data',$data, $target);
        return $target > $data;
    }
    public function total_menit($tanggal1, $tanggal2)
    {
        $data = date_diff(date_create($tanggal1), date_create($tanggal2));
        $jam = intval($data->format('%H'));
        $menit = intval($data->format('%i'));

        $total = $jam > 0 ? ($jam * 60) + $menit : $menit;
        return $total;
    }

    public function total_waktu($tanggal1, $tanggal2)
    {
        $data = date_diff(date_create($tanggal1), date_create($tanggal2));
        $jam = intval($data->format('%H'));
        $menit = intval($data->format('%i'));
        $total = $menit == 0 ? $jam . ' jam' : ($jam == 0 ? $menit . ' menit' : $jam . ' jam, ' . $menit . ' menit');
        return $total;
    }
}
