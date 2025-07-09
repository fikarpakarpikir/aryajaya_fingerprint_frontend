// SelectField.js
import React from "react";
import Select from "react-select";

const SelectField = ({ field, form, options, isClearable, ...props }) => {
    const handleChange = (selectedOption) => {
        form.setFieldValue(field.name, selectedOption.value);
    };

    const handleBlur = () => {
        form.setFieldTouched(field.name, true);
    };
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: "black", // Set the text color to black
        }),
    };
    return (
        <Select
            {...field}
            {...props}
            options={options}
            onChange={handleChange}
            onBlur={handleBlur}
            styles={customStyles}
            isClearable={isClearable}
        />
    );
};

export default SelectField;
