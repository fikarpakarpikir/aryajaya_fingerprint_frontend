import dataSelect, { getObjectValue } from "@/Functions/dataSelect";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import * as Yup from "yup";
import Select2RS from "./Select2";
import SelectRS from "./Select";
import InputRS from "./Input";
import sendDataGeneral from "@/Functions/sendDataGeneral";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
    formatDatetimeToInput,
    formatDateToInput,
    tanggalJamIndo,
    tanggalJamISO,
} from "@/Functions/waktuIndo";
import useAuth from "@/Functions/useAuth";

export const GetForm = ({
    items,
    value,
    error,
    touched,
    handleBlur,
    handleChange,
    setFieldValue,
    className = "w-full",
}) => {
    const { props } = useAuth();
    // console.log(items.key);
    switch (items.key) {
        case "tempat_lahir":
            return (
                <Select2RS
                    className={className}
                    label={`${items.label}`}
                    values={value}
                    data={dataSelect(props.cities, "title", "title")}
                    name={items.key}
                    id={items.key}
                    error={error}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={(val) => {
                        setFieldValue("tempat_lahir", val.value);
                        // console.log(error);
                    }}
                />
            );
        case "jenis_kelamin":
            return (
                <SelectRS
                    className={className}
                    label={`${items.label}`}
                    values={value}
                    data={["Laki-laki", "Perempuan"].map((item) => ({
                        value: item,
                        label: item,
                    }))}
                    name={items.key}
                    id={items.key}
                    error={error}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                />
            );
        case "kode_agama":
            return (
                <SelectRS
                    className={className}
                    label={`${items.label}`}
                    values={value}
                    data={dataSelect(props.agama)}
                    name={items.key}
                    id={items.key}
                    error={error}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                />
            );
        case "kode_nikah":
            return (
                <SelectRS
                    className={className}
                    label={`${items.label}`}
                    values={value}
                    data={dataSelect(props.nikah)}
                    name={items.key}
                    id={items.key}
                    error={error}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                />
            );
        case "kode_status_kerja":
            return (
                <SelectRS
                    className={className}
                    label={`${items.label}`}
                    values={value}
                    data={dataSelect(props.status_kerja)}
                    name={items.key}
                    id={items.key}
                    error={error}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                />
            );
        case "kode_golongan":
            return (
                <SelectRS
                    className={className}
                    label={`${items.label}`}
                    values={value}
                    data={dataSelect(props.golongan)}
                    name={items.key}
                    id={items.key}
                    error={error}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                />
            );
        case "kode_struktural":
            return (
                <SelectRS
                    className={className}
                    label={`${items.label}`}
                    values={value}
                    data={dataSelect(props.struktural)}
                    name={items.key}
                    id={items.key}
                    error={error}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                />
            );
        case "fungsional":
            return (
                <SelectRS
                    className={className}
                    label={`${items.label}`}
                    values={value}
                    data={dataSelect(props.fungsi)}
                    name={items.key}
                    id={items.key}
                    error={error}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                />
            );
        case "kode_fungsional":
            return (
                <SelectRS
                    className={className}
                    label={`${items.label}`}
                    values={value}
                    data={dataSelect(props.fungsional)}
                    name={items.key}
                    id={items.key}
                    error={error}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                />
            );
        case "kode_divisi":
            return (
                <SelectRS
                    className={className}
                    label={`${items.label}`}
                    values={value}
                    data={dataSelect(props.divisis)}
                    name={items.key}
                    id={items.key}
                    error={error}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                />
            );
        case "pendidikan":
            return (
                <SelectRS
                    className={className}
                    label={`${items.label}`}
                    values={value}
                    data={dataSelect(props.pendidikan)}
                    name={items.key}
                    id={items.key}
                    error={error}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                />
            );

        default:
            return (
                <InputRS
                    className={className}
                    label={`${items.label ?? ""} ${
                        ["no_hp", "no_hp_dkt"].includes(items.key)
                            ? "(Tanpa Menggunakan 0 dan +62)"
                            : ""
                    }`}
                    values={
                        items.type === "date" ? formatDateToInput(value) : value
                    }
                    type={items.type}
                    name={items.key}
                    id={items.key}
                    error={error}
                    touched={touched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                />
            );
            break;
    }
};

const FormEdit = ({
    items,
    initVal,
    processReducer,
    regulator,
    handleClick,
    border = true,
}) => {
    // const props = usePage().props;
    const dispatch = useDispatch();
    const [edit, setEdit] = useState(false);

    const handleSend = async (data) => {
        const form = new FormData();
        form.append("id", initVal.idPost);
        form.append("key", items.key);
        form.append([items.key], data[items.key]);

        await sendDataGeneral({
            data: form,
            route: initVal.routePost,
            slicer: initVal.slicer,
            prosesReducer: processReducer,
            dispatch: dispatch,
        });
        setEdit(false);
    };

    const clickIt = handleClick
        ? () => handleClick()
        : () => {
              if (regulator) {
                  setEdit(!edit);
                  //   console.log(initVal.idPost);
              }
          };
    // console.log(initVal);
    return (
        <div>
            {edit ? (
                <Formik
                    initialValues={initVal.value}
                    onSubmit={(val) => handleSend(val)}
                    validationSchema={Yup.object(initVal.valid)}
                >
                    {({
                        handleSubmit,
                        handleBlur,
                        handleChange,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="block sm:flex items-start gap-2">
                                <GetForm
                                    items={items}
                                    value={values?.[items.key]}
                                    error={errors?.[items.key]}
                                    touched={touched?.[items.key]}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    setFieldValue={setFieldValue}
                                />
                                <div
                                    className={`flex text-sm font-medium justify-end md:justify-start mt-8`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setEdit(!edit)}
                                        className="p-2.5 text-white bg-red-700 rounded-s-lg rounded-e-sm border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                    <button
                                        type="submit"
                                        className={`p-2.5 text-white bg-blue-700 rounded-e-lg rounded-s-sm border ${
                                            !errors[items.key]
                                                ? "border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                : "bg-gray-500"
                                        }`}
                                        disabled={errors[items.key]}
                                    >
                                        <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </Formik>
            ) : (
                <ListText
                    itemKey={items.key}
                    label={items.label}
                    handleClick={clickIt}
                    text={initVal.value?.[items.key]}
                    border={border}
                    type={items.type}
                />
            )}
        </div>
    );
};

export const ListText = ({
    itemKey,
    label,
    handleClick = () => null,
    text,
    border = true,
    type = "text",
}) => {
    return (
        <>
            {label && (
                <label className="font-semibold" htmlFor={itemKey}>
                    {label}
                </label>
            )}
            <span
                className={`block ${
                    border
                        ? "mt-1 w-full border p-2 rounded shadow-sm text-start"
                        : ""
                } hover:bg-sky-100 ${
                    typeof handleClick === "function" ? "btn" : ""
                }`}
                onClick={handleClick} // Execute handleClick on click
            >
                {type === "datetime-local" ? tanggalJamIndo(text) : text}
            </span>
        </>
    );
};

export default FormEdit;
