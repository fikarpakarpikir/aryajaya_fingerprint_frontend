<?php

namespace App\Http\Controllers;

use App\Models\JadwalKerja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class NotificationController extends Controller
{
    public function updateDeviceToken($token)
    {
        $user = User::find(auth()->user()->id);
        // dd($user, $request->token);
        $user->update(['device_token' => $token]);
        return response()->json(['Token successfully stored.']);
    }

    public static function sendNotification($request, $id_target, $redirect_link)
    {
        $url = 'https://fcm.googleapis.com/fcm/send';

        // $FcmToken = User::whereNotNull('device_token')->pluck('device_token')->all();
        $FcmToken = User::whereIn('id', $id_target)
            ->whereNotNull('device_token')
            ->pluck('device_token');

        if ($FcmToken == null) {
            return back();
        }

        $serverKey = 'AAAAEVBq-t4:APA91bHA58x3B7_im7NH7rmCohhJjMbbaxlg0gOc0-__UjU86-GsJrFRZW9q9gcpKVbvO0phumO4HVsI27ZYxRWrMUtX75NkhPFOTOlB_97HygK97HO9ta3JOpdbLhdKEFG5_YjNa0mH';
        // dd($request['title']);
        $data = [
            "registration_ids" => $FcmToken,
            "notification" => [
                "icon" => asset('assets/logo/logo-crc.png'),
                "title" => $request['title'],
                "body" => $request['body'],
                "priority" => 'high',
            ],
            // "link" => $redirect_link,
        ];
        $encodedData = json_encode($data);

        $headers = [
            'Authorization:key=' . $serverKey,
            'Content-Type: application/json',
        ];

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        // Disabling SSL Certificate support temporarly
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $encodedData);
        // Execute post
        $result = curl_exec($ch);
        if ($result == FALSE) {
            die('Curl failed: ' . curl_error($ch));
        }
        // Close connection
        curl_close($ch);
        // FCM response
        return back();
        // dd($result);
    }
}
