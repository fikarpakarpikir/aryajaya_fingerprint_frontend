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
import { cekFP, stopFetching } from "./api";
import { PlayerGIFLost } from "./PlayerGIFs";
import NotifMaintenance from "../Maintenance";
import {
    registeredReducer,
    setUrlScanner,
} from "@/redux/slices/FingerprintSlice";
import axios from "axios";
import { fetchReg } from "./api";
import { fetchAlat } from "./api";

export default function FPScanner() {
    const { props } = usePage();
    const { ip_alat: ipAlat, jenis_kehadiran: jenisKehadiran } = props;
    const urlScanner = `//${ipAlat}`;
    const fullScreenRef = useFullScreenHandle();
    const dispatch = useDispatch();
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [maintenance, setMaintenance] = useState(false);
    const [activeFP, setActiveFP] = useState(true);
    const [floatButtonFitur, setfloatButtonFitur] = useState(false);

    const [listKaryawans, setListKaryawans] = useState(false);

    const [status, setStatus] = useState(0);
    const [message, setMessage] = useState("Mohon tunggu...");
    const [getMessage, setGetMessage] = useState(false);
    const isFetching = useRef(false); // Ref to prevent concurrent fetches
    const [countdownScanning, setCountdownScanning] = useState(0);

    const [listFitur, setListFitur] = useState([
        { id: 1, title: "Presensi", status: true },
        { id: 2, title: "Daftar", status: false },
        { id: 3, title: "Hapus", status: false },
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
        //         setListKaryawans(response.data.listKaryawan);
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
        const checkAlat = async () => {
            if (!urlScanner) {
                setActiveFP(false);
                setMessage("URL scanner tidak valid");
                return;
            }

            setLoading(true);
            try {
                const data = await fetchAlat(urlScanner);
                setActiveFP(!!data.message);
                setMessage(
                    data.message ||
                        "Alat tidak terhubung, silakan hubungi Tim IT"
                );
            } catch (error) {
                console.error(error);
                setActiveFP(false);
                setMessage("Alat tidak terhubung, silakan hubungi Tim IT");
            } finally {
                setLoading(false);
            }
        };

        checkAlat();
    }, [urlScanner]);

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
                        <div className="bg-white shadow-lg fixed bottom-8 text-white p-3 end-4 rounded-lg z-40 m-0">
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
                                {fullScreenRef.active ? (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={fullScreenRef.exit}
                                    >
                                        Exit Fullscreen
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary"
                                        onClick={fullScreenRef.enter}
                                    >
                                        Enter Fullscreen
                                    </button>
                                )}
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
                            } border border-5 border-white text-white fixed w-12 h-12 end-0 bottom-8 mb-4 me-3 z-40 rounded-full`}
                            onClick={() => cekFP(urlScanner, setActiveFP)}
                        >
                            <FontAwesomeIcon
                                icon={activeFP ? faBars : faFingerprint}
                                size="xl"
                            />
                        </button>
                    )}
                    {listFitur.map((item) =>
                        item.status ? (
                            <div key={item.id} className="mt-3">
                                {item.id === 1 && <Presensi />}
                                {item.id === 2 && <Daftar />}
                                {item.id === 3 && <Hapus />}
                            </div>
                        ) : null
                    )}
                </>
            )}
        </>
    );
}
