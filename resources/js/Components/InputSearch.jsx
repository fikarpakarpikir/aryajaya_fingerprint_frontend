import { faSearch, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const InputSearch = ({
    width = "w-80",
    placeholder,
    handleChange,
    handleNull,
}) => {
    const [keyword, setKeyword] = useState("");
    return (
        <>
            <label htmlFor="table-search" className="sr-only">
                Search
            </label>
            <div className={`${width} relative mt-1`}>
                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                    <FontAwesomeIcon
                        icon={faSearch}
                        className="text-gray-400"
                    />
                </div>
                <input
                    type="text"
                    id="table-search"
                    className={`${width} block ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-blue-500 focus:border-blue-500 `}
                    placeholder={placeholder}
                    onChange={(e) => {
                        handleChange(e);
                        setKeyword(e.target.value);
                    }}
                    value={keyword}
                />
                {keyword && (
                    <button
                        className="absolute inset-y-0 rtl:inset-r-0 right-5 flex items-center ps-3"
                        onClick={() => {
                            handleNull();
                            setKeyword("");
                        }}
                    >
                        <FontAwesomeIcon
                            icon={faXmarkCircle}
                            className="text-gray-400"
                        />
                    </button>
                )}
            </div>
        </>
    );
};

export default InputSearch;
