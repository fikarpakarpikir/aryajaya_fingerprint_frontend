import sendDataGeneral from "@/Functions/sendDataGeneral";
import dayjs from "dayjs";
import { useState, useRef, useEffect } from "react";

export default function useSyncing() {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [hasClicked, setHasClicked] = useState(null);
    const [msg, setMsg] = useState(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!window.Echo) return;
        // const channel = window.Echo.channel("progress");
        const channel = window.Echo.channel("sync-progress");
        // const channel2 = window.Echo.channel("syncProgress");
        // const channel3 = window.Echo.channel(".sync-progress");
        // const channel4 = window.Echo.channel(".syncProgress");

        // console.log("🚀 ~ useSyncing ~ window.Echo:", window.Echo);
        // console.log("🚀 ~ useSyncing ~ channel:", channel);
        // console.log("🚀 ~ useSyncing ~ channel2:", channel2);
        // console.log("🚀 ~ useSyncing ~ channel3:", channel3);
        // console.log("🚀 ~ useSyncing ~ channel4:", channel4);

        const handler = (e) => {
            try {
                // console.log("🚀 ~ handler ~ e:", e);
                const { done, total } = e;
                const percent =
                    total > 0 ? Math.round((done / total) * 100) : 0;

                setProgress(percent);
                setMsg(`Synchronizing... ${done} / ${total}`);
                if (percent >= 100) {
                    setLoading(false);
                    setHasClicked("success");

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

    const syncingData = async (jenisData) => {
        setMsg("");
        const data = new FormData();
        data.append("jenis_data", jenisData);
        data.append("mulai", dayjs().subtract(2, "year").format("YYYY-MM-DD"));

        setLoading(true);
        setHasClicked("loading");
        setProgress(0);

        const res = await sendDataGeneral({
            data,
            route: route("sync_data"),
            handleClose: () => {},
            // onProgress: setProgress,
            useRedux: false,
            waitUntilFinish: true,
            slicer: () => {},
        });
        // console.log("🚀 ~ syncingData ~ res:", res);
        if (res.status == 200) {
            const { done, total, status } = res.data;
            if (status == "success" && done != total) {
                setMsg(
                    `Hanya ${done}/${total}. Tersisa ${
                        total - done
                    } data yang tidak berhasil`
                );
                setLoading(false);
                setHasClicked("success");
            }
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
