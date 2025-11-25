import { RenderPlayerGIF } from "@/Components/PlayerGIF";
import Select2RS from "@/Components/ReactStrap/Select2";
import { useFPContext } from "@/context/FPContext";
import dataSelect from "@/Functions/dataSelect";
import { registeredReducer } from "@/redux/slices/FingerprintSlice";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import FingerSelector from "./FingerSelector";

export default function Daftar() {
    const dispatch = useDispatch();
    const { props } = usePage();
    const [scanning, setScanning] = useState(false);

    const {
        getMessage,
        message,
        activeFP,
        countdownScanning,
        status,
        listKaryawans,
        setListKaryawans,
        getFitur,
    } = useFPContext();
    const { ip_alat: ipAlat, jenis_kehadiran: jenisKehadiran } = props;
    const { urlScanner } = useSelector((state) => state.fingerprints);
    const { listRegistereds } = useSelector((state) => state.fingerprints);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    route("Presensi.fp.getKaryawan")
                    // "http://127.0.0.1:8000/api/Karyawan/Presensi/Fingerprint"
                    // `${
                    //     import.meta.env.VITE_API_SERVER
                    // }/Karyawan/Presensi/Fingerprint`
                );
                // const response = await axios.get("/Get/Karyawan/Fingerprint");
                setListKaryawans(response.data.listKaryawan);
                dispatch(registeredReducer(response.data.registered));
                // console.log(
                //     "🚀 ~ fetchData ~ response.data.registered:",
                //     response.data.registered
                // );
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchData();
    }, []);
    if (!listKaryawans) {
        return <div>Loading...</div>; // Add loading state
    }

    return (
        <>
            <span className="badge bg-primary text-white font-bold text-md px-8">
                Daftar
            </span>
            {!scanning ? (
                <Formik
                    initialValues={{
                        idKar: "",
                        jariId: "",
                    }}
                    onSubmit={async (values) => {
                        setScanning(true);
                        try {
                            await getFitur(2, values.idKar, values.jariId); // tunggu sampai selesai
                            console.log("🚀 ~ Daftar ~ values:", values);
                        } catch (error) {
                            console.error(error);
                        } finally {
                            setScanning(false); // kembali setelah selesai
                        }
                    }}
                    // onSubmit={(values) => {
                    //     setScanning(true);
                    //     try {
                    //         getFitur(2, values.idKar, values.jariId);
                    //     } catch (error) {
                    //         console.error(error);
                    //     } finally {
                    //         setScanning(false);
                    //     }
                    //     // console.log(values);
                    // }}
                    validationSchema={Yup.object({
                        idKar: Yup.number().required("Harus dipilih"),
                    })}
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
                        <form onSubmit={handleSubmit} className="row g-3">
                            <Select2RS
                                className="w-3/4 mx-auto"
                                label="Nama Karyawan"
                                id="idKar"
                                data={dataSelect(
                                    listKaryawans?.filter(
                                        (k) =>
                                            listRegistereds?.filter(
                                                (reg) => reg.id_karyawan == k.id
                                            )?.length <= 2
                                    ),
                                    "id",
                                    "nama"
                                )}
                                name="idKar"
                                error={errors.idKar}
                                touched={touched.idKar}
                                handleChange={(values) => {
                                    setFieldValue("idKar", values.value);
                                    handleChange;
                                }}
                                handleBlur={handleBlur}
                                values={values.idKar}
                                placeholder="Pilih Karyawan"
                            />
                            {values?.idKar && (
                                <FingerSelector
                                    preValue={listRegistereds
                                        ?.filter(
                                            (reg) =>
                                                reg.id_karyawan == values.idKar
                                        )
                                        ?.flatMap((r) => r.jari_id)}
                                    onChange={(e) => {
                                        setFieldValue("jariId", e[0]);
                                    }}
                                />
                            )}
                            <div className="w-3/4 mx-auto mt-4">
                                <button
                                    type="submit"
                                    className="btn btn-primary mx-auto"
                                    onClick={() => {
                                        handleSubmit();
                                        setScanning(true);
                                    }}
                                    disabled={!values?.idKar || !values.jariId}
                                >
                                    Scan
                                </button>
                            </div>
                            {/* {values?.idKar && values.jariId && (
                            <RenderPlayerGIF
                                status={status}
                                message={message}
                            />
                        )} */}
                        </form>
                    )}
                </Formik>
            ) : (
                <>
                    {[3, 4].includes(status) && (
                        <button
                            type="submit"
                            className="btn btn-primary mx-auto"
                            onClick={() => setScanning(false)}
                        >
                            Daftar
                        </button>
                    )}
                </>
            )}
            <div className="w-30 h-25 mx-auto text-wrap">
                <RenderPlayerGIF status={status} message={message} />
            </div>
        </>
    );
}
