import Select2RS from "@/Components/ReactStrap/Select2";
import dataSelect from "@/Functions/dataSelect";
import { registeredReducer } from "@/redux/slices/FingerprintSlice";
import { usePage } from "@inertiajs/react";
import axios from "axios";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

export default function Daftar() {
    const dispatch = useDispatch();
    const { props } = usePage();
    const { ip_alat: ipAlat, jenis_kehadiran: jenisKehadiran } = props;
    const { urlScanner } = useSelector((state) => state.fingerprints);

    const [listKaryawans, setListKaryawans] = useState(null);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(
    //                 // "http://127.0.0.1:8000/api/Karyawan/Presensi/Fingerprint"
    //                 `${
    //                     import.meta.env.VITE_API_SERVER
    //                 }/Karyawan/Presensi/Fingerprint`
    //             );
    //             // const response = await axios.get("/Get/Karyawan/Fingerprint");
    //             setListKaryawans(response.data.listKaryawan);
    //             dispatch(registeredReducer(response.data.registered));
    //         } catch (error) {
    //             console.error("Error fetching user data:", error);
    //         }
    //     };

    //     fetchData();
    // }, []);
    if (!listKaryawans) {
        return <div>Loading...</div>; // Add loading state
    }

    return (
        <>
            <span className="badge bg-primary text-white font-bold text-md px-8">
                Daftar
            </span>
            <Formik
                initialValues={{
                    idKar: "",
                }}
                onSubmit={(values) => {
                    // sendData(values);
                    getFitur(2, values.idKar);
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
                            className="col-6 mx-auto"
                            label="Nama Karyawan"
                            id="idKar"
                            data={dataSelect(
                                listKaryawans.filter(
                                    (item) =>
                                        !listRegistereds.some(
                                            (reg) => reg.id_karyawan == item.id
                                        )
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
                        <div className="col-12 mt-3 d-flex">
                            <button
                                type="submit"
                                className="btn btn-primary mx-auto"
                                onClick={handleSubmit}
                            >
                                Scan
                            </button>
                        </div>
                    </form>
                )}
            </Formik>
            <div className="w-30 h-25 mx-auto text-wrap">
                {renderPlayerGIF(status, message)}
            </div>
        </>
    );
}
