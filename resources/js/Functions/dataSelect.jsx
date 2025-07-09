import useAuth from "./useAuth";
import { jamIndo, modifyTime } from "./waktuIndo";

export default function dataSelect(
    data,
    key1 = "id",
    key2 = "title",
    alt1 = "title"
) {
    const dataArray = data.map((item) => ({
        value: item[key1],
        label: key2.includes(".")
            ? getObjectValue(item, key2) || getObjectValue(item, alt1)
            : item[key2] || item[alt1],
    }));

    dataArray.sort((a, b) => {
        const labelA = a?.label?.toLowerCase() || "";
        const labelB = b?.label?.toLowerCase() || "";
        if (labelA < labelB) return -1;
        if (labelA > labelB) return 1;
        return 0;
    });
    return dataArray;
}

function getObjectValue(obj, path) {
    // if (path == "div.divisi.title") {
    //     console.log(obj, path);
    // }
    const keys = path.split(".");
    let value = obj;
    for (const key of keys) {
        value = value?.[key]; // use optional chaining here to handle undefined keys
        if (value === undefined) {
            return undefined;
        }
    }
    return value;
}
function formatDateTime(date) {
    const d = new Date(date);

    // Format components
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
function formatDate(date) {
    const d = new Date(date);

    // Format components
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function dayMap(target) {
    const days = {
        1: "Senin",
        2: "Selasa",
        3: "Rabu",
        4: "Kamis",
        5: "Jumat",
        6: "Sabtu",
        7: "Minggu",
    };

    // console.log("🚀 ~ dayMap ~ target:", target);
    let hariArray = Array.isArray(target)
        ? target
        : typeof target === "string"
        ? JSON.parse(target)
        : [];
    return hariArray?.map((num) => days[num.trim()] || "Invalid")?.join(", ");
}

function formatEvents(
    data,
    keyTitle = "title",
    keyStart = "mulai",
    keyEnd = "selesai",
    keyDesc,
    keyCat,
    subTitle = "title"
) {
    const { auth } = useAuth();
    const cekKey = (key, item) =>
        key.includes(".") ? getObjectValue(item, key) : item[key];
    return data.map((item) => {
        const isSpecialEvent =
            cekKey(keyCat, item) == 1 && item.macam_hadir == 28;
        const title = cekKey(keyTitle, item) ?? "Unknown Title";
        const subtitle = cekKey(subTitle, item) ?? "Unknown Title";
        const start = cekKey(keyStart, item) || "Unknown Date";
        const end = cekKey(keyEnd, item) || "Unknown Date";
        const description = `${
            item.id_karyawan != auth.user.id_karyawan
                ? `${item.org?.nama} -`
                : ""
        } ${
            isSpecialEvent
                ? dayMap(cekKey(keyDesc, item))
                : cekKey(keyDesc, item) ?? ""
        }`;
        const category = cekKey(keyCat, item) || "Unknown Category";

        // Common event object
        const event = {
            id: item.id,
            title,
            subtitle,
            start,
            end,
            description,
            category,
        };

        // Add recurrence only if it's a special event
        if (isSpecialEvent) {
            // console.log(item);
            event.recurrence = {
                frequency: "daily",
                interval: 1,
                byDay: dayMap(cekKey(keyDesc, item) ?? ""),
                until: modifyTime(cekKey(keyEnd, item), 2, "tahun"),
            };
        }

        return event;
    });
}

const imgExt = ["jpg", "jpeg", "png", "heic"];
const isImage = (filename) => {
    return imgExt.includes(filename?.split(".").pop()?.toLowerCase());
};
const isPDF = (filename) => {
    return ["pdf"].includes(filename?.split(".").pop()?.toLowerCase());
};

export { getObjectValue, isImage, isPDF, formatEvents, formatDate, dayMap };
