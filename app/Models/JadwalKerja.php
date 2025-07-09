<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Crypt;

class JadwalKerja extends Model
{
    use Notifiable;

    protected $guarded = ['id'];
    protected $with = ['status', 'ket', 'jenis', 'laporan', 'lampiran', 'org', 'overshift'];
    protected $appends = ['title', 'encId'];

    public function getEncIdAttribute()
    {
        return Crypt::encrypt($this->id);
    }
    public function getTitleAttribute()
    {
        //     if (in_array($this->macam_hadir, [33, 34])) {
        //         return $this->jenis->title ?? "#{$this->macam_hadir}";
        //     }

        //     $ket = $this->ket->title ?? '';
        //     $jenis = $this->jenis->title ?? null;

        //     return $jenis
        //         ? "{$ket} - {$jenis}"
        //         : $ket;
        return in_array($this->macam_hadir, [33, 34]) ? $this->jenis->title : "{$this->ket->title}" .
            ($this->macam_hadir ? " - " . ($this->jenis->title ?? "#{$this->macam_hadir}") : "");
    }
    public function org()
    {
        return $this->belongsTo(Karyawan::class, 'id_karyawan', 'id')->setEagerLoads([])->with(['pegawai'])->select(['id', 'nama', 'status_aktif', 'no_hp']);
    }

    public function status()
    {
        return $this->belongsTo(Status::class, 'kode_status', 'id');
    }

    public function badge()
    {
        switch ($this->kode_status) {
            case '1':
                $status = 'warning';
                break;
            case '2':
                $status = 'warning';
                break;
            case '3':
                $status = 'success';
                break;
            case '4':
                $status = 'danger';
                break;
            case '10':
                $status = 'success';
                break;
            case '11':
                $status = 'danger';
                break;
            case '12':
                $status = 'danger';
                break;

            default:
                $status = 'secondary';
                break;
        }
        if ($this->kode_status == 10) {
            if ($this->laporan != null) {
                if ($this->laporan->waktu_akhir != null && $this->laporan->foto_akhir != null) {
                    $text = 'Lembur Selesai';
                } else {
                    $status = 'warning';
                    $text = 'Lembur Masih Berlangsung';
                }
            } else {
                $text = $this->stat->title;
            }
        } else {
            $text = $this->stat->title;
        }

        echo '<span
        class="badge badge-lg fw-bold bg-gradient-' . $status . '">' . $text . '</span>';
    }

    public function jenis_ajuan()
    {
        switch ($this->kode_ket) {
            case '1':
                $status = 'success';
                break;
            case '2':
                $status = 'info';
                break;
            case '3':
                $status = 'info';
                break;
            case '4':
                $status = 'danger';
                break;
            case '':
                $status = 'primary';
                break;

            default:
                $status = 'secondary';
                break;
        }

        echo '<span
                class="badge badge-lg fw-bold bg-gradient-' . $status . '">' . $this->absen->title . '</span>';
    }

    public function jenis_ajuan_card_header()
    {
        switch ($this->kode_ket) {
            case '1':
                $status = 'success';
                break;
            case '2':
                $status = 'info';
                break;
            case '3':
                $status = 'info';
                break;
            case '4':
                $status = 'danger';
                break;
            case '9':
                $status = 'primary';
                break;

            default:
                $status = 'secondary';
                break;
        }

        echo '<div class="card-header text-center p-1 bg-gradient-' . $status . '">
        <span class="badge badge-lg fw-bold bg-gradient-' . $status . '">' . $this->absen->title . '</span>
        </div>
        ';
    }

    public function ket()
    {
        return $this->belongsTo(Kehadiran::class, 'kode_ket', 'id');
    }

    public function jenis()
    {
        return $this->belongsTo(MacamKehadiran::class, 'macam_hadir', 'id');
    }

    public function pegawai()
    {
        return $this->belongsTo(Kepegawaian::class, 'id_karyawan', 'id_karyawan');
    }
    public function absen()
    {
        return $this->belongsTo(Kehadiran::class, 'kode_ket', 'id');
    }

    public function jenis_absen()
    {
        return $this->belongsTo(MacamKehadiran::class, 'macam_hadir', 'id');
    }

    public function laporan()
    {
        // return $this->belongsTo(LaporanLembur::class, 'kode_jadwal_kerja', 'id');
        return $this->belongsTo(
            LaporanLembur::class,
            'id', // Local key on the mechanics table...
            'jaker_id', // Local key on the cars table...
        );
    }

    public function getOvershift($id_lembur)
    {
        return JadwalKerja::where('macam_hadir', $id_lembur)
            ->where('kode_ket', 11)
            ->first();
    }
    public function overshift()
    {

        return $this->hasMany(JadwalKerja::class, 'macam_hadir', 'id')
            ->where('kode_ket', 11)
            ->setEagerLoads([]);
        // return JadwalKerja::where('macam_hadir', $this->id)
        //     ->where('kode_ket', 11)
        //     ->first();
    }

    public function cekLemburOvershift()
    {
        return $this->belongsTo(JadwalKerja::class, 'macam_hadir', 'id');
    }

    public function overtime()
    {
        // $item = $this->belongsTo(LaporanLembur::class, 'id', 'kode_jadwal_kerja');
        $item = $this->laporan;
        $os = $this->overshift($item->jaker_id);
        // $os = $this->overshift_id;
        // dd($item, $os);
        if ($item != null && $os != null) {
            if ($this->mulai != null && $this->selesai != null) {
                // dd($os);
                $interval = date_diff(date_create($this->mulai), date_create($this->selesai));

                $totalJam = (int)$interval->format('%H');
                $totalMenit = (int)$interval->format('%I');

                // If the total minutes exceed 59, adjust the total hours and minutes
                if ($totalMenit > 59) {
                    $totalJam += floor($totalMenit / 60);
                    $totalMenit %= 60;
                };
                $totalMenit /= 60;
                // dd($totalMenit);
                return number_format($totalJam + $totalMenit, 2, ',', '.');
            }
        } else if ($item != null) {
            if ($item->waktu_awal != null && $item->waktu_akhir != null) {
                $interval = date_diff(date_create($item->waktu_awal), date_create($item->waktu_akhir));

                $totalJam = (int)$interval->format('%H');
                $totalMenit = (int)$interval->format('%I');

                // If the total minutes exceed 59, adjust the total hours and minutes
                if ($totalMenit > 59) {
                    $totalJam += floor($totalMenit / 60);
                    $totalMenit %= 60;
                };
                $totalMenit /= 60;
                // dd($totalMenit);
            }
            return number_format($totalJam + $totalMenit, 2, ',', '.');
        }
        return null;
    }

    public function lampiran()
    {
        return $this->belongsTo(LampiranPengajuan::class, 'id', 'id_jaker');
    }
}
