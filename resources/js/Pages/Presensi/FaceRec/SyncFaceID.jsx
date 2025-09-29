import ProgressBarFR from "@/Components/ProgressBar";
import fullWaktuIndo from "@/Functions/waktuIndo";
import useSyncing from "@/hooks/useSyncing";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { faCheckCircle, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const SyncFaceID = () => {
    const { loading, progress, syncing, msg, syncingData, hasClicked } =
        useSyncing();
    // useEffect(() => {
    //     console.log(window.Echo.channel("syncProgress"));

    //     window.Echo.channel("syncProgress").listen(
    //         ".SyncProgressEvent",
    //         (e) => {
    //             console.log("Progress event:", e);
    //             const { done, total } = e.progress;
    //             const percent =
    //                 total > 0 ? Math.round((done / total) * 100) : 0;
    //             // setProgress(percent);
    //         }
    //     );
    //     window.Echo.channel("sync-progress").listen(
    //         "SyncProgressEvent",
    //         (e) => {
    //             console.log("Progress event:", e);
    //             const { done, total } = e.progress;
    //             const percent =
    //                 total > 0 ? Math.round((done / total) * 100) : 0;
    //             // setProgress(percent);
    //         }
    //     );
    // }, []);

    const IconState = () => {
        switch (hasClicked) {
            case "loading":
                return <FontAwesomeIcon color="primary" icon={faSync} spin />;
            case "success":
                return <FontAwesomeIcon color="green" icon={faCheckCircle} />;
                // return <FontAwesomeIcon color="red" icon={faXmarkCircle} />;
                break;

            default:
                break;
        }
    };
    return (
        <div className="absolute end-4 bottom-4 flex items-center gap-2">
            {loading ? (
                <>
                    <ProgressBarFR
                        label={msg}
                        width="w-72"
                        progress={progress}
                        color="gray-600"
                        size="sm"
                    />
                </>
            ) : (
                <>
                    <div className="text-end text-sm text-gray-500">
                        <IconState />
                        <span className="font-semibold">
                            Terakhir Sinkronisasi Face ID:
                        </span>
                        <br />
                        {fullWaktuIndo()}
                        <br />
                        {msg && <span>{msg}</span>}
                    </div>
                    <button
                        onClick={() => syncingData(2)}
                        className="btn-primary rounded-full text-xs"
                    >
                        <FontAwesomeIcon icon={faSync} className="me-0" />
                        {/* Update Face ID */}
                    </button>
                </>
            )}
        </div>
    );
};

export default SyncFaceID;
