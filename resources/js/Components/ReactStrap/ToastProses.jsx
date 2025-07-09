import { Spinner } from "react-bootstrap";
import ToastRS from "./Toast";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";

// const ToastProses = ({ data, header }) => {
const ToastProses = ({ handleClose, autoHide = true }) => {
    const { toastState, processMessageFailed } = useSelector(
        (state) => state.process.default
    );

    let textColor, bg, message, icon;
    switch (toastState) {
        case "loading":
            icon = <Spinner />;
            textColor = "gray";
            message = "Loading...";
            bg = "secondary";
            break;
        case "success":
            icon = (
                <FontAwesomeIcon icon={faCheckCircle} className="text-3xl" />
            );
            textColor = "green";
            message = "Berhasil";
            bg = "success";
            break;
        case "failed":
            icon = (
                <FontAwesomeIcon icon={faXmarkCircle} className="text-3xl" />
            );
            textColor = "red";
            message =
                processMessageFailed || "Maaf, proses gagal. Silakan cek lagi";
            bg = "danger";
            break;

        default:
            break;
    }

    return (
        <ToastRS
            textColor={textColor}
            message={message}
            icon={icon}
            bg={bg}
            autoHide={autoHide}
            show={["loading", "success", "failed"].includes(toastState)}
            handleClose={handleClose}
        />
    );
};

export default ToastProses;
