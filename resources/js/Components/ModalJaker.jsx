import { isPDF } from "@/Functions/dataSelect";
import { Popover } from "flowbite-react";
import { useState } from "react";
import PreviewDoc from "./PreviewDoc";

export const PopoverJakerOrg = ({ item }) => {
    const [showPopover, setShowPopover] = useState(true);
    const tooglePopover = () => setShowPopover(!showPopover);

    return showPopover ? (
        <Popover
            aria-labelledby={`Detail ${item?.id}`}
            placement="right"
            trigger="hover"
            content={
                <div className="max-w-xs text-sm text-gray-500">
                    <div className="border-b border-gray-100 bg-gray-50 px-3 py-2">
                        <h3
                            id="default-popover"
                            className="font-semibold text-gray-900"
                        >
                            Detail ID #{item?.id}
                        </h3>
                    </div>
                    <div className="px-3 py-2 text-start">
                        <ul className="ps-1 mt-2 space-y-1 list-decimal list-inside">
                            {item.org?.map((item1, i) => (
                                <li key={i}>{item1.nama}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            }
        >
            {/* Wrap trigger elements inside a div */}
            <div
                className="cursor-pointer text-primary"
                onClick={tooglePopover}
            >
                {item?.org?.length} orang
            </div>
        </Popover>
    ) : (
        <ul
            className="cursor-pointer hover:text-primary ps-1 mt-2 space-y-1 list-decimal list-inside"
            onClick={tooglePopover}
        >
            {item.org?.map((item1, i) => (
                <li key={i}>{item1.nama}</li>
            ))}
        </ul>
    );
};
export const PopoverJaker = ({ item }) => {
    const [showPopover, setShowPopover] = useState(true);
    const tooglePopover = () => setShowPopover(!showPopover);
    return showPopover ? (
        <Popover
            aria-labelledby={`Detail ${item?.id}`}
            placement="right"
            trigger="hover"
            content={
                <div className="max-w-xs text-sm text-gray-500">
                    <div className="border-b border-gray-100 bg-gray-50 px-3 py-2">
                        <h3
                            id="default-popover"
                            className="font-semibold text-gray-900"
                        >
                            Detail ID #{item?.id}
                        </h3>
                    </div>
                    <div className="px-3 py-2">
                        <p className="break-words whitespace-normal">
                            {item?.keterangan}
                        </p>
                    </div>
                </div>
            }
        >
            {/* Wrap trigger elements inside a div */}
            <div className="cursor-pointer" onClick={tooglePopover}>
                {item?.keterangan?.substring(0, 30)}...{" "}
                <span className="text-primary">more</span>
            </div>
        </Popover>
    ) : (
        <p
            className="cursor-pointer hover:text-primary break-words whitespace-normal"
            onClick={tooglePopover}
        >
            {item?.keterangan}
        </p>
    );
};
const ModalJaker = ({ show, handleClose, item }) => {
    const filePath = "/assets/absen/";
    const file = item?.keterangan;
    const fileUrl = file ? `${filePath}${file}` : null;
    const thisIsPDF = fileUrl && isPDF(file);

    return (
        <PreviewDoc
            show={show}
            handleClose={handleClose}
            item={item}
            size={thisIsPDF ? "xl" : "md"}
        />
    );
};

export default ModalJaker;
