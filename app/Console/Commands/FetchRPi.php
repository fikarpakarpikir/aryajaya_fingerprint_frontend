<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

class FetchRPi extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rpi {action}';
    // protected $signature = 'rpi {action?}';
    // protected $signature = 'rpi
    //                     {fetch : Fetch device info}
    //                     {reg : Register device}
                        // {help : Show help}';



    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch device info from main server and store locally';
    private $apiServer, $apiAlat;

    public function __construct()
    {
        parent::__construct();
        $this->apiServer = config('app.api.server');
        $this->apiAlat = "{$this->apiServer}/Alat";
    }
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $action = $this->argument('action') ?? 'help';
        $list = $this->getCustHelp();

        switch ($action) {
            case 'fetch':
                return $this->fetch();

            case 'reg':
                return $this->regist();


            case 'help':
                return $this->line($this->getCustHelp());

            default:
                $this->error("Unknown action: $action\n");
                return $this->info($list);
        }
    }

    protected function getCustHelp()
    {
        return <<<HELP
Available actions:

  fetch     Fetch information from main server
  reg       Register device to server
  help      Show this help menu

Usage:
  php artisan rpi fetch
  php artisan rpi reg

HELP;
    }

    protected function getSeri()
    {
        $serial = trim(shell_exec("cat /proc/cpuinfo | grep Serial | cut -d ' ' -f 2"));

        if (!$serial) {
            return $this->error('Tidak ada serial');
        }
        return $serial;
    }

    protected function fetch()
    {
        // $serial = trim(file_get_contents('/etc/rpi-serial'));
        // $serial = '123123';
        $serial = '$this->getSeri()';
        // $serial = $this->getSeri();

        if (!$serial) {
            return $this->error('Tidak ada serial');
        }
        $this->info("Your Serial: {$serial}");

        $response = Http::withHeaders([
            'Accept' => 'application/json'
        ])->post("{$this->apiAlat}/info", [
            'serial_number' => $serial,
        ]);

        if ($response->status() === 404) {
            $this->error("Alat belum terdaftar");
            $c = $this->ask("Mau didaftarkan? y/n - atau langsung enter saja untuk Yes", 'y');
            switch ($c) {
                case 'y':
                    return $this->regist($serial);
                case 'n':
                    return $this->warn("Ok, goodbye.");
                    break;

                default:
                    $this->line("$c tidak ada dalam pilihan");
                    $this->error("==================");
                    return 1;
                    break;
            }
            return $this->regist();
        }
        if ($response->failed()) {
            $message = $response['message'] ?? $response['error'];
            $this->error("Failed to fetch device info: {$message}");
            return 1;
        }

        File::put(public_path('device.json'), $response->body());

        $this->info('Device info saved!');
        return 0;
    }

    protected function regist($serial = null)
    {
        $this->info("=== Register Device ===");

        $title = $this->ask("Nama perangkat?");

        $this->line("Mengirim ke server...");

        $response = Http::withHeaders([
            'Accept' => 'application/json'
        ])->post("{$this->apiAlat}/regist", [
            'title' => $title,
            'serial_number' => $serial,
            'kode_akses' => Crypt::encrypt(env('APP_KEY'))
        ]);

        if ($response->failed()) {
            $message = $response['error'] ?? '';
            return $this->error("Gagal register. {$message}");
        }

        return $this->info("Berhasil register device.");
    }
}
