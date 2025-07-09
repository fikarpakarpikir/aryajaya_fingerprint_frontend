<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function update($id_user, $kode_role)
    {
        User::find($id_user)
            ->update(['kode_role' => $kode_role]);
        // return json_encode($pesan);
        $role = Role::find($kode_role);
        return response()->json([
            'success' => 'Data berhasil diupdate',
            'role' => $role->title, // for status 200
        ]);
    }
}
