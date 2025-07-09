import { Spinner } from "flowbite-react";

export default function ButtonGroupRS({
    className = "col-md-6 col-3",
    value,
    id,
    error,
    touched,
    label,
    children,
    ...props
}) {
    return (
        <div className={className}>
            <span>{label}</span>
            <br />
            <div className="btn-group" role="group">
                {children}
            </div>
            {error && touched && (
                <div className="invalid-feedback d-block">{error}</div>
            )}
        </div>
    );
}

export const ButtonRadioRS = ({
    className,
    name,
    id,
    value,
    label,
    checked = false,
    autocomplete = "off",
    handle = () => {},
}) => {
    return (
        <>
            <input
                type="radio"
                className="hidden peer"
                name={name}
                id={id}
                autoComplete={autocomplete}
                value={value}
                checked={Boolean(checked)}
                onChange={handle}
            />
            <label
                className={`btn m-0 px-3 py-2 cursor-pointer btn-${className}`}
                htmlFor={id}
            >
                {label}
            </label>
        </>
    );
};
export const ButtonSwitchRS = ({
    handle = () => {},
    id,
    name,
    error,
    touched,
    value = 0,
    label = null,
    checked = false,
    autocomplete = "off",
}) => {
    return (
        <>
            <div className="form-check form-switch">
                <input
                    className="form-check-input"
                    name={name}
                    id={id}
                    type="checkbox"
                    role="switch"
                    value={value ? 1 : 0}
                    checked={checked} // Use the "checked" prop directly
                    onChange={handle}
                />
                {label && (
                    <label className="form-check-label" htmlFor={id}>
                        {label}
                    </label>
                )}
            </div>

            {error && touched && (
                <div className="invalid-feedback d-block">{error}</div>
            )}
        </>
    );
};
export const ButtonCheckRS = ({
    handle = () => {},
    id,
    name,
    error,
    touched,
    value = 0,
    label = null,
    checked = false,
    autocomplete = "off",
}) => {
    return (
        <>
            <div className="form-check form-switch">
                <input
                    className="form-check-input"
                    name={name}
                    id={id}
                    type="checkbox"
                    role="switch"
                    value={value ? 1 : 0}
                    checked={checked} // Use the "checked" prop directly
                    onChange={handle}
                />
                {label && (
                    <label className="form-check-label" htmlFor={id}>
                        {label}
                    </label>
                )}
            </div>

            {error && touched && (
                <div className="invalid-feedback d-block">{error}</div>
            )}
        </>
    );
};
export const ButtonCheckCardRS = ({
    handle = () => {},
    id,
    name,
    title,
    error,
    touched,
    value = 0,
    label = null,
    checked = false,
    autocomplete = "off",
    classButton = "outline-success",
}) => {
    return (
        <>
            <div className="d-flex ms-n4 my-1">
                <div className="form-check form-switch">
                    <input
                        type="radio"
                        className={`btn-check btn-${classButton}`}
                        name={name}
                        id={id}
                        autoComplete={autocomplete}
                        value={value}
                        checked={checked}
                        onChange={handle}
                    />
                    <label
                        className={`btn m-0 px-3 py-1 btn-${
                            value ? "success" : "outline-success"
                        }`}
                        htmlFor={id}
                    >
                        {label}
                    </label>
                </div>

                <label
                    htmlFor={id}
                    className={`btn ps-3 m-0 ms-1 py-1 ${
                        value
                            ? "bg-gradient-success text-white fw-bold pe-5 rounded-end-pill"
                            : "bg-white"
                    }`}
                >
                    {title}
                </label>
            </div>

            {error && touched && (
                <div className="invalid-feedback d-block">{error}</div>
            )}
        </>
    );
};

export const ButtonSubmit = ({
    text = "Save",
    handleCancel,
    showCancel = false,
    isSubmitting = false,
}) => {
    return (
        <div className="flex justify-end items-center gap-4 mt-5">
            {showCancel && (
                <button
                    onClick={handleCancel}
                    type="button"
                    className="btn-outline-secondary"
                >
                    Batal
                </button>
            )}
            <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
            >
                {isSubmitting ? <Spinner /> : text}
            </button>
        </div>
    );
};
