<?php

namespace App\Notifications;

use App\Models\JadwalKerja;
use App\Models\Karyawan;
use App\Models\Kehadiran;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PengajuanIzinNotif extends Notification
{
    use Queueable;
    public $izin;
    /**
     * Create a new notification instance.
     */
    public function __construct($izin)
    {
        $this->izin = $izin;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // return ['mail', 'database'];
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->view('General.Email.PengajuanIzin', [
                'org' => Karyawan::find($this->izin['id_karyawan']),
                'absen' => Kehadiran::find($this->izin['kode_ket']),
                'notif' => $this->izin,
            ]);
        // ->line($this->izin['id_karyawan'])
        // ->action(
        //     $this->izin['kode_ket'],
        //     $this->izin['kode_status']
        // )
        // ->line($this->izin['id_karyawan']);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return
            $this->izin;
    }
}
