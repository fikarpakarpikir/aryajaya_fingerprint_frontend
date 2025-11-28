<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

class FetchRPi extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'rpi:fetch';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch device info from main server and store locally';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // $serial = trim(file_get_contents('/etc/rpi-serial'));
        $serial = trim(shell_exec("cat /proc/cpuinfo | grep Serial | cut -d ' ' -f 2"));

        return $serial;


        $response = Http::post("{$this->apiServer}/Alat/info", [
            'serial' => $serial,
        ]);

        if ($response->failed()) {
            $this->error('Failed to fetch device info');
            return 1;
        }

        File∂::put(public_path('device.json'), $response->body());

        $this->info('Device info saved!');
        return 0;
    }
}
