import dayjs from "dayjs";
import { requestLocationPermission } from "./reqPermission";
import { formatDatetimeToInput } from "./waktuIndo";

export default function getLocation() {
    return new Promise(async (resolve, reject) => {
        const allowed = await requestLocationPermission();
        if (!allowed) {
            return reject("GPS Tidak Diizinkan");
        }

        if (!navigator.geolocation) {
            // alert("Geolocation tidak didukung browser.");
            return reject(new Error("Geolocation tidak didukung"));
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    long: position.coords.longitude,
                    waktu: dayjs().format("YYYY-MM-DD HH:mm:ss"),
                });
            },
            (error) => {
                // alert("Gagal mendapatkan lokasi: " + error.message);
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 5000,
            }
        );
    });
}
