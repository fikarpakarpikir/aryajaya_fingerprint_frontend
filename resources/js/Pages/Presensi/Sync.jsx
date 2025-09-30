import ProgressBarFR from "@/Components/ProgressBar";
import fullWaktuIndo from "@/Functions/waktuIndo";
import useSyncing from "@/hooks/useSyncing";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { faCheckCircle, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Sync = ({ jenis, title }) => {
    const { loading, progress, syncing, msg, syncingData, hasClicked } =
        useSyncing();
    const { processState, message } = useSelector(
        (state) => state.process.default
    );

    const newMsg = msg || message;

    const IconState = () => {
        switch (processState) {
            case "loading":
                return <FontAwesomeIcon color="primary" icon={faSync} spin />;
            case "success":
                return <FontAwesomeIcon color="green" icon={faCheckCircle} />;
            case "failed":
                return <FontAwesomeIcon color="red" icon={faXmarkCircle} />;
            default:
                return null;
        }
    };
    return (
        <div className="absolute end-4 bottom-4 flex items-center gap-2">
            {processState == "loading" ? (
                <>
                    <ProgressBarFR
                        label={newMsg}
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
                            Terakhir Sinkronisasi {title}:
                        </span>
                        <br />
                        {fullWaktuIndo()}
                        <br />
                        {newMsg && (
                            <span className="text-yellow-400">{newMsg}</span>
                        )}
                    </div>
                    <button
                        onClick={() => syncingData(jenis)}
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

export default Sync;
