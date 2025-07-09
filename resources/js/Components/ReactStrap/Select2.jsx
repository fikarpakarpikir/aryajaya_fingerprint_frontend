import React from "react";
import ReactSelect from "react-select";
import InputError from "../InputError";
import InputLabel from "../InputLabel";

const Select2RS = ({
    className = "",
    label,
    id,
    isMulti = false,
    data,
    name,
    error = null,
    touched = null,
    handleChange = () => {},
    handleBlur = () => {},
    values = [],
    placeholder = "",
    chooseAll = false,
}) => {
    const choices = chooseAll
        ? [
              {
                  label: "Pilih Semua",
                  value: "all",
              },
              ...data,
          ]
        : data;
    return (
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
            <ReactSelect
                isMulti={isMulti}
                name={name}
                id={id}
                options={choices}
                className="basic-multi-select rounded-3 border border-dark w-full mt-1"
                classNamePrefix={name}
                onChange={(val) => {
                    if (isMulti) {
                        const selectedAll = val
                            ?.map((item) => item.value)
                            .includes("all");

                        if (selectedAll) {
                            handleChange(data);
                        } else {
                            handleChange(val);
                        }
                    } else {
                        handleChange(val);
                    }
                }}
                onBlur={handleBlur}
                value={
                    isMulti
                        ? data?.filter((option) =>
                              values?.includes(option.value)
                          ) // For multi-select
                        : data.find((option) => option.value === values) // For single-select
                }
                placeholder={placeholder}
            />

            {(error || touched) && (
                <InputError message={error || touched} className="mt-2" />
                // <div className="invalid-feedback font-red-800">{error}</div>
            )}
        </div>
    );
};

export default Select2RS;
