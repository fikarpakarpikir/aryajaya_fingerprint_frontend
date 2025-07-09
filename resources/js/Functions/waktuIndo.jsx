// Convert string to Date object
export function formatTanggal(tanggal, options, negara = "id-ID") {
    return new Date(tanggal || Date.now()).toLocaleString(negara, options);
}

const fullWaktuIndo = (tanggal) =>
    formatTanggal(tanggal, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZoneName: "short",
        hour12: false, // Use 24-hour format
    });

export const hariIndo = (tanggal) =>
    formatTanggal(tanggal, { weekday: "long" });

export const hariTanggalIndo = (tanggal) =>
    formatTanggal(tanggal, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

export const tanggalIndo = (tanggal) =>
    formatTanggal(tanggal, { day: "numeric", month: "long", year: "numeric" });

export const jamIndo = (tanggal) =>
    formatTanggal(tanggal, {
        hour: "numeric",
        minute: "numeric",
        timeZoneName: "short",
        hour12: false, // Use 24-hour format
    });

export const tanggalJamIndo = (tanggal) => {
    const tgl = formatTanggal(tanggal, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });
    const jam = formatTanggal(tanggal, {
        hour: "numeric",
        minute: "numeric",
    });
    return `${tgl.replace("/", "-")} ${jam}`;
};
export const tanggalJamISO = (tanggal) =>
    new Date(tanggal || Date.now())
        .toISOString()
        .slice(0, 16)
        .replace("T", " ");

export const bulanTahunIndo = (tanggal) =>
    formatTanggal(tanggal, {
        month: "long",
        year: "numeric",
    });

export const formatWaktu = (detik) => {
    const jam = Math.floor(detik / 3600);
    const menit = Math.floor((detik % 3600) / 60);
    const sisaDetik = detik % 60;
    return `${jam.toString().padStart(2, "0")}:${menit
        .toString()
        .padStart(2, "0")}:${sisaDetik.toString().padStart(2, "0")}`;
};

export const formatDateToInput = (dateString) => {
    // Buat objek Date dari string tanggal dalam bahasa Inggris
    const date = new Date(dateString);

    // Pastikan objek Date valid sebelum mengonversi
    if (!isNaN(date)) {
        return date.toISOString().split("T")[0]; // Format "yyyy-MM-dd"
    }

    return ""; // Jika format tidak valid, kembalikan string kosong
};
export const formatDatetimeToInput = (dateString) => {
    // Buat objek Date dari string tanggal dalam bahasa Inggris
    const date = new Date(dateString);

    // Pastikan objek Date valid sebelum mengonversi
    if (!isNaN(date)) {
        0;
        date.toISOString().slice(0, 19).replace("T", " ");

        return date.toISOString().split("T")[0]; // Format "yyyy-MM-dd"
    }

    return ""; // Jika format tidak valid, kembalikan string kosong
};

export function modifyTime(waktu = new Date(), jumlah = 0, satuan = "menit") {
    const time = new Date(waktu);

    const units = {
        menit: () => time.setMinutes(time.getMinutes() + jumlah),
        jam: () => time.setHours(time.getHours() + jumlah),
        hari: () => time.setDate(time.getDate() + jumlah),
        minggu: () => time.setDate(time.getDate() + jumlah * 7),
        bulan: () => time.setMonth(time.getMonth() + jumlah),
        tahun: () => time.setFullYear(time.getFullYear() + jumlah),
    };

    units[satuan]?.(); // Calls the function if the unit exists
    return time;
}
export function detailWaktuIndo(tanggal = new Date()) {
    const waktu = formatTanggal(tanggal);
    // Format the date as required
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
        hour12: false, // Use 24-hour format
    };

    const full = waktu.toLocaleString("id-ID", options);
    const hari = waktu.toLocaleString("id-ID", { weekday: options.weekday });
    const tgl = waktu.toLocaleString("id-ID", { day: options.day });
    const bulan = waktu.toLocaleString("id-ID", { month: options.month });
    const tahun = waktu.toLocaleString("id-ID", { year: options.year });
    const jam = waktu.toLocaleString("id-ID", { hour: options.hour });
    const menit = waktu.toLocaleString("id-ID", { minute: options.minute });
    const detik = waktu.toLocaleString("id-ID", { second: options.second });
    const tz = waktu.toLocaleString("id-ID", {
        timeZoneName: options.timeZoneName,
    });
    const fullHari = waktu.toLocaleString("id-ID", {
        weekday: options.weekday,
        day: options.day,
        month: options.month,
        year: options.year,
    });
    const fullTanggal = waktu.toLocaleString("id-ID", {
        day: options.day,
        month: options.month,
        year: options.year,
    });
    const fullZona = waktu.toLocaleString("id-ID", {
        hour: options.hour,
        minute: options.minute,
        second: options.second,
        timeZone: options.timeZone,
    });
    const fullJam = waktu.toLocaleString("id-ID", {
        hour: options.hour,
        minute: options.minute,
        second: options.second,
    });

    return {
        full,
        hari,
        tanggal: tgl,
        bulan,
        tahun,
        jam,
        menit,
        detik,
        timeZone: tz,
        fullHari,
        fullTanggal,
        fullZona,
        fullJam,
    };
}

export default fullWaktuIndo;
