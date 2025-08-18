import { useEffect } from "react";
import { useFaceContext } from "@/context/FaceContext";

export default function useFaceDetection(faceMyDetect) {
    const {
        isLoadedModels,
        videoRef,
        dataUser,
        dataFaceID,
        notifError,
        hasDetectedRef,
        isMustRegist,
    } = useFaceContext();

    useEffect(() => {
        if (
            isLoadedModels &&
            videoRef &&
            dataUser &&
            dataFaceID?.length >= 2 &&
            !notifError &&
            !hasDetectedRef.current &&
            !isMustRegist
        ) {
            hasDetectedRef.current = true;
            faceMyDetect();
        }
    }, [dataFaceID, isLoadedModels]);
}
