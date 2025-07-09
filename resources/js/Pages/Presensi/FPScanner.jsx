import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { useCallback } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import waktuIndo, {
    detailWaktuIndo,
    hariIndo,
    jamIndo,
    tanggalIndo,
} from "@/Functions/waktuIndo";
import Clock from "@/Functions/clock";
import axios from "axios";
import { Collapse } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import Select2RS from "@/Components/ReactStrap/Select2";
import dataSelect from "@/Functions/dataSelect";
import { useRef } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import {
    registeredAdd,
    registeredDelete,
    registeredReducer,
} from "@/redux/slices/FingerprintSlice";
import useAuth from "@/Functions/useAuth";
import GuestLayout from "@/Layouts/GuestLayout";
import {
    faBars,
    faCheckCircle,
    faFingerprint,
    faGear,
    faImagePortrait,
    faWrench,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fullWaktuIndo from "@/Functions/waktuIndo";

export default function FPScanner() {
    const { props } = useAuth();
    const { ip_alat: ipAlat, jenis_kehadiran: jenisKehadiran } = props;
    const urlScanner = `//${ipAlat}`;
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    const [listKaryawans, setListKaryawans] = useState(null);
    // const [listRegistereds, setListRegistereds] = useState(null);
    const { listRegistereds } = useSelector((state) => state.fingerprints);

    const dummyKar = {
        id: 9728,
        mulai: "2025-07-09 10:38:40",
        lokasi_longitude_mulai: "107.6327055",
        lokasi_latitude_mulai: "-6.9550149",
        id_jaker: 2157,
        selesai: null,
        lokasi_latitude_selesai: null,
        created_at: "2025-07-09T03:38:40.000000Z",
        find_jaker: {
            id: 2157,
            kode_ket: 1,
            macam_hadir: 28,
            mulai: "2024-01-16 08:30:00",
            created_at: "2024-01-16T02:28:00.000000Z",
            jenis: {
                id: 28,
                title: "Rutin",
                total_durasi: null,
                kode_hadir: 1,
                updated_at: "2023-11-14T04:15:42.000000Z",
                created_at: "2023-11-14T04:15:42.000000Z",
            },
            selesai: "2024-01-16 17:30:00",
            title: "Kerja - Rutin",
            kode_status: 3,
            id_karyawan: 4,
            encId: "eyJpdiI6Ilo5b1hBeHRqS2g4bnJQckkvalcrM2c9PSIsInZhbHVlIjoiMHlrdGVJSUkxUkhCdW82SEhiOFdBZz09IiwibWFjIjoiYjIyZjUxMGVhYjU1YTI1MzVjZTM2YTI0MzRhMjkzODZmOTNmMzBkMmIzMTgxZGEzOTg3YzYzYTg0MzRiN2JiMiIsInRhZyI6IiJ9",
            updated_at: "2024-01-16T02:31:36.000000Z",
            ket: {
                encId: "eyJpdiI6InlQbWR1QitqWHh6ajgzM1pqM0lGQ0E9PSIsInZhbHVlIjoiMG5UeTFSQ3NmSVNmKzZQT1VTbzdCZz09IiwibWFjIjoiMmZmNDVlNjk4MzExNjA4M2M2NmRhMTdkODM2YzM2MTZlZWY1ZmFlYjI3OGRiMjk2NDQyNjMyZTlmZTc4Y2JlOCIsInRhZyI6IiJ9",
                id: 1,
                title: "Kerja",
                updated_at: "2023-11-12T11:21:48.000000Z",
                created_at: "2023-05-01T17:26:29.000000Z",
            },
            is_archive: null,
            bukti: '["1","2","3","4","5"]',
        },
        id_karyawan: 4,
        updated_at: "2025-07-09T03:38:40.000000Z",
        lokasi_longitude_selesai: null,
        jaker: {
            id: 2157,
            kode_ket: 1,
            macam_hadir: 28,
            mulai: "2024-01-16 08:30:00",
            created_at: "2024-01-16T02:28:00.000000Z",
            jenis: {
                id: 28,
                title: "Rutin",
                total_durasi: null,
                kode_hadir: 1,
                updated_at: "2023-11-14T04:15:42.000000Z",
                created_at: "2023-11-14T04:15:42.000000Z",
            },
            selesai: "2024-01-16 17:30:00",
            title: "Kerja - Rutin",
            kode_status: 3,
            id_karyawan: 4,
            encId: "eyJpdiI6IlVYWFFjR1pBVS91K1Npc2hMd2ZCVVE9PSIsInZhbHVlIjoieFZvRWpWZGdTTE1VOG1mRmtKbUpNUT09IiwibWFjIjoiYjU5NmZiMDFhODU1MWQ3NTk3ODg4YzMyOTgxNWZmYThmYzE5MzZiMmY5M2FjMjU5MWI4NGU3ODgxYjcxNTViOSIsInRhZyI6IiJ9",
            updated_at: "2024-01-16T02:31:36.000000Z",
            ket: {
                encId: "eyJpdiI6IkVHcmVKbTNxeDUrSzVsUXhzY2VUTWc9PSIsInZhbHVlIjoiY3ZaeElWWi9zZ1c0NUxaYmdUa0p4UT09IiwibWFjIjoiNjVkYzE1ZDZiZTgwYjY5ODY4NmNkNmZkZTdlN2U4ZjI0MjgyNzI3NDBjZTYyZTEwMDE5ZjIwYzhlOTYyNjY4ZSIsInRhZyI6IiJ9",
                id: 1,
                title: "Kerja",
                updated_at: "2023-11-12T11:21:48.000000Z",
                created_at: "2023-05-01T17:26:29.000000Z",
            },
            is_archive: null,
            bukti: '["1","2","3","4","5"]',
        },
        org: {
            encId: "eyJpdiI6IkowcXBaclBjVk5CZ01TRXpNU3JZZkE9PSIsInZhbHVlIjoiVDg3MFh0a0luVnhBcHNtRk9HYWJBZz09IiwibWFjIjoiNmYyYzcxMzlkNjYxZTAwNGQ5YWQwOTA5Nzg0MDc2NDdhZWU3NGM5MTNmYmY2YTU0MGM5MzliZjA5NzEwM2RhMyIsInRhZyI6IiJ9",
            id: 4,
            dokumen: [
                {
                    no_identity: null,
                    id: 5,
                    created_at: "2025-02-14T02:27:13.000000Z",
                    file: "foto_profil_68638e85e616c.png",
                    jenis_data_id: 1,
                    updated_at: "2025-07-01T07:30:13.000000Z",
                    karyawan_id: 4,
                },
            ],
            nama: "Fikar Mohammad Istiqlalul Wathan",
        },
    };

    const [maintenance, setMaintenance] = useState(false);
    const [karyawan, setKaryawan] = useState(null);
    // const [karyawan, setKaryawan] = useState(dummyKar);
    const [fotoProfil, setFotoProfil] = useState(null);

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);
    // const [status, setStatus] = useState(3);
    const [status, setStatus] = useState(0);
    const [message, setMessage] = useState("Mohon tunggu...");
    const [getMessage, setGetMessage] = useState(false);
    const isFetching = useRef(false); // Ref to prevent concurrent fetches
    const [countdownScanning, setCountdownScanning] = useState(0);

    // const [activeFP, setActiveFP] = useState(true);
    const [activeFP, setActiveFP] = useState(false);

    const [floatButtonFitur, setfloatButtonFitur] = useState(false);

    const fullScreenRef = useFullScreenHandle();
    const dispatch = useDispatch();

    const panggilanKaryawan = (nama) => {
        const wordsToRemove = [
            "Muhammad",
            "Muhamad",
            "Muh",
            "Mochammad",
            "Mochamad",
            "Mohammad",
            "M",
            "Siti",
        ];
        const panggilan = nama
            ?.split(" ")
            .filter((part) => !wordsToRemove.includes(part));
        // console.log(panggilan);
        return panggilan;
    };

    const getIndex = (id) => {
        let color,
            text = "white",
            title = jenisKehadiran?.find((item) => item.id == id)?.title;

        switch (id) {
            case 1:
                color = "#00954a";
                break;
            case 2:
                color = "#64748b";
                break;
            case 3:
                color = "#64748b";
                break;
            case 4:
                color = "#64748b";
                break;
            case 5:
                color = "#64748b";
                break;
            case 6:
                color = "#ae0a0a";
                break;
            case 7:
                color = "#ffa151";
                text = "dark";
                break;
            case 8:
                color = "#ae0a0a";
                break;
            case 9:
                color = "#55a6f8";
                break;
            case 10:
                color = "#ffe421";
                text = "dark";
                break;
            case 11:
                color = "#55a6f8";
                break;
            case 12:
                color = "#64748b";
                break;
            case 13:
                color = "#64748b";
                break;

            default:
                color = "light border border-dark border-2";
                title = "Ruangan";
                text = "dark";
                break;
        }

        return { color: color, text: text, title: title };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    // "http://127.0.0.1:8000/api/Karyawan/Presensi/Fingerprint"
                    "https://hrd.aryajaya.co.id/api/Karyawan/Presensi/Fingerprint"
                );
                // const response = await axios.get("/Get/Karyawan/Fingerprint");
                setListKaryawans(response.data.listKaryawan);
                dispatch(registeredReducer(response.data.registered));
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchData();
        // getFitur(1);
        findKaryawan(dummyKar);

        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        // console.log(countdownScanning <= 0);
        window.addEventListener("resize", handleResize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        setLoading(true);
        const fetchAlat = async () => {
            try {
                const res = await axios.get(`${urlScanner}/check_fingerprint`);
                setActiveFP(res.data.message ? true : false);
                setMessage(
                    res.data.message
                        ? res.data.message
                        : "Alat tidak terhubung, silakan hubungi Tim IT"
                );
            } catch (error) {
                console.error(error);
                setActiveFP(false);
                setMessage("Alat tidak terhubung, silakan hubungi Tim IT");
            }
        };
        fetchAlat();
        setLoading(false);
    }, [urlScanner]);

    useEffect(() => {
        if (getMessage) {
            const intervalId = setInterval(fetchEnrollmentStatus, 1000); // Poll every 1 second
            fetchEnrollmentStatus(); // Fetch immediately
            return () => clearInterval(intervalId); // Cleanup interval on component unmount
        }
    }, [getMessage]);

    const fetchEnrollmentStatus = async () => {
        if (isFetching.current) return; // Skip if already fetching

        isFetching.current = true;
        try {
            const response = await axios.get(`${urlScanner}/enrollment_status`);
            setStatus(response.data.status);
            setActiveFP(!!response.data.message);
            // setCountdownScanning(response.data.countdown);
            setGetMessage(
                response.data.countdown > 0 ? response.data.active : false
            );
            // console.log(response.data.fiturId);
            switch (response.data.fiturId) {
                case 1:
                    if (response.data.status === 4) {
                        findKaryawan(response.data.newData);
                        setTimeout(() => {
                            getFitur(1);
                        }, 3000); // Delay for 3 seconds (3000 milliseconds)
                    } else if (response.data.status === 3) {
                        setKaryawan(null);
                        setTimeout(() => {
                            getFitur(1);
                        }, 3000);
                    }
                    break;
                case 2:
                    if (response.data.status === 4) {
                        dispatch(registeredAdd(response.data.newData));
                    }
                    break;
                case 3:
                    if (response.data.status === 4) {
                        dispatch(registeredDelete(response.data.newData));
                    }
                    break;

                default:
                    break;
            }
            // if (response.data.active) countdownScanning = 120;

            setMessage(
                response.data.message ||
                    "Alat tidak terhubung, silakan hubungi Tim IT"
            );
        } catch (error) {
            setMessage("Alat tidak terhubung, silakan hubungi Tim IT");
            setGetMessage(false);
            setStatus(3);
            setCountdownScanning(0);
            setActiveFP(false);
            console.error("Error fetching enrollment status:", error);
        } finally {
            isFetching.current = false;
        }
        // console.log(countdownScanning);
    };

    const stopFetching = async () => {
        if (isFetching.current) return; // Skip if already fetching

        isFetching.current = true;
        try {
            const response = await axios.get(`${urlScanner}/stop_fetching`);
            setStatus(response.data.status);
            setCountdownScanning(0);
            setGetMessage(false);
            setMessage(
                response.data.message ||
                    "Alat tidak terhubung, silakan hubungi Tim IT"
            );
            // setActiveFP(!!response.data.message);
        } catch (error) {
            setMessage("Alat tidak terhubung, silakan hubungi Tim IT");
            setGetMessage(false);
            setStatus(3);
            setCountdownScanning(0);
            setActiveFP(false);
            console.error("Error fetching enrollment status:", error);
        } finally {
            isFetching.current = false;
        }
    };

    const findKaryawan = (newData) => {
        // console.log(newData);
        const kar = listKaryawans?.find(
            (item) => item.id == newData.id_karyawan
        );
        console.log(kar?.dokumen);

        fetchFotoProfil(kar?.dokumen?.[0]?.file);
        setKaryawan({
            nama: kar?.nama,
            panggilan: panggilanKaryawan(kar?.nama),
            newData,
        });
        // return { nama: kar.nama, panggilan: panggilanKaryawan(kar.nama), kar };
    };

    const fetchFotoProfil = (file_path) => {
        setFotoProfil(null);
        try {
            setFotoProfil(`/assets/foto_profil/${file_path}`);
        } catch (error) {
            console.error("Error loading image:", error);
        }
    };

    const openCloseFitur = useCallback((itemId) => {
        setListFitur((prevListFitur) =>
            prevListFitur.map((item) => ({
                ...item,
                status: item.id === itemId,
            }))
        );
    }, []);

    const cekFP = async () => {
        try {
            const response = await axios.get(`${urlScanner}/check_fingerprint`);
            setStatus(response.data.status);
            setActiveFP(!!response.data.message);
            // setCountdownScanning(response.data.countdown);
            setGetMessage(
                response.data.countdown > 0 ? response.data.active : false
            );
            // console.log(response.data.countdown);
            // if (response.data.active) countdownScanning = 120;

            setMessage(
                response.data.message ||
                    "Alat tidak terhubung, silakan hubungi Tim IT"
            );

            // setStatus(1);
            // setActiveFP(true);
            // // setCountdownScanning(response.data.countdown);
            // setGetMessage(true);
            // // console.log(response.data.countdown);
            // // if (response.data.active) countdownScanning = 120;

            setMessage(
                response?.data?.message ||
                    "Alat tidak terhubung, silakan hubungi Tim IT"
            );
        } catch (error) {
            setMessage("Alat tidak terhubung, silakan hubungi Tim IT");
            setGetMessage(false);
            setStatus(3);
            setCountdownScanning(0);
            setActiveFP(false);
            console.error(error);
        }
    };

    const inputPresensi = async (karyawanFPId) => {
        try {
            const res = await axios.post(
                "/Karyawan/Presensi/Fingerprint/presensiStore",
                {
                    template_id: karyawanFPId,
                }
            );
            // console.log(res.data.karyawan.id_karyawan);
            try {
                findKaryawan(res.data.karyawan.id_karyawan);
                setSuccess(true);
                setFailed(false);
                setMessage("Presensi Berhasil, Silakan selanjutnya");
            } catch (error) {
                setSuccess(false);
                setFailed(true);
                setMessage("Presensi Gagal, Data Fingerprint tidak ditemukan");
                console.error(error);
            }
        } catch (error) {
            setSuccess(false);
            setFailed(true);
            setMessage("Ada kesalahan sistem, silakan hubungi developer");
            console.error(error);
        }
    };

    const getFitur = async (fiturId, id_karyawan = 0) => {
        // setCountdownScanning(120);
        openCloseFitur(fiturId);
        setLoading(true);
        setGetMessage(true);
        try {
            const res = await axios.post(
                `${urlScanner}/fitur`,
                { fiturId, id_karyawan },
                { headers: { "Content-Type": "application/json" } }
            );
            setfloatButtonFitur(false);
        } catch (error) {
            console.error(error);
            setGetMessage(false);
            setCountdownScanning(0);
        } finally {
            setLoading(false);
        }
    };

    const selamatBekerja = [
        {
            id: 1,
            msg: "Selamat bekerja, semoga lancar!",
        },
        {
            id: 2,
            msg: "Tetap bahagia, terus semangat!",
        },
        {
            id: 3,
            msg: "Awali hari dengan penuh semangat!",
        },
        {
            id: 4,
            msg: "Semangat untuk orang sukses!",
        },
    ];

    function getRandomMessageById(id) {
        const message = selamatBekerja.find((item) => item.id === id);
        return message
            ? message.msg
            : getRandomMessageById(
                  Math.floor(Math.random() * selamatBekerja.length) + 1
              );
    }

    const Presensi = () => {
        const waktu = Clock();

        return (
            <div className="relative min-h-[480px]">
                <span className="badge bg-primary text-white text-md font-bold">
                    Presensi
                </span>
                <div className="flex justify-center">
                    <div className="grid grid-cols-2 shadow-lg rounded-lg mx-auto items-center">
                        <div className="text-end py-5 pr-2 pl-10">
                            <span className="fw-bold fs-5">
                                {hariIndo(waktu)},
                            </span>
                            <br />
                            <span className="fw-bold fs-6">
                                {tanggalIndo(waktu)}
                            </span>
                        </div>
                        <div className="p-4 pr-10 mr-2 text-start bg-primary shadow fs-3 font-bold text-white rounded-lg">
                            <span className="mt-2">{jamIndo(waktu)}</span>
                        </div>
                    </div>
                </div>
                <br />
                {/* {listKaryawans && (
                    <button onClick={() => getFitur(1)}>Cek</button>
                )} */}
                {activeFP ? (
                    <>
                        {karyawan && (
                            <>
                                <div className="absolute left-0 -translate-x-24 -translate-y-12 bg-white w-[450px] h-[450px] border border-gray-100 rounded-full shadow-lg z-0">
                                    <div className="border-4 border-white p-3 bg-white rounded-full shadow">
                                        {fotoProfil ? (
                                            <img
                                                src={fotoProfil}
                                                className="rounded-full cover  w-[440px] h-[440px]"
                                                alt="..."
                                            />
                                        ) : (
                                            <FontAwesomeIcon
                                                icon={faImagePortrait}
                                                style={{
                                                    fontSize: 400,
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col justify-start text-start ml-40 mt-12">
                                    <div
                                        className="p-2 mx-auto z-20"
                                        style={{ maxWidth: 500 }}
                                    >
                                        <div className="z-20">
                                            <div className="card-body text-start">
                                                <span className="text-xl font-bold">
                                                    {karyawan?.nama}
                                                </span>
                                                <p className="flex flex-col gap-2 mt-2">
                                                    <div>
                                                        <span className="border-r-4 border-tertiary font-bold px-6 py-1 me-4 rounded-lg">
                                                            Masuk:
                                                        </span>
                                                        {fullWaktuIndo(
                                                            karyawan?.newData
                                                                ?.mulai
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="border-r-4 border-tertiary font-bold px-6 py-1 me-4 rounded-lg">
                                                            Pulang:
                                                        </span>
                                                        {karyawan?.newData
                                                            ?.selesai
                                                            ? fullWaktuIndo(
                                                                  karyawan
                                                                      ?.newData
                                                                      ?.selesai
                                                              )
                                                            : "-"}
                                                    </div>
                                                </p>
                                                {/* <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full ml-12">
                                        <BadgeClass
                                            thisStatus={status}
                                            message={message}
                                        />
                                    </div>
                                </div>
                                <div className="absolute top-10 end-10 w-10">
                                    <span>Berikutnya</span>
                                    <DotLottieReact
                                        src={`/GIF/Fingerprint/scanning.lottie`}
                                        className="w-24 h-24 shadow border border-primary border-2 rounded-full"
                                        loop
                                        autoplay
                                        style={{
                                            height: 10,
                                            width: 10,
                                        }}
                                    />
                                </div>
                            </>
                        )}
                        {countdownScanning <= 0 && (
                            <>
                                <div className="col-12 mt-3 d-flex">
                                    <button
                                        type="button"
                                        className="btn btn-primary mx-auto"
                                        onClick={() => getFitur(1)}
                                    >
                                        Scan
                                    </button>
                                </div>
                            </>
                        )}
                        {!karyawan && (
                            <div className="w-30 h-25 mx-auto text-wrap">
                                {renderPlayerGIF(status, message)}
                            </div>
                        )}
                    </>
                ) : (
                    <PlayerGIFLost message={message} />
                )}
            </div>
        );
    };

    const Daftar = () => {
        if (!listKaryawans) {
            return <div>Loading...</div>; // Add loading state
        }

        return (
            <>
                <span className="badge badge-info fs-6">Daftar</span>
                <Formik
                    initialValues={{
                        idKar: "",
                    }}
                    onSubmit={(values) => {
                        // sendData(values);
                        getFitur(2, values.idKar);
                        // console.log(values);
                    }}
                    validationSchema={Yup.object({
                        idKar: Yup.number().required("Harus dipilih"),
                    })}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                    }) => (
                        <form onSubmit={handleSubmit} className="row g-3">
                            <Select2RS
                                className="col-6 mx-auto"
                                label="Nama Karyawan"
                                id="idKar"
                                data={dataSelect(
                                    listKaryawans.filter(
                                        (item) =>
                                            !listRegistereds.some(
                                                (reg) =>
                                                    reg.id_karyawan == item.id
                                            )
                                    ),
                                    "id",
                                    "nama"
                                )}
                                name="idKar"
                                error={errors.idKar}
                                touched={touched.idKar}
                                handleChange={(values) => {
                                    setFieldValue("idKar", values.value);
                                    handleChange;
                                }}
                                handleBlur={handleBlur}
                                values={values.idKar}
                                placeholder="Pilih Karyawan"
                            />
                            <div className="col-12 mt-3 d-flex">
                                <button
                                    type="submit"
                                    className="btn btn-primary mx-auto"
                                    onClick={handleSubmit}
                                >
                                    Scan
                                </button>
                            </div>
                        </form>
                    )}
                </Formik>
                <div className="w-30 h-25 mx-auto text-wrap">
                    {renderPlayerGIF(status, message)}
                </div>
            </>
        );
    };

    const Hapus = () => {
        if (!listKaryawans) {
            return <div>Loading...</div>; // Add loading state
        }
        return (
            <>
                <span className="badge badge-danger fs-6">Hapus</span>

                <Formik
                    initialValues={{
                        idKar: "",
                    }}
                    onSubmit={(values) => {
                        // sendData(values);
                        getFitur(3, values.idKar);
                        // console.log(values);
                    }}
                    validationSchema={Yup.object({
                        idKar: Yup.number().required("Harus dipilih"),
                    })}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                    }) => (
                        <form onSubmit={handleSubmit} className="row g-3">
                            <Select2RS
                                className="col-6 mx-auto"
                                label="Nama Karyawan"
                                id="idKar"
                                data={dataSelect(
                                    listRegistereds,
                                    "id_karyawan",
                                    "org.nama"
                                )}
                                name="idKar"
                                error={errors.idKar}
                                touched={touched.idKar}
                                handleChange={(values) => {
                                    setFieldValue("idKar", values.value);
                                    handleChange;
                                }}
                                handleBlur={handleBlur}
                                values={values.idKar}
                                placeholder="Pilih Karyawan"
                            />
                            <div className="col-12 mt-3 d-flex">
                                <button
                                    type="submit"
                                    className="btn btn-danger mx-auto"
                                    onClick={handleSubmit}
                                >
                                    Hapus
                                </button>
                            </div>
                        </form>
                    )}
                </Formik>
                <div className="w-30 h-25 mx-auto text-wrap">
                    {renderPlayerGIF(status, message)}
                </div>
            </>
        );
    };

    const PlayerGIFScanning = ({ message }) => (
        <>
            <BadgeClass status={status} message={message} />
            <DotLottieReact
                src={`/GIF/Fingerprint/scanning.lottie`}
                className="mx-auto w-64 h-48 shadow border border-primary border-4 rounded-lg"
                loop
                autoplay
                style={{
                    height: 10,
                    width: 10,
                }}
            />
        </>
    );
    const PlayerGIFLoading = ({ message }) => (
        <>
            <BadgeClass status={status} message={message} />

            <DotLottieReact
                src={`/GIF/Fingerprint/loading.lottie`}
                className="mx-auto w-64 h-48 shadow border border-sky-500 border-4 rounded-lg"
                loop
                autoplay
                style={{
                    height: 10,
                    width: 10,
                }}
            />
        </>
    );
    const PlayerGIFSuccess = ({ message }) => (
        <>
            <BadgeClass status={status} message={message} />

            <DotLottieReact
                src={`/GIF/Fingerprint/success.lottie`}
                className="mx-auto w-64 h-48 shadow border border-green-500 border-4 rounded-lg"
                loop
                autoplay
                style={{
                    height: 10,
                    width: 10,
                }}
            />
        </>
    );
    const PlayerGIFFailed = ({ message }) => (
        <>
            <BadgeClass status={status} message={message} />
            <DotLottieReact
                src={`/GIF/Fingerprint/failed.lottie`}
                className="mx-auto w-64 h-48 shadow border border-red-500 border-4 rounded-lg"
                loop
                autoplay
                style={{
                    height: 10,
                    width: 10,
                }}
            />
        </>
    );
    const PlayerGIFLost = () =>
        !activeFP && (
            <>
                <BadgeClass thisStatus={3} message={message} />
                <DotLottieReact
                    src={`/GIF/Fingerprint/search_scanner.lottie`}
                    className="mx-auto w-64 h-48 shadow border border-amber-500 border-4 rounded-lg"
                    loop
                    autoplay
                    style={{
                        height: 10,
                        width: 10,
                    }}
                />
            </>
        );

    const BadgeClass = ({ thisStatus, message }) => {
        let badgeClass;
        switch (thisStatus) {
            case 1:
            case 2:
                badgeClass = "bg-amber-400";
                break;
            case 3:
                badgeClass = "bg-red-500";
                break;
            case 4:
                badgeClass = "bg-green-500";
                break;
            default:
                badgeClass = "bg-primary";
                break;
        }

        return (
            <div
                className={`rounded-xl mx-auto w-[50%] shadow px-3 py-2 my-1 ${badgeClass} text-white text-sm text-wrap`}
            >
                {message}
            </div>
        );
    };

    const renderPlayerGIF = (status, message) => {
        switch (status) {
            case 1:
                return <PlayerGIFScanning message={message} />;
            case 2:
                return <PlayerGIFLoading message={message} />;
            case 3:
                return <PlayerGIFFailed message={message} />;
            case 4:
                return <PlayerGIFSuccess message={message} />;
            default:
                return null;
        }
    };

    const [listFitur, setListFitur] = useState([
        { id: 1, title: "Presensi", status: true },
        { id: 2, title: "Daftar", status: false },
        { id: 3, title: "Hapus", status: false },
    ]);

    const NotifMaintenance = () => {
        const waktu = Clock();
        return (
            <div className="relative min-h-[480px]">
                <span className="badge bg-red-500 text-white text-md font-bold">
                    Maintenance
                </span>
                <div className="flex justify-center">
                    <div className="grid grid-cols-2 shadow-lg rounded-lg mx-auto items-center">
                        <div className="text-end py-5 pr-2 pl-10">
                            <span className="fw-bold fs-5">
                                {hariIndo(waktu)},
                            </span>
                            <br />
                            <span className="fw-bold fs-6">
                                {tanggalIndo(waktu)}
                            </span>
                        </div>
                        <div className="p-4 pr-10 mr-2 text-start bg-primary shadow fs-3 font-bold text-white rounded-lg">
                            <span className="mt-2">{jamIndo(waktu)}</span>
                        </div>
                    </div>
                </div>
                <div className="mt-4 mt-10 text-3xl">
                    <span className="badge bg-amber-400 px-4 py-1 text-md font-bold">
                        Mohon Maaf
                    </span>
                    <br />
                    Alat sedang dalam perbaikan
                    <DotLottieReact
                        src={`/GIF/Fingerprint/search_scanner.lottie`}
                        className="mx-auto w-64 h-48 shadow border border-amber-500 border-4 rounded-lg"
                        loop
                        autoplay
                        style={{
                            height: 10,
                            width: 10,
                        }}
                    />
                </div>
            </div>
        );
    };

    return (
        <GuestLayout>
            <div className="text-center mx-auto bg-white">
                <div className="absolute top-2 end-2">
                    <FontAwesomeIcon
                        icon={maintenance ? faWrench : faCheckCircle}
                        onClick={() => setMaintenance(!maintenance)}
                    />
                </div>
                {maintenance ? (
                    <NotifMaintenance />
                ) : (
                    <FullScreen handle={fullScreenRef}>
                        {floatButtonFitur && (
                            <div
                                className={`bg-white shadow-lg fixed bottom-8 text-white p-3 end-4 rounded-lg z-40 m-0`}
                            >
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
                                    {/* <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        location.replace(
                                            "/Karyawan/Presensi/Fingerprint/dashboard"
                                        )
                                    }
                                >
                                    Kehadiran Hari Ini
                                </button> */}
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => stopFetching()}
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
                                            className={`text-xl text-primary`}
                                            onClick={() =>
                                                setfloatButtonFitur(false)
                                            }
                                            aria-expanded={!floatButtonFitur}
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
                                onClick={() => setfloatButtonFitur(true)}
                                aria-expanded={floatButtonFitur}
                            >
                                <FontAwesomeIcon
                                    icon={activeFP ? faBars : faFingerprint}
                                    size="xl"
                                />
                            </button>
                        )}
                        {listFitur.map(
                            (item, i) =>
                                item.status && (
                                    // <React.Fragment key={item.id}>
                                    //     {item.children}
                                    // </React.Fragment>
                                    <div key={item.id} className="mt-3">
                                        {item.id == 1 && <Presensi />}
                                        {item.id == 2 && <Daftar />}
                                        {item.id == 3 && <Hapus />}
                                    </div>
                                )
                        )}
                    </FullScreen>
                )}
            </div>
        </GuestLayout>
    );
}
