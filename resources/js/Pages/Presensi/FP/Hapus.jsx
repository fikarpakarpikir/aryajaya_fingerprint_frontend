import Select2RS from "@/Components/ReactStrap/Select2";
import dataSelect from "@/Functions/dataSelect";
import { usePage } from "@inertiajs/react";
import { Formik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";

export default function Hapus() {
    const { props } = usePage();
    const { ip_alat: ipAlat, jenis_kehadiran: jenisKehadiran } = props;
    const { urlScanner } = useSelector((state) => state.fingerprints);
    if (!listKaryawans) {
        return <div>Loading...</div>; // Add loading state
    }
    return (
        <>
            <span className="badge bg-red-500 text-white font-bold text-md px-8">
                Hapus
            </span>

            <Formik
                initialValues={{
                    idKar: "",
                }}
                onSubmit={(values) => {
                    // sendData(values);
                    getFitur(3, values.idKar);
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
                                listRegistereds,
                                "id_karyawan",
                                "org.nama"
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
                {renderPlayerGIF(status, message)}
            </div>
        </>
    );
}
