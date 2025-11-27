import { useState } from "react";

export default function FingerSelector({
    allowMultiple = false,
    onChange = () => {},
    initial = [],
    preValue = [],
    isDeletable = false,
}) {
    /*
     * NOTE: ID Jari
     *  1. Jempol Kanan
     *  2. Telunjuk Kanan
     *  3. Tengah Kanan
     *  4. Manis Kanan
     *  5. Kelingking Kanan
     *  6. Jempol Kiri
     *  7. Telunjuk Kiri
     *  8. Tengah Kiri
     *  9. Manis Kiri
     * 10. Kelingking Kiri
     */
    const [selected, setSelected] = useState(() => {
        // normalize initial
        return Array.isArray(initial) ? initial : [initial];
    });

    function toggle(id) {
        setSelected((prev) => {
            let next;
            if (allowMultiple) {
                if (prev.includes(id)) next = prev.filter((x) => x !== id);
                else next = [...prev, id];
            } else {
                next = prev.includes(id) ? [] : [id];
            }
            onChange(next);
            return next;
        });
    }

    function handleKey(e, id) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!preValue.includes(id)) toggleFinger(id);
        }
    }

    const styleFor = (id) => {
        const orange = "#ffba00";
        const gray = "#707070";
        return {
            fill: preValue.includes(id)
                ? isDeletable
                    ? orange
                    : gray
                : selected.includes(id)
                ? isDeletable
                    ? gray
                    : orange
                : "#fffaf1ff",
            stroke: selected.includes(id) ? "#ffba00" : "#b89b5bff",
            cursor: "pointer",
            transition: "all 160ms ease",
        };
    };

    const listJari = [
        // === Tangan Kanan ===
        {
            id: 1,
            x: 20,
            y: 120,
            rx: 18,
            ry: 18,
            w: 40,
            h: 80,
            label: "Ibu jari kanan",
            tangan: "kanan",
        },
        {
            id: 2,
            x: 64,
            y: 30,
            rx: 14,
            ry: 14,
            w: 36,
            h: 110,
            label: "Jari telunjuk kanan",
            tangan: "kanan",
        },
        {
            id: 3,
            x: 109,
            y: 20,
            rx: 14,
            ry: 14,
            w: 36,
            h: 120,
            label: "Jari tengah kanan",
            tangan: "kanan",
        },
        {
            id: 4,
            x: 154,
            y: 36,
            rx: 13,
            ry: 13,
            w: 34,
            h: 104,
            label: "Jari manis kanan",
            tangan: "kanan",
        },
        {
            id: 5,
            x: 196,
            y: 54,
            rx: 12,
            ry: 12,
            w: 30,
            h: 86,
            label: "Kelingking kanan",
            tangan: "kanan",
        },

        // === Tangan Kiri ===
        {
            id: 6,
            x: 290,
            y: 120,
            rx: 18,
            ry: 18,
            w: 40,
            h: 80,
            label: "Ibu jari kiri",
            tangan: "kiri",
        },
        {
            id: 7,
            x: 250,
            y: 30,
            rx: 14,
            ry: 14,
            w: 36,
            h: 110,
            label: "Jari telunjuk kiri",
            tangan: "kiri",
        },
        {
            id: 8,
            x: 205,
            y: 20,
            rx: 14,
            ry: 14,
            w: 36,
            h: 120,
            label: "Jari tengah kiri",
            tangan: "kiri",
        },
        {
            id: 9,
            x: 163,
            y: 36,
            rx: 13,
            ry: 13,
            w: 34,
            h: 104,
            label: "Jari manis kiri",
            tangan: "kiri",
        },
        {
            id: 10,
            x: 125,
            y: 54,
            rx: 12,
            ry: 12,
            w: 30,
            h: 86,
            label: "Kelingking kiri",
            tangan: "kiri",
        },
    ];

    const [u, r] = isDeletable
        ? ["Jari belum terdaftar", "Jari sudah terdaftar"]
        : ["Jari sudah terdaftar", "Jari belum terdaftar"];

    const listLegend = [
        { text: u, color: "#707070" },
        { text: "Jari dipilih untuk didaftarkan", color: "#ffba00" },
        { text: r, color: "#fffaf1" },
    ];

    const Jari = ({ j }) => {
        const exists = preValue.includes(j.id);

        const disabled = isDeletable ? !exists : exists;
        const isSelected = selected.includes(j.id);

        return (
            <g>
                <rect
                    key={j.id}
                    x={j.x}
                    y={j.y}
                    rx={j.rx}
                    ry={j.ry}
                    width={j.w}
                    height={j.h}
                    style={styleFor(j.id)}
                    tabIndex={disabled ? -1 : 0}
                    role="button"
                    aria-pressed={isSelected}
                    aria-label={j.label}
                    className={`transition-all ${
                        disabled
                            ? "cursor-not-allowed opacity-60 pointer-events-none"
                            : "cursor-pointer"
                    }`}
                    onClick={!disabled ? () => toggle(j.id) : undefined}
                    onKeyDown={
                        !disabled ? (e) => handleKey(e, j.id) : undefined
                    }
                />
            </g>
        );
    };

    return (
        <div className="pt-2 bg-white rounded-xl w-full max-w-xl mx-auto relative">
            <h3 className="text-lg font-semibold mb-1">Pilih Jari</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <svg
                    viewBox="0 0 760 280"
                    width="100%"
                    height="100%"
                    role="img"
                    aria-label="Diagram tangan kiri dan kanan dengan jari yang bisa dipilih"
                >
                    <defs>
                        <filter
                            id="shadow"
                            x="-20%"
                            y="-20%"
                            width="140%"
                            height="140%"
                        >
                            <feDropShadow
                                dx="0"
                                dy="4"
                                stdDeviation="6"
                                floodOpacity="0.12"
                            />
                        </filter>
                    </defs>

                    {/* LEFT HAND */}
                    <g transform="translate(-30,-20) scale(1.2)">
                        {/* Palm */}
                        <rect
                            x="120"
                            y="110"
                            rx="28"
                            ry="28"
                            width="180"
                            height="120"
                            style={{ fill: "#fff", stroke: "#e2e8f0" }}
                            filter="url(#shadow)"
                        />

                        {listJari
                            .filter((j) => j.tangan == "kiri")
                            .map((j, i) => (
                                <Jari j={j} key={i} />
                            ))}
                    </g>

                    {/* RIGHT HAND */}
                    <g transform="translate(380,-20) scale(1.2)">
                        {/* Palm */}
                        <rect
                            x="50"
                            y="110"
                            rx="28"
                            ry="28"
                            width="180"
                            height="120"
                            style={{ fill: "#fff", stroke: "#e2e8f0" }}
                            filter="url(#shadow)"
                        />

                        {/* Fingers (right-hand: thumb on right side of palm) */}
                        {listJari
                            .filter((j) => j.tangan == "kanan")
                            .map((j, i) => (
                                <Jari j={j} key={i} />
                            ))}
                    </g>
                    <text
                        x="220"
                        y="200"
                        fontSize="20"
                        fill="#475569"
                        textAnchor="middle"
                        fontWeight={"bold"}
                        style={{ userSelect: "none" }}
                    >
                        Tangan Kiri
                    </text>
                    <text
                        x="555"
                        y="200"
                        fontSize="20"
                        fill="#475569"
                        textAnchor="middle"
                        fontWeight={"bold"}
                        style={{ userSelect: "none" }}
                    >
                        Tangan Kanan
                    </text>
                </svg>
            </div>
            <div className="absolute -right-40 top-5 bg-zinc-200 p-2 rounded-lg">
                {listLegend.map((legend, i) => (
                    <div
                        key={i}
                        className="flex gap-2 items-center justify-start"
                    >
                        <span
                            className={`flex w-2.5 h-2.5 rounded-full me-1.5 shrink-0`}
                            style={{ backgroundColor: legend.color }}
                        ></span>
                        <span className="font-semibold text-sm">
                            {legend.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
