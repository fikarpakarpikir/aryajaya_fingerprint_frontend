import {
    faCircleCheck,
    faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spinner } from "react-bootstrap";

const SpinnerProses = ({ data }) => {
    let component;
    switch (data) {
        case "loading":
            component = <Spinner animation="border" />;
            break;
        case "success":
            component = (
                <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="fs-3 text-success"
                />
            );
            break;
        case "failed":
            component = (
                <FontAwesomeIcon
                    icon={faCircleXmark}
                    className="fs-3 text-danger"
                />
            );
            break;

        default:
            break;
    }

    return component;
};

export default SpinnerProses;
