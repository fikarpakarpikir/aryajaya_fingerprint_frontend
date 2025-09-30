import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function NotifMaintenance() {
    return (
        <div className="relative min-h-[480px]">
            <div className="mt-10 text-3xl">
                <span className="badge bg-amber-400 px-4 py-1 text-md font-bold">
                    Mohon Maaf
                </span>
                <br />
                Alat sedang dalam perbaikan
                <DotLottieReact
                    src={`/GIF/Fingerprint/search_scanner.lottie`}
                    className="mx-auto w-64 h-48 shadow border-amber-500 border-4 rounded-lg"
                    loop
                    autoplay
                    style={{
                        height: 10,
                        width: 10,
                    }}
                />
            </div>
        </div>
    );
}
