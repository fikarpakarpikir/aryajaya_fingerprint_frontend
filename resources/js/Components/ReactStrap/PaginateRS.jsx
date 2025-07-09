import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const PaginateRS = ({ data, perPage = 5, children, colSpan = 5 }) => {
    // Set how many items you want per page
    const itemsPerPage = perPage;

    // Set the current page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the total number of pages
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Get the items for the current page
    const currentData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Function to go to the next page
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Function to go to the previous page
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <>
            {children(currentData)}
            <tr>
                <td colSpan={colSpan}>
                    {currentPage > 1 && (
                        <button
                            className="btn btn-info text-md rounded-pill px-2 py-1 m-2"
                            onClick={prevPage}
                            disabled={currentPage === 1}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                    )}
                    <span>
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        className="btn btn-info text-md rounded-pill px-2 py-1 m-2"
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </td>
            </tr>
        </>
    );
};

export default PaginateRS;
