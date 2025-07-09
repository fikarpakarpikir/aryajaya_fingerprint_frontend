// components/DateRangePicker.jsx
import { useState } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
// import "react-day-picker/dist/style.css";
import "react-day-picker/style.css";
import {
    formatDateToInput,
    hariTanggalIndo,
    modifyTime,
    tanggalIndo,
} from "@/Functions/waktuIndo";
import { id } from "date-fns/locale";
import dayjs from "dayjs";

export default function DateRangePicker({
    mode = "range",
    min = 1,
    minSatuan = "hari",
    max = 41,
    maxSatuan = "hari",
    setFieldValue = () => {},
    setFieldTouched = () => {},
    disableBefore = true,
}) {
    // console.log(max);
    // ! FIX - Cuti Tahunan
    const [range, setRange] = useState({ from: undefined, to: undefined });

    const defCN = getDefaultClassNames();
    const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");
    const handleSelect = (val) => {
        if (mode === "single") {
            setFieldValue("mulai", formatDate(val));
            setFieldValue("selesai", formatDate(val));
            setFieldTouched("mulai", true);
            setFieldTouched("selesai", true);
            setRange({ from: val, to: val });
        } else {
            const finalRange = {
                from: val?.from,
                to: val?.to ?? val?.from, // <- kalau to belum ada, samakan dengan from
            };
            const formattedMulai = formatDate(finalRange?.from);
            const formattedSelesai = formatDate(finalRange?.to);
            setRange(finalRange);
            setFieldValue("mulai", formattedMulai ?? "");
            setFieldValue("selesai", formattedSelesai ?? formattedMulai ?? "");
            setFieldTouched("mulai", true);
            setFieldTouched("selesai", true);
        }
    };
    const handleReset = () => {
        setFieldValue("mulai", null);
        setFieldValue("selesai", null);
        setRange({ from: undefined, to: undefined });
    };
    const footer =
        range?.from && range?.to
            ? `${hariTanggalIndo(range.from)} - ${hariTanggalIndo(range.to)}`
            : range?.from
            ? `${hariTanggalIndo(range?.from)}`
            : "Silakan pilih rentang tanggal";

    return (
        <div className="flex flex-col items-center space-y-4 bg-white p-4 rounded-lg shadow-md w-full md:w-[420px]">
            Pilih Tanggal Mulai dan Selesai
            <DayPicker
                mode={mode}
                animate
                locale={id}
                captionLayout="dropdown"
                defaultMonth={modifyTime(new Date(), min, minSatuan)}
                startMonth={
                    disableBefore && modifyTime(new Date(), min, minSatuan)
                }
                min={1}
                max={max - 1}
                disabled={[
                    disableBefore && {
                        before: modifyTime(new Date(), min, minSatuan),
                    },
                    range?.from && {
                        // before: modifyTime(range.from, min, maxSatuan), // batas maksimum
                        after: modifyTime(range.from, max - 1, maxSatuan), // batas maksimum
                    },
                    // range?.to && {
                    //     before: modifyTime(range.to, min, minSatuan), // batas minimum setelah 'from'
                    // },
                ].filter(Boolean)}
                excludeDisabled
                selected={mode === "range" ? range : range?.from}
                onSelect={handleSelect}
                modifiersClassNames={{ marked: "bg-yellow-300 rounded-full" }}
                showOutsideDays
                classNames={{
                    // day: `rounded-lg`,
                    today: `text-primary font-bold rounded-full`, // Add a border to today's date
                    selected: `bg-primary text-white `, // Highlight the selected day
                    root: `${defCN.root} shadow-lg rounded-lg p-5`, // Add a shadow to the root element
                    chevron: `fill-primary`, // Change the color of the chevron
                    range_start: `rounded-l-lg`,
                    range_middle: `bg-sky-600 bg-opacity-60 border-primary text-white`,
                    range_end: `rounded-r-lg`,
                }}
            />
            <p className="text-gray-700">{footer}</p>
            <button
                className="btn-secondary"
                type="button"
                onClick={() => handleReset()}
            >
                Reset
            </button>
        </div>
    );
}
