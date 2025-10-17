import GuestLayout from "@/Layouts/GuestLayout";
import FaceRecogPage from "./FaceRec";
// import FPScanner from "./FPScanner";
import { RealTimeClock } from "./Clock";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Link, usePage } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { useEffect, useState } from "react";
import {
    faCamera,
    faClipboardQuestion,
    faCompress,
    faExpand,
    faFingerprint,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import Sync from "./Sync";
import FPScannerPage from "./FP";
import { setSync } from "@/redux/slices/syncSlice";
import { HR, Tooltip } from "flowbite-react";

const Presensi = () => {
    const dispatch = useDispatch();
    const { props } = usePage();
    const { last_sync } = props;

    const fullScreenRef = useFullScreenHandle();
    const { processState } = useSelector((state) => state.process.default);

    const [mode, setMode] = useState("fp");
    const listMode = [
        ["fp", faFingerprint, <FPScannerPage />, 1, "Fingerprint"],
        ["face", faCamera, <FaceRecogPage />, 2, "Face ID"],
    ];

    const findMode = listMode.find((item) => item[0] === mode);
    const MainPage = () => {
        return findMode[2];
    };

    useEffect(() => {
        dispatch(
            setSync({
                jenis: "fp",
                status: last_sync?.fp?.status,
                waktu: last_sync?.fp?.finished_at,
            })
        );
        dispatch(
            setSync({
                jenis: "face",
                status: last_sync?.face?.status,
                waktu: last_sync?.face?.finished_at,
            })
        );
    }, []);
    // console.log(findMode[3]);

    return (
        <GuestLayout>
            <FullScreen handle={fullScreenRef}>
                <div className="text-center mx-auto bg-white min-h-[480px]">
                    <div className="absolute left-0 top-0">
                        <Link href="/">
                            <ApplicationLogo className="h-24 fill-current text-gray-500 " />
                        </Link>
                    </div>
                    <span className="bg-primary font-bold text-white rounded-full px-2 py-1">
                        Presensi
                    </span>

                    <div className="absolute bg-white px-3 py-1 border-s-2 border-primary end-0 shadow rounded-s-lg flex flex-col justify-center gap-2">
                        <span className="text-sm font-bold text-neutral-500">
                            Mode
                        </span>
                        {listMode.map((item) => (
                            <button
                                disabled={processState == "loading"}
                                className={`${
                                    mode === item[0]
                                        ? "btn-primary"
                                        : "btn-outline-primary border-0"
                                } p-2 text-2xl w-12`}
                                onClick={() => setMode(item[0])}
                            >
                                <FontAwesomeIcon icon={item[1]} />
                            </button>
                        ))}
                        <div className="flex flex-col justify-center text-center">
                            <HR className="mt-0 mb-2" />

                            <Tooltip
                                content={
                                    fullScreenRef?.active
                                        ? "Kecilkan Layar"
                                        : "Fullscreen"
                                }
                            >
                                <div className="mx-1.5">
                                    {fullScreenRef.active ? (
                                        <button
                                            className="btn btn-secondary inline-flex items-center gap-2 w-full"
                                            onClick={fullScreenRef.exit}
                                        >
                                            <FontAwesomeIcon
                                                icon={faCompress}
                                            />
                                            {/* Exit Fullscreen */}
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-primary inline-flex items-center gap-2 w-full"
                                            onClick={fullScreenRef.enter}
                                        >
                                            <FontAwesomeIcon icon={faExpand} />
                                            {/* Enter Fullscreen */}
                                        </button>
                                    )}
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                    <RealTimeClock />
                    <MainPage />
                    <Sync jenis={findMode?.[3]} title={findMode?.[4]} />
                </div>
            </FullScreen>
        </GuestLayout>
    );
};

export default Presensi;
