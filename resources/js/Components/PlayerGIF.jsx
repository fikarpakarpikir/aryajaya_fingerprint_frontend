import { DotLottieReact } from "@dotlottie/react";
import { BadgeClass } from "./BadgeClass";

export const PlayerGIFScanning = ({ message, status }) => (
    <>
        <BadgeClass thisStatus={status} message={message} />
        <DotLottieReact
            src={`/GIF/Fingerprint/scanning.lottie`}
            className="mx-auto w-64 h-48 shadow border-primary border-4 rounded-lg"
            loop
            autoplay
        />
    </>
);

export const PlayerGIFLoading = ({ message, status }) => (
    <>
        <BadgeClass thisStatus={status} message={message} />
        <DotLottieReact
            src={`/GIF/Fingerprint/loading.lottie`}
            className="mx-auto w-64 h-48 shadow border-sky-500 border-4 rounded-lg"
            loop
            autoplay
        />
    </>
);

export const PlayerGIFSuccess = ({ message, status }) => (
    <>
        <BadgeClass thisStatus={status} message={message} />
        <DotLottieReact
            src={`/GIF/Fingerprint/success.lottie`}
            className="mx-auto w-64 h-48 shadow border-green-500 border-4 rounded-lg"
            loop
            autoplay
        />
    </>
);

export const PlayerGIFFailed = ({ message, status }) => (
    <>
        <BadgeClass thisStatus={status} message={message} />
        <DotLottieReact
            src={`/GIF/Fingerprint/failed.lottie`}
            className="mx-auto w-64 h-48 shadow border-red-500 border-4 rounded-lg"
            loop
            autoplay
        />
    </>
);

export const PlayerGIFLost = ({ message }) => (
    <>
        <BadgeClass thisStatus={3} message={message} />
        <DotLottieReact
            src={`/GIF/Fingerprint/search_scanner.lottie`}
            className="mx-auto w-64 h-48 shadow border-amber-500 border-4 rounded-lg"
            loop
            autoplay
        />
    </>
);
