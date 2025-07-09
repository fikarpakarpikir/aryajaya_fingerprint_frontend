import Clock from "@/Functions/clock";
import { hariIndo, jamIndo, tanggalIndo } from "@/Functions/waktuIndo";

export const RealTimeClock = () => {
    const waktuSekarang = Clock();
    return (
        <div className="bg-white grid grid-cols-2 border-x-2 border-primary m-2 p-4 rounded-lg xl:w-1/4 lg:-1/4 md:w-2/3 sm:w-1/2 w-full mx-auto items-center">
            <div className="text-end p-1 pe-3">
                <span className="font-bold text-lg">
                    {hariIndo(waktuSekarang)},
                </span>
                <br />
                <span className="font-bold fs-6">
                    {tanggalIndo(waktuSekarang)}
                </span>
            </div>
            <div className="py-4 ps-2 text-start bg-primary text-lg font-bold text-white rounded-e-lg rounded-s-md">
                <span className="mt-2">{jamIndo(waktuSekarang)}</span>
            </div>
        </div>
    );
};
