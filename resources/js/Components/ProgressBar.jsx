const ProgressBarFR = ({
    progress,
    label = null,
    color = "blue-700",
    width = "full",
    size = "base",
}) => {
    const colorText = `text-${color}`;
    const colorBg = `bg-${color}`;
    const textSize = `text-${size}`;
    return (
        <div className={`${width} flex flex-col my-2`}>
            <div className="flex justify-between mb-1">
                {label && (
                    <span
                        className={`${textSize} font-medium ${colorText} dark:text-white`}
                    >
                        {label}
                    </span>
                )}
                <span
                    className={`text-sm font-medium ${colorText} dark:text-white`}
                >
                    {progress}%
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                    className={`${colorBg} transition-all duration-300 ease-out h-2.5 rounded-full`}
                    style={{
                        width: `${progress}%`,
                    }}
                ></div>
            </div>

            {/* <FileProgress progress={progress} /> */}
        </div>
    );
};

export default ProgressBarFR;
