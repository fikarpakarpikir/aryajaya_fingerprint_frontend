import { PlayerGIFLost, RenderPlayerGIF } from "@/Components/PlayerGIF";
import { useFPContext } from "@/context/FPContext";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { panggilanKaryawan } from "@/utils/fpUtils";

export default function Presensi() {
    const { props } = usePage();

    const {
        getMessage,
        message,
        activeFP,
        countdownScanning,
        status,
        listKaryawans,
        getFitur,
    } = useFPContext();

    const { urlScanner } = useSelector((state) => state.fingerprints);

    const [karyawan, setKaryawan] = useState(null);
    const [fotoProfil, setFotoProfil] = useState(null);

    const findKaryawan = (newData) => {
        // console.log(newData);
        const kar = listKaryawans?.find(
            (item) => item.id == newData.id_karyawan
        );
        // console.log(kar?.dokumen);

        fetchFotoProfil(kar?.dokumen?.[0]?.file);
        setKaryawan({
            nama: kar?.nama,
            panggilan: panggilanKaryawan(kar?.nama),
            newData,
        });
        // return { nama: kar.nama, panggilan: panggilanKaryawan(kar.nama), kar };
    };

    const fetchFotoProfil = (file_path) => {
        setFotoProfil(null);
        try {
            setFotoProfil(`/assets/foto_profil/${file_path}`);
        } catch (error) {
            console.error("Error loading image:", error);
        }
    };
    return (
        <div className="relative ">
            <>
                {karyawan && (
                    <>
                        <div className="absolute left-0 -translate-x-24 -translate-y-12 bg-white w-[450px] h-[450px] border border-gray-100 rounded-full shadow-lg z-0">
                            <div className="border-4 border-white p-3 bg-white rounded-full shadow">
                                {fotoProfil ? (
                                    <img
                                        src={fotoProfil}
                                        className="rounded-full cover  w-[440px] h-[440px]"
                                        alt="..."
                                    />
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faImagePortrait}
                                        style={{
                                            fontSize: 400,
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col justify-start text-start ml-40 mt-12">
                            <div
                                className="p-2 mx-auto z-20"
                                style={{ maxWidth: 500 }}
                            >
                                <div className="z-20">
                                    <div className="card-body text-start">
                                        <span className="text-xl font-bold">
                                            {karyawan?.nama}
                                        </span>
                                        <p className="flex flex-col gap-2 mt-2">
                                            <div>
                                                <span className="border-r-4 border-tertiary font-bold px-6 py-1 me-4 rounded-lg">
                                                    Masuk:
                                                </span>
                                                {fullWaktuIndo(
                                                    karyawan?.newData?.mulai
                                                )}
                                            </div>
                                            <div>
                                                <span className="border-r-4 border-tertiary font-bold px-6 py-1 me-4 rounded-lg">
                                                    Pulang:
                                                </span>
                                                {karyawan?.newData?.selesai
                                                    ? fullWaktuIndo(
                                                          karyawan?.newData
                                                              ?.selesai
                                                      )
                                                    : "-"}
                                            </div>
                                        </p>
                                        {/* <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p> */}
                                    </div>
                                </div>
                            </div>
                            <div className="w-full ml-12">
                                <BadgeClass
                                    thisStatus={status}
                                    message={message}
                                />
                            </div>
                        </div>
                        <div className="absolute top-10 end-10 w-10">
                            <span>Berikutnya</span>
                            <DotLottieReact
                                src={`/GIF/Fingerprint/scanning.lottie`}
                                className="w-24 h-24 shadow border-primary border-2 rounded-full"
                                loop
                                autoplay
                                style={{
                                    height: 10,
                                    width: 10,
                                }}
                            />
                        </div>
                    </>
                )}
                {countdownScanning <= 0 && (
                    <>
                        <div className="col-12 mt-3 d-flex">
                            <button
                                type="button"
                                className="btn btn-primary mx-auto"
                                onClick={() => getFitur(1)}
                            >
                                Scan
                            </button>
                        </div>
                    </>
                )}
                {!karyawan && (
                    <div className="w-30 h-25 mx-auto text-wrap">
                        {<RenderPlayerGIF status={status} message={message} />}
                    </div>
                )}
            </>
        </div>
    );
}
