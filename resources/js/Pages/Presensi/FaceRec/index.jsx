import * as faceapi from "face-api.js";
import React, { useRef, useState } from "react";

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
import { faSync } from "@fortawesome/free-solid-svg-icons";
import fullWaktuIndo from "@/Functions/waktuIndo";
import SyncFaceID from "../Sync";

function FaceRecog() {
    const props = usePage().props;
    const org = usePage().props?.org;
    const {
        videoRef,
        loading,
        setLoading,
        message,
        setMessage,
        subMessage,
        setSubMessage,
    } = useFaceContext();

    const isSendingRef = useRef(false);
    const hasDetectedRef = useRef(false);
    useFaceApiCache();
    const [dataUser, setDataUser] = useState(org);
    const [dataFaceID, setDataFaceID] = useState([]);
    const [jadwal, setJadwal] = useState(props.jadwalKerja?.jadwal?.[0]);
    const [cekJadwal, setCekJadwal] = useState(props.jadwalKerja?.cek);
    const [presensi, setPresensi] = useState(props.jadwalKerja?.presensi?.[0]);

    const [showCamera, setShowCamera] = useState(false);
    const [done, setDone] = useState(false);
    const [buttonRefresh, setButtonRefresh] = useState(false);
    const [notif, setNotif] = useState(false);
    const [notifKosong, setNotifKosong] = useState(false);
    const [notifError, setNotifError] = useState(false);
    const [messageError, setMessageError] = useState(
        "Pemindaian mengalami masalah"
    );
    // const jarakWaktu = timeDiff(jadwal?.mulai, waktuSekarang);
    const jarakWaktu = timeDiff(jadwal?.mulai, new Date());
    const [diffHours, setDiffHours] = useState(jarakWaktu.hours);
    const [diffMinutes, setDiffMinutes] = useState(jarakWaktu.minutes);
    const [scanned, setScanned] = useState(false);
    const [resultScanned, setResultScanned] = useState(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [akurasiScan, setAkurasiScan] = useState(0);
    const [brightnessCam, setBrightnessCam] = useState(1);
    const [speedNetwork, setSpeedNetwork] = useState(null);
    const [isLoadedModels, setIsLoadedModels] = useState(false);

    const [isMustRegist, setIsMustRegist] = useState(
        dataUser?.face?.length < 2
    );
    const [activeWait, setActiveWait] = useState(false);
    const [countDown, setCountdown] = useState(false);
    const [countDownNumber, setCountdownNumber] = useState(3);
    const [flash, setFlash] = useState(false);
    const [next, setNext] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [screenshotNeutral, setScreenshotNeutral] = useState(null); // State to store the screenshot
    const [screenshotHappy, setScreenshotHappy] = useState(null); // State to store the screenshot
    const [videoStopped, setVideoStopped] = useState(false);

    const viewportWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    const newWidth = viewportWidth * 0.7; // Adjust this value as needed
    const [isCameraDenied, setIsCameraDenied] = useState(false);

    // usePresensiCheck(presensi);
    useFaceDetection(faceMyDetect);
    useCameraAndModels(dataUser, { loadModels, fetchData });

    async function fetchData() {
        try {
            const images = [];

            for (let i = 1; i <= 2; i++) {
                const img = await faceapi.fetchImage(
                    `/assets/face_rec/${dataUser.id}/${i}.png`
                );

                // Pastikan gambar telah dimuat sebelum diproses
                await img.decode();
                images.push(img);
            }

            // console.log(images, dataUser?.face, dataUser?.face.length);
            if (images.length > 1) {
                setDataFaceID(images);
                return images;
            }
            // setShowCamera(true);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    async function loadModels() {
        const models = [
            "tinyFaceDetector",
            "faceLandmark68Net",
            "faceRecognitionNet",
            "faceExpressionNet",
        ];

        if (!isMustRegist) {
            models.push("ssdMobilenetv1");
        }

        try {
            setMessage("Memuat model...");
            setLoadingProgress(0);
            let totalLoaded = 0;

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

            // Semua model selesai dimuat
            if (totalLoaded === models.length) {
                setIsLoadedModels(true);
                setMessage("Semua model telah dimuat. Tunggu...");
                if (!isMustRegist) {
                    setShowCamera(true);
                    startVideo();
                } else {
                    setShowConfirm(true);
                }
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
                    width: { min: 576, ideal: 720, max: 1080 },
                    height: { min: 576, ideal: 720, max: 1080 },
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

    async function getLabeledFaceDescriptions() {
        const labels = [dataUser.nama];

        // console.log(dataFaceID);
        if (!dataFaceID?.length) {
            console.warn("Data Face ID atau gambar tidak ditemukan.");
            return;
        }

        try {
            setSubMessage("Memuat data Face ID...");

            return Promise.all(
                labels.map(async (label) => {
                    const descriptions = [];

                    for (let i = 0; i < dataFaceID.length; i++) {
                        setSubMessage(`Sedang memindai dengan data ${i + 1}`);

                        // Pastikan gambar dalam format yang sesuai
                        const imgElement = dataFaceID[i];

                        // Tunggu hingga deteksi selesai
                        const detections = await faceapi
                            .detectSingleFace(imgElement)
                            .withFaceLandmarks()
                            .withFaceDescriptor();

                        if (detections) {
                            descriptions.push(detections.descriptor);
                        } else {
                            console.warn(
                                `Wajah tidak terdeteksi pada gambar ke-${i + 1}`
                            );
                        }
                    }

                    return new faceapi.LabeledFaceDescriptors(
                        label,
                        descriptions
                    );
                })
            );
        } catch (error) {
            console.error("Error saat memproses data Face ID:", error);
        }
    }

    const createFormData = (coord) => {
        const form = new FormData();
        form.append("jenis", cekJadwal);
        Number(cekJadwal) === 1 && form.append("id", presensi?.id);
        form.append("id_karyawan", dataUser.id);
        form.append("id_jaker", jadwal.id);
        form.append("long", coord.longitude);
        form.append("lat", coord.latitude);
        return form;
    };

    const createFormRegist = (foto, idFace) => {
        const data = new FormData();
        const idKar = dataUser.id;
        for (let i = 0; i < foto.length; i++) {
            data.append("image[]", foto[i]);
            data.append("id_face[]", idFace[i]);
        }
        data.append("id_karyawan", idKar);

        // console.log('foto:' + foto,'ID:' +  idKar,'idface:' +  idFace);
        return data;
    };

    const sendScreenshotToServer = async () => {
        try {
            const foto = [screenshotNeutral, screenshotHappy];
            const idFace = [1, 2];
            const data = createFormRegist(foto, idFace);
            const handleClose = () => {
                isSendingRef.current = false;
                setDone(true);
                setLoading(false);
                setTimeout(() => {
                    location.reload();
                }, 3000);
            };

            await sendDataGeneral({
                data: data,
                route: route("Presensi.face_rec.store"),
                handleClose: handleClose,
                waitUntilFinish: true,
                messageFailedReducer: processMessageFailedReducer,
                prosesReducer: processStateReducer,
                onProgress: setLoadingProgress,
            });
        } catch (error) {
            setButtonRefresh(true);
            setNotifError(true);
            setDone(false);
            setSubMessage(
                "Ada kesalahan dalam pengiriman data ke server, silakan hubungi tim IT"
            );
            console.log("====================================");
            console.log("Error response: ", error);
            console.log("====================================");
            isSendingRef.current = false;
        }
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

    async function faceMyDetect() {
        let countError = 7;
        let kurangCahaya = 15;
        let i = 5;
        let intervalPresensi; // Define intervalPresensi in a wider scope
        // startVideo();
        setMessage("Wajah Anda sedang dalam pemindaian");
        setSubMessage("---");

        if (videoRef) {
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
                        .withFaceLandmarks()
                        .withFaceDescriptors()
                        .withFaceExpressions();

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
                    // console.log(
                    //     results,
                    //     results[0]._label,
                    //     results[0]._label == dataUser.nama
                    // );

                    if (results.length > 0 && results[0]) {
                        if (results[0]._label == dataUser.nama) {
                            setAkurasiScan(
                                Number(results[0]._distance).toFixed(4) * 200
                            );
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
                                    setResultScanned(results);
                                    setScanned(true);
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
                                                            dataUser.nama +
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
                                                                    dataUser.nama +
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
            // console.log("====================================");
            // console.log(detections[0].expressions[expression]);
            // console.log("====================================");
            setAkurasiScan(
                Number(detections[0]?.expressions[expression]).toFixed(2) * 100
            );
            if (
                detections.length > 0 &&
                detections[0].expressions[expression] >= threshold
            ) {
                setSubMessage("-");
                setCountdown(true);
                setCountdownNumber(i);

                if (i == 1) {
                    setFlash(true);
                }
                if (i == 0) {
                    setFlash(false);
                }

                if (i <= -1) {
                    setActiveWait(false);
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
                            setNext(true);
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

    const siap = (idEks) => {
        setShowConfirm(false);
        setNext(false);
        setShowCamera(true);
        startVideo();

        // await loadModels(); // Ensure models are fully loaded before proceeding

        if (isLoadedModels && videoRef) {
            // console.log("ini");
            faceMyExp(idEks);
        }
    };

    const restartVideo = (idEks) => {
        // Reset the video stream by reloading it
        // videoRef.current.srcObject = null;
        setNext(false);
        startVideo();
        setShowCamera(true);

        if (isLoadedModels && videoRef) {
            // console.log("ini");
            faceMyExp(idEks);
        }
        switch (idEks) {
            case 1:
                setScreenshotNeutral(null);
                setScreenshotHappy(null);
                break;
            case 2:
                setScreenshotHappy(null);
                break;

            default:
                break;
        }
        setShowConfirm(false);
    };

    return (
        <>
            {isCameraDenied && <NotifCameraNotAllowed show={isCameraDenied} />}
            {loading && <LoadingSystem />}

            {!notifError &&
                !done &&
                !notifKosong &&
                !notif &&
                !showConfirm &&
                !screenshotHappy && (
                    <LoadingProgressBar
                        progress={loadingProgress}
                        message={message}
                        subMessage={subMessage}
                    />
                )}
            {showConfirm && <NotifRulesDaftar handleSiap={() => siap(1)} />}

            {/* {isLoadedModels && "OK"} */}

            {next && screenshotNeutral && (
                <div className="mx-auto bg-white xl:w-2/3 lg:w-1/3 md:w-2/3 sm:w-1/2 w-full text-center shadow rounded-lg p-3">
                    <div className="py-4">
                        Apa anda mau menjadikan foto ini sebagai Face ID pertama
                        anda?
                    </div>
                    <button
                        className="btn-tertiary me-2 font-bold"
                        onClick={() => restartVideo(1)}
                    >
                        Tidak, Scan Ulang
                    </button>
                    <button
                        onClick={() => siap(2)}
                        className="btn-primary font-bold text-white"
                    >
                        Lanjut
                    </button>
                </div>
            )}
            {!showCamera &&
                screenshotNeutral &&
                screenshotHappy &&
                !done &&
                !notifError && (
                    <>
                        <div className="mx-auto bg-white xl:w-2/3 lg:w-1/3 md:w-2/3 sm:w-1/2 w-full text-center shadow rounded-lg p-3">
                            <div className="py-4">
                                Apa anda mau menjadikan foto ini sebagai Face ID
                                kedua anda?
                            </div>
                            <div className="flex justify-center gap-3">
                                <button
                                    type="button"
                                    className="btn-tertiary font-bold"
                                    onClick={() => restartVideo(1)}
                                >
                                    Tidak, Ulangi dari awal
                                </button>
                                <button
                                    type="button"
                                    className="btn-tertiary font-bold"
                                    onClick={() => restartVideo(2)}
                                >
                                    Tidak, Scan Ulang
                                </button>
                                <button
                                    type="button"
                                    onClick={() => sendScreenshotToServer()}
                                    className="btn-success font-bold text-white"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                        <div className="md:w-1/2 w-full grid md:grid-cols-2 gap-3 mx-auto my-2 text-center">
                            {[
                                {
                                    exp: "Netral",
                                    source: screenshotNeutral,
                                    alt: "Screenshot Neural",
                                },
                                {
                                    exp: "Senyum",
                                    source: screenshotHappy,
                                    alt: "Screenshot Happy",
                                },
                            ].map(({ exp, source, alt }, i) => (
                                <div
                                    className="bg-white rounded-lg shadow p-1"
                                    key={i}
                                >
                                    <span>Ekspresi: {exp}</span>
                                    <img
                                        className="rounded-lg -scale-x-100"
                                        src={source}
                                        alt={alt}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            {showCamera && (
                <>
                    <div
                        className="items-center mx-auto rounded-lg p-3 my-6 bg-white"
                        style={{
                            width: `${newWidth > 568 ? 500 : newWidth}px`,
                            height: `${newWidth > 568 ? 500 : newWidth}px`,
                        }}
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

                            <img
                                src="/assets/instruments/circle-frame-white.png"
                                id="frame"
                                className="absolute rounded-lg w-full h-full opacity-70 z-30 shadow-lg"
                            />
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
                        </div>
                    </div>
                    <div className="max-w-[500px] mx-auto">
                        <div className="relative mt-6 bg-white shadow py-2 px-4 rounded-lg">
                            Kecepatan Internet Anda:{" "}
                            {Number(speedNetwork).toFixed(2)} Mbps
                        </div>

                        {akurasiScan > 0 && (
                            <div className="relative mt-2 bg-white shadow py-2 px-4 rounded-lg">
                                Akurasi: {akurasiScan.toFixed(2)}%
                                <span className="ms-3">
                                    {akurasiScan >= 75 ? (
                                        <span className="bg-green-500 rounded-full text-white px-2 py-1 font-bold">
                                            Bagus
                                        </span>
                                    ) : (
                                        <span className="bg-orange-400 rounded-full text-white px-2 py-1 font-bold">
                                            Kurang Bagus
                                        </span>
                                    )}
                                </span>
                            </div>
                        )}

                        <div className="relative mt-2 bg-white shadow py-2 px-4 rounded-lg">
                            <label
                                htmlFor="brightness-range"
                                className="block text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Atur Kecerahan:{" "}
                                {Math.round(brightnessCam * 100)}%
                            </label>
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
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                            />
                            <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                                <span>0</span>
                                <span className="ms-4">50</span>
                                <span className="ms-2">100</span>
                                <span>150</span>
                                <span>200</span>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {!notifError && done && (
                <>
                    <div className="text-center mx-auto md:w-1/2 w-full bg-white rounded-lg p-3 shadow mb-3 border-green-500 border-x-2">
                        {isMustRegist ? "Pendaftaran Face ID" : "Presensi"} Anda
                        telah Berhasil
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
            {(notif || notifKosong) && (
                <div className="text-center mx-auto md:w-1/2 w-full bg-white rounded-lg p-3 shadow mb-3 border-primary border-x-2">
                    {notif ? (
                        <NotifGeneral
                            subMessage={subMessage}
                            message={message}
                        />
                    ) : (
                        <>
                            <span className="bg-primary text-white rounded-full font-bold px-2 py-1">
                                Anda hari ini tidak ada jadwal kerja
                            </span>
                            <br />
                            <FontAwesomeIcon
                                icon={faCircleCheck}
                                className="fa-flip fa-4x text-success m-2"
                            />
                        </>
                    )}
                    <br />
                    Anda akan dikembalikan ke laman beranda
                </div>
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
