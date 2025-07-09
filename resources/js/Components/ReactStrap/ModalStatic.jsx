// import { Button, Modal } from "react-bootstrap";

import { Button, Modal } from "flowbite-react";
// import { motion } from "framer-motion";
// import { Modal } from "flowbite-react";
import { motion, AnimatePresence } from "framer-motion";

const ModalStatic = ({
    show,
    handleClose,
    title = "",
    children,
    buttonShow = true,
    position = "center", // Default position
    size = "md", // Default size
}) => {
    // Define position styles dynamically
    const getPositionStyles = () => {
        switch (position) {
            case "top":
                return "items-start";
            case "bottom":
                return "items-end";
            case "left":
                return "justify-start";
            case "right":
                return "justify-end";
            case "center":
            default:
                return "items-center justify-center";
        }
    };

    // Define size styles dynamically
    const getSizeStyles = () => {
        switch (size) {
            case "sm":
                return "max-w-sm"; // Small size
            case "md":
                return "max-w-md"; // Medium size
            case "lg":
                return "max-w-lg"; // Large size
            case "xl":
                return "max-w-2xl"; // Extra Large size
            case "full":
                return "max-w-full w-full h-full"; // Fullscreen modal
            default:
                return `max-w-${size}`; // Custom size (e.g., "max-w-4xl")
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Animated Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={handleClose} // Close modal when clicking outside
                    />

                    {/* Animated Modal Container */}
                    <motion.div
                        className={`fixed inset-0 flex ${getPositionStyles()} z-50`}
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div
                            id="static-modal"
                            data-modal-backdrop="static"
                            tabIndex="-1"
                            aria-hidden
                            className={`relative px-5 pt-4 pb-2 w-full ${getSizeStyles()} max-h-full`}
                        >
                            <div className="relative bg-white rounded-lg shadow-sm max-h-svh flex flex-col">
                                {/* Modal Header */}
                                <div className="sticky top-0 z-10 bg-white px-4 pt-4 pb-2 md:p-5 border-b rounded-t shadow-white shadow-lg border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-semibold text-gray-900">
                                            {typeof title === "function"
                                                ? title()
                                                : title}
                                        </span>
                                        {handleClose && (
                                            <button
                                                type="button"
                                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                                                onClick={handleClose}
                                            >
                                                <svg
                                                    className="w-3 h-3"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 14 14"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                                    />
                                                </svg>
                                                <span className="sr-only">
                                                    Close modal
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Modal Body */}
                                <div className="overflow-y-auto px-4 md:px-5 py-4 md:py-5 space-y-4 text-left flex-1">
                                    {children}
                                </div>

                                {/* Modal Footer (if buttonShow is true) */}
                                {buttonShow && (
                                    <div className="sticky bottom-0 z-10 bg-white px-5 py-3 md:p-5 border-t border-gray-200 text-end rounded-b">
                                        <button
                                            className="btn-secondary ms-auto"
                                            onClick={handleClose}
                                        >
                                            Close
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
{
    /* <Modal
    className={`transition-all delay-700 ease-in-out ${
        show ? "opacity-100" : "opacity-0"
    }`}
    size={size}
    show={true}
    onClose={handleClose}
    position={position}
>
    <Modal.Header className="px-5 pt-4 pb-2">
        {title}
    </Modal.Header>
    <Modal.Body>{children}</Modal.Body>
    {buttonShow && (
        <Modal.Footer className="py-2">
            <button
                className="btn-secondary ms-auto"
                onClick={handleClose}
            >
                Close
            </button>
        </Modal.Footer>
    )}
</Modal> */
}

export const ModalDelete = ({
    show,
    handleClose,
    title = "Hapus",
    handleDelete,
    buttonShow = false,
}) => {
    return (
        <ModalStatic
            show={show}
            handleClose={handleClose}
            title={title}
            buttonShow={buttonShow}
        >
            <div className="text-center">
                <span className="font-semibold">
                    Konfirmasi Penghapusan Data
                </span>
                <div className="flex justify-around mt-6">
                    <button
                        className="btn btn-outline-danger"
                        onClick={() => {
                            handleDelete();
                            // handleClose();
                        }}
                    >
                        Hapus
                    </button>
                    <button
                        className="btn btn-outline-primary2"
                        onClick={handleClose}
                    >
                        Batal
                    </button>
                </div>
            </div>
        </ModalStatic>
    );
};

export default ModalStatic;
