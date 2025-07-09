<?php

namespace Database\Seeders;

use App\Models\Agama;
use App\Models\Aktifitas;
use App\Models\Bank;
use App\Models\Fungsional;
use App\Models\Golongan;
use App\Models\JabatanFungsional;
use App\Models\JabatanStruktural;
use App\Models\Kehadiran;
use App\Models\LMS\JenisJawaban;
use App\Models\MacamKehadiran;
use App\Models\Nikah;
use App\Models\Nilai;
use App\Models\Pendidikan;
use App\Models\PHK;
use App\Models\Role;
use App\Models\Status;
use App\Models\StatusKaryawan;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FoundationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Fungsional::create(['id_struktural' => 1, 'title' => 'Management']);
        Fungsional::create(['id_struktural' => 2, 'title' => 'General']);
        Fungsional::create(['id_struktural' => 3, 'title' => 'Technician']);
        Fungsional::create(['id_struktural' => 4, 'title' => 'Sales']);
        Fungsional::create(['id_struktural' => 5, 'title' => 'Engineering']);

        Golongan::create(['id_struktural' => 2, 'title' => 'IVe']);
        Golongan::create(['id_struktural' => 2, 'title' => 'IVd']);
        Golongan::create(['id_struktural' => 3, 'title' => 'IVc']);
        Golongan::create(['id_struktural' => 3, 'title' => 'IVb']);
        Golongan::create(['id_struktural' => 3, 'title' => 'IVa']);
        Golongan::create(['id_struktural' => 4, 'title' => 'IIId']);
        Golongan::create(['id_struktural' => 4, 'title' => 'IIIc']);
        Golongan::create(['id_struktural' => 5, 'title' => 'IIIb']);
        Golongan::create(['id_struktural' => 5, 'title' => 'IIIa']);
        Golongan::create(['id_struktural' => 6, 'title' => 'IIId']);
        Golongan::create(['id_struktural' => 6, 'title' => 'IIIc']);
        Golongan::create(['id_struktural' => 7, 'title' => 'IIIb']);
        Golongan::create(['id_struktural' => 7, 'title' => 'IIIa']);
        Golongan::create(['id_struktural' => 8, 'title' => 'IId']);
        Golongan::create(['id_struktural' => 8, 'title' => 'IIc']);
        Golongan::create(['id_struktural' => 8, 'title' => 'IIb']);
        Golongan::create(['id_struktural' => 8, 'title' => 'IIa']);

        JabatanStruktural::create(['title' => 'Direktur Utama']);
        JabatanStruktural::create(['title' => 'Direktur']);
        JabatanStruktural::create(['title' => 'General Manager']);
        JabatanStruktural::create(['title' => 'Senior Manager']);
        JabatanStruktural::create(['title' => 'Junior Manager']);
        JabatanStruktural::create(['title' => 'Supervisor']);
        JabatanStruktural::create(['title' => 'Head of Division']);
        JabatanStruktural::create(['title' => 'Karyawan']);

        JabatanFungsional::create(['id_struktural' => 2, 'id_fungsional' => 1, 'title' => 'Ahli Utama']);
        JabatanFungsional::create(['id_struktural' => 3, 'id_fungsional' => 1, 'title' => 'Ahli Madya']);
        JabatanFungsional::create(['id_struktural' => 3, 'id_fungsional' => 3, 'title' => 'Head of Technician']);
        JabatanFungsional::create(['id_struktural' => 4, 'id_fungsional' => 1, 'title' => 'Ahli Muda']);
        JabatanFungsional::create(['id_struktural' => 4, 'id_fungsional' => 2, 'title' => 'Branch Officer & Plant Officer']);
        JabatanFungsional::create(['id_struktural' => 4, 'id_fungsional' => 3, 'title' => 'PM & SM']);
        JabatanFungsional::create(['id_struktural' => 4, 'id_fungsional' => 4, 'title' => 'National Sales']);
        JabatanFungsional::create(['id_struktural' => 4, 'id_fungsional' => 5, 'title' => 'Expert']);
        JabatanFungsional::create(['id_struktural' => 5, 'id_fungsional' => 1, 'title' => 'Ahli Pertama']);
        JabatanFungsional::create(['id_struktural' => 5, 'id_fungsional' => 2, 'title' => 'Branch Officer & Plant Officer']);
        JabatanFungsional::create(['id_struktural' => 5, 'id_fungsional' => 3, 'title' => 'Site Officer']);
        JabatanFungsional::create(['id_struktural' => 5, 'id_fungsional' => 4, 'title' => 'National Sales']);
        JabatanFungsional::create(['id_struktural' => 5, 'id_fungsional' => 5, 'title' => 'Senior Engineer']);
        JabatanFungsional::create(['id_struktural' => 6, 'id_fungsional' => 1, 'title' => 'Pengawas']);
        JabatanFungsional::create(['id_struktural' => 6, 'id_fungsional' => 2, 'title' => 'Kepala Gudang']);
        JabatanFungsional::create(['id_struktural' => 6, 'id_fungsional' => 3, 'title' => 'Pengawas']);
        JabatanFungsional::create(['id_struktural' => 6, 'id_fungsional' => 4, 'title' => 'Senior Sales']);
        JabatanFungsional::create(['id_struktural' => 6, 'id_fungsional' => 5, 'title' => 'Senior Engineer']);
        JabatanFungsional::create(['id_struktural' => 7, 'id_fungsional' => 1, 'title' => 'Senior Staff']);
        JabatanFungsional::create(['id_struktural' => 7, 'id_fungsional' => 2, 'title' => 'Logistik']);
        JabatanFungsional::create(['id_struktural' => 7, 'id_fungsional' => 3, 'title' => 'Teknisi Senior']);
        JabatanFungsional::create(['id_struktural' => 7, 'id_fungsional' => 4, 'title' => 'Sales']);
        JabatanFungsional::create(['id_struktural' => 7, 'id_fungsional' => 5, 'title' => 'Engineer']);
        JabatanFungsional::create(['id_struktural' => 8, 'id_fungsional' => 1, 'title' => 'Staff']);
        JabatanFungsional::create(['id_struktural' => 8, 'id_fungsional' => 1, 'title' => 'Junior Staff']);
        JabatanFungsional::create(['id_struktural' => 8, 'id_fungsional' => 1, 'title' => 'Assistent Staff']);
        JabatanFungsional::create(['id_struktural' => 8, 'id_fungsional' => 2, 'title' => 'Senior Driver']);
        JabatanFungsional::create(['id_struktural' => 8, 'id_fungsional' => 2, 'title' => 'Junior Driver']);
        JabatanFungsional::create(['id_struktural' => 8, 'id_fungsional' => 3, 'title' => 'Teknisi/Admin']);
        JabatanFungsional::create(['id_struktural' => 8, 'id_fungsional' => 3, 'title' => 'Teknisi Junior']);
        JabatanFungsional::create(['id_struktural' => 8, 'id_fungsional' => 3, 'title' => 'Assistent Teknisi']);
        JabatanFungsional::create(['id_struktural' => 8, 'id_fungsional' => 4, 'title' => 'Junior Sales/Admin']);
        JabatanFungsional::create(['id_struktural' => 8, 'id_fungsional' => 4, 'title' => 'Shop Keeper']);
        JabatanFungsional::create(['id_struktural' => 8, 'id_fungsional' => 5, 'title' => 'Junior Engineer']);

        Agama::create(['title' => 'Islam']);
        Agama::create(['title' => 'Kristen Protestan']);
        Agama::create(['title' => 'Kristen Katolik']);
        Agama::create(['title' => 'Hindu']);
        Agama::create(['title' => 'Buddha']);
        Agama::create(['title' => 'Konghucu']);
        Agama::create(['title' => 'Lainnya']);

        Aktifitas::create(['title' => 'Pertama Didaftarkan']); // 1
        Aktifitas::create(['title' => 'Log In']); // 2
        Aktifitas::create(['title' => 'Log Out']); // 3
        Aktifitas::create(['title' => 'Pelanggaran Akses']); // 4
        Aktifitas::create(['title' => 'Ganti Password']); // 5
        Aktifitas::create(['title' => 'Update Biodata']); // 6
        Aktifitas::create(['title' => 'Update Alamat']); // 7
        Aktifitas::create(['title' => 'Update Data Karyawan']); // 8
        Aktifitas::create(['title' => 'Update Riwayat Pendidikan']); // 9
        Aktifitas::create(['title' => 'Update Riwayat Kerja']); // 10
        Aktifitas::create(['title' => 'Update Akun']); // 11
        Aktifitas::create(['title' => 'Update Dokumen']); // 12
        Aktifitas::create(['title' => 'Update Sertifikat']); // 13
        Aktifitas::create(['title' => 'Naik Jabatan']); // 14
        Aktifitas::create(['title' => 'Naik Golongan']); // 15
        Aktifitas::create(['title' => 'PHK']); // 16
        Aktifitas::create(['title' => 'Pengajuan Izin']); // 17
        Aktifitas::create(['title' => 'Konfirmasi Izin']); // 18
        Aktifitas::create(['title' => 'Tambah Kontrak']); // 19
        Aktifitas::create(['title' => 'Tambah Peringatan']); // 20
        Aktifitas::create(['title' => 'Update Password']); // 21

        Bank::create(
            ['title' => 'BANK BRI', 'kode_bank' => '002'],
            ['title' => 'BANK EKSPOR INDONESIA', 'kode_bank' => '003'],
            ['title' => 'BANK MANDIRI', 'kode_bank' => '008'],
            ['title' => 'BANK BNI', 'kode_bank' => '009'],
            ['title' => 'BANK DANAMON', 'kode_bank' => '011'],
            ['title' => 'PERMATA BANK', 'kode_bank' => '013'],
            ['title' => 'BANK BCA', 'kode_bank' => '014'],
            ['title' => 'BANK BII', 'kode_bank' => '016'],
            ['title' => 'BANK PANIN', 'kode_bank' => '019'],
            ['title' => 'BANK ARTA NIAGA KENCANA', 'kode_bank' => '020'],
            ['title' => 'BANK NIAGA', 'kode_bank' => '022'],
            ['title' => 'BANK BUANA IND', 'kode_bank' => '023'],
            ['title' => 'BANK LIPPO', 'kode_bank' => '026'],
            ['title' => 'BANK NISP', 'kode_bank' => '028'],
            ['title' => 'AMERICAN EXPRESS BANK LTD', 'kode_bank' => '030'],
            ['title' => 'CITIBANK N.A.', 'kode_bank' => '031'],
            ['title' => 'JP. MORGAN CHASE BANK, N.A.', 'kode_bank' => '032'],
            ['title' => 'BANK OF AMERICA, N.A', 'kode_bank' => '033'],
            ['title' => 'ING INDONESIA BANK', 'kode_bank' => '034'],
            ['title' => 'BANK MULTICOR TBK.', 'kode_bank' => '036'],
            ['title' => 'BANK ARTHA GRAHA', 'kode_bank' => '037'],
            ['title' => 'BANK CREDIT AGRICOLE INDOSUEZ', 'kode_bank' => '039'],
            ['title' => 'THE BANGKOK BANK COMP. LTD', 'kode_bank' => '040'],
            ['title' => 'THE HONGKONG & SHANGHAI B.C.', 'kode_bank' => '041'],
            ['title' => 'THE BANK OF TOKYO MITSUBISHI UFJ LTD', 'kode_bank' => '042'],
            ['title' => 'BANK SUMITOMO MITSUI INDONESIA', 'kode_bank' => '045'],
            ['title' => 'BANK DBS INDONESIA', 'kode_bank' => '046'],
            ['title' => 'BANK RESONA PERDANIA', 'kode_bank' => '047'],
            ['title' => 'BANK MIZUHO INDONESIA', 'kode_bank' => '048'],
            ['title' => 'STANDARD CHARTERED BANK', 'kode_bank' => '050'],
            ['title' => 'BANK ABN AMRO', 'kode_bank' => '052'],
            ['title' => 'BANK KEPPEL TATLEE BUANA', 'kode_bank' => '053'],
            ['title' => 'BANK CAPITAL INDONESIA, TBK.', 'kode_bank' => '054'],
            ['title' => 'BANK BNP PARIBAS INDONESIA', 'kode_bank' => '057'],
            ['title' => 'BANK UOB INDONESIA', 'kode_bank' => '058'],
            ['title' => 'KOREA EXCHANGE BANK DANAMON', 'kode_bank' => '059'],
            ['title' => 'RABOBANK INTERNASIONAL INDONESIA', 'kode_bank' => '060'],
            ['title' => 'ANZ PANIN BANK', 'kode_bank' => '061'],
            ['title' => 'DEUTSCHE BANK AG.', 'kode_bank' => '067'],
            ['title' => 'BANK WOORI INDONESIA', 'kode_bank' => '068'],
            ['title' => 'BANK OF CHINA LIMITED', 'kode_bank' => '069'],
            ['title' => 'BANK BUMI ARTA', 'kode_bank' => '076'],
            ['title' => 'BANK EKONOMI', 'kode_bank' => '087'],
            ['title' => 'BANK ANTARDAERAH', 'kode_bank' => '088'],
            ['title' => 'BANK HAGA', 'kode_bank' => '089'],
            ['title' => 'BANK IFI', 'kode_bank' => '093'],
            ['title' => 'BANK CENTURY, TBK.', 'kode_bank' => '095'],
            ['title' => 'BANK MAYAPADA', 'kode_bank' => '097'],
            ['title' => 'BANK JABAR', 'kode_bank' => '110'],
            ['title' => 'BANK DKI', 'kode_bank' => '111'],
            ['title' => 'BPD DIY', 'kode_bank' => '112'],
            ['title' => 'BANK JATENG', 'kode_bank' => '113'],
            ['title' => 'BANK JATIM', 'kode_bank' => '114'],
            ['title' => 'BPD JAMBI', 'kode_bank' => '115'],
            ['title' => 'BPD ACEH', 'kode_bank' => '116'],
            ['title' => 'BANK SUMUT', 'kode_bank' => '117'],
            ['title' => 'BANK NAGARI', 'kode_bank' => '118'],
            ['title' => 'BANK RIAU', 'kode_bank' => '119'],
            ['title' => 'BANK SUMSEL', 'kode_bank' => '120'],
            ['title' => 'BANK LAMPUNG', 'kode_bank' => '121'],
            ['title' => 'BPD KALSEL', 'kode_bank' => '122'],
            ['title' => 'BPD KALIMANTAN BARAT', 'kode_bank' => '123'],
            ['title' => 'BPD KALTIM', 'kode_bank' => '124'],
            ['title' => 'BPD KALTENG', 'kode_bank' => '125'],
            ['title' => 'BPD SULSEL', 'kode_bank' => '126'],
            ['title' => 'BANK SULUT', 'kode_bank' => '127'],
            ['title' => 'BPD NTB', 'kode_bank' => '128'],
            ['title' => 'BPD BALI', 'kode_bank' => '129'],
            ['title' => 'BANK NTT', 'kode_bank' => '130'],
            ['title' => 'BANK MALUKU', 'kode_bank' => '131'],
            ['title' => 'BPD PAPUA', 'kode_bank' => '132'],
            ['title' => 'BANK BENGKULU', 'kode_bank' => '133'],
            ['title' => 'BPD SULAWESI TENGAH', 'kode_bank' => '134'],
            ['title' => 'BANK SULTRA', 'kode_bank' => '135'],
            ['title' => 'BANK NUSANTARA PARAHYANGAN', 'kode_bank' => '145'],
            ['title' => 'BANK SWADESI', 'kode_bank' => '146'],
            ['title' => 'BANK MUAMALAT', 'kode_bank' => '147'],
            ['title' => 'BANK MESTIKA', 'kode_bank' => '151'],
            ['title' => 'BANK METRO EXPRESS', 'kode_bank' => '152'],
            ['title' => 'BANK SHINTA INDONESIA', 'kode_bank' => '153'],
            ['title' => 'BANK MASPION', 'kode_bank' => '157'],
            ['title' => 'BANK HAGAKITA', 'kode_bank' => '159'],
            ['title' => 'BANK GANESHA', 'kode_bank' => '161'],
            ['title' => 'BANK WINDU KENTJANA', 'kode_bank' => '162'],
            ['title' => 'HALIM INDONESIA BANK', 'kode_bank' => '164'],
            ['title' => 'BANK HARMONI INTERNATIONAL', 'kode_bank' => '166'],
            ['title' => 'BANK KESAWAN', 'kode_bank' => '167'],
            ['title' => 'BANK TABUNGAN NEGARA (PERSERO)', 'kode_bank' => '200'],
            ['title' => 'BANK HIMPUNAN SAUDARA 1906, TBK .', 'kode_bank' => '212'],
            ['title' => 'BANK TABUNGAN PENSIUNAN NASIONAL', 'kode_bank' => '213'],
            ['title' => 'BANK SWAGUNA', 'kode_bank' => '405'],
            ['title' => 'BANK JASA ARTA', 'kode_bank' => '422'],
            ['title' => 'BANK MEGA', 'kode_bank' => '426'],
            ['title' => 'BANK JASA JAKARTA', 'kode_bank' => '427'],
            ['title' => 'BANK BUKOPIN', 'kode_bank' => '441'],
            ['title' => 'BANK SYARIAH MANDIRI', 'kode_bank' => '451'],
            ['title' => 'BANK BISNIS INTERNASIONAL', 'kode_bank' => '459'],
            ['title' => 'BANK SRI PARTHA', 'kode_bank' => '466'],
            ['title' => 'BANK JASA JAKARTA', 'kode_bank' => '472'],
            ['title' => 'BANK BINTANG MANUNGGAL', 'kode_bank' => '484'],
            ['title' => 'BANK BUMIPUTERA', 'kode_bank' => '485'],
            ['title' => 'BANK YUDHA BHAKTI', 'kode_bank' => '490'],
            ['title' => 'BANK MITRANIAGA', 'kode_bank' => '491'],
            ['title' => 'BANK AGRO NIAGA', 'kode_bank' => '494'],
            ['title' => 'BANK INDOMONEX', 'kode_bank' => '498'],
            ['title' => 'BANK ROYAL INDONESIA', 'kode_bank' => '501'],
            ['title' => 'BANK ALFINDO', 'kode_bank' => '503'],
            ['title' => 'BANK SYARIAH MEGA', 'kode_bank' => '506'],
            ['title' => 'BANK INA PERDANA', 'kode_bank' => '513'],
            ['title' => 'BANK HARFA', 'kode_bank' => '517'],
            ['title' => 'PRIMA MASTER BANK', 'kode_bank' => '520'],
            ['title' => 'BANK PERSYARIKATAN INDONESIA', 'kode_bank' => '521'],
            ['title' => 'BANK AKITA', 'kode_bank' => '525'],
            ['title' => 'LIMAN INTERNATIONAL BANK', 'kode_bank' => '526'],
            ['title' => 'ANGLOMAS INTERNASIONAL BANK', 'kode_bank' => '531'],
            ['title' => 'BANK DIPO INTERNATIONAL', 'kode_bank' => '523'],
            ['title' => 'BANK KESEJAHTERAAN EKONOMI', 'kode_bank' => '535'],
            ['title' => 'BANK UIB', 'kode_bank' => '536'],
            ['title' => 'BANK ARTOS IND', 'kode_bank' => '542'],
            ['title' => 'BANK PURBA DANARTA', 'kode_bank' => '547'],
            ['title' => 'BANK MULTI ARTA SENTOSA', 'kode_bank' => '548'],
            ['title' => 'BANK MAYORA', 'kode_bank' => '553'],
            ['title' => 'BANK INDEX SELINDO', 'kode_bank' => '555'],
            ['title' => 'BANK VICTORIA INTERNATIONAL', 'kode_bank' => '566'],
            ['title' => 'BANK EKSEKUTIF', 'kode_bank' => '558'],
            ['title' => 'CENTRATAMA NASIONAL BANK', 'kode_bank' => '559'],
            ['title' => 'BANK FAMA INTERNASIONAL', 'kode_bank' => '562'],
            ['title' => 'BANK SINAR HARAPAN BALI', 'kode_bank' => '564'],
            ['title' => 'BANK HARDA', 'kode_bank' => '567'],
            ['title' => 'BANK FINCONESIA', 'kode_bank' => '945'],
            ['title' => 'BANK MERINCORP', 'kode_bank' => '946'],
            ['title' => 'BANK MAYBANK INDOCORP', 'kode_bank' => '947'],
            ['title' => 'BANK OCBC – INDONESIA', 'kode_bank' => '948'],
            ['title' => 'BANK CHINA TRUST INDONESIA', 'kode_bank' => '949'],
            ['title' => 'BANK COMMONWEALTH', 'kode_bank' => '950']
        );

        Kehadiran::create(['title' => 'Hadir']);
        Kehadiran::create(['title' => 'Cuti Tahunan']); // 2
        Kehadiran::create(['title' => 'Cuti Khusus']); // 2
        Kehadiran::create(['title' => 'Izin']); // 3
        Kehadiran::create(['title' => 'Sakit']);
        Kehadiran::create(['title' => 'Alpha']);
        Kehadiran::create(['title' => 'Terlambat']);
        Kehadiran::create(['title' => 'Skorsing']);
        Kehadiran::create(['title' => 'Lembur']);

        MacamKehadiran::create(['kode_hadir' => 2, 'title' => 'Tahunan', 'total_durasi' => '12 days']);
        MacamKehadiran::create(['kode_hadir' => 2, 'title' => 'Haid', 'total_durasi' => '2 days first']);
        MacamKehadiran::create(['kode_hadir' => 2, 'title' => 'Ibadah Haji', 'total_durasi' => '40 days']);
        MacamKehadiran::create(['kode_hadir' => 2, 'title' => 'Ibadah Umrah', 'total_durasi' => '12 days']);
        MacamKehadiran::create(['kode_hadir' => 3, 'title' => 'Keperluan Menikah', 'total_durasi' => '3 days in weekdays']);
        MacamKehadiran::create(['kode_hadir' => 3, 'title' => 'Melahirkan', 'total_durasi' => '3 months']);
        MacamKehadiran::create(['kode_hadir' => 3, 'title' => 'Keguguran', 'total_durasi' => '1 month 2 weeks']);
        MacamKehadiran::create(['kode_hadir' => 3, 'title' => 'Pernikahan Anak Sah', 'total_durasi' => '2 days']);
        MacamKehadiran::create(['kode_hadir' => 3, 'title' => 'Istri Sah Melahirkan/Keguguran', 'total_durasi' => '2 days']);
        MacamKehadiran::create(['kode_hadir' => 3, 'title' => 'Kematian Suami/Istri/Anak/Orang Tua', 'total_durasi' => '2 days']);
        MacamKehadiran::create(['kode_hadir' => 3, 'title' => 'Kematian Mertua/Saudara Kandung/Menantu', 'total_durasi' => '2 days']);
        MacamKehadiran::create(['kode_hadir' => 3, 'title' => 'Kematian Nenek/Kakek dari Orang Tua Langsung', 'total_durasi' => '1 day']);
        MacamKehadiran::create(['kode_hadir' => 3, 'title' => 'Tertimpa Bencana Besar', 'total_durasi' => '2 days']);
        MacamKehadiran::create(['kode_hadir' => 3, 'title' => 'Pernikahan Saudara Kandung', 'total_durasi' => '1 day']);
        MacamKehadiran::create(['kode_hadir' => 3, 'title' => 'Hari Ujian Kesarjanaan', 'total_durasi' => '1 day']);

        Nikah::create(['title' => 'Belum Nikah']);
        Nikah::create(['title' => 'Sudah Nikah']);
        Nikah::create(['title' => 'Cerai Hidup']);
        Nikah::create(['title' => 'Cerai Mati']);

        Nilai::create(['title' => 'Teguran']);
        Nilai::create(['title' => 'SP1']);
        Nilai::create(['title' => 'SP2']);
        Nilai::create(['title' => 'SP3']);

        Pendidikan::create(['title' => 'SD']);
        Pendidikan::create(['title' => 'SMP/Sederajat']);
        Pendidikan::create(['title' => 'SMA/Sederajat']);
        Pendidikan::create(['title' => 'Diplome (D3)']);
        Pendidikan::create(['title' => 'Sarjana (S1)']);
        Pendidikan::create(['title' => 'Magister (S2)']);
        Pendidikan::create(['title' => 'Profesi/Spesialis']);
        Pendidikan::create(['title' => 'Doktor (S3)']);

        PHK::create(['title' => 'Meninggal']);
        PHK::create(['title' => 'Sakit Berkepanjangan']);
        PHK::create(['title' => 'Pemecatan']);
        PHK::create(['title' => 'Mengundurkan Diri']);

        Role::create(['title' => 'CTO']);
        Role::create(['title' => 'Superuser']);
        Role::create(['title' => 'Admin-IT']);
        Role::create(['title' => 'Manager']);
        Role::create(['title' => 'Admin-HC']);
        Role::create(['title' => 'Admin-Teknik']);
        Role::create(['title' => 'User']);

        Status::create(['title' => 'Sedang Diajukan ke atasan']);
        Status::create(['title' => 'Sedang Diajukan ke HRD']);
        Status::create(['title' => 'Acc']);
        Status::create(['title' => 'Ditolak']);
        Status::create(['title' => 'Lulus']);
        Status::create(['title' => 'Remedial']);
        Status::create(['title' => 'Gagal']);

        StatusKaryawan::create(['title' => 'PKWTT']);
        StatusKaryawan::create(['title' => 'PKWT']);

        JenisJawaban::create(['title' => 'Pilihan Ganda']);
        JenisJawaban::create(['title' => 'Essay']);
    }
}
