import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import ButtonGroupRS, { ButtonRadioRS } from "./Button";
import SpinnerProses from "./SpinnerProses";
import { getObjectValue } from "@/Functions/dataSelect";
import sendDataGeneral from "@/Functions/sendDataGeneral";
import { useSelector } from "react-redux";
import { spinnerProsesStateReducer } from "@/redux/slices/SpinnerProsesStateSlice";

const FileUpload = (props) => {
    const listMedia = [
        { id: 1, title: "gForm", target: "email", source: "bio.akun.email" },
        {
            id: 2,
            title: "Quizziz",
            target: "First Name",
            source: "bio.panggilan",
        },
    ];

    const { spinnerProsesState } = useSelector(
        (state) => state.spinnerProsesState
    );

    const [activeMedia, setActiveMedia] = useState(null);
    const [fileData, setFileData] = useState(null);

    const [loading, setLoading] = useState(false);

    const onDrop = (acceptedFiles) => {
        setLoading(true);
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[1];
            const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            // Extract First Name and Score columns
            const extractedData = sheet.map(
                (row) => {
                    const player = props.peserta?.find(
                        (items) =>
                            getObjectValue(items, activeMedia.source) ===
                            row[activeMedia.target]
                    );
                    // if (player) {
                    return {
                        player_id: player?.id, // No need for optional chaining, since player is defined here
                        target: row[activeMedia.target],
                        score: Math.round(
                            row["Score"] / (activeMedia.id === 1 ? 1 : 50)
                        ),
                    };
                }
                // return null; // Return null if no player is found
            );
            // .filter(Boolean); // Remove null or undefined values from the final array
            // console.log("====================================");
            // console.log(extractedData);
            // console.log("====================================");
            setFileData(extractedData);
            // onUpload(extractedData);
        };

        reader.readAsBinaryString(file);
        setLoading(false);
    };

    const handleUpload = async () => {
        setLoading(true);
        const form = new FormData();
        fileData
            .filter((item) => item.player_id && item.player_id > 0)
            .forEach((item) => {
                form.append("point_id", props.pointId);
                form.append("player_id[]", item.player_id);
                form.append("score[]", item.score);
            });
        await sendDataGeneral({
            data: form,
            route: route("Nilai.sync"),
            prosesReducer: spinnerProsesStateReducer,
        });
        setFileData(null);
        setLoading(false);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className="file-upload">
            <SpinnerProses data={spinnerProsesState} />
            {fileData ? (
                <div>
                    <h3>Preview data dari {activeMedia?.title}:</h3>
                    {/* <pre>{JSON.stringify(fileData, null, 2)}</pre> */}
                    {loading ? (
                        <SpinnerProses data={"loading"} />
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <td>Data Sama</td>
                                            <td>Nama</td>
                                            <td>Nilai</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fileData.map((item, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>
                                                        {item.player_id ? (
                                                            <i className="fa-solid fa-check text-success"></i>
                                                        ) : (
                                                            <i className="fa-solid fa-xmark text-danger"></i>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {item.target ?? (
                                                            <i className="fa-solid fa-xmark text-danger"></i>
                                                        )}
                                                    </td>
                                                    <td>{item.score}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <button
                                className="btn btn-warning me-auto"
                                onClick={() => setFileData(null)}
                            >
                                Ulangi
                            </button>
                            <button
                                className="btn btn-success"
                                onClick={handleUpload}
                            >
                                Sync
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <>
                    <ButtonGroupRS label={"Pilih Sumber Media Test"}>
                        {listMedia.map((item, i) => (
                            <ButtonRadioRS
                                className={"outline-info"}
                                key={i}
                                name={"media"}
                                id={item.title}
                                value={item.id}
                                label={item.title}
                                checked={activeMedia?.title === item.title}
                                // checked={true}
                                handle={() => {
                                    setActiveMedia(item);
                                }}
                            />
                        ))}
                    </ButtonGroupRS>
                    {activeMedia && (
                        <>
                            <input {...getInputProps()} />
                            <p className="rounded p-2 border border-white text-white">
                                Drag 'n' drop a file here, or click to select a
                                file. Format acceptable: .xlsx, .csv
                                <br />
                                <button className="btn btn-white">
                                    Choose File
                                </button>
                            </p>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default FileUpload;
