import React, { createContext, useContext, useRef, useState } from "react";

const FPContext = createContext();

export function FPProvider({ children }) {
    const videoRef = useRef(null);
    const hasDetectedRef = useRef(false);

    // === State Global ===
    const [activeFP, setActiveFP] = useState(true);
    const [countdownScanning, setCountdownScanning] = useState(0);
    const [status, setStatus] = useState(0);

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

    const value = {
        // refs
        videoRef,
        hasDetectedRef,
        // state
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
    };

    return <FPContext.Provider value={value}>{children}</FPContext.Provider>;
}

export const useFPContext = () => useContext(FPContext);
