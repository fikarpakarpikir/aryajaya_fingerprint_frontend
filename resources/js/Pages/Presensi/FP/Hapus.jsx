import Select2RS from "@/Components/ReactStrap/Select2";
import { useFPContext } from "@/context/FPContext";
import dataSelect from "@/Functions/dataSelect";
import { usePage } from "@inertiajs/react";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import FingerSelector from "./FingerSelector";
import { useEffect } from "react";
import axios from "axios";
import { registeredReducer } from "@/redux/slices/FingerprintSlice";
import { RenderPlayerGIF } from "@/Components/PlayerGIF";

export default function Hapus() {
    const { props } = usePage();
    const dispatch = useDispatch();
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
        if (listKaryawans?.length <= 0) {
            fetchData();
        }
    }, []);
    if (!listKaryawans) {
        return <div>Loading...</div>; // Add loading state
    }
    return (
        <>
            <span className="badge bg-red-500 text-white font-bold text-md px-8">
                Hapus Fingerprint
            </span>

            <Formik
                initialValues={{
                    idKar: "",
                    jariId: "",
                }}
                onSubmit={(values) => {
                    // sendData(values);
                    getFitur(3, values.idKar, values.jariId);
                    // console.log(values);
                }}
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
                                        )?.length > 0
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
                                        (reg) => reg.id_karyawan == values.idKar
                                    )
                                    ?.flatMap((r) => r.jari_id)}
                                onChange={(e) => {
                                    setFieldValue("jariId", e[0]);
                                }}
                                isDeletable
                            />
                        )}
                        <div className="col-12 mt-3 d-flex">
                            <button
                                type="submit"
                                className="btn btn-danger mx-auto"
                                onClick={handleSubmit}
                            >
                                Hapus
                            </button>
                        </div>
                    </form>
                )}
            </Formik>
            <div className="w-30 h-25 mx-auto text-wrap">
                <RenderPlayerGIF status={status} message={message} />
            </div>
        </>
    );
}
