import { useSelector } from "react-redux";

export const totalAbsen = (orgAbsens, kode_ket) => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1); // Start of year
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59); // End of year

    // Filter absens based on criteria
    const absens = orgAbsens?.filter(
        (absen) =>
            absen.kode_ket === kode_ket &&
            absen.kode_status === 3 &&
            new Date(absen.updated_at) >= startOfYear &&
            new Date(absen.updated_at) <= endOfYear
    );

    let totalAbsen = 0;

    absens?.forEach((key) => {
        const mulai = new Date(key.mulai);
        const selesai = new Date(key.selesai);

        let hariAbsen;
        if (kode_ket === 10 || kode_ket === 7) {
            // Difference in minutes
            const diffMinutes = Math.abs(selesai - mulai) / (1000 * 60);
            hariAbsen = Math.round(diffMinutes);
        } else {
            // Difference in days
            const diffDays = Math.abs(selesai - mulai) / (1000 * 60 * 60 * 24);
            hariAbsen = Math.round(diffDays) + 1;
        }

        totalAbsen += hariAbsen;
    });

    let pesan = "";
    if (absens.length > 0) {
        if (kode_ket === 10 || kode_ket === 7) {
            pesan = `${absens.length} kali dengan total ${totalAbsen} menit`;
        } else {
            pesan = `${absens.length} kali dengan total ${totalAbsen} hari`;
        }
    } else {
        pesan = "Belum pernah";
    }

    return pesan;
};

export const totalJadwalKerja = (data, kode_nilai, key) => {
    const total = data.filter((item) => item[key] == kode_nilai);
    // console.log(total);
    return total.length > 0 ? `${total.length} kali` : "Belum pernah";
};

export const calJaker = (jaker, id, ket = "hari") => {
    const data = jaker?.filter((item) => Number(item.kode_ket) === id);
    if (!data.length) return "Belum pernah";

    const totalHariUnik = new Set(
        data.map((item) => new Date(item.mulai).toDateString())
    )?.size;

    let durasi = 0;
    if (ket === "jam") {
        durasi = data.reduce((acc, item) => {
            const start = dayjs(item.mulai);
            const end = dayjs(item.selesai);
            return acc + end.diff(start, "minute");
        }, 0);
    }
    return {
        total: data.length,
        durasi: ket === "jam" ? durasi : totalHariUnik,
    };
};
