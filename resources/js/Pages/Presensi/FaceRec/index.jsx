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
import {
    faCheckCircle,
    faExclamationCircle,
    faPause,
    faPlay,
    faSun,
    faSync,
    faVideo,
    faXmark,
    faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
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
    const isReadyToShowCam = true;

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
    const detectInterval = useRef(null);

    const [playVideo, setPlayVideo] = useState(false);
    const [recognizedFaces, setRecognizedFaces] = useState([]);
    const [results, setResults] = useState([]);

    const hasDetectedRef = useRef(false);
    useFaceApiCache();

    const [showCamera, setShowCamera] = useState(false);
    const [done, setDone] = useState(false);
    const [listSuccess, setListSuccess] = useState([]);

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

    const [isCameraDenied, setIsCameraDenied] = useState(false);
    // const viewportWidth =
    //     window.innerWidth ||
    //     document.documentElement.clientWidth ||
    //     document.body.clientWidth;
    // const newWidth = viewportWidth * 0.7; // Adjust this value as needed

    // LOAD FROM USEEFFECT
    useEffect(() => {
        if (isReadyToShowCam) fetchData();
    }, []);
    useEffect(() => {
        if (dataFaceID && dataFaceID.length > 0) {
            loadModels();
        }
    }, [dataFaceID]);
    useEffect(() => {
        if (showCamera) {
            faceMyDetect();
        }
    }, [showCamera]);

    useEffect(() => {
        return () => {
            stopVideo();
            setLoading(false);
            setShowCamera(false);
            setPlayVideo(false);
            setDone(false);
            if (detectInterval.current) {
                clearInterval(detectInterval.current);
                detectInterval.current = null;
            }
            console.log("FaceRecogPage STOP");
        };
    }, []);

    // OPEN YOU FACE WEBCAM
    const startVideo = () => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then((currentStream) => {
                videoRef.current.srcObject = currentStream;
                videoRef.current.onloadedmetadata = () => {
                    if (isCameraDenied) setIsCameraDenied(false);
                    if (!playVideo) setPlayVideo(true);
                    faceMyDetect();
                    setLoading(false);
                    setMessage("Kamera aktif, sedang dalam pemindaian...");
                    setSubMessage("---");
                };
            })
            .catch((err) => {
                console.log(err);
            });
    };

    async function fetchData() {
        // try {
        if (!face_recs || face_recs.length === 0) {
            console.warn("No face_recs provided.");
            setMessageError("Tidak Face ID yang terdaftar");
            return;
        }

        // Load and decode all images in parallel
        const imgs = [];

    for (const item of face_recs) {
        const url = `/assets/face_rec/${item.id_karyawan}/${item.foto}.png`;
        try {
            const img = await faceapi.fetchImage(url);
            imgs.push({
                img,
                id_karyawan: item.id_karyawan,
                foto: item.foto,
            });

            // beri napas CPU Raspberry Pi
            await new Promise((r) => setTimeout(r, 5));
        } catch (err) {
            console.error("Gagal load image:", url, err);
        }
    }

        // we will keep an array of images per label if you have multiple images per label later
        setDataFaceID(imgs);
        setShowCamera(true);
        // } catch (error) {
        //     console.error("Error fetching user data:", error);
        // }
    }

    // LOAD MODELS FROM FACE API
    async function loadModels() {
        const models = [
            "tinyFaceDetector",
            "faceLandmark68Net",
            "faceRecognitionNet",
            "ssdMobilenetv1",
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

    const faceMyDetect = async () => {
        const labelFace = await getLabeledFaceDescriptions();
        if (!labelFace || labelFace.length === 0) {
            console.warn("⚠ Tidak ada face descriptor yang berhasil diload!");
            return []; // stop faceMyDetect supaya tidak error
        }
        if (detectInterval.current) {
            clearInterval(detectInterval.current);
            detectInterval.current = null;
        }
        const faceMatcher = new faceapi.FaceMatcher(labelFace);
        const canvas = faceapi.createCanvasFromMedia(videoRef.current);
        canvasRef.current.innerHTML = ""; // bersihkan
        canvasRef.current.appendChild(canvas);
        const displaySize = {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
        };
        detectInterval.current = setInterval(async () => {
            const detections = await faceapi
                .detectAllFaces(
                    videoRef.current,
                    new faceapi.TinyFaceDetectorOptions({ inputSize: 160 })
                )
                .withFaceLandmarks()
                .withFaceDescriptors();
            // .withFaceLandmarks();

            // DRAW YOU FACE IN WEBCAM
            // faceapi.matchDimensions(canvasRef.current, {
            //     width: videoRef.current.videoWidth,
            //     height: videoRef.current.videoHeight,
            // });

            const resized = faceapi.resizeResults(detections, displaySize);
            canvas
                .getContext("2d")
                .clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resized);

            const results = resized.map((d) => {
                return faceMatcher.findBestMatch(d?.descriptor);
            });

            const newRecognizedFaces = [...recognizedFaces];

            results.forEach((result, i) => {
                if (result.label === "unknown") return;

                const box = resized[i].detection.box;
                const faceId = `${result.label}_${i}`;

                // Cek apakah wajah ini sudah ada
                const existingIndex = newRecognizedFaces.findIndex(
                    (face) => face.id === faceId
                );

                if (existingIndex === -1) {
                    // Wajah baru, tambahkan
                    newRecognizedFaces.push({
                        id: faceId,
                        karId: karyawans.find((k) => k.nama == result.label)
                            ?.id,
                        label: result.label,
                        box: box,
                        lastSeen: Date.now(),
                    });
                } else {
                    // Update posisi wajah yang sudah ada
                    newRecognizedFaces[existingIndex] = {
                        ...newRecognizedFaces[existingIndex],
                        box: box,
                        lastSeen: Date.now(),
                    };
                }
            });
            // const filteredFaces = newRecognizedFaces.filter(
            //     (face) => Date.now() - face.lastSeen < 2000
            // );

            setRecognizedFaces(newRecognizedFaces);

            // Gambar semua wajah yang dilacak
            newRecognizedFaces.forEach((face) => {
                const drawBox = new faceapi.draw.DrawBox(face.box, {
                    label: face.label,
                    boxColor: "#00FF00",
                });
                drawBox.draw(canvas);
            });

            // // Gambar bounding box untuk wajah yang tidak dikenal
            // resized.forEach((det, i) => {
            //     if (results[i].label === "unknown") {
            //         const drawBox = new faceapi.draw.DrawBox(
            //             det.detection.box,
            //             {
            //                 label: "unknown",
            //                 boxColor: "#FF0000",
            //             }
            //         );
            //         drawBox.draw(canvas);
            //     }
            // });
            // faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
        }, 1000);
    };

    async function getLabeledFaceDescriptions() {
        const labels = face_recs.map((item) => ({
            id: item.id_karyawan,
            nama: karyawans.find((k) => k.id == item.id_karyawan)?.nama,
        }));

        // console.log(dataFaceID);
        if (!dataFaceID?.length) {
            console.warn("Data Face ID atau gambar tidak ditemukan.");
            return [];
        }

        try {
            setSubMessage("Memproses data Face ID...");

            const labeled = await Promise.all(
                labels.map(async (label) => {
                    const descriptions = [];
                    for (let i = 1; i <= 2; i++) {
                        const img = dataFaceID.find(
                            (d) => d.id_karyawan == label.id && d.foto == i
                        )?.img;
                        const detections = await faceapi
                            .detectSingleFace(
                                img,
                                new faceapi.TinyFaceDetectorOptions()
                            )
                            .withFaceLandmarks()
                            .withFaceDescriptor();
                        if (!detections) {
                            console.warn(
                                `Wajah tidak ditemukan untuk ID ${label.id} foto ${i}`
                            );
                            continue; // sangat penting agar tidak crash
                        }
                        if (detections)
                            descriptions.push(detections?.descriptor);
                    }
                    if (descriptions.length === 0) {
                        console.warn(
                            `Tidak ada descriptor valid untuk ID ${label.id}`
                        );
                        return null; // ← penting
                    }
                    return new faceapi.LabeledFaceDescriptors(
                        label.nama,
                        descriptions
                    );
                })
            );
            const validLabeled = labeled.filter(Boolean); // buang null
            return validLabeled;
        } catch (error) {
            console.error("Error saat memproses data Face ID:", error);
        }
    }

    function stopVideo() {
        if (videoRef?.current?.srcObject) {
            const stream = videoRef.current.srcObject;
            stream.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
            if (playVideo) setPlayVideo(false);
        }
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
            videoRef.current.srcObject = null;
            console.log("Camera stopped");
        }
    }

    function pauseVideo() {
        videoRef.current.pause();
        if (playVideo) setPlayVideo(false);
    }
    const resumeVideo = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
        });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
        };
        if (!playVideo) setPlayVideo(true);
    };

    const handleSendPrensensi = async () => {
        const data = new FormData();
        recognizedFaces.forEach((r) => data.append("id_karyawan[]", r.karId));
        console.log(
            "🚀 ~ handleSendPrensensi ~ recognizedFaces:",
            recognizedFaces
        );
        data.append("long", 107.6327055);
        data.append("lat", -6.9550149);

        const res = await sendDataGeneral({
            data,
            route: route("Presensi.send"),
            handleClose: () => {
                setDone(true);
                stopVideo();
                setShowCamera(false);
            },
            slicer: () => {},
            useRedux: false,
        });

        setListSuccess(res.data);
        console.log("🚀 ~ handleSendPrensensi ~ res:", res);
    };

    const getNama = (id) => karyawans?.find((k) => k.id == id)?.nama;

    const ListScanned = () => {
        return (
            <>
                <div className="mt-8 pl-2 flex flex-col justify-between w-48 min-h-[85%] shadow">
                    {recognizedFaces?.length > 0 ? (
                        <div>
                            <span>Hasil Deteksi:</span>
                            <ul className="list-outside list-decimal text-start ml-5">
                                {recognizedFaces.map((item) => (
                                    <li>{item.label}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        "Belum ada yang terdeteksi"
                    )}
                    <div className="flex flex-col gap-2">
                        <button
                            className="btn btn-primary bg-neutral-500"
                            onClick={() => {
                                if (playVideo) {
                                    pauseVideo();
                                    setPlayVideo(false);
                                } else {
                                    resumeVideo();
                                    setPlayVideo(true);
                                }
                            }}
                        >
                            {playVideo ? (
                                <span className="flex justify-center items-center gap-2">
                                    <FontAwesomeIcon icon={faPause} />
                                    Pause
                                </span>
                            ) : (
                                <span className="flex justify-center items-center gap-2">
                                    <FontAwesomeIcon icon={faPlay} />
                                    Play
                                </span>
                            )}
                        </button>
                        <button
                            className="btn btn-primary"
                            disabled={!recognizedFaces?.length}
                            onClick={handleSendPrensensi}
                        >
                            Kirim
                        </button>
                    </div>
                </div>
            </>
        );
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
                        className="items-center mx-auto rounded-lg my-6 bg-white shadow -lg w-[60%] h-fit"
                        // style={{
                        //     width: `${newWidth > 568 ? 500 : newWidth}px`,
                        //     height: `${newWidth > 568 ? 500 : newWidth}px`,
                        // }}
                    >
                        <div className="relative w-full h-full rounded-lg">
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
                                className="absolute top-0 left-0 z-10 -scale-x-100"
                                ref={canvasRef}
                                width={videoRef.current?.videoWidth}
                                height={videoRef.current?.videoHeight}
                            />
                            <div className="absolute -right-48 top-0 h-full">
                                <ListScanned />
                            </div>
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
            {/* <button onClick={testDetect}>Test Detect</button> */}

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
                        <span>Hasil Presensi:</span>
                        <div className="flex flex-col gap-2 mb-4">
                            {listSuccess.map((item, i) => (
                                <li
                                    className="flex justify-between items-center shadow px-2 py-1 rounded-lg"
                                    key={i}
                                >
                                    <span>
                                        {i + 1}. {getNama(item.id_karyawan)}
                                    </span>
                                    <span
                                        className={`font-bold text-lg ${
                                            [0, 1].includes(Number(item.cek))
                                                ? "text-green-500"
                                                : item.cek == 2
                                                ? "text-amber-500"
                                                : "text-red-500"
                                        }`}
                                    >
                                        <FontAwesomeIcon
                                            icon={
                                                [0, 1].includes(
                                                    Number(item.cek)
                                                )
                                                    ? faCheckCircle
                                                    : item.cek == 2
                                                    ? faExclamationCircle
                                                    : faXmarkCircle
                                            }
                                        />
                                    </span>
                                </li>
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                setListSuccess([]);
                                setDone(false);
                                setShowCamera(true);
                                startVideo();
                                setRecognizedFaces([]);
                            }}
                            className="btn btn-primary"
                        >
                            Presensi Lagi
                        </button>
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
