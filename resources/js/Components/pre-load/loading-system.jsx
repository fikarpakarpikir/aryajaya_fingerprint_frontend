import { Spinner } from "flowbite-react";
import React from "react";

function LoadingSystem() {
    return (
        <>
            <div className="bg-white rounded-lg shadow-lg md:w-1/2 w-full mx-auto my-3">
                <div className=" text-center mt-4">
                    <Spinner size="xl" />
                    <br />
                    <span className="fw-bold">
                        Silakan tunggu sistem sedang menyambungkan dengan kamera
                        perangkat anda
                    </span>
                </div>
            </div>
        </>
    );
}

export default LoadingSystem;
