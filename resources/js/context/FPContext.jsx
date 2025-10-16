import axios from "axios";
import React, { createContext, useContext, useRef, useState } from "react";
import { useSelector } from "react-redux";

const FPContext = createContext({
    videoRef: null,
    hasDetectedRef: { current: false },
    listKaryawans: [],
    setListKaryawans: () => {},
    activeFP: true,
    setActiveFP: () => {},
    countdownScanning: 0,
    setCountdownScanning: () => {},
    status: 0,
    setStatus: () => {},
    notifError: false,
    setNotifError: () => {},
    loading: true,
    setLoading: () => {},
    message: "",
    setMessage: () => {},
    getMessage: false,
    setGetMessage: () => {},
    subMessage: "",
    setSubMessage: () => {},
    notif: false,
    setNotif: () => {},
    notifKosong: false,
    setNotifKosong: () => {},
    goToHome: () => {},
    getFitur: () => {},
    cekFP: () => {},
    stopFetching: () => {},
    fetchAlat: () => {},
});

export function FPProvider({ children }) {
    const videoRef = useRef(null);
    const hasDetectedRef = useRef(false);
    const isFetching = useRef(false); // Ref to prevent concurrent fetches

    const { urlScanner } = useSelector((state) => state.fingerprints);

    // === State Global ===
    const [activeFP, setActiveFP] = useState(true);
    const [countdownScanning, setCountdownScanning] = useState(0);
    const [status, setStatus] = useState(0);

    const [listKaryawans, setListKaryawans] = useState(null);
    const [notifError, setNotifError] = useState(false);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [getMessage, setGetMessage] = useState(false);
    const [subMessage, setSubMessage] = useState("");
    const [notif, setNotif] = useState(false);
    const [notifKosong, setNotifKosong] = useState(false);

    function goToHome(time = 3000) {
        setTimeout(() => {
            location.replace(route("home"));
        }, time);
    }

    const getFitur = async (fiturId, id_karyawan = 0) => {
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

    const cekFP = async () => {
        try {
            const response = await axios.get(`${urlScanner}/check_fingerprint`);
            const { status, message, countdown, active } = response.data;
            setStatus(status);
            setActiveFP(!!message);
            setGetMessage(countdown > 0 ? active : false);
            setMessage(
                message || "Alat tidak terhubung, silakan hubungi Tim IT"
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

    const stopFetching = async () => {
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

    const fetchAlat = async () => {
        if (!urlScanner) {
            setActiveFP(false);
            setMessage("URL scanner tidak valid");
            return;
        }
        try {
            const res = await axios.get(`${urlScanner}/check_fingerprint`);
            setActiveFP(res.data.message ? true : false);
            setMessage(
                res.data.message
                    ? res.data.message
                    : "Alat tidak terhubung, silakan hubungi Tim IT"
            );
        } catch (error) {
            console.error(error);
            setActiveFP(false);
            setMessage("Alat tidak terhubung, silakan hubungi Tim IT");
        }
    };

    const value = {
        // refs
        videoRef,
        hasDetectedRef,

        // state
        listKaryawans,
        setListKaryawans,
        activeFP,
        setActiveFP,
        countdownScanning,
        setCountdownScanning,
        status,
        setStatus,

        notifError,
        setNotifError,
        loading,
        setLoading,
        message,
        setMessage,
        getMessage,
        setGetMessage,
        subMessage,
        setSubMessage,
        notif,
        setNotif,
        notifKosong,
        setNotifKosong,

        // functions
        goToHome,
        getFitur,
        cekFP,
        stopFetching,
        fetchAlat,
    };

    return <FPContext.Provider value={value}>{children}</FPContext.Provider>;
}

export const useFPContext = () => useContext(FPContext);
