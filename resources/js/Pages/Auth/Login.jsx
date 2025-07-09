import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import { ButtonRadioRS } from "@/Components/ReactStrap/Button";
import InputRS from "@/Components/ReactStrap/Input";
import TextInput from "@/Components/TextInput";
import sendDataGeneral from "@/Functions/sendDataGeneral";
import GuestLayout from "@/Layouts/GuestLayout";
import {
    messageFailedReducer,
    spinnerProsesStateReducer,
} from "@/redux/slices/SpinnerProsesStateSlice";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Head, Link, useForm } from "@inertiajs/react";
import { Spinner } from "flowbite-react";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import LazyLoad from "react-lazyload";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

export default function Login({ status, canResetPassword }) {
    // console.log("ini");
    const dispatch = useDispatch();
    const { spinnerProsesState, messageFailed } = useSelector(
        (state) => state.process.spinner
    );
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
        setLoading(false);
    }, []);
    const submit = async (data) => {
        const form = new FormData();
        form.append("username", data.username);
        form.append("password", data.password);
        try {
            const resp = await sendDataGeneral({
                data: form,
                route: route("authenticate"),
                prosesReducer: spinnerProsesStateReducer,
                dispatch: dispatch,
                messageFailedReducer: messageFailedReducer,
            });

            // console.log(resp);
            if (resp.status === 200) {
                location.replace(route("home"));
            } else if (resp.status === 419) {
                dispatch(
                    messageFailedReducer(
                        "Session Anda habis, sistem akan reload halaman otomatis"
                    )
                );
                setTimeout(() => location.reload(), 2000);
            }
            // Navigate to home only after successful authentication
        } catch (error) {
            // console.error("Authentication failed:", error);
            if (error.status === 419) {
                dispatch(
                    messageFailedReducer(
                        "Session Anda habis, sistem akan reload halaman otomatis"
                    )
                );
                setTimeout(() => location.reload(), 2000);
            }
        }
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            {loading ? (
                <Spinner color="secondary" />
            ) : (
                <>
                    {messageFailed && (
                        <div className="mb-4 text-sm font-medium text-red-600">
                            {messageFailed}
                        </div>
                    )}
                    <div className="sm:items-center sm:grid sm:grid-cols-3 flex flex-col-reverse">
                        <div className="pb-10">
                            <Formik
                                initialValues={{
                                    username: "",
                                    password: "",
                                    mode: "",
                                }}
                                validationSchema={Yup.object({
                                    username:
                                        Yup.string().required("Wajib diisi"),
                                    password:
                                        Yup.string().required("Wajib diisi"),
                                })}
                                onSubmit={(values) => submit(values)}
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
                                    <form
                                        className="mt-4 px-5"
                                        onSubmit={handleSubmit}
                                    >
                                        <div className="mb-2">
                                            Log In sebagai:
                                        </div>

                                        <button
                                            name="mode"
                                            type="button"
                                            className={`${
                                                values.mode == "1"
                                                    ? "btn-primary"
                                                    : "btn-outline-primary"
                                            } me-2`}
                                            value={1}
                                            onClick={handleChange}
                                        >
                                            PKWTT
                                        </button>
                                        <button
                                            name="mode"
                                            type="button"
                                            className={`${
                                                values.mode == "2"
                                                    ? "btn-primary"
                                                    : "btn-outline-primary"
                                            }`}
                                            value={2}
                                            onClick={handleChange}
                                        >
                                            PKWT
                                        </button>
                                        <div className="mt-3">
                                            <InputRS
                                                className="w-full"
                                                id={"username"}
                                                name={"username"}
                                                label={"Username atau Email"}
                                                error={errors.username}
                                                touched={touched.username}
                                                values={values.username}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                                isFocused={true}
                                            />
                                        </div>

                                        <div className="mt-3 relative">
                                            <InputRS
                                                className="w-full"
                                                id={"password"}
                                                name={"password"}
                                                label={"Password"}
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                error={errors.password}
                                                touched={touched.password}
                                                values={values.password}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="text-white absolute end-0 top-2 sm:top-4 mt-5 bg-primary hover:bg-gray-950 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-s-2xl rounded-e-md text-sm px-2 py-1.5 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
                                            >
                                                <FontAwesomeIcon
                                                    icon={
                                                        showPassword
                                                            ? faEyeSlash
                                                            : faEye
                                                    }
                                                />
                                            </button>
                                        </div>

                                        <div className="mt-4 flex items-center justify-end">
                                            {canResetPassword && (
                                                <Link
                                                    href={route(
                                                        "password.request"
                                                    )}
                                                    className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                >
                                                    Forgot your password?
                                                </Link>
                                            )}

                                            <PrimaryButton
                                                className="ms-4"
                                                disabled={
                                                    spinnerProsesState ==
                                                    "loading"
                                                }
                                            >
                                                {spinnerProsesState ==
                                                "loading" ? (
                                                    <Spinner color="secondary" />
                                                ) : (
                                                    "Log in"
                                                )}
                                            </PrimaryButton>
                                        </div>
                                    </form>
                                )}
                            </Formik>
                        </div>
                        <div className="sm:col-span-2 ms-2 items-center min-h-fit block p-4">
                            <LazyLoad>
                                <div className="h-full py-[32%] sm:py-[30%] bg-[url('/assets/family.png')] bg-no-repeat bg-cover bg-center rounded"></div>
                            </LazyLoad>
                        </div>
                    </div>
                </>
            )}
        </GuestLayout>
    );
}
