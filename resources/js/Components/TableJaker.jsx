import { usePage } from "@inertiajs/react";
import { hariTanggalIndo, jamIndo, modifyTime } from "@/Functions/waktuIndo";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    faBackwardFast,
    faBed,
    faCaretLeft,
    faCaretRight,
    faCheck,
    faCheckCircle,
    faChevronCircleRight,
    faClipboardCheck,
    faClipboardUser,
    faExchange,
    faEye,
    faFaceSmile,
    faFileEdit,
    faFilter,
    faForwardFast,
    faPencil,
    faSortDown,
    faSortUp,
    faUpload,
    faUserClock,
    faXmark,
    faXmarkCircle,
    faXmarksLines,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik } from "formik";
import InputRS from "@/Components/ReactStrap/Input";
import SelectRS from "@/Components/ReactStrap/Select";
import ModalStatic from "@/Components/ReactStrap/ModalStatic";
import InputSearch from "@/Components/InputSearch";
import { useDispatch } from "react-redux";
import { jakerReducer, jakerStatusChange } from "@/redux/slices/jakerSlice";
import sendDataGeneral from "@/Functions/sendDataGeneral";
import {
    processMessageFailedReducer,
    toastStateReducer,
} from "@/redux/slices/ProcessStateSlice";
import Select2RS from "@/Components/ReactStrap/Select2";
import dataSelect, { isImage, isPDF } from "@/Functions/dataSelect";
import { ButtonRadioRS } from "./ReactStrap/Button";
import useAuth from "@/Functions/useAuth";
import { getEventColor } from "./Calendar";
import ModalJaker, { PopoverJaker, PopoverJakerOrg } from "./ModalJaker";
import { Pengajuan } from "./Pengajuan";
import { Popover, Tooltip } from "flowbite-react";
import fullDateDiff, { DateDiff } from "@/Functions/fullDateDiff";
import ModalFormLaporanLembur, {
    ModalLaporanLembur,
} from "@/Pages/Jaker/Modal/LaporanLembur";
import ModalOvershift from "@/Pages/Jaker/Modal/Overshift";
import ModalBuktiSakit from "@/Pages/Jaker/Modal/BuktiSakit";

const TableJaker = ({ data }) => {
    const dispatch = useDispatch();
    const { props, org, isAtasan, isDev, isHC } = useAuth();
    const { jadwal, jenis, macam, status, title, jadwalKerja } = props;
    // console.log("🚀 ~ jadwalKerja:", jadwalKerja);
    const { cek: statusPresensi, jadwal: kerja } = jadwalKerja;
    const isNotPribadi = !props.isPribadi;

    //NOTE
    // !Pengajuan Sakit belum selesai upload bukti surat sakit yang menyusul
    const [loading, setLoading] = useState(false);

    const [itemDetail, setItemDetail] = useState(null);
    const dummy = {
        id: 11878,
        id_karyawan: 4,
        kode_ket: 5,
        macam_hadir: null,
        bukti: null,
        mulai: "2025-07-05 00:00:00",
        selesai: "2025-07-05 00:00:00",
        kode_status: 3,
        is_archive: null,
        created_at: "2025-07-04T21:35:33.000000Z",
        updated_at: "2025-07-04T21:35:33.000000Z",
        title: "Sakit",
        encId: "eyJpdiI6IlhMNEY0dGlKZ0N2cjRCT25rSGVVc2c9PSIsInZhbHVlIjoiQU9jODQvcTl5YlUvOFVpVzUwYkZNQT09IiwibWFjIjoiMzYwM2E5NzAxM2E5MGQxODdmOWIxODI2YWM2Y2FlNTRhYjk1ZDE0MzJjNDhhYTFkZjU5NGQ2MDQ0NzFlMDJiNSIsInRhZyI6IiJ9",
        status: {
            id: 3,
            title: "Acc",
            created_at: "2023-05-01T17:26:30.000000Z",
            updated_at: "2023-05-01T17:26:30.000000Z",
        },
        ket: {
            id: 5,
            title: "Sakit",
            created_at: "2023-05-01T17:26:30.000000Z",
            updated_at: "2023-05-01T17:26:30.000000Z",
            encId: "eyJpdiI6IkRXZXBlTCtkMFJzaDBJN1FDeG5kaUE9PSIsInZhbHVlIjoiSFFwcWZMUEU0R0Y4NzRuVVkzdHdUdz09IiwibWFjIjoiYzI3ZDNjYTUzNWUwMzBlMzIzZWJmYTExODRkYTIzNzdmM2QwNzQxNjZmNDVkOWY3ZWM1MWU3ODYwOGM5Y2Q0OSIsInRhZyI6IiJ9",
        },
        jenis: null,
        laporan: null,
        lampiran: null,
        org: [
            {
                id: 4,
                nama: "Fikar Mohammad Istiqlalul Wathan",
                status_aktif: 1,
                no_hp: "89646615484",
                encId: "eyJpdiI6IjRyUHRKM2VuVkpMYmhiUTdVRG9PbVE9PSIsInZhbHVlIjoiK3NtWlBrMzZDNWtiL2RXRG1YaXFnUT09IiwibWFjIjoiMjFlNzdmMDE5NDM2ZGU2NDQ4ODBmMzc3OWY4MDE2YTM4YzAzNzM3OWFhZTJkZjMzM2EwYTc0MTNmOTYzOWRmYiIsInRhZyI6IiJ9",
                pegawai: {
                    id: 4,
                    id_karyawan: 4,
                    masuk: "2023-03-13",
                    kode_status_kerja: 2,
                    kode_golongan: 15,
                    kode_struktural: 8,
                    fungsional: 1,
                    kode_fungsional: 36,
                    created_at: "2023-05-15T12:56:16.000000Z",
                    updated_at: "2023-06-23T06:54:48.000000Z",
                },
            },
        ],
        overshift: [],
        encIds: [
            "eyJpdiI6IlhMNEY0dGlKZ0N2cjRCT25rSGVVc2c9PSIsInZhbHVlIjoiQU9jODQvcTl5YlUvOFVpVzUwYkZNQT09IiwibWFjIjoiMzYwM2E5NzAxM2E5MGQxODdmOWIxODI2YWM2Y2FlNTRhYjk1ZDE0MzJjNDhhYTFkZjU5NGQ2MDQ0NzFlMDJiNSIsInRhZyI6IiJ9",
        ],
    };
    const [itemLapLembur, setItemLapLembur] = useState(null);
    const [itemOvershift, setItemOvershift] = useState(null);
    const [itemBuktiSakit, setItemBuktiSakit] = useState(null);
    const [showSearch, setShowSearch] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const scrollRef = useRef(null);
    const scrollRestore = useRef(0);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [show, setShow] = useState({
        showModalDetail: false,
        showBtnAct: false,
    });
    const toggleShow = (key) => {
        setShow((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // Simpan scroll sebelum data berubah
    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            scrollRestore.current = container.scrollTop;
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    // Kembalikan scroll setelah data berubah
    useLayoutEffect(() => {
        const container = scrollRef.current;
        if (container && scrollRestore.current != null) {
            container.scrollTop = scrollRestore.current;
        }
    }, [filteredData, data]);

    const dataLama = data;

    const filterLocal = (jadwal, values) => {
        const selectedJenis = Array.isArray(values.jenis) ? values.jenis : [];
        return jadwal
            ?.filter((item) => !values.id || values.id.includes(item.id))
            ?.filter(
                (item) =>
                    !values.mulai ||
                    new Date(item.mulai) >= new Date(values.mulai)
            )
            ?.filter(
                (item) =>
                    !values.selesai ||
                    new Date(item.selesai) <= new Date(values.selesai)
            )
            ?.filter(
                (item) => !values.status || item.kode_status == values.status
            )
            ?.filter(
                (item) =>
                    selectedJenis.length === 0 ||
                    selectedJenis.includes(item.kode_ket)
            )
            ?.filter(
                (item) =>
                    !values.macam || item.detail?.macam_hadir == values.macam
            );
    };

    const dataTable = useMemo(() => {
        const source = data; // dari Redux atau props

        const filtered = filteredData
            ? filterLocal(source, filteredData)
            : source;
        const searched = searchQuery
            ? filtered.filter((item) => {
                  const title = item?.title?.toLowerCase() ?? "";
                  const bukti = item?.bukti?.toLowerCase() ?? "";
                  const nama = item?.org?.nama?.toLowerCase() ?? "";
                  const id = item?.id?.toString() ?? "";
                  return (
                      title.includes(searchQuery) ||
                      bukti.includes(searchQuery) ||
                      nama.includes(searchQuery) ||
                      id.includes(searchQuery)
                  );
              })
            : filtered;
        return Object.values(
            searched.reduce((acc, item) => {
                const key = `${item.kode_ket}-${item.bukti}-${item.mulai}-${item.kode_status}`;
                if (!acc[key]) {
                    acc[key] = {
                        ...item,
                        org: [item.org],
                        encIds: [item.encId],
                    };
                } else {
                    acc[key].org.push(item.org);
                    acc[key].encIds.push(item.encId);
                }

                return acc;
            }, {})
        );
    }, [data, filteredData, searchQuery]);
    // console.log(props);
    const columns = useMemo(
        () =>
            [
                {
                    accessorKey: "id",
                    header: "ID",
                    cell: ({ row }) => row.original.id,
                    sortingFn: "basic",
                },
                {
                    accessorKey: "created_at",
                    header: "Waktu Pengajuan",
                    cell: ({ row }) => row.original.created_at,
                    sortingFn: (rowA, rowB) =>
                        new Date(rowA.original.created_at) -
                        new Date(rowB.original.created_at),
                },
                {
                    accessorFn: (row) => getDataJaker(row)?.jenis,
                    id: "jenis",
                    header: "Jenis",
                    cell: ({ row }) => getDataJaker(row.original)?.jenis,
                },
                isNotPribadi
                    ? {
                          accessorFn: (row) => row?.org?.nama,
                          id: "nama",
                          header: "Nama",
                          cell: ({ row }) =>
                              Array.isArray(row.original.org) &&
                              row?.original?.org?.length > 1
                                  ? `${row?.original?.org?.length} orang`
                                  : row?.original?.org?.nama,
                      }
                    : null,
                {
                    accessorFn: (row) => getDataJaker(row)?.keterangan,
                    id: "keterangan",
                    header: "Keterangan",
                    cell: ({ row }) => getDataJaker(row.original)?.keterangan,
                },
                {
                    accessorFn: (row) => getDataJaker(row)?.mulai,
                    id: "mulai",
                    header: "Mulai",
                    cell: ({ row }) => getDataJaker(row.original)?.mulai,
                },
                {
                    accessorFn: (row) => getDataJaker(row)?.selesai,
                    id: "selesai",
                    header: "Selesai",
                    cell: ({ row }) => getDataJaker(row.original)?.selesai,
                },
                {
                    accessorFn: (row) => getDataJaker(row)?.status,
                    id: "status",
                    header: "Status",
                    cell: ({ row }) => getDataJaker(row.original)?.status,
                },
            ].filter(Boolean),
        []
    );

    const table = useReactTable({
        data: dataTable,
        columns,
        filterFns: {},
        state: {
            pagination,
        },
        initialState: {
            sorting: [
                {
                    id: "created_at",
                    desc: true,
                },
            ],
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(), //client side filtering
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        autoResetPageIndex: false,
    });

    const getDataJaker = (item) => {
        let status,
            bgColor,
            textColor = "text-dark";

        const days = {
            1: "Senin",
            2: "Selasa",
            3: "Rabu",
            4: "Kamis",
            5: "Jumat",
            6: "Sabtu",
            7: "Minggu",
        };

        const WaktuText = ({ time, showTgl = true, showJam = false }) => {
            const [hari, tanggal] = hariTanggalIndo(time).split(", ");
            return (
                <>
                    {showTgl && (
                        <>
                            {hari}, <br /> {tanggal}
                        </>
                    )}
                    {showJam && (
                        <div className="mt-2">
                            <span className="badge bg-primary px-4 text-white">
                                {jamIndo(time)}
                            </span>
                        </div>
                    )}
                </>
            );
        };

        let jenis = `${item?.ket?.title} ${
            item.macam_hadir
                ? `- ${item.jenis?.title ?? `#${item.macam_hadir}`}`
                : ""
        }`;
        let keterangan = item.bukti;
        let mulai = <WaktuText time={item.mulai} showJam />;
        let selesai = <WaktuText time={item.selesai} showJam />;

        switch (item?.kode_ket) {
            case 1:
                switch (item.macam_hadir) {
                    case 28:
                        let hariArray = Array.isArray(item.bukti)
                            ? item.bukti
                            : typeof item.bukti === "string"
                            ? JSON.parse(item.bukti)
                            : [];
                        keterangan = hariArray
                            ?.map((num) => days[num.trim()] || "Invalid")
                            ?.join(", ");
                        mulai = (
                            <WaktuText
                                time={item.mulai}
                                showJam
                                showTgl={false}
                            />
                        );
                        selesai = (
                            <WaktuText
                                time={item.selesai}
                                showJam
                                showTgl={false}
                            />
                        );
                        break;

                    default:
                        keterangan = item.bukti;
                        break;
                }
                break;
            case 2:
            case 3:
            case 4:
            case 5:
            case 11:
            case 12:
            case 13:
                switch (item.macam_hadir) {
                    case 33:
                    case 34:
                        jenis = item.jenis?.title;
                        break;

                    default:
                        break;
                }
                mulai = <WaktuText time={item.mulai} />;
                selesai = <WaktuText time={item.selesai} />;
                break;
            case 9:
                const lap = item?.laporan;
                mulai = (
                    <WaktuText
                        time={lap ? lap?.waktu_awal : item.mulai}
                        showJam
                    />
                );
                selesai = (
                    <WaktuText
                        time={lap ? lap?.waktu_akhir : item.selesai}
                        showJam
                    />
                );
                break;
            default:
                keterangan = item.bukti;
                break;
        }

        const kodeStatus = Number(item.kode_status);
        if ([1, 2, 6, 8, 9].includes(kodeStatus)) {
            bgColor = "bg-amber-500";
            textColor = "text-white";
        } else if ([3, 5, 10].includes(kodeStatus)) {
            bgColor = "bg-green-500";
            textColor = "text-white";
        } else if ([4, 7, 11, 12].includes(kodeStatus)) {
            bgColor = "bg-red-500";
            textColor = "text-white";
        } else {
            bgColor = "bg-white-500";
            textColor = "text-dark";
        }

        status =
            item.kode_ket == 9 && item.laporan ? (
                item.id_karyawan == org.id ? (
                    <>
                        {item.laporan.waktu_akhir ? (
                            <span
                                className={`badge ${bgColor} ${textColor} font-bold`}
                            >
                                <FontAwesomeIcon
                                    icon={faEye}
                                    className="me-1"
                                />{" "}
                                Lembur Selesai
                            </span>
                        ) : (
                            <span
                                className={`badge bg-tertiary ${textColor} font-bold`}
                            >
                                <FontAwesomeIcon
                                    icon={faEye}
                                    className="me-1"
                                />{" "}
                                Masih Dalam Pengerjaan
                            </span>
                        )}
                    </>
                ) : (
                    <button
                        className={`btn-tertiary text-sm text-dark font-bold`}
                        onClick={() => setItemLapLembur(item)}
                    >
                        <FontAwesomeIcon icon={faEye} className="me-1" /> Lihat
                        Laporan
                    </button>
                )
            ) : (
                <span className={`badge ${bgColor} ${textColor} font-bold`}>
                    {item.status?.title}
                </span>
            );

        return { jenis, keterangan, status, mulai, selesai };
    };

    const sendSearchData = async (data) => {
        const form = new FormData();

        if (data?.id) form.append("id", data.id);
        if (data?.jenis) {
            if (Array.isArray(data.jenis)) {
                data.jenis.forEach((j) => form.append("jenis[]", j)); // Append array values properly
            } else {
                form.append("jenis", data.jenis);
            }
        }
        if (data?.macam) form.append("macam", data.macam);
        if (data?.mulai) form.append("mulai", data.mulai);
        if (data?.selesai) form.append("selesai", data.selesai);
        if (data?.status) form.append("status", data.status);

        await sendDataGeneral({
            data: form,
            route: route("Jaker.search"),
            prosesReducer: toastStateReducer,
            messageFailedReducer: processMessageFailedReducer,
            dispatch: dispatch,
            slicer: jakerReducer,
            waitUntilFinish: true,
            handleClose: () => setLoading(false),
        });
        setLoading(false);
    };

    const SearchFilterData = () => {
        return (
            <ModalStatic
                show={showSearch}
                handleClose={() => setShowSearch(!showSearch)}
                title="Filter Data"
                size="3xl"
            >
                <Formik
                    initialValues={{
                        id: "",
                        jenis: jenis?.flatMap((item) => item.id),
                        macam: "",
                        mulai: "",
                        selesai: "",
                        status: "",
                    }}
                    onSubmit={(values) => {
                        setLoading(true);
                        const localResult = filterLocal(jadwal, values);

                        if (localResult.length > 0) {
                            setFilteredData(values);
                            dispatch(jakerReducer(localResult));
                            setLoading(false);
                        } else {
                            sendSearchData(values);
                            setFilteredData(values); // tetap update agar konsisten
                        }

                        setShowSearch(false);
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                    }) => (
                        <>
                            <button
                                type="button"
                                className="btn-tertiary mx-auto"
                                onClick={() => {
                                    setFilteredData(null);
                                    setShowSearch(false);
                                    dispatch(jakerReducer(jadwal));
                                }}
                            >
                                Kembalikan data awal
                            </button>

                            <form onSubmit={handleSubmit}>
                                <div className="grid sm:grid-cols-2 gap-y-2 gap-x-4 relative mb-8">
                                    <InputRS
                                        label="ID"
                                        id="id"
                                        name="id"
                                        type="text"
                                        error={errors.id}
                                        touched={touched.id}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        values={values.id}
                                        placeholder="Cari ID"
                                    />
                                    <SelectRS
                                        label="Status"
                                        id="status"
                                        data={status}
                                        name="status"
                                        error={errors.status}
                                        touched={touched.status}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        values={values.status}
                                        placeholder="Pilih Status"
                                    />
                                    <div className="group">
                                        <InputRS
                                            label="Waktu mulai"
                                            id="mulai"
                                            name="mulai"
                                            type="date"
                                            error={errors.mulai}
                                            touched={touched.mulai}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            values={values.mulai}
                                            placeholder="Dari ..."
                                        />
                                        <div className="mt-1 gap-2 flex">
                                            {[
                                                {
                                                    additional: 0,
                                                    label: "Hari ini",
                                                },
                                                {
                                                    additional: 1,
                                                    label: "1 bulan yang lalu",
                                                },
                                                {
                                                    additional: 2,
                                                    label: "2 bulan yang lalu",
                                                },
                                                {
                                                    additional: 3,
                                                    label: "3 bulan yang lalu",
                                                },
                                            ].map(
                                                ({ additional, label }, i) => {
                                                    const modifWaktu =
                                                        modifyTime(
                                                            new Date(),
                                                            -additional,
                                                            "bulan"
                                                        )
                                                            .toISOString()
                                                            .split("T")[0];
                                                    return (
                                                        <ButtonRadioRS
                                                            key={i}
                                                            className={`outline-primary shadow border-0 px-1 text-xs ${
                                                                values.mulai ==
                                                                modifWaktu
                                                                    ? "btn-primary text-white"
                                                                    : ""
                                                            }`}
                                                            name="opsiMulai"
                                                            id={`opsiMulai${additional}`}
                                                            value={modifWaktu} // Convert to "yyyy-MM-dd"
                                                            label={label}
                                                            checked={
                                                                values.mulai ==
                                                                modifWaktu
                                                            }
                                                            handle={(e) => {
                                                                setFieldValue(
                                                                    "mulai",
                                                                    e.target
                                                                        .value
                                                                ); // Gunakan `e.target.value`
                                                            }}
                                                        />
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                    <InputRS
                                        label="Waktu Selesai"
                                        id="selesai"
                                        name="selesai"
                                        type="date"
                                        error={errors.selesai}
                                        touched={touched.selesai}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        values={values.selesai}
                                        placeholder="Dari ..."
                                    />
                                    <Select2RS
                                        isMulti
                                        id="jenis"
                                        data={dataSelect(jenis)}
                                        name="jenis"
                                        error={errors.jenis}
                                        touched={touched.jenis}
                                        handleChange={(selectedOptions) => {
                                            setFieldValue(
                                                "jenis",
                                                selectedOptions
                                                    ? selectedOptions.map(
                                                          (option) =>
                                                              option.value
                                                      )
                                                    : []
                                            );
                                        }}
                                        handleBlur={handleBlur}
                                        values={values.jenis}
                                        placeholder="Pilih Jenis"
                                        chooseAll
                                    />
                                    {values.jenis?.length === 1 && (
                                        <SelectRS
                                            id="macam"
                                            data={macam?.filter(
                                                (item) =>
                                                    item.kode_hadir ==
                                                    values.jenis
                                            )}
                                            name="macam"
                                            error={errors.macam}
                                            touched={touched.macam}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            values={values.macam}
                                            placeholder="Pilih Macam Jenis"
                                        />
                                    )}
                                </div>
                                <div className="mt-3 text-end">
                                    <button
                                        type="submit"
                                        className="btn btn-primary px-6 py-1 rounded-full"
                                        onClick={handleSubmit}
                                    >
                                        Cari
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </Formik>
            </ModalStatic>
        );
    };

    const safeText = (val) => {
        if (typeof val === "string" || typeof val === "number") return val;
        if (val === null || val === undefined) return "-";
        return JSON.stringify(val);
    };

    const gridCols = `${
        isNotPribadi
            ? "md:grid-cols-[50px_140px_180px_200px_260px_160px_160px_280px]"
            : "md:grid-cols-[50px_140px_180px_200px_160px_160px_280px]"
    } md:grid-rows-1 grid-cols-4 items-center text-center md:min-w-max`;

    const handleChangeStatus = async ({ ids, kodeStatus, handleClose }) => {
        const data = new FormData();
        ids.forEach((id) => data.append("id[]", id));
        data.append("kode_status", kodeStatus);

        await sendDataGeneral({
            data,
            route: route("Jaker.changeStatus"),
            dispatch,
            prosesReducer: toastStateReducer,
            waitUntilFinish: true,
            handleClose,
            slicer: jakerStatusChange,
        });
    };

    const DataItem = ({ row }) => {
        const [editStatus, setEditStatus] = useState(false);
        const item = row?.original;
        const jaker = getDataJaker(item);
        const { bg, bgSub, border } = getEventColor(
            item?.kode_ket,
            [9].includes(item?.kode_ket) ? item?.macam_hadir : null
        );
        const [title, subTitle] = jaker?.jenis?.split(" - ") || [];
        const isBuktiSakitKosong = item.kode_ket === 5 && !item?.bukti;
        const thisIsImage =
            isImage(jaker?.keterangan) || isPDF(jaker?.keterangan);
        const tanggal = hariTanggalIndo(row.original.created_at);
        const [hari, sisanya] = tanggal.split(", ");
        const kodeStatus = Number(item?.kode_status);
        const isLembur = item.kode_ket === 9;
        const lap = item?.laporan;
        const overshift =
            item?.overshift?.length > 0
                ? item?.overshift?.filter((item) =>
                      [1, 2, 3].includes(Number(item.kode_status))
                  )
                : [];
        const isLapAkhir = Boolean(lap?.waktu_akhir && lap?.foto_akhir);
        const showBtnLapLembur =
            item.id_karyawan === org.id &&
            !editStatus &&
            kodeStatus === 10 &&
            (!lap || (!isLapAkhir && lap));
        const durasiLap = fullDateDiff(lap?.waktu_awal, lap?.waktu_akhir);
        const minDurasiOvershift = 8;
        const canOvershift =
            overshift?.length <= 0 &&
            isLembur &&
            kodeStatus === 10 &&
            isLapAkhir &&
            durasiLap.totalHours >= minDurasiOvershift &&
            item.id_karyawan === org?.id;
        const showBtnPencil =
            ([1, 2, 8].includes(kodeStatus) &&
                ![28, 29, 32, 33, 34].includes(item?.macam_hadir) &&
                (isAtasan || isHC || isDev)) ||
            (kodeStatus === 3 &&
                item?.kode_ket === 9 &&
                !item?.laporan &&
                item.id_karyawan === org.id);

        const handleShow = () => {
            if (thisIsImage) {
                toggleShow("showModalDetail");
                setItemDetail({
                    ...jaker,
                    id: row.original.id,
                });
            }
        };

        const PopoverDurasi = () => {
            const [showPopover, setShowPopover] = useState(true);
            const togglePopover = () => setShowPopover(!showPopover);

            const mulai = isLembur && lap ? lap?.waktu_awal : item.mulai;
            const selesai = isLembur && lap ? lap?.waktu_akhir : item.selesai;
            const durasi = DateDiff(
                mulai,
                selesai,
                [1, 9, 10].includes(item.kode_ket)
                    ? ["totalHours", "minutes"]
                    : ["totalDays"]
            );
            return (
                <Popover
                    aria-labelledby={`Durasi ${row.original?.id}`}
                    placement="right"
                    trigger="hover"
                    content={
                        <div className="max-w-xs text-sm text-gray-500 z-30">
                            <div className="border-b border-gray-100 bg-gray-50 px-3 py-2">
                                <h3
                                    id="default-popover"
                                    className="font-semibold text-gray-900"
                                >
                                    Durasi ID #{row.original?.id}
                                </h3>
                            </div>
                            <div className="px-3 py-2">
                                <p className="break-words whitespace-normal">
                                    {durasi}
                                </p>
                            </div>
                        </div>
                    }
                >
                    {/* Wrap trigger elements inside a div */}
                    <div
                        className="cursor-pointer hover:translate-x-1 transition-transform duration-300 ease-in-out"
                        onClick={togglePopover}
                    >
                        <FontAwesomeIcon
                            icon={faChevronCircleRight}
                            className="text-primary text-xl"
                        />
                    </div>
                </Popover>
            );
        };

        // console.log(lap, isLapAkhir);

        return (
            <div
                key={row.id}
                className={`rounded-xl shadow ${bg} z-0 text-xs md:text-md min-w-[300px] md:w-full`}
            >
                <div className="block md:hidden text-sm text-center text-white font-bold py-2">
                    {title}
                </div>
                <div
                    className={`grid ${gridCols} transition-transform duration-300 ease-in-out translate-x-0 md:hover:translate-x-2 hover:translate-y-2 md:hover:translate-y-0 whitespace-nowrap gap-2 px-4 py-3 bg-white rounded-lg shadow border border-gray-200 text-sm`}
                >
                    {subTitle && (
                        <div className="block md:hidden col-span-4">
                            <span
                                className={`badge text-white text-xs font-bold px-3 ${bgSub}`}
                            >
                                {subTitle}
                            </span>
                        </div>
                    )}
                    <div className="font-semibold text-gray-800">
                        <div className="block md:hidden font-semibold text-2xs">
                            <span className="text-gray-400">ID</span>
                            <br />
                        </div>
                        # {item?.id}
                    </div>

                    <div className="col-span-3 md:col-span-1 text-start text-xs md:text-sm md:text-center border-s md:border-0 ps-2">
                        <div className="block md:hidden font-semibold text-2xs">
                            <span className="text-gray-400">
                                Waktu Pengajuan
                            </span>
                            <br />
                        </div>
                        <div className="flex flex-row md:flex-col gap-1">
                            <div>{hari},</div>
                            <div>{sisanya}</div>
                        </div>
                        <div className=" text-gray-500 font-semibold">
                            {jamIndo(item?.created_at)}
                        </div>
                    </div>

                    <div className="hidden md:flex flex-col justify-center whitespace-normal items-center text-xs md:text-md text-center gap-1">
                        <span
                            className={`badge text-white font-bold px-3 ${bg}`}
                        >
                            {title}
                        </span>
                        {subTitle && (
                            <span
                                className={`badge text-white font-bold px-3 ${bgSub}`}
                            >
                                {subTitle}
                            </span>
                        )}
                    </div>

                    {isNotPribadi && (
                        <div
                            className={`text-start whitespace-normal col-span-4 md:col-span-1 border-t border-x rounded-t-lg ${border} md:border-0 p-3 pb-1 md:p-0`}
                        >
                            {Array.isArray(item?.org) &&
                            item?.org.length > 1 ? (
                                <PopoverJakerOrg
                                    item={{
                                        ...jaker,
                                        id: item?.id,
                                        org: item?.org,
                                    }}
                                />
                            ) : (
                                item?.org?.[0]?.nama || "-"
                            )}
                        </div>
                    )}

                    <div
                        className={`col-span-4 md:col-span-1 text-start ${
                            isNotPribadi
                                ? "border-b border-x rounded-b-lg pt-1"
                                : "border rounded-lg p-1"
                        } ${border} md:border-0 p-3 md:p-0`}
                    >
                        {isBuktiSakitKosong ? (
                            <div className="text-center">
                                <button
                                    onClick={() => setItemBuktiSakit(item)}
                                    className="btn-primary inline-flex text-xs items-center gap-1"
                                >
                                    <FontAwesomeIcon icon={faUpload} /> Upload
                                    Bukti Sakit
                                </button>
                            </div>
                        ) : thisIsImage ? (
                            <div className="text-center">
                                <button
                                    onClick={handleShow}
                                    className="btn-primary inline-flex items-center gap-1"
                                >
                                    <FontAwesomeIcon icon={faEye} /> Lihat
                                </button>
                            </div>
                        ) : typeof jaker?.keterangan === "string" ? (
                            <div className="text-start">
                                {jaker.keterangan.length > 30 ? (
                                    <PopoverJaker
                                        item={{
                                            ...jaker,
                                            id: item?.id,
                                        }}
                                    />
                                ) : (
                                    safeText(jaker.keterangan)
                                )}
                            </div>
                        ) : (
                            "-"
                        )}
                    </div>

                    <div className="col-span-2 md:col-span-1 my-2 md:my-2 border-e text-start md:text-center relative">
                        {jaker?.mulai}
                        <div className="absolute top-1/2 right-[-15px] transform -translate-y-1/2 z-10">
                            <PopoverDurasi />
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1 border-s text-end md:text-center">
                        {jaker?.selesai}
                    </div>

                    <div
                        className={`col-span-4 md:col-span-1 mt-4 md:mt-0 text-xs md:text-md relative md:flex justify-center items-center ${
                            kodeStatus === 10 ? "gap-2" : "gap-4"
                        }`}
                    >
                        {showBtnLapLembur ? (
                            <div className="flex flex-col justify-center items-center gap-1">
                                <FontAwesomeIcon
                                    icon={faCheckCircle}
                                    className="text-xl text-success"
                                />
                                <button
                                    className="btn-tertiary bg-amber-500 rounded-lg py-1 px-3 flex gap-2 font-semibold text-white text-sm items-center"
                                    onClick={() => setItemLapLembur(item)}
                                >
                                    <FontAwesomeIcon
                                        icon={faFileEdit}
                                        className="text-xs md:text-sm"
                                    />
                                    Buat Laporan {(!lap && "Awal") || "Akhir"}
                                </button>
                            </div>
                        ) : (
                            !editStatus && jaker?.status
                        )}

                        {([1, 2, 8].includes(kodeStatus) ||
                            (item?.kode_ket === 9 &&
                                kodeStatus === 3 &&
                                !item?.laporan)) && (
                            <>
                                {editStatus && (
                                    <div className="flex justify-center items-center gap-4 md:gap-1">
                                        {isNotPribadi ? (
                                            <>
                                                <button
                                                    className="btn-outline-danger py-1 rounded-full"
                                                    onClick={() =>
                                                        handleChangeStatus({
                                                            ids: item?.encIds,
                                                            kodeStatus: 4,
                                                            handleClose: () =>
                                                                setEditStatus(
                                                                    false
                                                                ),
                                                        })
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faXmarkCircle}
                                                    />
                                                    Tolak
                                                </button>
                                                <button
                                                    className="btn-success text-white flex justify-center items-center gap-1 py-1 rounded-full"
                                                    onClick={() =>
                                                        handleChangeStatus({
                                                            ids: item?.encIds,
                                                            kodeStatus:
                                                                isHC || isDev
                                                                    ? 3
                                                                    : 2,

                                                            handleClose: () =>
                                                                setEditStatus(
                                                                    false
                                                                ),
                                                        })
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faCheckCircle}
                                                    />
                                                    {isHC || isDev
                                                        ? "Acc"
                                                        : "Ajukan ke HC"}
                                                </button>
                                            </>
                                        ) : item?.kode_ket === 9 &&
                                          kodeStatus === 3 &&
                                          !item?.laporan ? (
                                            <>
                                                <button
                                                    className="btn-outline-danger py-1 rounded-full"
                                                    onClick={() =>
                                                        handleChangeStatus({
                                                            ids: item?.encIds,
                                                            kodeStatus: 11,
                                                            handleClose: () =>
                                                                setEditStatus(
                                                                    false
                                                                ),
                                                        })
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faXmarkCircle}
                                                    />
                                                    Tidak Siap
                                                </button>
                                                <button
                                                    className="btn-success text-white flex justify-center items-center gap-1 py-1 rounded-full"
                                                    onClick={() =>
                                                        handleChangeStatus({
                                                            ids: item?.encIds,
                                                            kodeStatus: 10,

                                                            handleClose: () =>
                                                                setEditStatus(
                                                                    false
                                                                ),
                                                        })
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faCheckCircle}
                                                    />
                                                    Siap
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="btn-outline-danger py-1 rounded-full"
                                                onClick={() =>
                                                    handleChangeStatus({
                                                        ids: item?.encIds,
                                                        kodeStatus: 12,
                                                        handleClose: () =>
                                                            setEditStatus(
                                                                false
                                                            ),
                                                    })
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faXmarkCircle}
                                                />
                                                Batalkan Ajuan
                                            </button>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {showBtnPencil && (
                            <button
                                className={`absolute md:relative bottom-0 end-0 ${
                                    editStatus
                                        ? "btn-secondary"
                                        : "btn-tertiary"
                                } w-7 h-7 p-0 rounded-full`}
                                onClick={() => setEditStatus(!editStatus)}
                            >
                                <FontAwesomeIcon
                                    icon={editStatus ? faXmark : faPencil}
                                    className="text-xs md:text-sm"
                                />
                            </button>
                        )}
                        {canOvershift && (
                            <Tooltip
                                content={"Ajukan Overshift"}
                                trigger="hover"
                            >
                                <button
                                    className={`absolute md:relative bottom-0 end-0 btn-primary w-7 h-7 p-0 rounded-full`}
                                    onClick={() => {
                                        setItemOvershift(item);
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={faExchange}
                                        className="text-xs md:text-sm"
                                    />
                                </button>
                            </Tooltip>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="relative w-full rounded-lg">
            <div
                className={`flex ${
                    isAtasan || isHC || isDev ? "flex-col" : "flex-row"
                } sm:flex-row-reverse gap-2 mb-4`}
            >
                <div className={`bg-white grow shadow rounded-lg px-4 py-2`}>
                    {/* {title !== "Jadwal Kerja" && ( */}
                    <span className="text-primary font-bold text-sm">
                        Buat Pengajuan
                    </span>

                    <Pengajuan />
                </div>
                {title === "Dashboard" && (
                    <div className="bg-white shadow rounded-lg px-4 py-2 h-full">
                        {/* {title !== "Jadwal Kerja" && ( */}
                        <span className="text-primary font-bold text-sm">
                            Presensi
                        </span>
                        <div
                            className={`grid ${
                                isAtasan || isHC || isDev ? "grid-cols-2" : ""
                            } gap-2 items-start`}
                        >
                            {kerja !== "libur" && statusPresensi !== 2 ? (
                                <a
                                    className={`transition-shadow duration-300 btn-outline-primary sm:border-0 text-center flex flex-col justify-center items-center gap-1 text-xs sm:text-sm hover:shadow-lg rounded-lg w-full py-2`}
                                    href={route("Presensi.face_rec.index")}
                                >
                                    <div className="sm:btn-outline-primary w-10 h-10 text-center flex justify-center items-center">
                                        <FontAwesomeIcon
                                            icon={
                                                org?.face?.length > 0
                                                    ? statusPresensi == 0
                                                        ? faClipboardUser
                                                        : statusPresensi == 1
                                                        ? faUserClock
                                                        : faCheckCircle
                                                    : faFaceSmile
                                            }
                                            className="text-xl"
                                        />
                                    </div>
                                    {org?.face?.length > 0
                                        ? statusPresensi == 0
                                            ? "Presensi Datang"
                                            : statusPresensi == 1
                                            ? "Presensi Pulang"
                                            : "Selesai"
                                        : "Daftar Face ID"}
                                </a>
                            ) : (
                                <button
                                    className={`transition-shadow duration-300 btn-outline-primary sm:border-0 text-center flex flex-col justify-center items-center gap-1 text-xs sm:text-sm hover:shadow-lg rounded-lg w-full py-2`}
                                >
                                    <div className="sm:btn-outline-primary w-10 h-10 text-center flex justify-center items-center">
                                        <FontAwesomeIcon
                                            icon={
                                                org?.face?.length > 0
                                                    ? statusPresensi == 2
                                                        ? faCheckCircle
                                                        : faBed
                                                    : faFaceSmile
                                            }
                                            className="text-xl"
                                        />
                                    </div>
                                    {org?.face?.length > 0
                                        ? statusPresensi == 2
                                            ? "Selesai"
                                            : "Libur"
                                        : "Daftar Face ID"}
                                </button>
                            )}
                            {(isAtasan || isHC || isDev) && (
                                <a
                                    className={`transition-shadow duration-300 btn-outline-primary sm:border-0 text-center flex flex-col justify-center items-center gap-1 text-xs sm:text-sm hover:shadow-lg rounded-lg w-full py-2`}
                                    href={route("Rekap.Presensi.index")}
                                >
                                    <div className="sm:btn-outline-primary w-10 h-10 text-center flex justify-center items-center">
                                        <FontAwesomeIcon
                                            icon={faClipboardCheck}
                                            className="text-xl"
                                        />
                                    </div>
                                    Kehadiran Hari Ini
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white p-3 shadow rounded-lg">
                {title !== "Dashboard" && (
                    <>
                        <div className="flex flex-col md:flex-row justify-between items-end md:items-center my-2 gap-2">
                            <InputSearch
                                width="min-w-full md:min-w-80"
                                handleChange={(e) => {
                                    setSearchQuery(
                                        e.target.value.toLowerCase()
                                    );
                                }}
                                placeholder="Cari ID atau Keterangan..."
                                handleNull={() => setSearchQuery("")}
                            />
                            <button
                                className="btn-primary py-2 flex justify-center items-center gap-1"
                                onClick={() => setShowSearch(!showSearch)}
                            >
                                <FontAwesomeIcon
                                    icon={faFilter}
                                    className="me-1"
                                />
                                filter
                            </button>
                        </div>
                        <SearchFilterData />
                    </>
                )}
                <div
                    ref={scrollRef}
                    className="relative max-w-screen-sm md:max-w-full min-h-max rounded-lg"
                >
                    <div className="mb-2">
                        <span className="badge bg-primary text-white font-bold text-sm">
                            Pengajuan Anda
                        </span>
                    </div>
                    {/* <div className="bg-gradient-to-r from-white h-full w-10 absolute start-0 z-30"></div> */}
                    <div className="bg-gradient-to-l from-gray-300/40 h-full w-10 hidden md:absolute end-0 z-30"></div>
                    <div className="overflow-visible md:overflow-y-auto rounded-lg overflow-x-auto scrollbar-hide h-[90%] w-full">
                        <div
                            className={`hidden md:grid ${gridCols} gap-2 px-4 py-1 bg-gray-100 text-center font-bold text-sm text-gray-700 border-b border-gray-300 rounded-t-md`}
                        >
                            {table?.getHeaderGroups()?.map((headerGroup) =>
                                headerGroup.headers.map((header, i) => {
                                    // console.log(header.column);
                                    return (
                                        <div
                                            key={header.id}
                                            colSpan={header.colSpan}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <>
                                                    <div
                                                        {...{
                                                            className: `${
                                                                header.column.getCanSort()
                                                                    ? "cursor-pointer select-none"
                                                                    : ""
                                                            }`,
                                                            onClick:
                                                                header.column.getToggleSortingHandler(),
                                                        }}
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext()
                                                        )}
                                                        {{
                                                            asc: (
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faSortUp
                                                                    }
                                                                    className="ms-1"
                                                                />
                                                            ),
                                                            desc: (
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faSortDown
                                                                    }
                                                                    className="ms-1"
                                                                />
                                                            ),
                                                        }[
                                                            header.column.getIsSorted()
                                                        ] ?? null}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Body Cards */}
                        <div className="flex flex-row md:flex-col min-w-max md:w-full gap-3">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="p-4 rounded-md shadow bg-white space-y-2"
                                    >
                                        <Skeleton height={15} width={30} />
                                        <Skeleton width={150} height={15} />
                                    </div>
                                ))
                            ) : (dataTable || data)?.length === 0 ? (
                                <div className="text-center text-gray-500 py-4">
                                    Data tidak ada
                                </div>
                            ) : (
                                table
                                    .getRowModel()
                                    .rows.map((row) => (
                                        <DataItem
                                            key={row.original.id}
                                            row={row}
                                        />
                                    ))
                            )}
                        </div>
                    </div>
                </div>

                {/* <div className="relative overflow-y-auto h-[90%] overflow-x-auto shadow-lg rounded-lg">
                <table className="max-h-[95%] w-full overflow-auto bg-gray-100 rounded-t-lg border-separate border-spacing-y-2 rounded-lg  text-center text-sm rtl:text-right text-gray-500">
                    <thead className="sticky top-0 text-xs text-gray-700 uppercase min-h-10 w-full">
                        {table?.getHeaderGroups()?.map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    // console.log(header.column);
                                    return (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <>
                                                    <div
                                                        {...{
                                                            className:
                                                                header.column.getCanSort()
                                                                    ? "cursor-pointer select-none"
                                                                    : "",
                                                            onClick:
                                                                header.column.getToggleSortingHandler(),
                                                        }}
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext()
                                                        )}
                                                        {{
                                                            asc: (
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faSortUp
                                                                    }
                                                                    className="ms-1"
                                                                />
                                                            ),
                                                            desc: (
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faSortDown
                                                                    }
                                                                    className="ms-1"
                                                                />
                                                            ),
                                                        }[
                                                            header.column.getIsSorted()
                                                        ] ?? null}
                                                    </div>
                                                </>
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="overflow-y-scroll max-h-screen bg-white">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <tr key={i}>
                                    <td>
                                        <Skeleton height={15} width={30} />
                                    </td>
                                    <td>
                                        <Skeleton width={150} height={15} />
                                        <Skeleton width={50} height={15} />
                                    </td>
                                    <td className="flex gap-3">
                                        <Skeleton width={35} height={15} />
                                        <Skeleton width={50} height={15} />
                                    </td>
                                    <td>
                                        <Skeleton
                                            height={15}
                                            width={60}
                                            count={3}
                                        />
                                    </td>
                                    <td>
                                        <Skeleton height={15} width={60} />
                                    </td>
                                    <td>
                                        <Skeleton height={15} width={60} />
                                    </td>
                                    <td>
                                        <Skeleton height={15} width={60} />
                                    </td>
                                    <td>
                                        <Skeleton height={20} width={20} />
                                    </td>
                                </tr>
                            ))
                        ) : (filteredData || data) &&
                          (filteredData || data)?.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-4">
                                    Data tidak ada
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => {
                                const jaker = getDataJaker(row?.original); // Get computed data
                                const { bg, bgSub } = getEventColor(
                                    row?.original?.kode_ket,
                                    row.original?.macam_hadir
                                );
                                const thisIsImage =
                                    isImage(jaker?.keterangan) ||
                                    isPDF(jaker?.keterangan);
                                const handleShow = () => {
                                    if (thisIsImage) {
                                        // console.log(jaker?.keterangan);
                                        toggleShow("showModalDetail");
                                        setItemDetail({
                                            ...jaker,
                                            id: row.original.id,
                                        });
                                    }
                                };
                                const tanggal = hariTanggalIndo(
                                    row.original.created_at
                                ); // misal hasil: "Sabtu, 21 September 2024 09.49 WIB"
                                const [hari, sisanya] = tanggal.split(", ");
                                // console.log("jaker", jaker);
                                // console.log("row.original", row.original);
                                return (
                                    <tr
                                        key={row.id}
                                        className="text-xs sm:text-sm bg-white transition-transform duration-300 ease-in-out hover:translate-x-2 ring-1 ring-gray-200 rounded-lg shadow-lg"
                                    >
                                        <td className="bg-primary px-3 rounded-l-lg w-4 text-white font-bold">
                                            {row.original.id}
                                        </td>
                                        <td className="bg-primary px-3 text-white w-36 font-bold truncate">
                                            {hari},<br />
                                            {sisanya}
                                            <br />
                                            {jamIndo(row.original.created_at)}
                                        </td>

                                        <td className="text-left bg-primary pr-0 py-0 pl-3 border-white text-gray-900 truncate">
                                            <div className="bg-white py-6 rounded-l-lg px-3">
                                                <span
                                                    className={`badge text-white font-bold px-3 ${bg}`}
                                                >
                                                    {jaker?.jenis}
                                                </span>
                                            </div>
                                        </td>
                                        {isNotPribadi && (
                                            <td className="w-48 px-2 text-gray-900 truncate">
                                                {Array.isArray(
                                                    row.original.org
                                                ) &&
                                                row.original.org.length > 1 ? (
                                                    <PopoverJakerOrg
                                                        item={{
                                                            ...jaker,
                                                            id: row.original.id,
                                                            org: row.original
                                                                .org,
                                                        }}
                                                    />
                                                ) : (
                                                    row.original.org?.[0]
                                                        ?.nama || "-"
                                                )}
                                            </td>
                                        )}

                                        <td
                                            className="text-left ps-2 border-white max-w-80 truncate"
                                            onClick={handleShow}
                                        >
                                            {thisIsImage ? (
                                                <button className="btn-primary">
                                                    <FontAwesomeIcon
                                                        icon={faEye}
                                                    />
                                                </button>
                                            ) : typeof jaker?.keterangan ===
                                              "string" ? (
                                                jaker.keterangan.length > 30 ? (
                                                    <PopoverJaker
                                                        item={{
                                                            ...jaker,
                                                            id: row.original.id,
                                                        }}
                                                    />
                                                ) : (
                                                    safeText(jaker.keterangan)
                                                )
                                            ) : (
                                                "-"
                                            )}
                                        </td>

                                        <td className="w-48 px-2 truncate">
                                            {jaker?.mulai}
                                        </td>

                                        <td className="w-48 px-2 truncate">
                                            {jaker?.selesai}
                                        </td>

                                        <td className="rounded-r-lg w-32 px-4 truncate">
                                            {jaker?.status}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div> */}

                {title != "Dashboard" && dataTable?.length > 0 && (
                    // <div className="flex justify-between my-3 text-gray-600">
                    //     <select
                    //         className="rounded border-primary py-1"
                    //         value={table.getState().pagination.pageSize}
                    //         onChange={(e) => {
                    //             table.setPageSize(Number(e.target.value));
                    //         }}
                    //     >
                    //         {[10, 20, 30, 40, 50].map((pageSize) => (
                    //             <option key={pageSize} value={pageSize}>
                    //                 Show {pageSize}
                    //             </option>
                    //         ))}
                    //     </select>
                    //     <div className="flex items-center gap-2">
                    //         <button
                    //             className="btn-outline-primary border p-1"
                    //             onClick={() => table.firstPage()}
                    //             disabled={!table.getCanPreviousPage()}
                    //         >
                    //             <FontAwesomeIcon icon={faBackwardFast} />
                    //         </button>
                    //         <button
                    //             className="btn-outline-primary border p-1"
                    //             onClick={() => table.previousPage()}
                    //             disabled={!table.getCanPreviousPage()}
                    //         >
                    //             <FontAwesomeIcon icon={faCaretLeft} />
                    //         </button>
                    //         <span className="flex items-center gap-1">
                    //             <div>Halaman</div>
                    //             <strong>
                    //                 {table.getState().pagination.pageIndex + 1} dari{" "}
                    //                 {table.getPageCount().toLocaleString()}
                    //             </strong>
                    //         </span>
                    //         <button
                    //             className="btn-outline-primary border p-1"
                    //             onClick={() => table.nextPage()}
                    //             disabled={!table.getCanNextPage()}
                    //         >
                    //             <FontAwesomeIcon icon={faCaretRight} />
                    //         </button>
                    //         <button
                    //             className="btn-outline-primary border p-1"
                    //             onClick={() => table.lastPage()}
                    //             disabled={!table.getCanNextPage()}
                    //         >
                    //             <FontAwesomeIcon icon={faForwardFast} />
                    //         </button>
                    //         <span className="flex items-center gap-1">
                    //             Cari di halaman:
                    //             <input
                    //                 type="number"
                    //                 min="1"
                    //                 max={table.getPageCount()}
                    //                 defaultValue={
                    //                     table.getState().pagination.pageIndex + 1
                    //                 }
                    //                 onChange={(e) => {
                    //                     const page = e.target.value
                    //                         ? Number(e.target.value) - 1
                    //                         : 0;
                    //                     table.setPageIndex(page);
                    //                 }}
                    //                 className="border border-primary p-1 rounded w-16"
                    //             />
                    //         </span>
                    //     </div>
                    //     <div>
                    //         Hasil: {table.getRowCount().toLocaleString()} Rows
                    //     </div>
                    // </div>
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="flex justify-center p-2 border-b border-primary gap-1">
                            <button
                                className="btn-outline-primary border p-1"
                                onClick={() => table.firstPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <FontAwesomeIcon icon={faBackwardFast} />
                            </button>
                            <button
                                className="btn-outline-primary border p-1"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <FontAwesomeIcon icon={faCaretLeft} />
                            </button>
                            <span className="flex items-center gap-1 rounded border border-primary text-neutral-500 px-2">
                                <strong>
                                    {table.getState().pagination.pageIndex + 1}
                                </strong>
                                dari
                                <strong>
                                    {table.getPageCount().toLocaleString()}
                                </strong>
                            </span>
                            <button
                                className="btn-outline-primary border p-1"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <FontAwesomeIcon icon={faCaretRight} />
                            </button>
                            <button
                                className="btn-outline-primary border p-1"
                                onClick={() => table.lastPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <FontAwesomeIcon icon={faForwardFast} />
                            </button>
                        </div>

                        <div className="md:flex justify-between items-center text-gray-600">
                            <div className="flex justify-between items-center my-3 text-gray-600">
                                <select
                                    className="rounded border-primary py-1"
                                    value={table.getState().pagination.pageSize}
                                    onChange={(e) => {
                                        table.setPageSize(
                                            Number(e.target.value)
                                        );
                                    }}
                                >
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <option key={pageSize} value={pageSize}>
                                            Show {pageSize}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1">
                                    Cari di halaman:
                                    <input
                                        type="number"
                                        min="1"
                                        max={table.getPageCount()}
                                        defaultValue={
                                            table.getState().pagination
                                                .pageIndex + 1
                                        }
                                        onChange={(e) => {
                                            const page = e.target.value
                                                ? Number(e.target.value) - 1
                                                : 0;
                                            table.setPageIndex(page);
                                        }}
                                        className="border border-primary p-1 rounded w-16"
                                    />
                                </span>
                            </div>
                            <div>
                                Hasil: {table.getRowCount().toLocaleString()}{" "}
                                Rows
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {itemDetail && (
                <ModalJaker
                    show={show.showModalDetail}
                    handleClose={() => toggleShow("showModalDetail")}
                    item={itemDetail}
                />
            )}
            {itemOvershift && (
                <ModalOvershift
                    show={Boolean(itemOvershift)}
                    handleClose={() => setItemOvershift(null)}
                    item={itemOvershift}
                />
            )}
            {itemBuktiSakit && (
                <ModalBuktiSakit
                    show={Boolean(itemBuktiSakit)}
                    handleClose={() => setItemBuktiSakit(null)}
                    item={itemBuktiSakit}
                />
            )}
            {org.id === itemLapLembur?.id_karyawan ? (
                <ModalFormLaporanLembur
                    show={Boolean(itemLapLembur)}
                    handleClose={() => setItemLapLembur(null)}
                    item={itemLapLembur}
                />
            ) : (
                <ModalLaporanLembur
                    show={Boolean(itemLapLembur)}
                    handleClose={() => setItemLapLembur(null)}
                    item={itemLapLembur}
                />
            )}
        </div>
    );
};

export default TableJaker;
