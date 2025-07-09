import { Spinner } from "flowbite-react";
import ModalStatic from "./ModalStatic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheckCircle,
    faXmarkCircle,
} from "@fortawesome/free-regular-svg-icons";

const ModalProcess = ({ show, handleClose, status, messageFailed = "" }) => {
    const statusModal = (status) => {
        let title = "";
        let content = "";
        let button = false;

        // Determine title and content based on status
        switch (status) {
            case "loading":
                title = "Loading";
                content = (
                    <div className="loader mx-auto text-center">
                        <Spinner className="h-10 w-10" />
                    </div>
                );
                break;
            case "success":
                title = "Berhasil";
                content = (
                    <div className="mx-auto text-center text-success text-lg">
                        <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-5xl"
                        />

                        <div className="">Berhasil</div>
                    </div>
                );
                button = true;
                break;
            case "failed":
                title = "Gagal Diproses";
                content = (
                    <div className="mx-auto text-center text-danger text-lg">
                        <FontAwesomeIcon
                            icon={faXmarkCircle}
                            className="text-5xl"
                        />
                        <div className="">{messageFailed}</div>
                    </div>
                );
                button = true;
                break;
            default:
                title = "";
                content = "";
                button = true;
        }
        // console.log(title, content);
        return { title, content, button };
    };
    return (
        <ModalStatic
            show={show}
            handleClose={handleClose}
            keyboard={false}
            title={statusModal(status).title}
            buttonShow={statusModal(status).button} // Show buttons for success and failed, not for loading
        >
            {statusModal(status).content}
        </ModalStatic>
    );
};
export default ModalProcess;
