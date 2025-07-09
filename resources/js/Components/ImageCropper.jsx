import { convertBase64ToFile } from "@/Functions/imageCompress";
import { Spinner } from "flowbite-react";
import { useRef, useState } from "react";
import ReactCrop, {
    centerCrop,
    convertToPixelCrop,
    makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export const setCanvasPreview = (image, canvas, crop) => {
    const ctx = canvas?.getContext("2d");
    if (!ctx) {
        throw new Error("No 2D context");
    }

    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";
    ctx.save();

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    ctx.translate(-cropX, -cropY);
    ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
    );

    ctx.restore();
};

export const ImageCropper = ({
    ratio = 1,
    onCropComplete,
    circularCrop = true,
}) => {
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const [imgSrc, setImgSrc] = useState("");
    const [croppedImg, setCroppedImg] = useState("");

    const [crop, setCrop] = useState({
        unit: "%",
        x: 50,
        y: 50,
        width: 100,
        height: 100,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // const ratio = 1;
    const minDimension = 150;

    const onSelectFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // setTimeout(() => setIsLoading(true), 100);
        setIsLoading(true);
        setError("");
        setImgSrc("");
        setCroppedImg("");

        const reader = new FileReader();
        reader.onload = () => {
            const imageElement = new Image();
            const imageUrl = reader.result?.toString() || "";
            imageElement.src = imageUrl;

            imageElement.onload = (e) => {
                if (error) setError("");
                const { naturalWidth, naturalHeight } = e.currentTarget;
                if (
                    naturalHeight < minDimension ||
                    naturalWidth < minDimension
                ) {
                    setError(
                        `Foto harus lebih dari ${minDimension} x ${minDimension} pixels`
                    );
                    setIsLoading(false);
                    return setImgSrc("");
                }
            };
            // setTimeout(() => setIsLoading(false), 200);
            setIsLoading(false);
            setImgSrc(imageUrl);
        };
        reader.readAsDataURL(file);
        // console.log(isLoading);
        // setTimeout(() => setIsLoading(false), 200);
        setIsLoading(false);
    };

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        setIsLoading(true);

        const cropWidthInPercent = (minDimension / width) * 100;
        const initialCrop = makeAspectCrop(
            {
                unit: "%",
                // height: cropWidthInPercent,
                width: cropWidthInPercent,
            },
            ratio,
            width,
            height
        );
        const centeredCrop = centerCrop(initialCrop, width, height);
        setCrop(centeredCrop);
        // setTimeout(() => setIsLoading(false), 50);
        setIsLoading(false);
    };

    const onCropImage = () => {
        if (!imgRef.current || !previewCanvasRef.current) return;
        setIsLoading(true);

        setCanvasPreview(
            imgRef.current,
            previewCanvasRef.current,
            convertToPixelCrop(
                crop,
                imgRef.current.width,
                imgRef.current.height
            )
        );

        setTimeout(() => {
            const dataUrl = previewCanvasRef.current.toDataURL();
            setCroppedImg(dataUrl);
            setIsLoading(false);
        }, 100);
    };

    const resetCropper = () => {
        setImgSrc("");
        setCroppedImg("");
        setCrop({
            unit: "%",
            x: 50,
            y: 50,
            width: 100,
            height: 100,
        });
        setError("");
        setIsLoading(false);

        // Reset file input value
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <>
            <div className="text-center">
                {error && <p className="text-red-500 text-xs">{error}</p>}
                {isLoading && <Spinner size="lg" />}
            </div>
            <label className="mb-5 w-fit">
                <span className="sr-only">Pilih Foto</span>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={onSelectFile}
                    placeholder="Pilih Foto"
                    className="block w-full text-sm border py-2 mb-3 rounded text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-gray-700 file:text-sky-300 hover:file:bg-gray-600"
                />
            </label>
            {imgSrc && !croppedImg && !isLoading && (
                <div className="flex flex-col items-center">
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        circularCrop={circularCrop}
                        keepSelection
                        aspect={ratio}
                        minWidth={minDimension}
                    >
                        <img
                            ref={imgRef}
                            src={imgSrc}
                            alt="Upload"
                            style={{ maxHeight: "70vh" }}
                            onLoad={onImageLoad}
                        />
                    </ReactCrop>

                    <button
                        className="btn-primary mt-3"
                        onClick={onCropImage}
                        disabled={isLoading}
                    >
                        {isLoading ? "Cropping..." : "Crop"}
                    </button>
                </div>
            )}

            <>
                <canvas
                    ref={previewCanvasRef}
                    className={`${
                        isLoading || !croppedImg ? "hidden" : ""
                    } mt-4 h-64 w-64 object-contain mx-auto`}
                />
                {croppedImg && (
                    <div className="text-center mt-3">
                        <button
                            className="btn-tertiary me-2"
                            type="button"
                            onClick={resetCropper}
                        >
                            Ganti Foto
                        </button>
                        <button
                            className="btn-tertiary"
                            type="button"
                            onClick={() => setCroppedImg("")}
                        >
                            Ulangi
                        </button>
                        {onCropComplete && (
                            <button
                                className="btn-primary ms-2"
                                type="button"
                                onClick={() => {
                                    onCropComplete(croppedImg);
                                }}
                            >
                                Ok
                            </button>
                        )}
                    </div>
                )}
            </>
        </>
    );
};
