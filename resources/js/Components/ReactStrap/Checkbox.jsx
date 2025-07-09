export default function CheckboxRS({
    className = "col-md-6 col-3",
    value,
    id,
    error,
    touched,
    label,
    ...props
}) {
    return (
        <div className={`form-check ${className}`}>
            <input
                className="form-check-input"
                type="checkbox"
                value={value}
                id={id}
                {...props}
            />
            <label className="form-check-label" htmlFor={id}>
                {label}
            </label>

            {error && touched && (
                <div className="invalid-feedback d-block">{error}</div>
            )}
        </div>
    );
}
