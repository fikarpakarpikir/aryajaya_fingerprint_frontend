import { useFaceContext } from "@/context/FaceContext";
import fullDateDiff from "@/Functions/fullDateDiff";
import fullWaktuIndo from "@/Functions/waktuIndo";
import { useEffect } from "react";

export default function usePresensiCheck(presensi) {
    const { setLoading, setMessage, setSubMessage, setNotif, goToHome } =
        useFaceContext();

    useEffect(() => {
        if (!presensi) return;

        const diff = fullDateDiff(presensi.mulai, new Date());
        if (diff.totalMinutes < 10 && diff.isEarly) {
            setLoading(false);
            setMessage("Anda baru saja presensi");
            setSubMessage(
                <>
                    Presensi Anda hari ini telah dilakukan pada: <br />
                    Masuk:
                    <br />
                    <span className="badge bg-primary text-white text-sm font-bold ms-2">
                        {fullWaktuIndo(presensi?.mulai)}
                    </span>
                    <br />
                    Silakan tunggu 10 menit dari waktu presensi masuk untuk
                    pulang
                </>
            );
            setNotif(true);
            goToHome(5000);
        }
    }, [presensi]);
}
