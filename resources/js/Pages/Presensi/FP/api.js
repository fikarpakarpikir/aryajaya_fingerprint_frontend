import axios from "axios";

// Ambil base URL dari environment
const API_BASE = import.meta.env.VITE_API_SERVER;

export const fetchReg = async () => {
    try {
        const response = await axios.get(
            `${API_BASE}/Karyawan/Presensi/Fingerprint`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};

export const fetchAlat = async (urlScanner) => {
    if (!urlScanner) throw new Error("URL scanner tidak ada");
    try {
        const res = await axios.get(`${urlScanner}/check_fingerprint`, {
            timeout: 5000,
        });
        return res.data;
    } catch (error) {
        console.error("Fetch alat gagal:", error);
        throw error;
    }
};

export const fetchEnrollmentStatus = async () => {
    if (isFetching.current) return; // Skip if already fetching

    isFetching.current = true;
    try {
        const response = await axios.get(`${urlScanner}/enrollment_status`);
        const thisState = Number(response.data?.status);
        setStatus(thisState);
        setActiveFP(!!response.data.message);
        // setCountdownScanning(response.data.countdown);
        setGetMessage(
            response.data.countdown > 0 ? response.data.active : false
        );
        console.log("id", response.data.fiturId);
        switch (response.data.fiturId) {
            case 1:
                if (thisState === 4) {
                    findKaryawan(response.data.newData);
                    setTimeout(() => {
                        getFitur(1);
                    }, 3000); // Delay for 3 seconds (3000 milliseconds)
                } else if (thisState === 3) {
                    setKaryawan(null);
                    setTimeout(() => {
                        getFitur(1);
                    }, 3000);
                }
                break;
            case 2:
                if (thisState === 4) {
                    dispatch(registeredAdd(response.data.newData));
                }
                break;
            case 3:
                console.log("id", response.data.newData);
                if (thisState === 4) {
                    dispatch(registeredDelete(response.data.newData));
                }
                break;

            default:
                break;
        }
        // if (response.data.active) countdownScanning = 120;

        setMessage(
            response.data.message ||
                "Alat tidak terhubung, silakan hubungi Tim IT"
        );
    } catch (error) {
        setMessage("Alat tidak terhubung, silakan hubungi Tim IT");
        setGetMessage(false);
        setStatus(3);
        setCountdownScanning(0);
        setActiveFP(false);
        console.error("Error fetching enrollment status:", error);
    } finally {
        isFetching.current = false;
    }
    // console.log(countdownScanning);
};

export const stopFetching = async () => {
    if (isFetching.current) return; // Skip if already fetching

    isFetching.current = true;
    try {
        const response = await axios.get(`${urlScanner}/stop_fetching`);
        setStatus(response.data.status);
        setCountdownScanning(0);
        setGetMessage(false);
        setMessage(
            response.data.message ||
                "Alat tidak terhubung, silakan hubungi Tim IT"
        );
        // setActiveFP(!!response.data.message);
    } catch (error) {
        setMessage("Alat tidak terhubung, silakan hubungi Tim IT");
        setGetMessage(false);
        setStatus(3);
        setCountdownScanning(0);
        setActiveFP(false);
        console.error("Error fetching enrollment status:", error);
    } finally {
        isFetching.current = false;
    }
};

export const cekFP = async () => {
    try {
        const response = await axios.get(`${urlScanner}/check_fingerprint`);
        setStatus(response.data.status);
        setActiveFP(!!response.data.message);
        // setCountdownScanning(response.data.countdown);
        setGetMessage(
            response.data.countdown > 0 ? response.data.active : false
        );
        // console.log(response.data.countdown);
        // if (response.data.active) countdownScanning = 120;

        setMessage(
            response.data.message ||
                "Alat tidak terhubung, silakan hubungi Tim IT"
        );

        // setStatus(1);
        // setActiveFP(true);
        // // setCountdownScanning(response.data.countdown);
        // setGetMessage(true);
        // // console.log(response.data.countdown);
        // // if (response.data.active) countdownScanning = 120;

        setMessage(
            response?.data?.message ||
                "Alat tidak terhubung, silakan hubungi Tim IT"
        );
    } catch (error) {
        setMessage("Alat tidak terhubung, silakan hubungi Tim IT");
        setGetMessage(false);
        setStatus(3);
        setCountdownScanning(0);
        setActiveFP(false);
        console.error(error);
    }
};

export const getFitur = async (fiturId, id_karyawan = 0) => {
    // setCountdownScanning(120);
    openCloseFitur(fiturId);
    setLoading(true);
    setGetMessage(true);
    try {
        const res = await axios.post(
            `${urlScanner}/fitur`,
            { fiturId, id_karyawan },
            { headers: { "Content-Type": "application/json" } }
        );
        setfloatButtonFitur(false);
    } catch (error) {
        console.error(error);
        setGetMessage(false);
        setCountdownScanning(0);
    } finally {
        setLoading(false);
    }
};
