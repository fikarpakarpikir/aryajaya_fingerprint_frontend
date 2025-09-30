export const BadgeClass = ({ thisStatus, message }) => {
    let badgeClass;
    switch (thisStatus) {
        case 1:
        case 2:
            badgeClass = "bg-amber-400";
            break;
        case 3:
            badgeClass = "bg-red-500";
            break;
        case 4:
            badgeClass = "bg-green-500";
            break;
        default:
            badgeClass = "bg-primary";
            break;
    }

    return (
        <div
            className={`rounded-xl mx-auto w-[50%] shadow px-3 py-2 my-1 ${badgeClass} text-white text-sm text-wrap`}
        >
            {message}
        </div>
    );
};
