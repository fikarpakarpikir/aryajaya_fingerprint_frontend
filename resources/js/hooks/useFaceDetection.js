import { useEffect } from "react";
import { useFaceContext } from "@/context/FaceContext";

// export default function useFaceDetection(faceMyDetect) {
//     const {
//         isLoadedModels,
//         videoRef,
//         dataFaceID,
//         notifError,
//         hasDetectedRef,
//         isMustRegist,
//     } = useFaceContext();

//     useEffect(() => {
//         if (
//             isLoadedModels &&
//             videoRef &&
//             dataFaceID?.length >= 1 &&
//             !notifError &&
//             !hasDetectedRef.current
//         ) {
//             hasDetectedRef.current = true;
//             faceMyDetect();
//             console.log("🚀 ~ useFaceDetection ~ cek");
//         }
//     }, [dataFaceID, isLoadedModels]);
// }

export default function useFaceDetection(faceMatcher, onResults) {
    const {
        isLoadedModels,
        videoRef,
        dataFaceID,
        notifError,
        hasDetectedRef,
        isMustRegist,
    } = useFaceContext();
    useEffect(() => {
        if (!isLoadedModels) return;
        if (!videoRef?.current || !faceMatcher) return;

        let interval;
        let animationId;

        const detectLoop = async () => {
            const video = videoRef.current;

            if (!video || video.readyState < 2) {
                animationId = requestAnimationFrame(detectLoop);
                return;
            }

            const detections = await faceapi
                .detectAllFaces(
                    video,
                    new faceapi.TinyFaceDetectorOptions({ inputSize: 256 })
                )
                .withFaceLandmarks()
                .withFaceDescriptors();

            if (!detections.length) {
                onResults([]);
                animationId = requestAnimationFrame(detectLoop);
                return;
            }
            const resized = faceapi.resizeResults(detections, {
                width: video.videoWidth,
                height: video.videoHeight,
            });
            const results = resized.map((det) => {
                const match = faceMatcher.findBestMatch(det.descriptor);

                return {
                    label: match.label,
                    distance: match.distance,
                    box: det.detection.box,
                    descriptor: det.descriptor,
                };
            });
            console.log("🚀 ~ detectLoop ~ results:", results);

            onResults(results);
            animationId = requestAnimationFrame(detectLoop);
        };

        animationId = requestAnimationFrame(detectLoop);

        return () => cancelAnimationFrame(animationId);
    }, [videoRef, faceMatcher, onResults]);
}

export async function loadLabeledData(dataFaceID, karyawans, setSubMessage) {
    const labels = karyawans.map((k) => k.nama);

    const labeled = await Promise.all(
        labels.map(async (label) => {
            const descriptions = [];

            for (let i = 0; i < dataFaceID.length; i++) {
                setSubMessage(`Memproses Face ID ${i + 1}`);

                const det = await faceapi
                    .detectSingleFace(dataFaceID[i])
                    .withFaceLandmarks()
                    .withFaceDescriptor();

                if (det) descriptions.push(det.descriptor);
            }

            return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
    );

    return labeled;
}
