import {
    bulanTahunIndo,
    hariIndo,
    hariTanggalIndo,
    jamIndo,
    tanggalIndo,
} from "@/Functions/waktuIndo";
import {
    faChevronLeft,
    faChevronRight,
    faEye,
    faSearch,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import ModalStatic from "./ReactStrap/ModalStatic";
import { Accordion } from "flowbite-react";
import { isImage } from "@/Functions/dataSelect";
import InputSearch from "./InputSearch";

const Calendar = ({ events }) => {
    const [view, setView] = useState("month");
    const [selectedDate, setSelectedDate] = useState(null);
    const [agendas, setAgendas] = useState(events || {});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const generateRecurringEvents = (event, exclDate) => {
        const occurrences = [];
        let thisCurrentDate = new Date(event.start).getTime(); // Convert to timestamp
        let lastDate = new Date(event.recurrence.until).getTime(); // Convert to timestamp
        const eventDuration =
            new Date(event.end).getTime() - new Date(event.start).getTime();

        const hariMap = {
            1: "Senin",
            2: "Selasa",
            3: "Rabu",
            4: "Kamis",
            5: "Jumat",
            6: "Sabtu",
            7: "Minggu",
        };

        while (thisCurrentDate <= lastDate) {
            const eventDate = new Date(thisCurrentDate);
            const eventDayCode = hariMap[eventDate.getDay()];
            // Check if the date is within range and matches the recurrence rule
            if (
                new Date(eventDate) >= new Date(event.start) &&
                !exclDate.includes(tanggalIndo(thisCurrentDate))
            ) {
                const hari = event.recurrence.byDay;
                if (!hari || hari.includes(eventDayCode)) {
                    occurrences.push({
                        ...event,
                        start: new Date(eventDate),
                        end: new Date(eventDate.getTime() + eventDuration),
                    });
                }
            }

            // Ensure interval is at least 1 to prevent infinite loops
            const interval = Math.max(event.recurrence.interval || 1, 1);

            // Move to the next occurrence
            switch (event.recurrence.frequency) {
                case "daily":
                    thisCurrentDate += interval * 24 * 60 * 60 * 1000; // Add days in milliseconds
                    break;
                case "weekly":
                    thisCurrentDate += interval * 7 * 24 * 60 * 60 * 1000; // Add weeks in milliseconds
                    break;
                case "monthly": {
                    const nextDate = new Date(thisCurrentDate);
                    nextDate.setMonth(nextDate.getMonth() + interval);
                    thisCurrentDate = nextDate.getTime();
                    break;
                }
                case "yearly": {
                    const nextDate = new Date(thisCurrentDate);
                    nextDate.setFullYear(nextDate.getFullYear() + interval);
                    thisCurrentDate = nextDate.getTime();
                    break;
                }
                default:
                    return occurrences; // Exit if frequency is invalid
            }

            // Stop if the recurrence has an end date

            if (
                event.recurrence.until &&
                thisCurrentDate > new Date(event.recurrence.until).getTime()
            ) {
                break;
            }
        }

        return occurrences;
    };

    const groupAgendasByDateAndCategory = (agendas) => {
        const grouped = {};

        agendas.forEach((agenda) => {
            const categoryKey = String(agenda.category);

            if (agenda.recurrence) {
                const occurrences = generateRecurringEvents(
                    agenda,
                    agendas
                        ?.filter((item) =>
                            [2, 3, 4, 5, 8, 12, 13].includes(item.category)
                        )
                        ?.flatMap((item) => tanggalIndo(item.start))
                );
                occurrences.forEach((occurrence) => {
                    const dateKey = tanggalIndo(occurrence.start);

                    if (!grouped[dateKey]) {
                        grouped[dateKey] = {};
                    }

                    if (!grouped[dateKey][categoryKey]) {
                        grouped[dateKey][categoryKey] = [];
                    }
                    grouped[dateKey][categoryKey].push(occurrence);
                });
                // Generate recurring events
            } else {
                const dateKey = tanggalIndo(agenda.start); // Format the date correctly

                if (!grouped[dateKey]) {
                    grouped[dateKey] = {};
                }

                if (!grouped[dateKey][categoryKey]) {
                    grouped[dateKey][categoryKey] = [];
                }

                grouped[dateKey][categoryKey].push(agenda);
            }
        });

        return grouped;
    };

    useEffect(() => {
        setAgendas(groupAgendasByDateAndCategory(events));
    }, []);

    const handleDateClick = (day) => {
        const clickedDate = new Date(year, month, day);
        setSelectedDate(clickedDate);
        // setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const BoxDay = ({ handleClick = () => {}, day }) => {
        const thisDate = new Date(year, month, day);
        const dateKey = tanggalIndo(thisDate);
        // const dateKey = thisDate.toISOString().split("T")[0];
        const hasAgenda =
            agendas[dateKey] && Object.keys(agendas[dateKey]).length > 0;

        const isSameDay = (date1, date2) =>
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();

        const isSelected = selectedDate && isSameDay(selectedDate, thisDate);
        const isCurrentDay = isSameDay(currentDate, thisDate);
        return (
            <div
                className={`transition-all duration-600 ease-in-out text-center py-5 bg-gray-50/0 shadow-none hover:bg-gray-100 hover:border ${
                    isSelected ? "border" : ""
                } hover:shadow-lg hover:-translate-y-1 rounded-lg cursor-pointer relative min-h-20`}
                onClick={() => handleClick(day)}
            >
                <div
                    className={`flex justify-center items-center text-sm md:text-base ${
                        hasAgenda ? "-translate-y-2" : ""
                    }`}
                >
                    <span
                        className={`${
                            isCurrentDay
                                ? "badge bg-primary text-white"
                                : isSelected
                                ? "badge bg-tertiary text-black"
                                : ""
                        }`}
                    >
                        {day}
                    </span>
                </div>
                {hasAgenda && (
                    <div className="absolute bottom-5 right-0 left-0 text-[8px] flex justify-center gap-[0.1rem]">
                        {Object.entries(agendas[dateKey]).map(
                            ([category, events]) => {
                                const color = getEventColor(category);
                                return (
                                    <div key={category}>
                                        <span
                                            className={`${color.bg} text-white p-1 rounded-full font-bold`}
                                        >
                                            {events.length}
                                        </span>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </div>
        );
    };

    const ListAgenda = () => {
        const nowAgenda = agendas[tanggalIndo(selectedDate)];
        // const nowAgenda = agendas[selectedDate?.toISOString().split("T")[0]];
        const ImageDesc = ({ src }) => {
            const [showModal, setShowModal] = useState(false);
            return (
                <>
                    <button
                        className={`btn-primary px-2 py-1`}
                        onClick={() => setShowModal(!showModal)}
                    >
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                    <ModalStatic
                        show={showModal}
                        handleClose={() => setShowModal(!showModal)}
                    >
                        <img src={src} alt={src} />
                    </ModalStatic>
                </>
            );
        };
        return nowAgenda && Object.keys(nowAgenda).length > 0 ? (
            <Accordion collapseAll>
                {Object.entries(nowAgenda).map(([category, agendaList]) => {
                    const { bg, border, grad, text } = getEventColor(
                        agendaList[0].category
                    );
                    const [filteredData, setFilteredData] = useState(null);
                    const [showFilter, setShowFilter] = useState(false);

                    return (
                        <Accordion.Panel
                            key={category}
                            className="mb-6"
                            collapseAll
                            // collapseAll={agendaList?.length < 4}
                        >
                            <Accordion.Title
                                className={`font-bold text-white relative border-e-4 ${border} text-gray-900 bg-gradient-to-r from-neutral-50 ${grad}`}
                            >
                                <span className="me-auto">
                                    {agendaList[0].title}
                                </span>{" "}
                                <div
                                    className={`absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white ${bg} border-2 border-white rounded-full -top-2 -end-2`}
                                >
                                    {(filteredData ?? agendaList)?.length}
                                </div>
                            </Accordion.Title>
                            <Accordion.Content>
                                <ul>
                                    {agendaList?.length >= 3 && (
                                        <li className="mb-3 text-start">
                                            {showFilter ? (
                                                <div className="flex items-center justify-between">
                                                    <InputSearch
                                                        width="w-64"
                                                        placeholder={
                                                            "Cari ID, Nama, atau Keterangan"
                                                        }
                                                        handleChange={(e) => {
                                                            const searchValue =
                                                                e.target.value.toLowerCase();
                                                            setFilteredData(
                                                                agendaList?.filter(
                                                                    (item) =>
                                                                        (item.description &&
                                                                            item.description
                                                                                .toLowerCase()
                                                                                .includes(
                                                                                    searchValue
                                                                                )) ||
                                                                        (item.id &&
                                                                            item.id
                                                                                .toString()
                                                                                .includes(
                                                                                    searchValue
                                                                                ))
                                                                )
                                                            );
                                                        }}
                                                        handleNull={() =>
                                                            setFilteredData(
                                                                null
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        className={`btn-outline-primary ${border} hover:${bg} ${text} px-2 py-1`}
                                                        onClick={() =>
                                                            setShowFilter(
                                                                !showFilter
                                                            )
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faXmark}
                                                        />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className={`btn-primary ${bg} px-2 py-1`}
                                                    onClick={() =>
                                                        setShowFilter(
                                                            !showFilter
                                                        )
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faSearch}
                                                        className="me-1"
                                                    />
                                                    Cari
                                                </button>
                                            )}
                                        </li>
                                    )}
                                    {(filteredData ?? agendaList).map(
                                        (agenda) => {
                                            const { bg, text, grad } =
                                                getEventColor(agenda.category);
                                            return (
                                                <li
                                                    key={agenda.id}
                                                    className={`mb-2 p-4 shadow border-s-4 ${border} rounded-lg text-start ${bg} bg-opacity-5 ${text}`}
                                                >
                                                    <div className="font-bold">
                                                        {agenda.subtitle}
                                                    </div>
                                                    <div className="font-bold">
                                                        #{agenda.id}
                                                    </div>
                                                    {[
                                                        2, 3, 4, 5, 6, 8, 13,
                                                    ].includes(
                                                        agenda.category
                                                    ) ? (
                                                        <div>
                                                            {tanggalIndo(
                                                                agenda.start
                                                            ) ==
                                                            tanggalIndo(
                                                                agenda.end
                                                            ) ? (
                                                                <div>
                                                                    {hariTanggalIndo(
                                                                        agenda.start
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    {hariTanggalIndo(
                                                                        agenda.start
                                                                    )}{" "}
                                                                    -{" "}
                                                                    {hariTanggalIndo(
                                                                        agenda.end
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            {jamIndo(
                                                                agenda.start
                                                            )}{" "}
                                                            -{" "}
                                                            {jamIndo(
                                                                agenda.end
                                                            )}
                                                        </div>
                                                    )}
                                                    <br />
                                                    <div>
                                                        {isImage(
                                                            agenda.description
                                                        ) ? (
                                                            <ImageDesc
                                                                src={`/assets/absen/${agenda.description}`}
                                                            />
                                                        ) : (
                                                            agenda.description
                                                        )}
                                                    </div>
                                                    <div>
                                                        {/* Mulai:{" "} */}
                                                        {/* {hariTanggalIndo(
                                                        agenda.start
                                                    )} */}
                                                    </div>
                                                </li>
                                            );
                                        }
                                    )}
                                </ul>
                            </Accordion.Content>
                        </Accordion.Panel>
                    );
                })}
            </Accordion>
        ) : (
            "Tidak ada agenda"
        );
    };

    const RenderMonth = () => {
        const days = [];
        const totalDays = daysInMonth(year, month);
        const firstDay = firstDayOfMonth(year, month);

        for (let i = 0; i < firstDay; i++) {
            days.push(
                <div key={`empty-${i}`} className="text-center py-2"></div>
            );
        }

        for (let day = 1; day <= totalDays; day++) {
            days.push(
                <BoxDay
                    key={day}
                    day={day}
                    handleClick={() => handleDateClick(day)}
                />
            );
        }

        return days;
    };

    const RenderWeek = () => {
        const days = [];
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);

            days.push(
                <BoxDay
                    key={i}
                    day={day.getDate()}
                    handleClick={() => handleDateClick(day.getDate())}
                />
            );
        }

        return days;
    };
    const RenderDay = () => {
        const dateKey = currentDate.toISOString().split("T")[0];
        // const dateKey = currentDate.toISOString().split("T")[0];
        const hasAgenda = agendas[dateKey] && agendas[dateKey].length > 0;

        return (
            <div className="text-center py-2 hover:bg-gray-200 cursor-pointer relative">
                <ListAgenda />
            </div>
            // <BoxDay day={currentDate.getDate()} />
        );
    };

    const changeView = (newView) => {
        setView(newView);
    };

    const changeMonth = (offset) => {
        setCurrentDate(new Date(year, month + offset, 1));
    };

    const changeWeek = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + offset * 7); // Move by 7 days (1 week)
        setCurrentDate(newDate);
    };
    const changeDay = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + offset); // Move by 1 day
        setCurrentDate(newDate);
        setSelectedDate(newDate);
    };

    const RenderDayName = () => {
        const days = [];
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            const namaHari = hariIndo(day);
            days.push(
                <div
                    key={i}
                    className="text-center text-sm md:text-base text-gray-500 py-2"
                >
                    <span className="block md:hidden">
                        {namaHari.slice(0, 3)}
                    </span>

                    {/* Desktop: nama hari lengkap */}
                    <span className="hidden md:block">{namaHari}</span>
                </div>
            );
        }

        return (
            <div className="shadow-lg outline outline-offset-2 outline-gray-200 rounded-lg my-4 grid grid-cols-7">
                {days}
            </div>
        );
    };

    return (
        <div className="p-4">
            <div className="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-2 md:gap-0 mb-4">
                <div className="flex justify-start items-center space-x-1">
                    <button
                        onClick={() =>
                            view === "month"
                                ? changeMonth(-1)
                                : view === "week"
                                ? changeWeek(-1)
                                : changeDay(-1)
                        }
                        className="btn-primary"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>

                    <button
                        onClick={() =>
                            view === "month"
                                ? changeMonth(1)
                                : view === "week"
                                ? changeWeek(1)
                                : changeDay(1)
                        }
                        className="btn-primary"
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                    <button
                        onClick={() => {
                            setCurrentDate(today);
                            setSelectedDate(today);
                        }}
                        className={`btn-primary bg-gray-200 text-gray-600 hover:text-white`}
                    >
                        Hari Ini
                    </button>
                </div>
                <h2 className="text-md text-center md:text-xl font-bold">
                    {view === "month"
                        ? bulanTahunIndo(currentDate)
                        : view === "week"
                        ? `Week of ${bulanTahunIndo(currentDate)}`
                        : hariTanggalIndo(currentDate)}
                </h2>
                <div className="flex justify-end space-x-1">
                    <button
                        onClick={() => changeView("day")}
                        className={`btn-primary ${
                            view === "day"
                                ? ""
                                : "bg-gray-200 text-gray-600 hover:text-white"
                        }`}
                    >
                        Day
                    </button>
                    <button
                        onClick={() => changeView("week")}
                        className={`btn-primary ${
                            view === "week"
                                ? ""
                                : "bg-gray-200 text-gray-600 hover:text-white"
                        }`}
                    >
                        Week
                    </button>
                    <button
                        onClick={() => changeView("month")}
                        className={`btn-primary ${
                            view === "month"
                                ? ""
                                : "bg-gray-200 text-gray-600 hover:text-white"
                        } `}
                    >
                        Month
                    </button>
                </div>
            </div>

            <div
                className={`${
                    view === "month" ? `grid md:grid-cols-3 gap-2 md:gap-6` : ""
                } space-y-5`}
            >
                <div className="col-span-2">
                    {["month", "week"].includes(view) && <RenderDayName />}
                    <div
                        className={`${
                            view !== "day" ? "grid grid-cols-7" : ""
                        } gap-2 md:gap-6 shadow-lg rounded-lg p-3 border border-gray-100`}
                    >
                        {view === "month" && <RenderMonth />}
                        {view === "week" && <RenderWeek />}
                        {/* {view === "day" && <RenderDay />} */}
                    </div>
                </div>

                <div className="text-center col-span-2 md:col-span-1">
                    {view !== "day" && (
                        <p className="text-lg font-bold mb-6">
                            {hariTanggalIndo(selectedDate)}
                        </p>
                    )}
                    <div className="max-w-sm mx-auto">
                        <ListAgenda />
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <ModalStatic show={isModalOpen} handleClose={closeModal}>
                    <h3 className="text-lg font-bold">Selected Date</h3>
                    <p>{hariTanggalIndo(selectedDate)}</p>
                    <ListAgenda />
                </ModalStatic>
            )}
        </div>
    );
};

export function getEventColor(id, subId = null) {
    const colorMap = {
        1: "emerald-600", // Kerja
        2: "zinc-500", // Cuti Tahunan
        3: "zinc-500", // Cuti Khusus
        4: "zinc-500", // Izin
        5: "zinc-500", // Sakit
        12: "zinc-500", // izin Khusus
        6: "red-500", // Alpha
        8: "red-500", // Skorsing
        7: "amber-500", // Terlambat
        10: "amber-500", // Izin Terlambat
        9: "sky-600", // Lembur
        11: "teal-500", // Overshift
        13: "stone-400", // Libur
    };
    const colorMapSub = {
        19: "sky-600", // Lembur
        20: "orange-600", // Lembur
    };

    const color = colorMap[id] || "gray-300"; // Default color
    const colorSub = subId ? colorMapSub[subId] : color; // Default color

    const gradientColors = {
        "emerald-600": "to-emerald-400",
        "zinc-400": "to-zinc-300",
        "red-500": "to-red-300",
        "amber-500": "to-amber-300",
        "sky-600": "to-sky-400",
        "teal-500": "to-teal-300",
        "stone-400": "to-stone-200",
        "gray-400": "to-gray-300", // Default fallback
    };
    const textColors = {
        "emerald-600": "text-emerald-700",
        "zinc-400": "text-zinc-500",
        "red-500": "text-red-600",
        "amber-500": "text-amber-600",
        "sky-600": "text-sky-700",
        "teal-500": "text-teal-600",
        "stone-400": "text-stone-600",
        "gray-400": "text-gray-500", // Default fallback
    };

    // const color = colors[id ] || "gray-300"; // Default color
    const gradient = gradientColors[color] || "to-gray-100"; // Ensure all IDs get a valid gradient
    const text = textColors[color] || "to-gray-100"; // Ensure all IDs get a valid gradient

    return {
        color,
        text,
        bg: `bg-${color}`,
        bgSub: `bg-${colorSub}`,
        grad: gradient,
        border: `border-${color}`,
        ring: `ring-${color}`,
    };
}

export default Calendar;
