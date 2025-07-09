import { useState } from "react";
import { getEventColor } from "./Calendar";
import ModalStatic from "./ReactStrap/ModalStatic";
import { FieldArray, Form, Formik } from "formik";
import InputRS from "./ReactStrap/Input";
import { Spinner } from "flowbite-react";
import RangeDatePicker from "./RangeDatePicker";
import useAuth from "@/Functions/useAuth";
import SelectRS from "./ReactStrap/Select";
import dataSelect from "@/Functions/dataSelect";
import { calJaker } from "@/Functions/totalDataKerja";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import sendDataGeneral from "@/Functions/sendDataGeneral";
import { jakerAdd } from "@/redux/slices/jakerSlice";
import { toastStateReducer } from "@/redux/slices/ProcessStateSlice";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBriefcase,
    faBusinessTime,
    faCalendarXmark,
    faChevronCircleDown,
    faChevronCircleRight,
    faChevronLeft,
    faFileContract,
    faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import Select2RS from "./ReactStrap/Select2";
import { faClock } from "@fortawesome/free-regular-svg-icons";

export const Pengajuan = () => {
    const { props, auth, user, org, isAtasan, isDev, isHC } = useAuth();
    // console.log("🚀 ~ Pengajuan ~ props:", props.macam);
    const { macam, jenis, karyawans } = props;
    const dispatch = useDispatch();
    const { jaker } = useSelector((state) => state.jaker);

    const [show, setShow] = useState({
        perizinan: false,
        lembur: false,
        jaker: false,
        libur: false,
    });

    const toggleShow = (key) => {
        setShow((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const closeAll = () => {
        setShow({
            perizinan: false,
            lembur: false,
            jaker: false,
            libur: false,
        });
    };

    {
        /* NOTE *-Kode Keterangan
         { id: 1, title: "Kerja" },
         { id: 9, title: "Lembur" },
         { id: 13, title: "Libur" },
         { id: 2, title: "Cuti Tahunan" },
         { id: 3, title: "Cuti Khusus" },
         { id: 5, title: "Sakit" },
         { id: 4, title: "Izin" },
         { id: 12, title: "Izin Khusus" },
         { id: 10, title: "Izin Terlambat" },
     ] */
    }

    // $date = date_create(auth()->user()->org->pegawai->masuk, timezone_open('Asia/Jakarta'));
    // $legal = date_add(date_create(auth()->user()->org->pegawai->masuk, timezone_open('Asia/Jakarta')), date_interval_create_from_date_string('1 year'));

    // $diff = date_diff($date, now());
    // $diff2 = date_diff(now(), $legal);

    // if (number_format($diff->format('%y')) >= 1 && number_format($diff->format('%y')) < 2) {
    //     $sisaCuti = App\Http\Controllers\KaryawanController::TotalSisaCutiBaruSetahunKerja(auth()->user()->id_karyawan);
    //     $sisa = $sisaCuti == 1 ? 12 - $sisaCuti : $sisaCuti;
    // } elseif (number_format($diff->format('%y')) >= 2) {
    //     $sisa = 12;
    // } else {
    //     $sisa = 0;
    // }
    // $total_sisa = $sisa - number_format(App\Http\Controllers\JadwalKerjaController::Total_Cuti_Tahunan(auth()->user()->id_karyawan, 2));

    const handleSend = async (data) => {
        const kodeKet = Number(data?.kode_ket);
        const kodeMacam = Number(data?.macam_hadir);
        const ketEncId = jenis.find(
            (item) => Number(item.id) === kodeKet
        )?.encId;
        const form = new FormData();
        if (data.idKar?.length > 0) {
            data.idKar?.forEach((item, i) => form.append(`id_kar[${i}]`, item));
        } else {
            form.append("id_kar", org?.encId);
        }
        form.append("kode_ket", ketEncId);
        ![4, 5].includes(kodeKet) && form.append("macam_hadir", kodeMacam);
        form.append("mulai", dayjs(data?.mulai).format("YYYY-MM-DD"));
        form.append("selesai", dayjs(data?.selesai).format("YYYY-MM-DD"));
        if (Array.isArray(data.bukti) && data.bukti.length > 0) {
            data.bukti
                .slice()
                .sort((a, b) => a - b)
                .forEach((item, i) => form.append(`bukti[${i}]`, item));
        } else if (data.bukti) {
            form.append("bukti", data.bukti);
        }
        if (
            [10].includes(kodeKet) ||
            [18, 19, 20, 28, 29].includes(kodeMacam)
        ) {
            form.append("mulai_jam", data?.mulai_jam);
            form.append("selesai_jam", data?.selesai_jam);
        }

        await sendDataGeneral({
            data: form,
            route: route("Jaker.add"),
            dispatch,
            slicer: jakerAdd,
            prosesReducer: toastStateReducer,
            handleClose: () => closeAll(),
            waitUntilFinish: true,
        });
        // setTarget(null);
    };

    const BtnPengajuan = ({ handleClick, icon, text }) => {
        return (
            <>
                <button
                    className={`transition-shadow duration-300 text-center flex flex-col justify-center items-center whitespace-nowrap gap-1 text-xs sm:text-sm hover:shadow-lg rounded-lg w-full py-2`}
                    onClick={handleClick}
                    type="button"
                >
                    <div className="btn-outline-primary w-10 h-10 text-center flex justify-center items-center">
                        <FontAwesomeIcon icon={icon} className="text-xl" />
                    </div>
                    {text}
                </button>
            </>
        );
    };

    const FormPengajuan = () => {
        const [showBtn, setShowBtn] = useState(show.perizinan);
        const [target, setTarget] = useState(null);

        const titleMap = {
            perizinan: `Pengajuan Perizinan untuk ${target?.title}`,
            jaker: "Penjadwalan Kerja",
            lembur: "Penjadwalan Lembur",
            libur: "Penjadwalan Cuti/Libur",
        };

        const titleKey = Object.keys(show).find((key) => show[key]);
        const title = titleKey ? titleMap[titleKey] : "";

        const { durasi } = calJaker(jaker, 2, "hari") || 0;
        const sisaCutiTahunan = 12 - 0;
        let total = sisaCutiTahunan;
        const regulasi = {
            // * [min, minSatuan, max, maxSatuan, bukti/attachment, enableBefore]
            // cuti tahunan
            1: [2, "minggu", total >= 3 ? 3 : total, "hari", "text"],
            4: [2, "minggu", total, "hari", "file"],
            31: [0, "hari", total >= 3 ? 3 : total, "hari", "text"],

            // cuti khusus
            3: [3, "bulan", 40, "hari", "file"],
            5: [2, "minggu", 3, "hari", "text"],
            6: [2, "minggu", 3, "bulan", "file"],
            8: [2, "minggu", 2, "hari", "file"],
            9: [2, "minggu", 2, "hari", "text"], // !ini gimana istri sah melahirkan kl ngedadak?
            14: [2, "minggu", 1, "hari", "file"],
            15: [2, "hari", 1, "hari", "file"],
            21: [2, "minggu", 2, "hari", "text"],
            22: [2, "minggu", 1, "hari", "file"],

            // izin khusus
            2: [0, "hari", 2, "hari", "file"],
            7: [0, "hari", 6, "minggu", "file"],
            10: [0, "hari", 2, "hari", "file"],
            11: [0, "hari", 2, "hari", "file"],
            12: [0, "hari", 1, "hari", "file"],
            13: [0, "hari", 2, "hari", "file"],
            23: [1, "hari", 6, "bulan", "file"],
            24: [-3, "hari", 12, "bulan", "file"],
            25: [0, "hari", 1, "hari", "file"],
            26: [0, "hari", 2, "hari", "file"],

            // izin terlambat (khusus)
            16: [0, "hari", 1, "hari", "text"],
            17: [0, "hari", 1, "hari", "text"],
            18: [0, "hari", 1, "hari", "text"],
            27: [0, "hari", 1, "hari", "text"],
            0: [0, "hari", 0, "hari", "text"],

            // lembur
            19: [1, "hari", 30, "hari", "text"],
            20: [0, "hari", 30, "hari", "text"],

            sakit: [-1, "hari", 12, "bulan", "file"],
            izin: [0, "hari", 12, "bulan", "text"],
            hc: [0, "hari", 365, "hari", "text"],
        };

        return (
            <>
                <ModalStatic
                    show={
                        show.perizinan ||
                        show.lembur ||
                        show.jaker ||
                        show.libur
                    }
                    handleClose={closeAll}
                    title={() => (
                        <div className="flex items-center gap-1">
                            {!showBtn && show.perizinan && (
                                <button
                                    className={`btn-secondary px-2 py-1 rounded-full text-center text-xs sm:text-sm`}
                                    onClick={() => {
                                        setTarget(null);
                                        setShowBtn(!showBtn);
                                    }}
                                    type="button"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                            )}
                            {!showBtn ? title : `Pilih Perizinan`}
                        </div>
                    )}
                    size={showBtn ? "md" : "lg"}
                >
                    {showBtn && show.perizinan ? (
                        <div className="flex flex-wrap justify-center gap-2">
                            {jenis
                                .filter((item) =>
                                    [2, 3, 5, 4, 12, 10].includes(item.id)
                                )
                                ?.map((item, i) => (
                                    <button
                                        key={i}
                                        className={`btn-primary text-center font-bold text-xs sm:text-sm ${
                                            getEventColor(item.id).bg
                                        }`}
                                        type="button"
                                        onClick={() => {
                                            setTarget(item);
                                            setShowBtn(!showBtn);
                                        }}
                                    >
                                        {item.title}
                                    </button>
                                ))}
                        </div>
                    ) : (
                        <>
                            <Formik
                                initialValues={{
                                    idKar: [],
                                    kode_ket: show.jaker
                                        ? 1
                                        : show.lembur
                                        ? 9
                                        : show.libur
                                        ? 13
                                        : target?.id || 0,
                                    macam_hadir: 0,
                                    mulai: "",
                                    mulai_jam: "",
                                    selesai: "",
                                    selesai_jam: "",
                                    bukti: null,
                                }}
                                onSubmit={(val) => handleSend(val)}
                                validationSchema={Yup.object({
                                    idKar: Yup.array().when(
                                        "kode_ket",
                                        (kode_ket) => {
                                            return [1, 9, 13].includes(
                                                kode_ket[0]
                                            )
                                                ? Yup.array()
                                                      .min(1, "Minimal pilih 1")
                                                      .required("Wajib Diisi")
                                                : Yup.array();
                                        }
                                    ),
                                    macam_hadir: ![4, 5].includes(target?.id)
                                        ? Yup.number().required("Harus Dipilih")
                                        : Yup.number(),

                                    mulai: Yup.string().required("Harus Diisi"),

                                    mulai_jam: Yup.string().when(
                                        ["macam_hadir", "mulai"],
                                        ([macam_hadir, mulai]) => {
                                            const isMacamWajib = [
                                                19, 20, 28, 29,
                                            ].includes(Number(macam_hadir));
                                            const isTarget10 =
                                                target?.id === 10; // target harus tersedia dari scope luar
                                            const isToday =
                                                new Date(
                                                    mulai
                                                ).toDateString() ===
                                                new Date().toDateString();

                                            // Mulai dari schema dasar
                                            let schema = Yup.string();

                                            if (isMacamWajib || isTarget10) {
                                                schema =
                                                    schema.required(
                                                        "Harus Diisi"
                                                    );
                                            }

                                            if (
                                                Number(macam_hadir) === 20 &&
                                                isToday
                                            ) {
                                                schema = schema.test(
                                                    "jam-harus-di-masa-depan",
                                                    "Jam mulai harus lebih besar dari sekarang",
                                                    (value) => {
                                                        if (!value)
                                                            return false;
                                                        const [hours, minutes] =
                                                            value.split(":");
                                                        const now = new Date();
                                                        const selectedTime =
                                                            new Date();
                                                        selectedTime.setHours(
                                                            +hours,
                                                            +minutes,
                                                            0,
                                                            0
                                                        );
                                                        return (
                                                            selectedTime.getTime() >
                                                            now.getTime()
                                                        );
                                                    }
                                                );
                                            }

                                            return schema; // 🟢 PENTING: Harus return schema di akhir
                                        }
                                    ),

                                    selesai:
                                        Yup.string().required("Harus Diisi"),

                                    selesai_jam: Yup.string().when(
                                        ["macam_hadir"],
                                        ([macam_hadir]) => {
                                            const isMacamWajib = [
                                                19, 20, 28, 29,
                                            ].includes(Number(macam_hadir));
                                            const isTarget10 =
                                                target?.id === 10; // target harus tersedia dari scope luar

                                            // Mulai dari schema dasar
                                            let schema = Yup.string();

                                            if (isMacamWajib || isTarget10) {
                                                schema =
                                                    schema.required(
                                                        "Harus Diisi"
                                                    );
                                            }

                                            return schema; // 🟢 PENTING: Harus return schema di akhir
                                        }
                                    ),

                                    bukti: Yup.mixed().when(
                                        "macam_hadir",
                                        (macam_hadir, schema) => {
                                            if (
                                                [5].includes(target?.id) ||
                                                [29].includes(
                                                    Number(macam_hadir)
                                                )
                                            ) {
                                                // Kalau target id = 5 → nullable, tidak perlu validasi lanjut
                                                return schema.nullable();
                                            }

                                            if (
                                                regulasi?.[macam_hadir]?.[4] ===
                                                "file"
                                            ) {
                                                return schema
                                                    .required("Wajib Upload")
                                                    .test(
                                                        "fileFormat",
                                                        "Only PDF/PNG/JPG/JPEG files are allowed",
                                                        (value) =>
                                                            value &&
                                                            [
                                                                "application/pdf",
                                                                "image/png",
                                                                "image/jpg",
                                                                "image/jpeg",
                                                            ].includes(
                                                                value?.type
                                                            )
                                                    )
                                                    .test(
                                                        "fileSize",
                                                        "File harus di bawah 4MB",
                                                        (value) =>
                                                            !value ||
                                                            value?.size <=
                                                                4194304
                                                    );
                                            }

                                            if (Number(macam_hadir) === 28) {
                                                return Yup.array()
                                                    .min(
                                                        1,
                                                        "Minimal pilih satu hari"
                                                    )
                                                    .required("Wajib diisi");
                                            }

                                            // Default selain itu, wajib diisi sebagai string
                                            return Yup.string().required(
                                                "Harus Diisi"
                                            );
                                        }
                                    ),
                                })}
                            >
                                {({
                                    isSubmitting,
                                    handleSubmit,
                                    handleBlur,
                                    handleChange,
                                    handleReset,
                                    values,
                                    errors,
                                    touched,
                                    setFieldValue,
                                    setFieldTouched,
                                }) => {
                                    const targetId = show.jaker
                                        ? 1
                                        : show.lembur
                                        ? 9
                                        : show.libur
                                        ? 13
                                        : target?.id;
                                    const isChooseKar = [1, 9, 13].includes(
                                        targetId
                                    );
                                    const macamHadir = Number(
                                        values?.macam_hadir
                                    );
                                    const isDisableBefore = ![
                                        28, 29, 32, 33, 34,
                                    ].includes(macamHadir);

                                    const reg =
                                        targetId == 4
                                            ? regulasi["izin"]
                                            : targetId == 5
                                            ? regulasi["sakit"]
                                            : regulasi[macamHadir]
                                            ? regulasi[macamHadir]
                                            : isChooseKar && regulasi["hc"];

                                    const mode =
                                        (reg &&
                                            reg[2] === 1 &&
                                            reg[3] === "hari") ||
                                        [10].includes(targetId)
                                            ? "single"
                                            : "range";
                                    const isCutiTahunanValid =
                                        sisaCutiTahunan > 0 &&
                                        targetId === 2 &&
                                        !isChooseKar;
                                    const isMacamHadirDipilih =
                                        Boolean(macamHadir);
                                    const isTargetSpesial = [4, 5].includes(
                                        targetId
                                    );
                                    const isNeedClock =
                                        [10].includes(targetId) ||
                                        [19, 20, 28, 29].includes(macamHadir);
                                    const isNeedKet = ![28, 29].includes(
                                        macamHadir
                                    );
                                    const isChooseDay = [28].includes(
                                        macamHadir
                                    );

                                    const baseCondition =
                                        reg &&
                                        !isChooseDay &&
                                        (isCutiTahunanValid ||
                                            (isMacamHadirDipilih &&
                                                !isCutiTahunanValid) ||
                                            isTargetSpesial);

                                    const showRangeDate = isChooseKar
                                        ? values.idKar?.length > 0 &&
                                          baseCondition
                                        : baseCondition;

                                    const submitableClock =
                                        !isNeedClock ||
                                        (!errors.mulai_jam &&
                                            !errors.selesai_jam);

                                    const submitableKet =
                                        !isNeedKet || !errors.bukti; // ← bisa kamu sesuaikan dengan logika submitableKet juga

                                    const submitableIdKar =
                                        !isChooseKar ||
                                        (values.idKar?.length > 0 &&
                                            !errors.idKar);
                                    const noErrors = [
                                        "kode_ket",
                                        "macam_hadir",
                                        "mulai",
                                    ].every((key) => !errors[key]);
                                    const submitable =
                                        !isSubmitting &&
                                        submitableIdKar &&
                                        submitableClock &&
                                        submitableKet &&
                                        noErrors;
                                    // console.log(
                                    //     errors,
                                    //     !isSubmitting,
                                    //     submitableIdKar,
                                    //     submitableClock,

                                    //     isNeedClock,
                                    //     !errors.mulai_jam,
                                    //     !errors.selesai_jam,
                                    //     submitableKet,
                                    //     noErrors
                                    // );

                                    return (
                                        <Form
                                            onSubmit={handleSubmit}
                                            className="h-full items-center gap-3"
                                        >
                                            {targetId == 2 && (
                                                <span className="text-primary font-bold">
                                                    Sisa Cuti Tahunan:{" "}
                                                    {sisaCutiTahunan}
                                                </span>
                                            )}
                                            {((sisaCutiTahunan > 0 &&
                                                targetId == 2) ||
                                                ![4, 5].includes(targetId)) && (
                                                <SelectRS
                                                    className={"mb-3"}
                                                    label={`Pilih Jenis Pengajuan`}
                                                    values={values.macam_hadir}
                                                    data={dataSelect(
                                                        macam?.filter(
                                                            (item) =>
                                                                (item.kode_hadir ===
                                                                    targetId &&
                                                                    (targetId !==
                                                                        2 ||
                                                                        item.id !==
                                                                            32)) ||
                                                                (targetId ===
                                                                    13 &&
                                                                    item.id ===
                                                                        32)
                                                        )
                                                    )}
                                                    name={"macam_hadir"}
                                                    id={"macam_hadir"}
                                                    error={errors.macam_hadir}
                                                    touched={
                                                        touched.macam_hadir
                                                    }
                                                    handleBlur={handleBlur}
                                                    handleChange={(e) => {
                                                        const val = Number(
                                                            e.target.value
                                                        );
                                                        handleReset();
                                                        if (val === 28) {
                                                            setFieldValue(
                                                                "mulai",
                                                                new Date()
                                                            );
                                                            setFieldValue(
                                                                "selesai",
                                                                new Date()
                                                            );
                                                        }

                                                        if (val === 32) {
                                                            setFieldValue(
                                                                "kode_ket",
                                                                2
                                                            );
                                                        } else if (
                                                            [33, 34].includes(
                                                                val
                                                            )
                                                        ) {
                                                            setFieldValue(
                                                                "kode_ket",
                                                                13
                                                            );
                                                        }
                                                        handleChange(e);
                                                    }}
                                                />
                                            )}
                                            {isChooseKar && (
                                                <Select2RS
                                                    className={"mb-3"}
                                                    label={`Pilih Karyawan`}
                                                    values={values.idKar}
                                                    data={dataSelect(
                                                        karyawans,
                                                        "id",
                                                        "nama"
                                                    )}
                                                    name={"idKar[]"}
                                                    id={"idKar"}
                                                    error={errors.idKar}
                                                    touched={touched.idKar}
                                                    handleBlur={handleBlur}
                                                    isMulti
                                                    chooseAll
                                                    handleChange={(
                                                        selectedOptions
                                                    ) => {
                                                        setFieldValue(
                                                            "idKar",
                                                            selectedOptions
                                                                ? selectedOptions.map(
                                                                      (
                                                                          option
                                                                      ) =>
                                                                          option.value
                                                                  )
                                                                : []
                                                        );
                                                    }}
                                                />
                                            )}
                                            {showRangeDate && (
                                                <>
                                                    <RangeDatePicker
                                                        mode={mode}
                                                        min={reg?.[0]}
                                                        minSatuan={reg?.[1]}
                                                        max={reg?.[2]}
                                                        maxSatuan={reg?.[3]}
                                                        setFieldValue={
                                                            setFieldValue
                                                        }
                                                        setFieldTouched={
                                                            setFieldTouched
                                                        }
                                                        disableBefore={
                                                            isDisableBefore
                                                        }
                                                    />

                                                    {(errors.mulai ||
                                                        errors.selesai) && (
                                                        <div className="invalid-feedback text-red-600 text-sm">
                                                            {errors.mulai ||
                                                                errors.selesai}
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {isChooseDay && (
                                                <>
                                                    <FieldArray name="bukti">
                                                        {({
                                                            push,
                                                            remove,
                                                            form,
                                                        }) => {
                                                            const selected =
                                                                Array.isArray(
                                                                    form.values
                                                                        .bukti
                                                                )
                                                                    ? form
                                                                          .values
                                                                          .bukti
                                                                    : [];
                                                            return (
                                                                <div className="flex flex-wrap justify-center items-center gap-2">
                                                                    {[
                                                                        "Senin",
                                                                        "Selasa",
                                                                        "Rabu",
                                                                        "Kamis",
                                                                        "Jumat",
                                                                        "Sabtu",
                                                                        "Minggu",
                                                                    ].map(
                                                                        (
                                                                            item,
                                                                            i
                                                                        ) => {
                                                                            const value =
                                                                                i +
                                                                                1;
                                                                            const isChecked =
                                                                                selected.includes(
                                                                                    value
                                                                                );

                                                                            return (
                                                                                <div
                                                                                    className="min-w-max mb-2"
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                >
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        id={`text_${item}`}
                                                                                        className="hidden"
                                                                                        hidden
                                                                                        checked={
                                                                                            isChecked
                                                                                        }
                                                                                        onChange={() => {
                                                                                            if (
                                                                                                isChecked
                                                                                            ) {
                                                                                                const index =
                                                                                                    selected.indexOf(
                                                                                                        value
                                                                                                    );
                                                                                                remove(
                                                                                                    index
                                                                                                );
                                                                                            } else {
                                                                                                push(
                                                                                                    value
                                                                                                );
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <label
                                                                                        htmlFor={`text_${item}`}
                                                                                        className={`btn-outline-primary ${
                                                                                            isChecked
                                                                                                ? "bg-primary text-white"
                                                                                                : ""
                                                                                        }`}
                                                                                    >
                                                                                        {
                                                                                            item
                                                                                        }
                                                                                    </label>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            );
                                                        }}
                                                    </FieldArray>

                                                    {errors.bukti && (
                                                        <div className="invalid-feedback text-red-600 text-sm">
                                                            {errors.bukti}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                            {isNeedClock && (
                                                <div className="grid md:grid-cols-7 text-center items-start my-2">
                                                    <InputRS
                                                        className="col-span-1 md:col-span-3"
                                                        label={"Jam Mulai"}
                                                        type={"time"}
                                                        name={"mulai_jam"}
                                                        id={"mulai_jam"}
                                                        values={
                                                            values.mulai_jam
                                                        }
                                                        error={errors.mulai_jam}
                                                        touched={
                                                            touched.mulai_jam
                                                        }
                                                        handleBlur={handleBlur}
                                                        handleChange={
                                                            handleChange
                                                        }
                                                        icon={faClock}
                                                    />
                                                    <div className="text-center md:mt-8">
                                                        <label
                                                            htmlFor="selesai_jam"
                                                            className="text-primary font-bold text-xl"
                                                        >
                                                            <div className="block md:hidden">
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faChevronCircleDown
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="hidden md:block">
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faChevronCircleRight
                                                                    }
                                                                />
                                                            </div>
                                                        </label>
                                                    </div>
                                                    <InputRS
                                                        className="col-span-1 md:col-span-3"
                                                        label={"Jam Selesai"}
                                                        type={"time"}
                                                        name={"selesai_jam"}
                                                        id={"selesai_jam"}
                                                        values={
                                                            values.selesai_jam
                                                        }
                                                        error={
                                                            errors.selesai_jam
                                                        }
                                                        touched={
                                                            touched.selesai_jam
                                                        }
                                                        handleBlur={handleBlur}
                                                        handleChange={
                                                            handleChange
                                                        }
                                                        icon={faClock}
                                                    />
                                                </div>
                                            )}
                                            {reg ? (
                                                isNeedKet && (
                                                    <InputRS
                                                        className="my-3"
                                                        label={
                                                            reg[4] === "file"
                                                                ? "Lampirkan Bukti"
                                                                : "Keterangan"
                                                        }
                                                        type={reg[4]}
                                                        name={"bukti"}
                                                        id={"bukti"}
                                                        error={
                                                            typeof errors.bukti ===
                                                            "string"
                                                                ? errors.bukti
                                                                : null
                                                        }
                                                        handleBlur={handleBlur}
                                                        accept={
                                                            reg[4] === "file"
                                                                ? ".pdf, .png, .jpeg, .jpg, .heic"
                                                                : ""
                                                        }
                                                        handleChange={(e) => {
                                                            reg[4] === "file"
                                                                ? setFieldValue(
                                                                      "bukti",
                                                                      e
                                                                          .currentTarget
                                                                          .files[0]
                                                                  )
                                                                : handleChange(
                                                                      e
                                                                  );
                                                        }}
                                                    />
                                                )
                                            ) : (
                                                <div className="text-red-500">
                                                    Pilih Jenis terlebih dahulu
                                                </div>
                                            )}
                                            <div className="flex justify-end my-2">
                                                <button
                                                    className={`btn-primary text-center text-xs sm:text-sm`}
                                                    onClick={handleSubmit}
                                                    disabled={!submitable}
                                                    type="submit"
                                                >
                                                    {isSubmitting ? (
                                                        <Spinner />
                                                    ) : (
                                                        "Kirim"
                                                    )}
                                                </button>
                                            </div>
                                        </Form>
                                    );
                                }}
                            </Formik>
                        </>
                    )}
                </ModalStatic>
            </>
        );
    };

    return (
        <>
            <div
                className={`grid ${
                    isAtasan || isHC || isDev
                        ? "grid-cols-4 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-6"
                        : "grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10"
                } gap-2 items-start`}
            >
                {(isAtasan || isHC || isDev) && (
                    <>
                        <BtnPengajuan
                            handleClick={() => toggleShow("jaker")}
                            text={"Jadwal Kerja"}
                            icon={faBriefcase}
                        />
                        <BtnPengajuan
                            handleClick={() => toggleShow("lembur")}
                            text={"Lembur"}
                            icon={faBusinessTime}
                        />
                    </>
                )}
                {(isHC || isDev) && (
                    <BtnPengajuan
                        handleClick={() => toggleShow("libur")}
                        text={"Cuti/Libur"}
                        icon={faCalendarXmark}
                    />
                )}
                <BtnPengajuan
                    handleClick={() => toggleShow("perizinan")}
                    text={"Perizinan"}
                    icon={faFileContract}
                />
                <FormPengajuan />
            </div>
        </>
    );
};
