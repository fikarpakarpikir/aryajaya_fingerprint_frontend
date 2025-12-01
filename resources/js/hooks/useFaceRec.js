import { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "face-api.js";

/**
 * useFaceRecognition
 * - load labeled descriptors ONCE dari daftar face_recs/karyawans
 * - start lightweight detection loop (throttled)
 *
 * Props / env needed from caller:
 * - videoRef (ref to <video> that streams camera)
 * - faceRecs: array of training records { id_karyawan, foto, nama } (or adapt)
 * - kar: current user object (with .nama)
 * - sendPresensi(formData) callback to submit attendance
 */
export default function useFaceRec({
    videoRef,
    faceRecs = [],
    karyawans = [],
    kar,
    onSendPresensi,
    detectionIntervalMs = 800, // how often (ms) we run detection
}) {
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [subMessage, setSubMessage] = useState("");
    const [showCamera, setShowCamera] = useState(false);
    const [scanned, setScanned] = useState(false);

    const [notifError, setNotifError] = useState(false);
    const faceMatcherRef = useRef(null);
    const labeledDescriptorsRef = useRef(null);
    const rafRef = useRef(null);
    const detectionTimerRef = useRef(null);
    const countErrorRef = useRef(7);

    // --------------- 1) load models ---------------
    const loadModels = useCallback(async (modelsPath = "/models") => {
        const models = [
            "tinyFaceDetector",
            "faceLandmark68Net",
            "faceRecognitionNet",
            "faceExpressionNet",
            "ssdMobilenetv1",
        ];
        try {
            setLoading(true);
            // load models needed for descriptor + tiny detector + expressions
            await Promise.all(
                models.map((modelName) =>
                    faceapi.nets[modelName].loadFromUri("/models").then(() => {
                        totalLoaded++; // Tambah setelah satu model selesai
                        setLoadingProgress(
                            Math.round((totalLoaded / models.length) * 100)
                        );
                        setMessage(
                            `Model ${modelName} telah dimuat (${totalLoaded}/${models.length})`
                        );
                    })
                )
            );
            setModelsLoaded(true);
        } catch (err) {
            console.error("Error loading faceapi models:", err);
            setNotifError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    // --------------- 2) utility to load training images and build descriptors (once) ---------------
    const buildLabeledDescriptors = useCallback(
        async (records = [], labelList = []) => {
            // records: faceRecs (has id_karyawan, foto) OR images already loaded
            // labelList: karyawans or labels array for mapping. We'll use karyawans array to generate labels
            if (!modelsLoaded) {
                console.warn("Models not loaded yet.");
                return null;
            }
            try {
                setLoading(true);
                setSubMessage("Memuat data Face ID...");

                // Build map label => images array (if you have mapping)
                // For simplicity: will build images from faceRecs for each karyawan name
                // Adjust based on your real data structure.
                const labelToImages = {};

                // faceRecs assumed to contain images for employees.
                // Group by nama if provided; otherwise by id_karyawan
                records.forEach((rec) => {
                    // rec: { id_karyawan, foto, nama }
                    const label = rec.nama ?? String(rec.id_karyawan);
                    labelToImages[label] = labelToImages[label] || [];
                    labelToImages[label].push(rec);
                });

                // For each label, load images and compute descriptors
                const descriptorsPromises = Object.keys(labelToImages).map(
                    async (label) => {
                        const recs = labelToImages[label];
                        const descriptors = [];

                        // load all images for this label in parallel
                        const imgs = await Promise.all(
                            recs.map(async (r) => {
                                // adjust path as needed
                                const url = `/assets/face_rec/${r.id_karyawan}/${r.foto}.png`;
                                const img = await faceapi.fetchImage(url);
                                // ensure decoded
                                if (img.decode) await img.decode();
                                return img;
                            })
                        );

                        // get descriptor for each image sequentially (can be parallel but sequential helps memory)
                        for (let i = 0; i < imgs.length; i++) {
                            setSubMessage(
                                `Memproses ${label} (${i + 1}/${imgs.length})`
                            );
                            // use detectSingleFace for a single face per training image
                            const detection = await faceapi
                                .detectSingleFace(
                                    imgs[i],
                                    new faceapi.TinyFaceDetectorOptions({
                                        inputSize: 160,
                                    })
                                )
                                .withFaceLandmarks()
                                .withFaceDescriptor();

                            if (detection && detection.descriptor) {
                                descriptors.push(detection.descriptor);
                            } else {
                                console.warn(
                                    `No face detected for ${label} image ${
                                        i + 1
                                    }`
                                );
                            }
                        }

                        return new faceapi.LabeledFaceDescriptors(
                            label,
                            descriptors
                        );
                    }
                );

                const labeledDescriptors = await Promise.all(
                    descriptorsPromises
                );
                // filter out labels with zero descriptors
                const validLabeled = labeledDescriptors.filter(
                    (ld) => ld.descriptors && ld.descriptors.length > 0
                );

                labeledDescriptorsRef.current = validLabeled;
                // create FaceMatcher with a reasonable distance threshold
                faceMatcherRef.current = new faceapi.FaceMatcher(
                    validLabeled,
                    0.5
                );

                setSubMessage("Selesai memuat Face ID");
                return validLabeled;
            } catch (err) {
                console.error("Error building labeled descriptors:", err);
                setNotifError(true);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [modelsLoaded]
    );
    async function detectMultipleFaces(video, faceMatcher) {
        if (!video || video.readyState < 2) return [];

        // deteksi semua wajah dalam satu frame
        const detections = await faceapi
            .detectAllFaces(
                video,
                new faceapi.TinyFaceDetectorOptions({ inputSize: 160 })
            )
            .withFaceLandmarks()
            .withFaceDescriptors();

        if (!detections.length) return [];

        // mapping hasil match
        const results = detections.map((det) => {
            const match = faceMatcher.findBestMatch(det.descriptor);

            return {
                label: match.label, // nama label
                distance: match.distance, // tingkat kemiripan
                box: det.detection.box, // posisi wajah dalam video
                descriptor: det.descriptor, // raw descriptor
            };
        });

        return results;
    }
    function startMultiFaceDetection(videoRef, faceMatcher, callback) {
        const interval = setInterval(async () => {
            const video = videoRef.current;

            const faces = await detectMultipleFaces(video, faceMatcher);

            // berikan ke UI / logic
            callback(faces);
        }, 800); // 800ms sekali → smooth & hemat CPU

        return () => clearInterval(interval);
    }
    function drawFaceBoxes(canvas, faces) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        faces.forEach((f) => {
            const { x, y, width, height } = f.box;
            ctx.strokeStyle = "lime";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            ctx.fillStyle = "lime";
            ctx.fillText(f.label, x, y - 5);
        });
    }

    // --------------- 3) start detection loop ---------------
    const startDetection = useCallback(
        (opts = {}) => {
            if (
                !modelsLoaded ||
                !faceMatcherRef.current ||
                !videoRef?.current
            ) {
                console.warn(
                    "Cannot start detection; missing models/matcher/video"
                );
                return;
            }
            setShowCamera(true);
            setMessage("Wajah Anda sedang dalam pemindaian");
            setSubMessage("---");
            countErrorRef.current = 7;
            setScanned(false);

            // throttle detection using setInterval instead of running at full fps
            if (detectionTimerRef.current)
                clearInterval(detectionTimerRef.current);

            detectionTimerRef.current = setInterval(async () => {
                // guard: if video not ready skip
                const video = videoRef.current;
                if (!video || video.readyState < 2) {
                    // not enough data yet
                    return;
                }

                try {
                    // detect faces in current video frame
                    // use smaller inputSize for speed; adjust threshold as needed
                    const detection = await faceapi
                        .detectSingleFace(
                            video,
                            new faceapi.TinyFaceDetectorOptions({
                                inputSize: 160,
                            })
                        )
                        .withFaceLandmarks()
                        .withFaceDescriptors(); // only if you need expressions

                    if (!detection || !detection.descriptor) {
                        setMessage("Pastikan wajah berada di dalam lingkaran");
                        return;
                    }

                    // find best match
                    const best = faceMatcherRef.current.findBestMatch(
                        detection.descriptor
                    );
                    console.log("Detection match:", best);

                    if (best && best.label) {
                        // Accept only if distance small enough (tweak threshold)
                        if (best.distance <= 0.45) {
                            // optionally check expressions for neutral/happy if you want
                            const expressions = detection.expressions || {};
                            const neutral = expressions.neutral ?? 0;
                            const happy = expressions.happy ?? 0;

                            if (neutral >= 0.7 || happy >= 0.6) {
                                // success
                                setScanned(true);
                                setMessage(`Presensi anda sedang diproses.`);
                                // stop detection & camera
                                stopDetection();
                                // pause stream + stop tracks
                                try {
                                    video.pause();
                                    const tracks =
                                        video.srcObject?.getTracks() || [];
                                    tracks.forEach((t) => t.stop());
                                } catch (err) {
                                    console.warn(
                                        "Error stopping video tracks:",
                                        err
                                    );
                                }

                                // Send presensi with geolocation (wrap in try)
                                if (navigator.geolocation) {
                                    navigator.geolocation.getCurrentPosition(
                                        (position) => {
                                            const coords = position.coords;
                                            const data = {
                                                latitude: coords.latitude,
                                                longitude: coords.longitude,
                                            };
                                            if (
                                                typeof onSendPresensi ===
                                                "function"
                                            ) {
                                                onSendPresensi(data);
                                            }
                                        },
                                        (error) => {
                                            console.warn(
                                                "Geolocation error:",
                                                error
                                            );
                                            // fallback coords if desired
                                            if (
                                                typeof onSendPresensi ===
                                                "function"
                                            ) {
                                                onSendPresensi({
                                                    latitude: -6.9550149,
                                                    longitude: 107.6327055,
                                                });
                                            }
                                        },
                                        {
                                            enableHighAccuracy: true,
                                            timeout: 10000,
                                            maximumAge: 0,
                                        }
                                    );
                                } else {
                                    if (typeof onSendPresensi === "function") {
                                        onSendPresensi({});
                                    }
                                }
                                return;
                            } else {
                                setMessage(
                                    "Tolong tunjukkan ekspresi netral/baik agar verifikasi lebih akurat"
                                );
                            }
                        } else {
                            setMessage(
                                "Pastikan wajah terlihat jelas dan dekat dengan kamera"
                            );
                        }
                    }
                } catch (err) {
                    // degrade gracefully if faceapi throws
                    console.error("Face detection loop error:", err);
                    countErrorRef.current -= 1;
                    if (countErrorRef.current <= 0) {
                        setNotifError(true);
                        setMessageError?.("Pemindaian Gagal");
                        setSubMessage?.(
                            "Silakan cek jaringan atau kecerahan tempat Anda"
                        );
                        stopDetection();
                        // stop video tracks
                        try {
                            const video = videoRef.current;
                            if (video) {
                                video.pause();
                                video.srcObject
                                    ?.getTracks()
                                    ?.forEach((t) => t.stop());
                            }
                        } catch (e) {
                            console.warn(
                                "Error stopping video after failure:",
                                e
                            );
                        }
                    }
                }
            }, detectionIntervalMs);
        },
        [modelsLoaded, videoRef, kar, onSendPresensi, detectionIntervalMs]
    );

    // --------------- stop detection & cleanup ---------------
    const stopDetection = useCallback(() => {
        if (detectionTimerRef.current) {
            clearInterval(detectionTimerRef.current);
            detectionTimerRef.current = null;
        }
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        setShowCamera(false);
    }, []);

    // cleanup on unmount
    useEffect(() => {
        return () => {
            stopDetection();
            // stop camera if still active
            try {
                const v = videoRef?.current;
                if (v && v.srcObject) {
                    v.pause();
                    v.srcObject.getTracks().forEach((t) => t.stop());
                }
            } catch (e) {
                // noop
            }
        };
    }, [stopDetection, videoRef]);

    return {
        // state
        modelsLoaded,
        loading,
        message,
        subMessage,
        showCamera,
        scanned,

        notifError,
        // actions
        loadModels,
        buildLabeledDescriptors,
        startDetection,
        stopDetection,
        // refs for advanced usage
        faceMatcherRef,
        labeledDescriptorsRef,
    };
}
