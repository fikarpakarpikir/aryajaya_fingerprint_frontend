import { Tooltip } from "flowbite-react";
import { useState } from "react";

const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

export default capitalizeFirstLetter;

const truncateText = (text, maxLength) => {
    const [long, setLong] = useState(false);
    let renderText;
    if (text.length <= maxLength) {
        renderText = text; // No need to truncate if text is already shorter than maxLength
    } else if (long) {
        renderText = (
            <>
                {text}
                <span
                    className="text-info"
                    onClick={() => setLong(false)}
                    style={{ cursor: "pointer" }}
                >
                    {"<<"}
                </span>
            </>
        );
    } else {
        renderText = (
            <>
                {text.substring(0, maxLength)}...
                <span
                    className="text-info"
                    onClick={() => setLong(true)}
                    style={{ cursor: "pointer" }}
                >
                    read more
                </span>
            </>
        );
    }

    return <div>{renderText}</div>;
};

const CopyToClipboard = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset status setelah 2 detik
        });
    };

    return copied ? (
        <span>Copied!</span>
    ) : (
        <Tooltip className="flex" content="Klik 2 kali untuk copy email">
            <span className="cursor-pointer" onDoubleClick={copy}>
                {text}
            </span>
        </Tooltip>
    );
};

export { truncateText, CopyToClipboard };
