import * as faceapi from "face-api.js";
import React, { useEffect, useRef, useState } from "react";

import LoadingSystem from "@/Components/pre-load/loading-system";
import { timeDiff } from "@/Functions/fullDateDiff";
import { usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import sendDataGeneral from "@/Functions/sendDataGeneral";
// import Clock from "@/Functions/clock";
import {
    processMessageFailedReducer,
    processStateReducer,
} from "@/redux/slices/ProcessStateSlice";
// import { RealTimeClock } from "./Clock";
import { useFaceApiCache } from "@/Functions/indexedDBConfig";
import { NotifRulesDaftar } from "./NotifRulesDaftar";
import { NotifCameraNotAllowed } from "./NotifCameraNotAllowed";
import { LoadingProgressBar } from "./LoadingProgressBar";
import { NotifGeneral } from "./NotifGeneral";
import { RefreshButton } from "./RefreshButton";
import useCameraAndModels from "@/hooks/useCameraAndModels";
import useFaceDetection from "@/hooks/useFaceDetection";
import usePresensiCheck from "@/hooks/usePresensiCheck";
import { RealTimeClock } from "../Clock";
import { FaceProvider, useFaceContext } from "@/context/FaceContext";
import { faSun, faSync, faVideo } from "@fortawesome/free-solid-svg-icons";
import fullWaktuIndo from "@/Functions/waktuIndo";
import SyncFaceID from "../Sync";

function FaceRecog() {
    const DETECTION_INTERVAL_MS = 1000; // 1s per check (ubah kalau perlu)
    const MATCH_DISTANCE_THRESHOLD = 0.45; // rekomendasi: 0.4-0.6 tergantung model/data
    const TINY_OPTIONS = new faceapi.TinyFaceDetectorOptions({
        inputSize: 224,
        scoreThreshold: 0.5,
    });

    const { props } = usePage();
    const { karyawans, face_recs } = props;
    const isReadyToShowCam = !true;

    const {
        videoRef,
        loading,
        setLoading,
        message,
        setMessage,
        subMessage,
        setSubMessage,
        isLoadedModels,
        setIsLoadedModels,
        dataFaceID,
        setDataFaceID,
    } = useFaceContext();

    const isSendingRef = useRef(false);
    const labeledDescriptorsRef = useRef(null);
    const faceMatcherRef = useRef(null);
    const canvasRef = useRef(null);

    const [faceMatcher, setFaceMatcher] = useState(null);
    const [results, setResults] = useState([]);

    const hasDetectedRef = useRef(false);
    useFaceApiCache();

    const [jadwal, setJadwal] = useState(props.jadwalKerja?.jadwal?.[0]);
    const [cekJadwal, setCekJadwal] = useState(props.jadwalKerja?.cek);
    const [presensi, setPresensi] = useState(props.jadwalKerja?.presensi?.[0]);

    const [showCamera, setShowCamera] = useState(false);
    const [done, setDone] = useState(false);
    const [buttonRefresh, setButtonRefresh] = useState(false);
    const [notifError, setNotifError] = useState(false);
    const [messageError, setMessageError] = useState(
        "Pemindaian mengalami masalah"
    );
    // const jarakWaktu = timeDiff(jadwal?.mulai, waktuSekarang);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const [brightnessCam, setBrightnessCam] = useState(1);

    const [countDown, setCountdown] = useState(false);
    const [countDownNumber, setCountdownNumber] = useState(3);
    const [videoStopped, setVideoStopped] = useState(false);

    // const viewportWidth =
    //     window.innerWidth ||
    //     document.documentElement.clientWidth ||
    //     document.body.clientWidth;
    // const newWidth = viewportWidth * 0.7; // Adjust this value as needed
    const [isCameraDenied, setIsCameraDenied] = useState(false);

    // usePresensiCheck(presensi);

    // useFaceDetection(faceMyDetect);
    useCameraAndModels({ loadModels, fetchData });

    useEffect(() => {
        async function prepareMatcher() {
            console.log("🚀 ~ prepareMatcher ~ cek");
            if (!dataFaceID.length) return;

            const labeled = await getLabeledFaceDescriptions();
            console.log("🚀 ~ prepareMatcher ~ labeled:", labeled);
            const matcher = new faceapi.FaceMatcher(labeled, 0.5);

            setFaceMatcher(matcher);
        }

        prepareMatcher();
        console.log("🚀 ~ FaceRecog ~ dataFaceID:", dataFaceID);
    }, [dataFaceID]);

    useFaceDetection(faceMatcher, setResults);

    useEffect(() => {
        if (!results.length) return;

        const found = results.find(
            (r) => r.label === kar.nama && r.distance < 0.45
        );

        if (found) {
            console.log("Wajah ditemukan:", found);

            // lanjut presensi kamu di sini…
        }
    }, [results]);

    useEffect(() => {
        if (!videoRef?.current) return;

        const video = videoRef.current;
        const canvas = faceapi.createCanvasFromMedia(video);
        canvas.style.position = "absolute";
        canvas.style.top = "0";
        canvas.style.left = "0";

        video.parentNode.appendChild(canvas);

        const interval = setInterval(() => {
            if (!results || !results.length) {
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            faceapi.matchDimensions(canvas, {
                width: video.videoWidth,
                height: video.videoHeight,
            });

            const resized = results.map((res) => ({
                ...res,
                box: res.box,
            }));

            canvas
                .getContext("2d")
                .clearRect(0, 0, canvas.width, canvas.height);

            resized.forEach((res) => {
                const draw = new faceapi.draw.DrawBox(res.box, {
                    label: `${res.label} (${res.distance.toFixed(2)})`,
                });
                draw.draw(canvas);
            });
        }, 200);

        return () => clearInterval(interval);
    }, [results]);

    async function fetchData() {
        // try {
        if (!face_recs || face_recs.length === 0) {
            console.warn("No face_recs provided.");
            setMessageError("Tidak Face ID yang terdaftar");
            return;
        }

        // Load and decode all images in parallel
        const imgs = await Promise.all(
            face_recs.map(async (item) => {
                const url = `/assets/face_rec/${item.id_karyawan}/${item.foto}.png`;
                const img = await faceapi.fetchImage(url);
                // ensure decoded
                if (img.decode) await img.decode();
                return { img, id_karyawan: item.id_karyawan, foto: item.foto };
            })
        );

        // we will keep an array of images per label if you have multiple images per label later
        setDataFaceID(imgs);
        setShowCamera(true);
        // } catch (error) {
        //     console.error("Error fetching user data:", error);
        // }
    }

    async function loadModels() {
        const models = [
            "tinyFaceDetector",
            "faceLandmark68Net",
            "faceRecognitionNet",
            // "ssdMobilenetv1",
        ];

        try {
            setMessage("Memuat model...");
            setLoadingProgress(0);
            let totalLoaded = 0;

            if (isReadyToShowCam) {
                await Promise.all(
                    models.map((modelName) =>
                        faceapi.nets[modelName]
                            .loadFromUri("/models")
                            .then(() => {
                                totalLoaded++; // Tambah setelah satu model selesai
                                setLoadingProgress(
                                    Math.round(
                                        (totalLoaded / models.length) * 100
                                    )
                                );
                                setMessage(
                                    `Model ${modelName} telah dimuat (${totalLoaded}/${models.length})`
                                );
                            })
                    )
                );
            }

            // Semua model selesai dimuat
            if (totalLoaded === models.length) {
                setIsLoadedModels(true);
                setMessage("Semua model telah dimuat. Tunggu...");

                setShowCamera(true);
                startVideo();
            }
        } catch (error) {
            console.error("Gagal memuat model:", error);
            setMessage("Terjadi kesalahan saat memuat model.");
        }
    }

    const startVideo = () => {
        navigator.mediaDevices
            .getUserMedia({
                video: {
                    // width: { min: 576, ideal: 720, max: 1080 },
                    // height: { min: 576, ideal: 720, max: 1080 },
                    facingMode: "user",
                },
            })
            .then((currentStream) => {
                videoRef.current.srcObject = currentStream;
                videoRef.current.onloadedmetadata = () => {
                    if (isCameraDenied) setIsCameraDenied(false);
                    setLoading(false);
                    setMessage(
                        "Kamera aktif, Wajah Anda sedang dalam pemindaian..."
                    );
                    setSubMessage("---");
                };
            })
            .catch((err) => {
                console.log(err);
                setMessage(
                    "Kamera harus diizinkan. Silakan klik Izinkan Kamera"
                );

                if (!isCameraDenied) {
                    setIsCameraDenied(true);
                }
            });
    };
    const stopVideo = () => {
        const video = videoRef.current;

        if (video && video.srcObject) {
            const stream = video.srcObject;
            const tracks = stream.getTracks();

            tracks.forEach((track) => track.stop()); // HENTIKAN SEMUA TRACK
            video.srcObject = null; // Lepas dari elemen video
        }
    };

    async function getLabeledFaceDescriptions() {
        const labels = karyawans.flatMap((item) => item.nama);

        // console.log(dataFaceID);
        if (!dataFaceID?.length) {
            console.warn("Data Face ID atau gambar tidak ditemukan.");
            return;
        }

        try {
            setSubMessage("Memproses data Face ID...");

            const labeled = await Promise.all(
                labels.map(async (label) => {
                    const descriptions = [];

                    // if you have specific mapping between label and images, filter imgItems accordingly.
                    // Here we attempt to detect faces across all provided images (you can refine).
                    for (let i = 0; i < dataFaceID.length; i++) {
                        const imgEl = dataFaceID[i].img;
                        const det = await faceapi
                            .detectSingleFace(imgEl, TINY_OPTIONS)
                            .withFaceLandmarks()
                            .withFaceDescriptor(); // descriptor untuk matcher

                        if (det && det.descriptor) {
                            descriptions.push(det.descriptor);
                        }
                        //  else {
                        //     // tidak selalu fatal; bisa jadi gambar tidak cocok
                        //     console.warn(
                        //         `No face detected in training image ${
                        //             i + 1
                        //         } for ${label}`
                        //     );
                        // }
                    }

                    if (descriptions.length === 0) {
                        console.warn(
                            `No descriptors for label ${label} — skipping`
                        );
                        return null;
                    }

                    return new faceapi.LabeledFaceDescriptors(
                        label,
                        descriptions
                    );
                })
            );
            return labeled;

            // remove nulls
            // const filtered = labeled.filter(Boolean);
            // labeledDescriptorsRef.current = filtered;
            // // create faceMatcher
            // faceMatcherRef.current = new faceapi.FaceMatcher(
            //     filtered,
            //     MATCH_DISTANCE_THRESHOLD
            // );
            // setSubMessage("Face ID siap");
            // return filtered;
        } catch (error) {
            console.error("Error saat memproses data Face ID:", error);
        }
    }

    const createFormData = (coord) => {
        const form = new FormData();
        form.append("jenis", cekJadwal);
        Number(cekJadwal) === 1 && form.append("id", presensi?.id);
        form.append("id_karyawan", kar.id);
        form.append("id_jaker", jadwal.id);
        form.append("long", coord.longitude);
        form.append("lat", coord.latitude);
        return form;
    };

    const sendPresensi = async (data) => {
        if (isSendingRef.current) return; // Prevent duplicate execution
        isSendingRef.current = true;
        try {
            const sendData = await sendDataGeneral({
                data: data,
                route: route("Presensi.store"),
                handleClose: () => setDone(true),
                waitUntilFinish: true,
                onProgress: setLoadingProgress,
            });
            // setLoading(true)

            if (sendData.status === 200) {
                // location.reload();
                // setLoading(false)
                isSendingRef.current = false;
                setDone(true);
                setTimeout(() => {
                    // location.reload()
                    // window.open('/')
                    location.replace("/");
                }, 5000);
            } else {
                setButtonRefresh(true);
                setNotifError(true);
                setDone(false);
                setSubMessage(sendData.data?.error);

                console.log("====================================");
                console.log("Error response: ", sendData);
                console.log("====================================");
            }
        } catch (error) {
            setButtonRefresh(true);
            setNotifError(true);
            setDone(false);
            setSubMessage(
                error.data?.error ??
                    "Ada kesalahan dalam pengiriman data ke server, silakan hubungi tim IT"
            );
            console.log("====================================");
            console.log("Error response: ", error);
            console.log("====================================");
            isSendingRef.current = false;
        }
    };

    const testDetect = async () => {
        const res = await faceapi.detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions({ inputSize: 256 })
        );
        console.log("Test detect:", res);
    };

    async function faceMyDetect() {
        let countError = 7;
        let kurangCahaya = 15;
        let i = 5;
        let intervalPresensi; // Define intervalPresensi in a wider scope
        // startVideo();
        setMessage("Sedang dalam pemindaian");
        setSubMessage("---");

        if (videoRef) {
            const detectLoop = async () => {
                const video = videoRef.current;

                if (!video || video.readyState < 2) return;

                const detections = await faceapi
                    .detectAllFaces(
                        video,
                        new faceapi.TinyFaceDetectorOptions({ inputSize: 160 })
                    )
                    .withFaceLandmarks()
                    .withFaceDescriptors();

                if (!detections.length) {
                    onResults([]);
                    return;
                }

                const results = detections.map((det) => {
                    const match = faceMatcher.findBestMatch(det.descriptor);

                    return {
                        label: match.label,
                        distance: match.distance,
                        box: det.detection.box,
                        descriptor: det.descriptor,
                    };
                });

                onResults(results);
            };

            interval = setInterval(detectLoop, 800); // 800ms agar ringan

            return () => clearInterval(interval);
            intervalPresensi = setInterval(async () => {
                try {
                    const labeledFaceDescriptors =
                        await getLabeledFaceDescriptions();
                    const faceMatcher = new faceapi.FaceMatcher(
                        labeledFaceDescriptors
                    );
                    const detections = await faceapi
                        .detectAllFaces(
                            videoRef.current,
                            new faceapi.TinyFaceDetectorOptions()
                        )
                        .withFaceDescriptors();

                    const displaySize = {
                        width: videoRef.current.videoWidth,
                        height: videoRef.current.videoHeight,
                    };
                    const resizedDetections = faceapi.resizeResults(
                        detections,
                        displaySize
                    );

                    const results = resizedDetections.map((d) => {
                        return faceMatcher.findBestMatch(d?.descriptor);
                    });
                    console.log("🚀 ~ faceMyDetect ~ results:", results);

                    if (results.length > 0 && results[0]) {
                        if (results[0]._label == kar.nama) {
                            if (results[0]._distance >= 0.37) {
                                // console.log("====================================");
                                // console.log(detections[0].expressions.neutral);
                                // console.log("====================================");
                                // if (detections[0].expressions.happy >= 0.8) {
                                // DEVELOPING USE NEUTRAL
                                const expression = detections[0].expressions;
                                if (
                                    expression.neutral >= 0.75 ||
                                    expression.happy >= 0.65
                                ) {
                                    // j--;
                                    // console.log("oke");
                                    try {
                                        if (navigator.geolocation) {
                                            navigator.geolocation.getCurrentPosition(
                                                function (position) {
                                                    const data = createFormData(
                                                        position.coords
                                                    );
                                                    sendPresensi(data);
                                                    setShowCamera(false);
                                                    // console.log(data);
                                                    //   setLatitude(position.coords.latitude);
                                                    //   setLongitude(position.coords.longitude);
                                                    setMessage(
                                                        "Hai " +
                                                            kar?.nama +
                                                            ". Presensi anda sedang di proses, silakan tunggu"
                                                    );
                                                    videoRef.current.pause();
                                                    videoRef.current.srcObject
                                                        .getTracks()
                                                        .forEach((track) => {
                                                            track.stop();
                                                        });
                                                },
                                                function (error) {
                                                    switch (error.code) {
                                                        case error.PERMISSION_DENIED:
                                                            alert(
                                                                "Izin lokasi ditolak oleh pengguna."
                                                            );
                                                            break;
                                                        case error.POSITION_UNAVAILABLE:
                                                            // alert(
                                                            //     "Lokasi tidak tersedia."
                                                            // );
                                                            const data =
                                                                createFormData({
                                                                    longitude: 107.6327055,
                                                                    latitude:
                                                                        -6.9550149,
                                                                });
                                                            sendPresensi(data);
                                                            setShowCamera(
                                                                false
                                                            );
                                                            // console.log(data);
                                                            //   setLatitude(position.coords.latitude);
                                                            //   setLongitude(position.coords.longitude);
                                                            setMessage(
                                                                "Hai " +
                                                                    kar?.nama +
                                                                    ". Presensi anda sedang di proses, silakan tunggu"
                                                            );
                                                            videoRef.current.pause();
                                                            videoRef.current.srcObject
                                                                .getTracks()
                                                                .forEach(
                                                                    (track) => {
                                                                        track.stop();
                                                                    }
                                                                );
                                                            break;
                                                        case error.TIMEOUT:
                                                            alert(
                                                                "Permintaan lokasi melebihi waktu tunggu."
                                                            );
                                                            break;
                                                        case error.UNKNOWN_ERROR:
                                                        default:
                                                            alert(
                                                                "Terjadi kesalahan saat mengambil lokasi."
                                                            );
                                                            break;
                                                    }
                                                    clearInterval(
                                                        intervalPresensi
                                                    );
                                                },
                                                {
                                                    enableHighAccuracy: true, // <= opsi penting untuk lokasi lebih akurat
                                                    timeout: 10000, // maksimal 10 detik menunggu
                                                    maximumAge: 0, // jangan gunakan cache lokasi lama
                                                }
                                            );
                                            clearInterval(intervalPresensi);
                                        } else {
                                            alert(
                                                "Geolocation is not supported by your browser."
                                            );
                                        }
                                    } catch (error) {
                                        console.log(error);
                                    }
                                }
                            } else {
                                kurangCahaya--;
                                if (kurangCahaya > 7 && kurangCahaya <= 9) {
                                    setMessage(
                                        "Pastikan wajah mendapatkan cahaya yang cukup"
                                    );
                                } else if (
                                    kurangCahaya > 5 &&
                                    kurangCahaya <= 7
                                ) {
                                    setMessage(
                                        "Silakan cari posisi yang cukup cahaya"
                                    );
                                } else if (
                                    kurangCahaya > 0 &&
                                    kurangCahaya <= 5
                                ) {
                                    setMessage(
                                        "Jika masih tidak terdeteksi, sistem akan merefresh otomatis dalam 5 detik"
                                    );
                                } else if (kurangCahaya <= 0) {
                                    location.reload();
                                }
                            }
                        } else {
                            setMessage(
                                "Pastikan tidak ada orang lain yang tertangkap kamera"
                            );
                        }
                    } else {
                        setMessage("Pastikan wajah berada di dalam lingkaran");
                    }
                } catch (error) {
                    // Handle the error when face detection fails
                    countError--;
                    console.log(countError);
                    if (countError <= 0) {
                        clearInterval(intervalPresensi);
                        setLoading(false);
                        setShowCamera(false);
                        setNotifError(true);
                        setMessageError("Pemindaian Gagal");
                        setSubMessage(
                            "silakan cek jaringan atau kecerahan tempat ada"
                        );
                        console.error("Face detection error:", error);
                        videoRef.current.pause();
                        videoRef.current.srcObject
                            .getTracks()
                            .forEach((track) => {
                                track.stop();
                            });
                        setTimeout(() => {
                            location.reload();
                        }, 5000);
                    }
                }
            }, 3000);
        }
    }

    const faceMyExp = (idEks_in) => {
        let i = 3;
        let expression, threshold;
        const interval1 = setInterval(async () => {
            // console.log("ini");
            const detections = await faceapi
                .detectAllFaces(
                    videoRef.current,
                    new faceapi.TinyFaceDetectorOptions()
                )
                .withFaceLandmarks()
                .withFaceExpressions();

            if (idEks_in == 1) {
                setMessage("Anda harus berekspresi biasa saja (netral)");
                expression = "neutral";
                threshold = 0.85;
            } else if (idEks_in == 2) {
                setMessage("Anda harus senyum");
                expression = "happy";
                threshold = 0.81;
            }
            if (
                detections.length > 0 &&
                detections[0].expressions[expression] >= threshold
            ) {
                setSubMessage("-");
                setCountdown(true);
                setCountdownNumber(i);

                if (i == 1) {
                }
                if (i == 0) {
                }

                if (i <= -1) {
                    setLoadingProgress(0);
                    setCountdown(false);
                    const canvas = document.createElement("canvas");
                    canvas.width = videoRef.current.videoWidth;
                    canvas.height = videoRef.current.videoHeight;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(
                        videoRef.current,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    const squareSize = Math.min(canvas.width, canvas.height);
                    const xOffset = (canvas.width - squareSize) / 2;
                    const yOffset = (canvas.height - squareSize) / 2;

                    const squareCanvas = document.createElement("canvas");
                    squareCanvas.width = squareSize;
                    squareCanvas.height = squareSize;
                    const squareCtx = squareCanvas.getContext("2d");
                    squareCtx.drawImage(
                        canvas,
                        xOffset,
                        yOffset,
                        squareSize,
                        squareSize,
                        0,
                        0,
                        squareSize,
                        squareSize
                    );

                    const screenshotDataUrl =
                        squareCanvas.toDataURL("image/png");
                    videoRef.current.pause();
                    videoRef.current.srcObject.getTracks().forEach((track) => {
                        track.stop();
                    });
                    switch (idEks_in) {
                        case 1:
                            setScreenshotNeutral(screenshotDataUrl);
                            break;
                        case 2:
                            setScreenshotHappy(screenshotDataUrl);
                            setShowCamera(false);
                            break;

                        default:
                            break;
                    }
                    clearInterval(interval1);
                }
                i--;
            } else {
                setSubMessage(
                    "Silakan berkedip atau gerakanna kepala Anda sedikit"
                );
            }

            if (videoStopped) {
                setScreenshotNeutral(null);
                setVideoStopped(false);
                // restartVideo();
                clearInterval(interval1);
            }
        }, 1000);
    };

    return (
        <>
            {isCameraDenied && <NotifCameraNotAllowed show={isCameraDenied} />}
            {loading && <LoadingSystem />}

            {!notifError && !done && (
                <LoadingProgressBar
                    progress={loadingProgress}
                    message={message}
                    subMessage={subMessage}
                />
            )}
            {showCamera && (
                <>
                    <div
                        className="items-center mx-auto rounded-lg my-6 bg-white shadow -lg w-[70%] h-fit"
                        // style={{
                        //     width: `${newWidth > 568 ? 500 : newWidth}px`,
                        //     height: `${newWidth > 568 ? 500 : newWidth}px`,
                        // }}
                    >
                        <div className="relative w-full h-full rounded-lg">
                            {countDown && (
                                <div className="absolute z-40 inset-0 p-1 mt-3 text-center ">
                                    <span className="fs-6 font-bold badge text-white px-8 bg-amber-500 mt-5">
                                        Tahan posisi
                                    </span>
                                    <div
                                        id="status_hasil"
                                        className="text-center mt-10"
                                    >
                                        <span
                                            id="count"
                                            className="text-7xl opacity-80 font-bold text-white"
                                        >
                                            {countDownNumber}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* <img
                                src="/assets/instruments/circle-frame-white.png"
                                id="frame"
                                className="absolute rounded-lg w-full h-full opacity-70 z-30 shadow-lg"
                            /> */}
                            <video
                                className="cam-face-recog -scale-x-100 w-full h-full rounded-lg"
                                crossOrigin="anonymous"
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                style={{
                                    filter: `brightness(${brightnessCam})`,
                                }}
                            ></video>
                            <canvas
                                ref={canvasRef}
                                width={videoRef.current?.videoWidth}
                                height={videoRef.current?.videoHeight}
                            />
                        </div>
                    </div>

                    <div className="absolute left-0 inset-y-0 my-auto h-[325px] bg-white border-r-2 border-primary shadow py-2 px-1 rounded-lg flex flex-col items-center justify-between gap-2">
                        <label
                            htmlFor="brightness-range"
                            className="text-sm font-medium text-gray-900
                                flex flex-col gap-2 mt-3"
                        >
                            {/* Atur <br /> Kecerahan: */}
                            <FontAwesomeIcon
                                icon={faSun}
                                size="2xl"
                                className="text-amber-500"
                            />
                            {Math.round(brightnessCam * 100)}%
                        </label>
                        <div className="flex items-center gap-4 mt-4">
                            <input
                                id="brightness-range"
                                type="range"
                                min="0"
                                max="2"
                                step="0.1"
                                value={brightnessCam}
                                onChange={(e) =>
                                    setBrightnessCam(parseFloat(e.target.value))
                                }
                                className="w-48 h-2 -rotate-90 -m-24
                                    bg-gray-200 rounded-lg
                                    accent-amber-500
                                    appearance-none cursor-pointer"
                            />
                            <div className="flex flex-col-reverse text-start justify-between h-48 text-sm text-gray-500 ">
                                <span>0</span>
                                <span>50</span>
                                <span>100</span>
                                <span>150</span>
                                <span>200</span>
                            </div>
                        </div>
                        <span className="text-gray-500 italic text-2xs">
                            Atur Kecerahan
                        </span>
                    </div>
                </>
            )}
            <button onClick={testDetect}>Test Detect</button>

            <div className="mt-4">
                <h3>Hasil Deteksi:</h3>
                <pre>{JSON.stringify(results, null, 2)}</pre>
            </div>

            {!notifError && done && (
                <>
                    <div className="text-center mx-auto md:w-1/2 w-full bg-white rounded-lg p-3 shadow mb-3 border-green-500 border-x-2">
                        Presensi telah Berhasil
                        <br />
                        <FontAwesomeIcon
                            icon={faCircleCheck}
                            className="fa-flip fa-4x text-success m-2"
                        />
                        <br />
                        Halaman akan me-refresh otomatis, silakan tunggu
                    </div>
                </>
            )}
            {!done && notifError && (
                <div className="text-center mx-auto md:w-1/2 w-full bg-white rounded-lg p-3 shadow mb-3 border-red-600 border-x-2">
                    <span className=" bg-red-600 text-white rounded-full font-bold px-2 py-1">
                        {messageError}
                    </span>
                    <p>{subMessage}</p>
                    <br />
                    <FontAwesomeIcon
                        icon={faCircleXmark}
                        className="fa-flip fa-4x text-red-600 m-2"
                    />
                    <br />
                    silakan refresh halaman untuk mencoba lagi
                </div>
            )}
            <button
                className={`${
                    showCamera ? "btn-primary" : "btn-danger"
                } border border-5 border-white text-white absolute w-12 h-12 end-0 bottom-0 mb-4 me-3 z-40 rounded-full`}
                onClick={() => {
                    setShowCamera(!showCamera);
                    if (!showCamera) {
                        startVideo();
                    } else {
                        stopVideo();
                    }
                }}
            >
                <FontAwesomeIcon icon={faVideo} size="lg" />
            </button>
            <RefreshButton buttonRefresh={buttonRefresh} />
        </>
    );
}

export default function FaceRecogPage() {
    return (
        <FaceProvider>
            <FaceRecog />
        </FaceProvider>
    );
}
