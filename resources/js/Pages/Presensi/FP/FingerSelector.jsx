import { useState } from "react";

export default function FingerSelector({
    allowMultiple = false,
    onChange = () => {},
    initial = [],
    preValue = [],
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
            toggleFinger(id);
        }
    }

    const styleFor = (id) => {
        return {
            fill: preValue.includes(id)
                ? "#f7f5de"
                : selected.includes(id)
                ? "#ffba00"
                : "#fffaf1ff",
            stroke: selected.includes(id) ? "#ffba00" : "#b89b5bff",
            cursor: "pointer",
            transition: "all 160ms ease",
        };
    };

    return (
        <div className="pt-2 bg-white rounded-xl w-full max-w-xl mx-auto">
            <h3 className="text-lg font-semibold mb-1">Pilih Jari</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <svg
                    viewBox="0 0 760 280"
                    width="100%"
                    height="auto"
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

                        {/* Thumb */}
                        <g>
                            <rect
                                x="290"
                                y="120"
                                rx="18"
                                ry="18"
                                width="40"
                                height="80"
                                style={styleFor(6)}
                                tabIndex={0}
                                role="button"
                                aria-pressed={selected.includes(6)}
                                aria-label="Ibu jari kiri"
                                onClick={() => toggle(6)}
                                onKeyDown={(e) => handleKey(e, 6)}
                            />
                        </g>

                        {/* Index */}
                        <g>
                            <rect
                                x="250"
                                y="30"
                                rx="14"
                                ry="14"
                                width="36"
                                height="110"
                                style={styleFor(7)}
                                tabIndex={0}
                                role="button"
                                aria-pressed={selected.includes(7)}
                                aria-label="Jari telunjuk kiri"
                                onClick={() => toggle(7)}
                                onKeyDown={(e) => handleKey(e, 7)}
                            />
                        </g>
                        {/* Middle */}
                        <g>
                            <rect
                                x="205"
                                y="20"
                                rx="14"
                                ry="14"
                                width="36"
                                height="120"
                                style={styleFor(8)}
                                tabIndex={0}
                                role="button"
                                aria-pressed={selected.includes(8)}
                                aria-label="Jari tengah kiri"
                                onClick={() => toggle(8)}
                                onKeyDown={(e) => handleKey(e, 8)}
                            />
                        </g>

                        {/* Ring */}
                        <g>
                            <rect
                                x="163"
                                y="36"
                                rx="13"
                                ry="13"
                                width="34"
                                height="104"
                                style={styleFor(9)}
                                tabIndex={0}
                                role="button"
                                aria-pressed={selected.includes(9)}
                                aria-label="Jari manis kiri"
                                onClick={() => toggle(9)}
                                onKeyDown={(e) => handleKey(e, 9)}
                            />
                        </g>

                        {/* Pinky */}
                        <g>
                            <rect
                                x="125"
                                y="54"
                                rx="12"
                                ry="12"
                                width="30"
                                height="86"
                                style={styleFor(10)}
                                tabIndex={0}
                                role="button"
                                aria-pressed={selected.includes(10)}
                                aria-label="Kelingking kiri"
                                onClick={() => toggle(10)}
                                onKeyDown={(e) => handleKey(e, 10)}
                            />
                        </g>
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
                        {/* Thumb */}
                        <g>
                            <rect
                                x="20"
                                y="120"
                                rx="18"
                                ry="18"
                                width="40"
                                height="80"
                                style={styleFor(1)}
                                tabIndex={0}
                                role="button"
                                aria-pressed={selected.includes(1)}
                                aria-label="Ibu jari kanan"
                                onClick={() => toggle(1)}
                                onKeyDown={(e) => handleKey(e, 1)}
                            />
                        </g>

                        {/* Index */}
                        <g>
                            <rect
                                x="64"
                                y="30"
                                rx="14"
                                ry="14"
                                width="36"
                                height="110"
                                style={styleFor(2)}
                                tabIndex={0}
                                role="button"
                                aria-pressed={selected.includes(2)}
                                aria-label="Jari telunjuk kanan"
                                onClick={() => toggle(2)}
                                onKeyDown={(e) => handleKey(e, 2)}
                            />
                        </g>

                        {/* Middle */}
                        <g>
                            <rect
                                x="109"
                                y="20"
                                rx="14"
                                ry="14"
                                width="36"
                                height="120"
                                style={styleFor(3)}
                                tabIndex={0}
                                role="button"
                                aria-pressed={selected.includes(3)}
                                aria-label="Jari tengah kanan"
                                onClick={() => toggle(3)}
                                onKeyDown={(e) => handleKey(e, 3)}
                            />
                        </g>

                        {/* Ring */}
                        <g>
                            <rect
                                x="154"
                                y="36"
                                rx="13"
                                ry="13"
                                width="34"
                                height="104"
                                style={styleFor(4)}
                                tabIndex={0}
                                role="button"
                                aria-pressed={selected.includes(4)}
                                aria-label="Jari manis kanan"
                                onClick={() => toggle(4)}
                                onKeyDown={(e) => handleKey(e, 4)}
                            />
                        </g>
                        {/* Pinky */}
                        <g>
                            <rect
                                x="196"
                                y="54"
                                rx="12"
                                ry="12"
                                width="30"
                                height="86"
                                style={styleFor(5)}
                                tabIndex={0}
                                role="button"
                                aria-pressed={selected.includes(5)}
                                aria-label="Kelingking kanan"
                                onClick={() => toggle(5)}
                                onKeyDown={(e) => handleKey(e, 5)}
                            />
                        </g>
                    </g>
                    <text
                        x="220"
                        y="200"
                        fontSize="20"
                        fill="#475569"
                        textAnchor="middle"
                        fontWeight={"bold"}
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
                    >
                        Tangan Kanan
                    </text>
                </svg>
            </div>
        </div>
    );
}
