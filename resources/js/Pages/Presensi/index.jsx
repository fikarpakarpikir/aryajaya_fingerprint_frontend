import GuestLayout from "@/Layouts/GuestLayout";
import FaceRecogPage from "./FaceRec";
import FPScanner from "./FPScanner";
import { RealTimeClock } from "./Clock";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Link } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";

const Presensi = () => {
    const fullScreenRef = useFullScreenHandle();
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
                    <RealTimeClock />
                    <FaceRecogPage />
                    <FPScanner />
                </div>
            </FullScreen>
        </GuestLayout>
    );
};

export default Presensi;
