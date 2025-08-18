import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const NotifGeneral = ({ subMessage, message }) => {
    return (
        subMessage != "---" && (
            <>
                <span className="bg-green-500 text-white rounded-full font-bold px-2 py-1">
                    {message}
                </span>
                <p>{subMessage}</p>
                <br />
                <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="fa-flip fa-4x text-success m-2"
                />
            </>
        )
    );
};
