import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Spinner, ToastContainer } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";

const TemplateToast = ({ textColor = "white", handleClose, message, icon }) => {
    return (
        <div
            className="flex items-center w-full max-w-xs p-2 mt-2 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800"
            role="alert"
        >
            <div
                className={`inline-flex items-center justify-center flex-shrink-0 p-1 text-${textColor}-500 rounded-lg dark:text-${textColor}-200`}
            >
                {icon}

                <span className="sr-only">Check icon</span>
            </div>
            <div className={`ms-3 text-sm font-normal text-${textColor}-500`}>
                {message}
            </div>
            <button
                type="button"
                className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                aria-label="Close"
                onClick={handleClose}
            >
                <span className="sr-only">Close</span>
                <FontAwesomeIcon icon={faXmark} />
            </button>
        </div>
    );
};
const ToastRS = ({
    textColor,
    message,
    icon,
    bg = "gray",
    autoHide = false,
    waktu = 5000,
    show,
    handleClose = () => {},
}) => {
    return (
        <ToastContainer
            position="bottom-end"
            className={`m-3 fixed z-30 bg-${textColor}-500 rounded-lg mt-16`}
            // style={{ zIndex: 9999 }}
        >
            <Toast
                bg={bg}
                onClose={handleClose}
                show={show}
                delay={autoHide ? waktu : false}
                autohide={autoHide}
            >
                <TemplateToast
                    bg={bg}
                    textColor={textColor}
                    handleClose={handleClose}
                    message={message}
                    icon={icon}
                />
            </Toast>
        </ToastContainer>
    );
};

export default ToastRS;
