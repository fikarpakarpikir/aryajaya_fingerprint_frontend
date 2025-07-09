import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBackwardFast,
    faCaretLeft,
    faCaretRight,
    faForwardFast,
} from "@fortawesome/free-solid-svg-icons";

export default function PaginateTanstack({ table }) {
    const BtnNav = ({ icon, onClick, disabled = false }) => {
        return (
            <button
                className="btn-outline-primary border p-1"
                onClick={onClick}
                disabled={disabled}
            >
                <FontAwesomeIcon icon={icon} />
            </button>
        );
    };
    return (
        <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-center p-2 border-b border-primary gap-1">
                <BtnNav
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                    icon={faBackwardFast}
                />
                <BtnNav
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    icon={faCaretLeft}
                />
                <span className="flex items-center gap-1 rounded border border-primary text-neutral-500 px-2">
                    <strong>{table.getState().pagination.pageIndex + 1}</strong>
                    dari
                    <strong>{table.getPageCount().toLocaleString()}</strong>
                </span>
                <BtnNav
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    icon={faCaretRight}
                />
                <BtnNav
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                    icon={faForwardFast}
                />
            </div>

            <div className="md:flex justify-between items-center text-gray-600">
                <div className="flex justify-between items-center my-3 text-gray-600">
                    <select
                        className="rounded border-primary py-1"
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                        Cari di halaman:
                        <input
                            type="number"
                            min="1"
                            max={table.getPageCount()}
                            defaultValue={
                                table.getState().pagination.pageIndex + 1
                            }
                            onChange={(e) => {
                                const page = e.target.value
                                    ? Number(e.target.value) - 1
                                    : 0;
                                table.setPageIndex(page);
                            }}
                            className="border border-primary p-1 rounded w-16"
                        />
                    </span>
                </div>
                <div>Hasil: {table.getRowCount().toLocaleString()} Rows</div>
            </div>
        </div>
    );
}
