import React, { useState, useEffect } from "react";

const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timerId); // Cleanup the interval on component unmount
    }, []);

    return time;
};

export const useCountdown = ({
    quota,
    startTime,
    handleWaktuHabis = () => {},
    jeda = 0,
}) => {
    const mulai = new Date(startTime); // pastikan format ISO

    const [sisaWaktu, setSisaWaktu] = useState(() => {
        const sekarang = new Date();
        const selisih = Math.floor(
            (mulai.getTime() + quota * 1000 - sekarang.getTime()) / 1000
        );
        return Math.max(selisih, 0);
    });

    const [sudahEksekusi, setSudahEksekusi] = useState(false);
    useEffect(() => {
        if (sisaWaktu <= 0 && !sudahEksekusi) {
            setSudahEksekusi(true);

            // // Tampilkan peringatan
            // console.warn("Waktu habis! Memberi jeda untuk user membaca...");

            // Eksekusi function dengan jeda 3 detik
            const timeout = setTimeout(() => {
                handleWaktuHabis();
            }, jeda * 1000);

            return () => clearTimeout(timeout);
        }

        const interval = setInterval(() => {
            setSisaWaktu((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    handleWaktuHabis();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [sisaWaktu]);

    return sisaWaktu;
};
export const CountdownTimer = ({ detik }) => {
    const formatWaktu = (detik) => {
        const jam = Math.floor(detik / 3600);
        const menit = Math.floor((detik % 3600) / 60);
        const sisaDetik = detik % 60;
        return `${jam.toString().padStart(2, "0")}:${menit
            .toString()
            .padStart(2, "0")}:${sisaDetik.toString().padStart(2, "0")}`;
    };

    return <span>{formatWaktu(detik)}</span>;
};

export default Clock;
