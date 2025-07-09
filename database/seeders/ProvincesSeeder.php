<?php

namespace Database\Seeders;

use App\Models\Province;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProvincesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Province::create(['province_id' => '1', 'title' => 'Bali']);
        Province::create(['province_id' => '2', 'title' => 'Bangka Belitung']);
        Province::create(['province_id' => '3', 'title' => 'Banten']);
        Province::create(['province_id' => '4', 'title' => 'Bengkulu']);
        Province::create(['province_id' => '5', 'title' => 'DI Yogyakarta']);
        Province::create(['province_id' => '6', 'title' => 'DKI Jakarta']);
        Province::create(['province_id' => '7', 'title' => 'Gorontalo']);
        Province::create(['province_id' => '8', 'title' => 'Jambi']);
        Province::create(['province_id' => '9', 'title' => 'Jawa Barat']);
        Province::create(['province_id' => '10', 'title' => 'Jawa Tengah']);
        Province::create(['province_id' => '11', 'title' => 'Jawa Timur']);
        Province::create(['province_id' => '12', 'title' => 'Kalimantan Barat']);
        Province::create(['province_id' => '13', 'title' => 'Kalimantan Selatan']);
        Province::create(['province_id' => '14', 'title' => 'Kalimantan Tengah']);
        Province::create(['province_id' => '15', 'title' => 'Kalimantan Timur']);
        Province::create(['province_id' => '16', 'title' => 'Kalimantan Utara']);
        Province::create(['province_id' => '17', 'title' => 'Kepulauan Riau']);
        Province::create(['province_id' => '18', 'title' => 'Lampung']);
        Province::create(['province_id' => '19', 'title' => 'Maluku']);
        Province::create(['province_id' => '20', 'title' => 'Maluku Utara']);
        Province::create(['province_id' => '21', 'title' => 'Nanggroe Aceh Darussalam (NAD)']);
        Province::create(['province_id' => '22', 'title' => 'Nusa Tenggara Barat (NTB)']);
        Province::create(['province_id' => '23', 'title' => 'Nusa Tenggara Timur (NTT)']);
        Province::create(['province_id' => '24', 'title' => 'Papua']);
        Province::create(['province_id' => '25', 'title' => 'Papua Barat']);
        Province::create(['province_id' => '26', 'title' => 'Riau']);
        Province::create(['province_id' => '27', 'title' => 'Sulawesi Barat']);
        Province::create(['province_id' => '28', 'title' => 'Sulawesi Selatan']);
        Province::create(['province_id' => '29', 'title' => 'Sulawesi Tengah']);
        Province::create(['province_id' => '30', 'title' => 'Sulawesi Tenggara']);
        Province::create(['province_id' => '31', 'title' => 'Sulawesi Utara']);
        Province::create(['province_id' => '32', 'title' => 'Sumatera Barat']);
        Province::create(['province_id' => '33', 'title' => 'Sumatera Selatan']);
        Province::create(['province_id' => '34', 'title' => 'Sumatera Utara']);
    }
}
