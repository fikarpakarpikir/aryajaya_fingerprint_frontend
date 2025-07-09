import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export default forwardRef(function TextInput(
    { type = "text", className = "", isFocused = false, icon = null, ...props },
    ref
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <div className="relative">
            <input
                {...props}
                type={type}
                className={
                    "rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 " +
                    className
                }
                ref={localRef}
            />
            {icon && (
                <label htmlFor={props?.id}>
                    <FontAwesomeIcon
                        icon={icon}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                </label>
            )}
        </div>
    );
});
