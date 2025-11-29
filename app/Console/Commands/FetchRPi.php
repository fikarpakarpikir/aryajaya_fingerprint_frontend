<?php

namespace App\Console\Commands;

use App\Services\RPiService;
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
        // $serial = '$this->getSeri()';
       $service = new RPiService();

        $serial = $service->getSerial();
        if (!$serial) return $this->error('Tidak ada serial');

        $this->info("Your Serial: {$serial}");

        $result = $service->fetch($serial);

        if (isset($result['status']) && $result['status'] == 404) {
            $this->warn("Alat belum terdaftar");
            $c = $this->ask("Mau didaftarkan? y/n", 'y');

            if ($c === 'y') {
                return $this->regist($serial);
            }
            return $this->warn("Ok, goodbye.");
        }

        if (isset($result['error'])) {
            return $this->error("Failed: " . $result['error']);
        }

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
            'kode_akses' => Crypt::encrypt(env('APP_KEY')),
            'ip_alat' => request()->ip(),
        ]);

        if ($response->failed()) {
            $message = $response['error'] ?? '';
            return $this->error("Gagal register. {$message}");
        }

        File::put(public_path('device.json'), $response->body());
        return $this->info("Berhasil register device.");
    }
}
