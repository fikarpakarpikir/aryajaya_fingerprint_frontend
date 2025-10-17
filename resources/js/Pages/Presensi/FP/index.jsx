import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePage } from "@inertiajs/react";
import { useFullScreenHandle } from "react-full-screen";
import Presensi from "./Presensi";
import Daftar from "./Daftar";
import Hapus from "./Hapus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faWrench,
    faCheckCircle,
    faBars,
    faFingerprint,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import NotifMaintenance from "../Maintenance";
import {
    registeredReducer,
    setUrlScanner,
} from "@/redux/slices/FingerprintSlice";
import axios from "axios";
import { fetchReg } from "./api";
// import { fetchAlat } from "./api";
import { FPProvider, useFPContext } from "@/context/FPContext";
import { PlayerGIFLost } from "@/Components/PlayerGIF";

export function FPScanner() {
    const { props } = usePage();
    const { ip_alat: ipAlat, jenis_kehadiran: jenisKehadiran } = props;
    const urlScanner = `//${ipAlat}`;
    const fullScreenRef = useFullScreenHandle();
    const dispatch = useDispatch();
    const {
        message,
        getMessage,
        activeFP,
        setLoading,
        setGetMessage,
        setMessage,
        setActiveFP,
        setListKaryawans,
        setStatus,
        fetchAlat,
        cekFP,
        stopFetching,
    } = useFPContext();

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [maintenance, setMaintenance] = useState(false);
    const [floatButtonFitur, setfloatButtonFitur] = useState(false);

    const [listFitur, setListFitur] = useState([
        { id: 1, title: "Presensi", status: true, comp: <Presensi /> },
        { id: 2, title: "Daftar", status: false, comp: <Daftar /> },
        { id: 3, title: "Hapus", status: false, comp: <Hapus /> },
    ]);

    const openCloseFitur = (itemId) => {
        setListFitur((prev) =>
            prev.map((item) => ({ ...item, status: item.id === itemId }))
        );
    };

    useEffect(() => {
        // const fetchData = async () => {
        //     try {
        //         const response = await axios.get(
        //             `${
        //                 import.meta.env.VITE_API_SERVER
        //             }/Karyawan/Presensi/Fingerprint`
        //         );
        //         setListKaryawans(listKaryawan);
        //         dispatch(registeredReducer(response.data.registered));
        //     } catch (error) {
        //         console.error("Error fetching user data:", error);
        //     }
        // };

        // fetchData();
        fetchReg().then((data) => {
            setListKaryawans(data.listKaryawan);
            dispatch(registeredReducer(data.registered));
        });
        dispatch(setUrlScanner(urlScanner));
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        fetchAlat();
    }, [urlScanner]);

    // ! Ganti dengan Reverb
    // useEffect(() => {
    //     if (getMessage) {
    //         const intervalId = setInterval(fetchEnrollmentStatus, 1000); // Poll every 1 second
    //         fetchEnrollmentStatus(); // Fetch immediately
    //         return () => clearInterval(intervalId); // Cleanup interval on component unmount
    //     }
    // }, [getMessage]);

    return (
        <>
            <div className="absolute top-2 end-2">
                <FontAwesomeIcon
                    icon={maintenance ? faWrench : faCheckCircle}
                    onClick={() => setMaintenance(!maintenance)}
                />
            </div>
            {maintenance ? (
                <NotifMaintenance />
            ) : (
                <>
                    {floatButtonFitur && (
                        <div className="bg-white shadow-lg absolute bottom-4 text-white p-3 end-4 rounded-lg z-40 m-0">
                            <div className="flex flex-col gap-1">
                                {activeFP ? (
                                    listFitur?.map((item, i) => (
                                        <button
                                            className={`${
                                                item.status
                                                    ? "btn-" +
                                                      (item.id != 3
                                                          ? "primary"
                                                          : "danger")
                                                    : "btn-" +
                                                      (item.id != 3
                                                          ? "outline-primary"
                                                          : "outline-danger")
                                            }`}
                                            onClick={() => {
                                                openCloseFitur(item.id);
                                                setfloatButtonFitur(false);
                                            }}
                                            key={i}
                                        >
                                            {item.title}
                                        </button>
                                    ))
                                ) : (
                                    <button
                                        className={`btn btn-${
                                            activeFP ? "primary" : "danger"
                                        }`}
                                        onClick={() => cekFP()}
                                    >
                                        Cek Alat
                                    </button>
                                )}
                                <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                        stopFetching(urlScanner, setActiveFP)
                                    }
                                >
                                    Stop Sensor
                                </button>
                                <div className="text-end">
                                    <button
                                        className="text-xl text-primary"
                                        onClick={() =>
                                            setfloatButtonFitur(false)
                                        }
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {!floatButtonFitur && (
                        <button
                            className={`${
                                activeFP ? "btn-primary" : "btn-danger"
                            } border border-5 border-white text-white absolute w-12 h-12 end-0 bottom-0 mb-4 me-3 z-40 rounded-full`}
                            // onClick={() => cekFP(urlScanner, setActiveFP)}
                            onClick={() =>
                                setfloatButtonFitur(!floatButtonFitur)
                            }
                        >
                            <FontAwesomeIcon
                                icon={activeFP ? faBars : faFingerprint}
                                size="xl"
                            />
                        </button>
                    )}
                    {activeFP ? (
                        <>
                            {listFitur.map((item) =>
                                item.status ? (
                                    <div key={item.id} className="mt-3">
                                        {item.comp}
                                    </div>
                                ) : null
                            )}
                        </>
                    ) : (
                        <PlayerGIFLost message={message} />
                    )}
                </>
            )}
        </>
    );
}

export default function FPScannerPage() {
    return (
        <FPProvider>
            <FPScanner />
        </FPProvider>
    );
}
