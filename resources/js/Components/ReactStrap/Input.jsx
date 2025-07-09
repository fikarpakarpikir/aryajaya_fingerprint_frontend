import React from "react";
import InputLabel from "../InputLabel";
import TextInput from "../TextInput";
import InputError from "../InputError";
import { Textarea as TextareaFR } from "flowbite-react";

const InputRS = ({
    className = "",
    label,
    id,
    type = "text",
    name,
    error = null,
    touched = null,
    handleChange = null,
    handleBlur = null,
    values = null,
    placeholder = "",
    readonly = false,
    isFocused = false,
    accept = null,
    icon = null,
}) => {
    return (
        <div className={className}>
            <InputLabel
                htmlFor={id}
                value={label}
                className="font-bold text-sm md:text-lg"
            >
                {label}
            </InputLabel>
            <TextInput
                id={id}
                type={type}
                name={name}
                value={values}
                className={`mt-1 block w-full p-2 border border-gray-200 ${
                    error && "border-red-300"
                }`}
                autoComplete={name}
                isFocused={isFocused}
                onChange={handleChange}
                placeholder={placeholder}
                readOnly={readonly}
                onBlur={handleBlur}
                accept={accept}
                icon={icon}
            />
            {(error || touched) && (
                <InputError message={error || touched} className="mt-2" />
            )}
        </div>
    );
};

export const Textarea = ({
    className = "max-w-md",
    label,
    id,
    type = "text",
    name,
    error = null,
    touched = null,
    handleChange = null,
    handleBlur = null,
    values = null,
    placeholder = "",
    readonly = false,
    isFocused = false,
    accept = null,
    icon = null,
    required = true,
    rows = 4,
}) => {
    return (
        <div className={className}>
            <InputLabel
                htmlFor={id}
                value={label}
                className="font-bold text-sm md:text-lg"
            >
                {label}
            </InputLabel>
            <TextareaFR
                required={required}
                rows={rows}
                id={id}
                type={type}
                name={name}
                value={values}
                className={`mt-1 block w-full p-2 rounded-lg border ${
                    values ? "bg-white" : ""
                } focus:bg-white border-gray-300 ${error && "border-red-300"}`}
                autoComplete={name}
                isfocused={isFocused.toString()}
                onChange={handleChange}
                placeholder={placeholder}
                readOnly={readonly}
                onBlur={handleBlur}
                accept={accept}
                icon={icon}
            />
            {(error || touched) && (
                <InputError message={error || touched} className="mt-2" />
            )}
        </div>
    );
};

export default InputRS;
