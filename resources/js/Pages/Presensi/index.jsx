import GuestLayout from "@/Layouts/GuestLayout";
import FaceRecogPage from "./FaceRec";
import FPScanner from "./FPScanner";
import { RealTimeClock } from "./Clock";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Link } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { useState } from "react";
import {
    faCamera,
    faClipboardQuestion,
    faFingerprint,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Presensi = () => {
    const fullScreenRef = useFullScreenHandle();

    const [mode, setMode] = useState("face");
    const listMode = [
        ["fp", faFingerprint, <FPScanner />],
        ["face", faCamera, <FaceRecogPage />],
    ];
    const MainPage = () => {
        const findMode = listMode.find((item) => item[0] === mode);
        return findMode[2];
    };
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

                    <div className="absolute bg-white px-3 py-1 border-s-2 border-primary end-0 shadow rounded-s-lg flex gap-2">
                        {listMode.map((item) => (
                            <button
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
                    </div>
                    <RealTimeClock />
                    <MainPage />
                </div>
            </FullScreen>
        </GuestLayout>
    );
};

export default Presensi;
