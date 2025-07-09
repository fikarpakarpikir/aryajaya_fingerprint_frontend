const ProgressBarFR = ({ label = null, progress }) => {
    return (
        <div className="my-2">
            <div className="flex justify-between mb-1">
                {label && (
                    <span className="text-base font-medium text-blue-700 dark:text-white">
                        {label}
                    </span>
                )}
                <span className="text-sm font-medium text-blue-700 dark:text-white">
                    {progress}%
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                        width: `${progress * 0.9}%`,
                    }}
                ></div>
            </div>

            {/* <FileProgress progress={progress} /> */}
        </div>
    );
};

export default ProgressBarFR;
