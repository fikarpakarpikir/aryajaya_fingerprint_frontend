<?php

namespace App\Http\Controllers;

use App\Models\Dokumen;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;

class DokumenController extends Controller
{
    private function getRequiredID($jenis_data_id)
    {
        // NOTE jenis data
        /**
         * @param {jenis_data_id} data
         * * 1 : Foto Profil
         * * 2 : KTP
         * * 3 : NPWP
         * * 4 : BPJS
         */
        return in_array($jenis_data_id, [2, 3, 4]);
    }
    private function validateRequest(Request $req, $method)
    {
        // NOTE method
        /**
         * @param {$method} data
         * * 1 : Add
         * * 2 : Change/Edit
         * * 3 : Delete
         */
        $req->validate([
            'id' => 'required|string',
            'jenis_data_id' => 'required|string',
            'file' => [
                $method === 3 ? 'nullable' : 'required',
                function ($attribute, $value, $fail) {
                    // Validate only if file is provided and contains base64 data
                    if ($value && preg_match('/^data:image\/(png|jpg|jpeg);base64,/', $value)) {
                        $decoded = base64_decode(substr($value, strpos($value, ',') + 1), true);

                        if (!$decoded) {
                            return $fail('Invalid base64 encoding.');
                        }

                        if (strlen($decoded) > 2 * 1024 * 1024) {
                            return $fail('The file must be smaller than 2MB.');
                        }
                    } elseif ($value && !is_string($value)) {
                        return $fail('The file must be a valid base64 image or a string reference.');
                    }
                }
            ],
            'no_identity' => $this->getRequiredID($req->jenis_data_id) ? 'required' : ''
        ]);
    }

    private function getStorageFolder($jenis_data_id)
    {
        $locFolder = "foto_profil";
        switch ($jenis_data_id) {
            case 2:
                $locFolder = "file_ktp";
                break;
            case 3:
                $locFolder = "file_bpjs";
                break;
            case 4:
                $locFolder = "file_npwp";
                break;

            default:
                $locFolder = "foto_profil";
                break;
        }
        return $locFolder;
    }

    private function saveBase64File($base64Data, $folder)
    {
        $decodedData = base64_decode(substr($base64Data, strpos($base64Data, ',') + 1));

        if (!$decodedData) return null;

        $storagePath = public_path("assets/$folder/");
        if (!file_exists($storagePath)) {
            mkdir($storagePath, 0777, true);
        }

        $fileName = uniqid("{$folder}_") . '.png';
        file_put_contents($storagePath . $fileName, $decodedData);

        return $fileName;
    }

    public function add(Request $req)
    {
        $this->validateRequest($req, 1);

        $folder = $this->getStorageFolder($req->jenis_data_id);
        $fileName = $this->saveBase64File($req->file, $folder) ?? $req->file;

        $data = Dokumen::create([
            'karyawan_id' => Crypt::decrypt($req->id),
            'jenis_data_id' => $req->jenis_data_id,
            'file' => $fileName,
            'no_identity' => $req->no_identity,
        ]);

        return response()->json($this->getData('dokumen', $data->id, 'dokumen'));
    }

    public function change(Request $req)
    {
        $this->validateRequest($req, 2);

        $folder = $this->getStorageFolder($req->jenis_data_id);
        $fileName = $this->saveBase64File($req->file, $folder) ?? $req->file;

        $data = Dokumen::findOrFail(Crypt::decrypt($req->id));
        $data->update(['file' => $fileName]);

        if ($this->getRequiredID($req->jenis_data_id)) {
            $req->validate(['no_identity' => 'required']);
            $data->update(['no_identity' => $req->no_identity]);
        }

        return response()->json($this->getData('dokumen', $data->id, 'dokumen'));
    }

    public function delete(Request $req)
    {
        $this->validateRequest($req, 3);

        $data = Dokumen::findOrFail(Crypt::decrypt($req->id));
        // dd($data->id, 'delete');
        $folder = $this->getStorageFolder($data->jenis_data_id);
        $filePath = 'assets/' . $folder . '/' . $data->file;
        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
            // return response()->json(['message' => 'File deleted successfully'], 200);
        }
        $data->delete();

        return response()->json([
            'parent' => 'dokumen',
            'data' => $data
        ]);
    }
}
