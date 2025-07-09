import React from "react";
import InputLabel from "../InputLabel";

const SelectRS = ({
    className = "w-full",
    label = null,
    id = "",
    data,
    name = "",
    error = null,
    touched = null,
    handleChange = () => {},
    handleBlur = () => {},
    values,
    placeholder = "",
}) => {
    return (
        <>
            <div className={className}>
                {label && (
                    <InputLabel
                        htmlFor={id}
                        value={label}
                        className="font-bold text-sm md:text-lg"
                    >
                        {label}
                    </InputLabel>
                )}
                <select
                    name={name}
                    id={id}
                    className={`w-full rounded form-select mt-1 ${
                        error && "is-invalid"
                    }`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values}
                >
                    <option value="">{placeholder}</option>
                    {data?.length > 0 &&
                        data.map((item, index) => (
                            <option
                                value={item.id ? item.id : item.value}
                                key={index}
                            >
                                {item.title ? item.title : item.label}
                            </option>
                        ))}
                </select>

                {error && touched && (
                    <div className="invalid-feedback text-red-600">{error}</div>
                )}
            </div>
        </>
    );
};

export default SelectRS;
