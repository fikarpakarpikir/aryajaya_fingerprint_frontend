<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CropImageController extends Controller
{
    public function storeCropImage(Request $request)
    {
        $image = $request->image;
        $folderPath = public_path('assets/foto_profil/');

        // list($type, $image) = explode(";", $image);
        // list(, $image) = explode(",", $image);
        // $image = base64_decode($image);

        $image_parts = explode(";base64,", $image);
        $image_type_aux = explode('image/', $image_parts[0]);
        $image = base64_decode($image_parts[1]);
        // $image_type_aux = explode("image/", $image_parts[0]);
        // $image_type = $image_type_aux[1];

        $image_name = uniqid('foto_profil_') . '.png';

        $imageFullPath = $folderPath . $image_name;
        file_put_contents($imageFullPath, $image);

        return response()->json(['success' => $image_name]);
    }
}
