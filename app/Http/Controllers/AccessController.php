<?php

namespace App\Http\Controllers;

use App\Models\Record;
use App\Models\User;
use App\Notifications\GeneralNotif;
use App\Notifications\PengajuanIzinNotif;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification as FacadesNotification;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AccessController extends Controller
{

    public function Login()
    {
        return Inertia::render('Auth/Login', [
            'title' => 'Log In',
            'subtitle' => '',
            'lupa_password' => '',
        ]);
        // return view('General.Form.Login', [
        //     'title' => 'Log In',
        //     'subtitle' => '',
        //     'lupa_password' => '',
        // ]);
    }

    public function authenticate(Request $request)
    {
        $data = $request->validate([
            'username' => 'required',
            'password' => 'required'
        ]);

        $logintype = filter_var($data['username'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $credentials = [
            $logintype => $data['username'],
            'password' => $data['password'],
        ];

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            RecordController::RecordAct(Auth::user()->id_karyawan, 2);
            // return redirect()->intended('/')->with('success', 'Selamat Datang ' . Auth::user()->nama);
            // switch (auth()->user()->role) {
            //     case '1':
            //         return redirect()->intended('/')->with('success', 'Selamat Datang ' . auth()->user()->nama);
            //         break;
            //     case '2':
            //         return redirect()->intended('/Kasir')->with('success', 'Selamat Datang ' . auth()->user()->nama);
            //         break;

            //     default:
            //         return redirect()->intended('/Login')->with('error', 'Silakan menggunakan akun yang benar');
            //         break;
            // }
            return response()
                ->json(['message' => 'Sucesss'], 200);
        } else {
            $lupa_password = 'Lupa';
            return response()
                ->json(['message' => 'Log In Gagal! Cek kembali username/email dan password Anda'], 400);
        }
    }

    public function logout(Request $request)
    {
        // $id_user = Crypt::decrypt($id_user);
        $user = User::find(auth()->user()->id);

        if ($user != null) {
            RecordController::RecordAct(auth()->user()->id, 3);
            Auth::logout();

            $request->session()->invalidate();

            $request->session()->regenerateToken();

            // return redirect('/Login')->with('success', 'Anda telah Log Out, silakan Log In kembali untuk mengakses');
        }
        // return back()->with('error', 'Anda gagal Log Out');
    }

    public function add(Request $req)
    {
        $req->validate([
            'id_karyawan' => ['required', 'string'],
            'username' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:6'],
            'confpassword' => ['required', 'string', 'min:6'],
        ]);
        $id_kar = Crypt::decrypt($req->id_karyawan);
        $password = Crypt::decrypt($req->password);
        // dd($password);
        $confpassword = Crypt::decrypt($req->confpassword);
        if ($password === $confpassword) {
            $data = [
                'id_karyawan' => $id_kar,
                'username' => $req->username,
                'email' => $req->email,
                'password' => bcrypt($password),
                'kode_role' => $req->kode_role ?? 7,
            ];

            // dd($data);
            $new = User::create($data);
            return response()->json($this->getData('akun', $new));
        }
        return response()->json(['error' => "Password yang dikonfirmasi tidak sama"], 422);
    }

    public function lupaPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status == Password::RESET_LINK_SENT
            // ? back()->with(['status' => __($status)])
            ? back()->with(['status' => 'Link Reset Password telah dikirimkan melalui email Anda yang terdaftar'])
            : back()->with('error', 'Email yang anda masukkan tidak terdaftar dalam data')->withErrors(['email' => __($status)]);
    }

    public function ResetPassword(string $token)
    {
        return view('General.Form.resetPassword', [
            'title' => 'Reset Password',
            'subtitle' => 'Buat Password Baru',
            'token' => $token
        ]);
    }
    public function UpdatePassword(Request $request, $email)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        if ($request->email == $email) {
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function (User $user, string $password) {
                    $user->forceFill([
                        'password' => Hash::make($password)
                    ])->setRememberToken(Str::random(60));

                    $user->save();

                    event(new PasswordReset($user));
                }
            );

            $user = User::where('email', $request->email)->first();
            Notification::send($user, new GeneralNotif([
                'kode_aktifitas' => 21,
                'pesan_notif' => 'Anda baru saja mengganti password.'
            ]));

            return $status == Password::PASSWORD_RESET
                // ? redirect()->route('login')->with('status', __($status))
                ? redirect()->route('Login')->with('status', 'Password berhasil diupdate')
                : back()->withErrors(['email' => [__($status)]]);
        } else {
            return back()->with('error', 'Email yang dimasukkan tidak sama dengan kode token email yang dikirim');
        }
    }
}
