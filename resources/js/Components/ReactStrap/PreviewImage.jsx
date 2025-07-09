import { useEffect, useState } from "react";
import ModalStatic from "./ModalStatic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { LazyLoadImage } from "react-lazy-load-image-component";

const PreviewImage = ({
    src,
    litleIcon = false,
    width = "max-w-full",
    height = "h-full",
}) => {
    const [showPreview, setShowPreview] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        setIsLoaded(false);
    }, [src]);
    return (
        <>
            <div
                className={`rounded-full max-h-full ${
                    litleIcon ? "" : "p-1 mt-n7 border-gray-100 border-4"
                } text-center mx-auto max-w-36 max-h-36`}
            >
                {!isLoaded && (
                    <FontAwesomeIcon
                        icon={faCircleUser}
                        className={`cursor-pointer mt-n7 border-gray-100 ${
                            litleIcon ? "text-5xl" : "text-9xl"
                        }`}
                    />
                )}
                <LazyLoadImage
                    src={src}
                    alt={`profile ${src}`}
                    className={`rounded-full ${width} ${height} border-3 shadow-xs object-cover ${
                        !isLoaded ? "hidden" : ""
                    }`}
                    onClick={() => setShowPreview(!showPreview)}
                    onLoad={() => setIsLoaded(true)}
                />
            </div>
            {isLoaded && (
                <ModalStatic
                    show={showPreview}
                    handleClose={() => setShowPreview(!showPreview)}
                    title={`Preview`}
                >
                    <LazyLoadImage
                        src={src ?? "http://placehold.it/150"}
                        alt={`preview ${src}`}
                        className="img-thumbnail mx-auto rounded-lg"
                    />
                </ModalStatic>
            )}
        </>
    );
};

export default PreviewImage;
