export default function InputLabel({
    value,
    className = "",
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={` ${className} block text-sm font-medium text-gray-700`}
        >
            {value ? value : children}
        </label>
    );
}
