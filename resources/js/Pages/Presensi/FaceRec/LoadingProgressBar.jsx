import ProgressBarFR from "@/Components/ProgressBar";

export const LoadingProgressBar = ({ progress, message, subMessage }) => {
    return (
        <div
            id="wait"
            className="text-center mx-auto md:w-1/2 w-full bg-white rounded-lg px-3 shadow mb-3 border-primary border-x-2"
        >
            {progress > 0 && progress < 100 ? (
                <ProgressBarFR label={message} progress={progress} />
            ) : (
                <span className="fs-6" id="status_hasil">
                    {message}
                </span>
            )}

            <p>{subMessage}</p>
        </div>
    );
};
