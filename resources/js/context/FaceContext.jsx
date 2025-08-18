import React, { createContext, useContext, useRef, useState } from "react";

const FaceContext = createContext();

export function FaceProvider({ children }) {
    const videoRef = useRef(null);
    const hasDetectedRef = useRef(false);

    // === State Global ===
    const [dataFaceID, setDataFaceID] = useState([]);
    const [notifError, setNotifError] = useState(false);
    const [isMustRegist, setIsMustRegist] = useState(false);
    const [isCameraDenied, setIsCameraDenied] = useState(false);
    const [isLoadedModels, setIsLoadedModels] = useState(false);
    const [speedNetwork, setSpeedNetwork] = useState(null);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
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
        dataFaceID,
        setDataFaceID,
        notifError,
        setNotifError,
        isMustRegist,
        setIsMustRegist,
        isCameraDenied,
        setIsCameraDenied,
        isLoadedModels,
        setIsLoadedModels,
        speedNetwork,
        setSpeedNetwork,
        loading,
        setLoading,
        message,
        setMessage,
        subMessage,
        setSubMessage,
        notif,
        setNotif,
        notifKosong,
        setNotifKosong,
        // functions
        goToHome,
    };

    return (
        <FaceContext.Provider value={value}>{children}</FaceContext.Provider>
    );
}

export const useFaceContext = () => useContext(FaceContext);
