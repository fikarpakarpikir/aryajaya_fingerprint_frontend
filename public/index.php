<?php

// use Illuminate\Http\Request;

// define('LARAVEL_START', microtime(true));

// // Determine if the application is in maintenance mode...
// if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
//     require $maintenance;
// }

// // Register the Composer autoloader...
// require __DIR__.'/../vendor/autoload.php';

// // Bootstrap Laravel and handle the request...
// (require_once __DIR__.'/../bootstrap/app.php')
//     ->handleRequest(Request::capture());


use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Register Composer Autoloader first (needed for Dotenv)
require __DIR__ . '/../vendor/autoload.php';

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__ . '/../storage/framework/maintenance.php')) {
    require $maintenance;
}
// jika nyambung dengan flask
$app = new Illuminate\Foundation\Application(
    $_ENV['APP_BASE_PATH'] ?? dirname(__DIR__)
);
$envFile = Dotenv\Dotenv::createImmutable(dirname(__DIR__,2), 'shared.env');
// dd($envFile)
$envFile->safeLoad();

// // Determine correct .env file based on context
// $envFile = '.env'; // Default

// if (PHP_SAPI === 'cli-server') {
//     // CLI context (e.g., artisan)
//     // if (env('LARAVEL_ENV') === 'dev') {
//     $envFile = '.env.dev';
//     // }
// } else {
//     // Web context (e.g., HTTP request)
//     $host = $_SERVER['HTTP_HOST'] ?? '';
//     if (in_array($host, ['127.0.0.1', '127.0.0.1:8000'])) {
//         $envFile = '.env.dev';
//     }
// }
// dd($envFile);

// // Bootstrap Laravel dan inject env file
// $app = require __DIR__ . '/../bootstrap/app.php';
// $app->loadEnvironmentFrom($envFile);

// // Jalankan Laravel
// $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
// $response = $kernel->handle(
//     $request = Illuminate\Http\Request::capture()
// )->send();

// $kernel->terminate($request, $response);
// Load the selected .env file

// Dotenv\Dotenv::createImmutable(__DIR__ . '/..', $envFile)->safeLoad(); // safeLoad agar tidak error jika file tidak ada

// Bootstrap Laravel and handle the request...
(require __DIR__ . '/../bootstrap/app.php')
    ->handleRequest(Request::capture());
