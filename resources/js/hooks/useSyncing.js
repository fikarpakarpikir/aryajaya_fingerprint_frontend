import sendDataGeneral from "@/Functions/sendDataGeneral";

import { setMessage, setProcess } from "@/redux/slices/ProcessStateSlice";
import { setSync } from "@/redux/slices/syncSlice";
import dayjs from "dayjs";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";

export default function useSyncing() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [hasClicked, setHasClicked] = useState(null);
    const [msg, setMsg] = useState(null);
    const intervalRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!window.Echo) return;
        // const channel = window.Echo.channel("progress");
        const channel = window.Echo.channel("sync-progress");

        const handler = (e) => {
            try {
                const { done, total, step, status, jenis_data } = e;

                const jenis = {
                    1: "fp",
                    2: "face",
                }[jenis_data];
                const percent =
                    total > 0 ? Math.round((done / total) * 100) : 0;

                setProgress(percent);
                const msgState = {
                    1: "Downloading",
                    2: "Migrating",
                    3: "Selesai",
                }[step];

                const msgLocal = `${msgState}... ${done} / ${total}`;
                const msgStep = `Step ${step}/2: ${msgLocal}`;
                setMsg(msgLocal);
                dispatch(setMessage(msgLocal));
                // setMsg(`Synchronizing... ${done} / ${total}`);
                let statusSync = "loading";
                updateSync(jenis, statusSync, "", msgLocal, step);
                if (step == 3) {
                    setLoading(false);
                    if (percent >= 100) {
                        statusSync = "success";
                        setHasClicked(statusSync);
                        dispatch(setProcess(statusSync));
                        dispatch(setMessage("Sinkronisasi selesai"));
                        updateSync(jenis, statusSync, "", msgLocal, step);
                    } else {
                        statusSync = "success not all";
                        setHasClicked(statusSync);
                        dispatch(setProcess(statusSync));
                        dispatch(
                            setMessage("Sinkronisasi selesai tapi tidak semua")
                        );
                        updateSync(jenis, statusSync, "", msgLocal, step);
                    }

                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        channel.listen(".SyncProgress", handler);

        return () => {
            channel.stopListening(".SyncProgress", handler);
        };
    }, []); // <- hook ini selalu dipanggil, ga pernah conditional

    function updateSync(jenis, status, waktu, message, step) {
        dispatch(
            setSync({
                jenis,
                status,
                waktu,
                message,
                step,
            })
        );
    }

    const syncingData = async (jenisData) => {
        const listSync = {
            1: "fp",
            2: "face",
        }[jenisData];
        setMsg("");
        // setHasClicked("loading");
        setLoading(true);
        updateSync(listSync, "loading", "", "");

        dispatch(setMessage(""));
        dispatch(setProcess("loading"));
        setProgress(0);

        try {
            const data = new FormData();
            data.append("jenis_data", jenisData);
            data.append(
                "mulai",
                dayjs().subtract(2, "year").format("YYYY-MM-DD")
            );

            const res = await sendDataGeneral({
                data,
                route: route("sync_data"),
                handleClose: () => {},
                useRedux: false, // kalau mau Redux aware, bisa true
                waitUntilFinish: true,
                slicer: () => {},
            });

            if (res.status == 200) {
                const { done, total, status, message } = res.data;

                if (status === "success") {
                    dispatch(setProcess("success"));
                    if (done !== total) {
                        updateSync(
                            listSync,
                            "success",
                            "",
                            `Hanya ${done}/${total}. Tersisa ${
                                total - done
                            } data gagal`
                        );
                        dispatch(
                            setMessage(
                                `Hanya ${done}/${total}. Tersisa ${
                                    total - done
                                } data gagal`
                            )
                        );
                    } else {
                        updateSync(
                            listSync,
                            "success",
                            "",
                            `Sinkronisasi ${done}/${total} berhasil`
                        );
                        dispatch(setMessage("Sinkronisasi berhasil"));
                    }
                } else if (status === "success not all") {
                    dispatch(setProcess("success not all"));
                    if (done !== total) {
                        dispatch(
                            setMessage(
                                `Hanya ${done}/${total}. Tersisa ${
                                    total - done
                                } data gagal`
                            )
                        );

                        updateSync(
                            listSync,
                            "success not all",
                            "",
                            `Hanya ${done}/${total}. Tersisa ${
                                total - done
                            } data gagal`
                        );
                    } else {
                        updateSync(listSync, "success not all", "", message);
                        dispatch(setMessage(message));
                    }
                } else {
                    updateSync(
                        listSync,
                        "failed",
                        "",
                        res.data.message || "Sinkronisasi gagal"
                    );
                    dispatch(setProcess("failed"));
                    dispatch(
                        setMessage(res.data.message || "Sinkronisasi gagal")
                    );
                }
            } else {
                updateSync(
                    listSync,
                    "failed",
                    "",
                    "Sinkronisasi gagal: " + res.statusText
                );
                dispatch(setProcess("failed"));
                dispatch(setMessage("Sinkronisasi gagal: " + res.statusText));
                // setHasClicked("failed");
            }
        } catch (error) {
            updateSync(
                listSync,
                "failed",
                "",
                error.message || "Terjadi kesalahan"
            );
            dispatch(setProcess("failed"));
            dispatch(setMessage(error.message || "Terjadi kesalahan"));
            setHasClicked("failed");
        } finally {
            setLoading(false);
        }
    };

    const syncing = () => {
        // tandai bahwa tombol sudah diklik
        setHasClicked("loading");

        // kalau ada interval lama, stop dulu
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        setProgress(0);
        setLoading(true);

        intervalRef.current = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    setLoading(false);
                    setHasClicked("success");
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    return 100;
                }
                return p + 2;
            });
        }, 100);
    };

    return { loading, progress, msg, syncing, syncingData, hasClicked };
}
