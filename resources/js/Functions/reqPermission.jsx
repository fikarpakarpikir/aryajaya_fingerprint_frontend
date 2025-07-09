export const requestCameraPermission = async () => {
    try {
        // Cek apakah permission API tersedia
        if (!navigator.mediaDevices || !navigator.permissions) {
            console.warn(
                "MediaDevices API atau Permissions API tidak didukung di browser ini."
            );
            return false;
        }

        // Cek status permission kamera
        const permissionStatus = await navigator.permissions.query({
            name: "camera",
        });

        if (permissionStatus.state === "granted") {
            console.log("Izin kamera sudah diberikan.");
            return true;
        } else if (permissionStatus.state === "prompt") {
            console.log("Meminta izin kamera...");
            return await getUserMediaPermission();
        } else {
            console.warn("Akses kamera ditolak.");
            await getUserMediaPermission();
            return false;
        }
    } catch (error) {
        console.error("Gagal meminta izin kamera:", error);
        return false;
    }
};

const getUserMediaPermission = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
        });
        stream.getTracks().forEach((track) => track.stop()); // Matikan stream setelah izin diberikan
        console.log("Izin kamera diberikan.");
        return true;
    } catch (error) {
        console.error("Akses kamera ditolak:", error);
        return false;
    }
};

export const checkCameraPermission = async () => {
    try {
        if (!navigator.mediaDevices || !navigator.permissions) {
            console.warn(
                "MediaDevices API atau Permissions API tidak didukung."
            );
            return;
        }

        const permissionStatus = await navigator.permissions.query({
            name: "camera",
        });

        if (permissionStatus.state === "granted") {
            // console.log("Izin kamera sudah diberikan.");
            return true;
        } else if (permissionStatus.state === "prompt") {
            // console.log("Meminta izin kamera...");
            requestCameraPermission();
        } else {
            // console.warn("Akses kamera ditolak.");
            return false;
        }

        permissionStatus.onchange = () => {
            checkCameraPermission(); // Update status saat izin berubah
        };
    } catch (error) {
        console.error("Gagal memeriksa izin kamera:", error);
    }
};

export async function requestLocationPermission() {
    if (!navigator.permissions || !navigator.geolocation) {
        alert("Geolocation tidak didukung oleh browser.");
        return false;
    }

    try {
        const permissionStatus = await navigator.permissions.query({
            name: "geolocation",
        });

        if (permissionStatus.state === "granted") {
            return permissionStatus.state; // Sudah diizinkan
        }

        if (permissionStatus.state === "prompt") {
            // Coba paksa trigger permission prompt dengan getCurrentPosition
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    () => resolve(true),
                    () => reject(false)
                );
            });
        }

        if (permissionStatus.state === "denied") {
            // Tidak bisa diakses, user harus ubah manual
            // alert(
            //     "Izin lokasi ditolak. Silakan aktifkan izin lokasi di pengaturan browser Anda."
            // );
            return permissionStatus.state;
        }
    } catch (err) {
        console.error("Gagal memeriksa izin lokasi:", err);
        return false;
    }
}
