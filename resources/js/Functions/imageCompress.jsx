import imageCompression from "browser-image-compression";

export const imageCompress = async (
    image,
    maxSizeMB = 1,
    maxWidthOrHeight = 1920
) => {
    const options = {
        maxSizeMB: maxSizeMB,
        maxWidthOrHeight: maxWidthOrHeight,
        useWebWorker: true,
    };

    // console.log(`originalFile size ${image.size / 1024 / 1024} MB`);
    const compressedFile = await imageCompression(image, options);
    // console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`);
    return compressedFile;
};

export const convertBase64ToFile = (base64, fileName = "cropped.png") => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
};
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};
