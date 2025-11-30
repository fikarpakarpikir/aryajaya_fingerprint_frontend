import ProgressBarFR from "@/Components/ProgressBar";
import fullWaktuIndo from "@/Functions/waktuIndo";
import useSyncing from "@/hooks/useSyncing";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import {
    faArrowsRotate,
    faCheck,
    faCheckCircle,
    faDownload,
    faExclamationCircle,
    faSync,
    faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Sync = ({ jenis, title }) => {
    const { loading, progress, syncing, msg, syncingData, hasClicked } =
        useSyncing();
    const { processState } = useSelector((state) => state.process.default);
    const { fp, face } = useSelector((state) => state.sync);
    const listState = {
        1: fp,
        2: face,
    };
    const active = listState[jenis];
    const { status, message, waktu, step } = active;
    // const status = "loading";
    const newMsg = msg || message;
    // const showLoading = true;
    const showLoading = status === "loading";

    const IconState = () => {
        switch (status) {
            case "loading":
                return <FontAwesomeIcon color="primary" icon={faSync} spin />;
            case "success not all":
                return (
                    <FontAwesomeIcon
                        color="orange"
                        icon={faExclamationCircle}
                    />
                );
            case "success":
                return <FontAwesomeIcon color="green" icon={faCheckCircle} />;
            case "failed":
                return <FontAwesomeIcon color="red" icon={faXmarkCircle} />;
            default:
                return null;
        }
    };

    const listLabel = [
        { step: 1, label: "Sync Karyawan" },
        { step: 2, label: "Downloading" },
        { step: 3, label: "Migrating" },
    ];
    return (
        <div
            className={`transition-all duration-200 ease-in-out
                ${
                    showLoading
                        ? "absolute inset-0 flex items-center justify-center bg-gray-800/50 backdrop-blur-md z-50"
                        : "absolute left-0 bottom-0"
                }
            `}
            //   className="absolute left-4 bottom-4 flex items-center gap-2"
        >
            <div
                className={`transition-all duration-200 ease-in rounded-lg p-4 flex items-center gap-2
                    ${showLoading ? "bg-white" : "bg-neutral-50/0"}
                `}
            >
                {showLoading ? (
                    <>
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <ol className="flex justify-center items-center w-full">
                                    <li className="flex flex-col items-center text-blue-600 ">
                                        <span className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full lg:h-12 lg:w-12 dark:bg-blue-800 shrink-0">
                                            {step <= 1 ? (
                                                <FontAwesomeIcon
                                                    icon={faUsers}
                                                    bounce
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faCheck}
                                                />
                                            )}
                                        </span>
                                    </li>
                                    <li
                                        className={`flex w-full items-center text-blue-600 dark:text-blue-500 after:content-[''] after:w-full after:h-1 after:border-b ${
                                            step >= 2
                                                ? "after:border-blue-100"
                                                : "after:border-gray-100"
                                        } after:border-4 after:inline-block`}
                                    ></li>
                                    <li className="flex flex-col items-center">
                                        <span className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0">
                                            {step <= 2 ? (
                                                <FontAwesomeIcon
                                                    icon={faDownload}
                                                    spin
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faCheck}
                                                />
                                            )}
                                        </span>
                                    </li>
                                    <li
                                        className={`flex w-full items-center text-blue-600 dark:text-blue-500 after:content-[''] after:w-full after:h-1 after:border-b ${
                                            step >= 3
                                                ? "after:border-blue-100"
                                                : "after:border-gray-100"
                                        } after:border-4 after:inline-block`}
                                    ></li>
                                    <li className="flex flex-col items-center">
                                        <span className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full lg:h-12 lg:w-12 dark:bg-gray-700 shrink-0">
                                            {step <= 3 ? (
                                                <FontAwesomeIcon
                                                    icon={faArrowsRotate}
                                                    spin
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faCheck}
                                                />
                                            )}
                                        </span>
                                    </li>
                                </ol>
                                <ol className="flex justify-between items-center w-full">
                                    {listLabel.map((item, i) => (
                                        <li className="flex flex-col items-center">
                                            <span
                                                className={`badge text-xs w-32 ${
                                                    step <= item.step
                                                        ? "bg-gray-100 text-gray-600"
                                                        : "bg-blue-100 text-blue-600"
                                                }`}
                                            >
                                                {item.label}
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            <ProgressBarFR
                                label={newMsg}
                                width="w-[500px]"
                                progress={progress}
                                color="gray-600"
                                size="sm"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => syncingData(jenis)}
                            className="btn-primary rounded-full text-xs"
                        >
                            <FontAwesomeIcon icon={faSync} />
                        </button>
                        <div className="text-start text-sm text-gray-500">
                            <IconState />
                            <span className="font-semibold ml-1">
                                Terakhir Sinkronisasi {title}:
                            </span>
                            <br />
                            {fullWaktuIndo(waktu)}
                            <br />
                            {newMsg && (
                                <span className="text-yellow-400">
                                    {newMsg}
                                </span>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Sync;
