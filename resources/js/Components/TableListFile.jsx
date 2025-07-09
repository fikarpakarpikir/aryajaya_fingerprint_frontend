import { Checkbox, TabItem, Table, Tabs, Tooltip } from "flowbite-react";
import { useMemo, useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { formatSize } from "@/Functions/fileDetail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBackwardFast,
    faCaretLeft,
    faCaretRight,
    faDownload,
    faEye,
    faFilter,
    faForwardFast,
    faSearch,
    faSortDown,
    faSortUp,
    faTrash,
    faUnsorted,
} from "@fortawesome/free-solid-svg-icons";
import fullWaktuIndo from "@/Functions/waktuIndo";
import PreviewDoc from "@/Components/PreviewDoc";
import RangeDatePicker from "@/Components/RangeDatePicker";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import ModalStatic from "@/Components/ReactStrap/ModalStatic";

const TableListFile = ({ item }) => {
    const { files, folder, title } = item;
    const [confirm, setConfirm] = useState(null);
    const [previewPhoto, setPreviewPhoto] = useState(null);
    const [showFilter, setShowFilter] = useState(null);
    const [checkedItems, setCheckedItems] = useState([]);

    const [filteredData, setFilteredData] = useState(null);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const dataLama = files;
    const dataTable = useMemo(
        () => Object.values(filteredData ?? files),
        [filteredData, files]
    );
    const [sorting, setSorting] = useState([
        { id: "created_at", desc: true }, // default sort
    ]);

    const columns = useMemo(() => {
        const baseColumns = [
            {
                accessorKey: "id",
                id: "id",
                header: "ID",
                cell: ({ row }) => row.original.id,
                sortingFn: "basic", // bisa pakai 'basic' atau custom fn
                enableSorting: true,
            },
            {
                accessorKey: "created_at",
                id: "created_at",
                header: "Waktu Pengunggahan",
                cell: ({ row }) => row.original.created_at,
                sortingFn: (rowA, rowB) =>
                    new Date(rowA.original.created_at) -
                    new Date(rowB.original.created_at),
                enableSorting: true,
            },
        ];

        const pengajuanColumns = [
            {
                accessorFn: (row) => formatSize(row.file_size),
                id: "ukuran",
                header: "Ukuran (MB)",
                cell: ({ row }) => formatSize(row.original.file_size),
                sortingFn: (rowA, rowB) =>
                    rowA.original.file_size - rowB.original.file_size,
                enableSorting: true,
            },
            {
                id: "link",
                header: "Link Lampiran",
                cell: ({ row }) => row.original.file,
            },
        ];

        const lemburColumns = [
            {
                accessorFn: (row) => formatSize(row.foto_awal_size),
                id: "ukuran_awal",
                header: "Ukuran Foto Awal (MB)",
                cell: ({ row }) => formatSize(row.original.foto_awal_size),
                sortingFn: (rowA, rowB) =>
                    rowA.original.foto_awal_size - rowB.original.foto_awal_size,
                enableSorting: true,
            },
            {
                id: "link_awal",
                header: "Link Foto Awal",
                cell: ({ row }) => row.original.foto_awal,
            },
            {
                accessorFn: (row) => formatSize(row.foto_akhir_size),
                id: "ukuran_akhir",
                header: "Ukuran Foto Akhir (MB)",
                cell: ({ row }) => formatSize(row.original.foto_akhir_size),
                sortingFn: (rowA, rowB) =>
                    rowA.original.foto_akhir_size -
                    rowB.original.foto_akhir_size,
                enableSorting: true,
            },
            {
                id: "link_akhir",
                header: "Link Foto Akhir",
                cell: ({ row }) => row.original.foto_akhir,
            },
        ];

        return [
            ...baseColumns,
            ...(title === "Pengajuan" ? pengajuanColumns : []),
            ...(title === "Laporan Lembur" ? lemburColumns : []),
        ];
    }, [title]);

    const table = useReactTable({
        data: dataTable,
        columns,
        filterFns: {},
        state: {
            pagination,
            sorting,
        },
        initialState: {
            sorting: [
                {
                    id: "created_at",
                    desc: true,
                },
            ],
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(), //client side filtering
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
    });

    const toggleCheckbox = (id) => {
        setCheckedItems((prev) =>
            prev.includes(id)
                ? prev.filter((itemId) => itemId !== id)
                : [...prev, id]
        );
    };

    const ButtonPreview = ({ file }) => {
        return (
            <button
                className="btn-primary px-3 py-1"
                onClick={() => {
                    setPreviewPhoto(file);
                    console.log(file);
                }}
            >
                <FontAwesomeIcon icon={faEye} />
            </button>
        );
    };

    const ModalFilter = () => {
        return (
            <ModalStatic
                show={showFilter}
                handleClose={() => setShowFilter(!showFilter)}
                title="Filter File"
                size="lg"
            >
                <Formik
                    initialValues={{
                        mulai: "",
                        selesai: "",
                    }}
                    onSubmit={(val) => {
                        const mulai = new Date(val.mulai);
                        const selesai = new Date(val.selesai);

                        // Normalisasi jam ke 00:00:00 dan 23:59:59 untuk jangkauan penuh
                        mulai.setHours(0, 0, 0, 0);
                        selesai.setHours(23, 59, 59, 999);

                        setFilteredData(
                            files.filter((item) => {
                                const itemDate = new Date(item.created_at);
                                return itemDate >= mulai && itemDate <= selesai;
                            })
                        );
                        setShowFilter(false);
                    }}
                    validationSchema={Yup.object({
                        mulai: Yup.string().required("Harus Diisi"),
                        selesai: Yup.string().required("Harus Diisi"),
                    })}
                >
                    {({ handleSubmit, setFieldValue, setFieldTouched }) => {
                        return (
                            <Form>
                                <div className="flex justify-center items-center">
                                    <RangeDatePicker
                                        mode={"range"}
                                        min={1}
                                        max={365}
                                        setFieldValue={setFieldValue}
                                        setFieldTouched={setFieldTouched}
                                        disableBefore={false}
                                    />
                                </div>
                                <div className="text-center mt-4">
                                    <button
                                        type="submit"
                                        className="btn-primary"
                                        onClick={handleSubmit}
                                    >
                                        Filter
                                    </button>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </ModalStatic>
        );
    };

    const ModalConfirm = () => {
        return (
            <ModalStatic
                show={!!confirm}
                handleClose={() => setConfirm(null)}
                title={`Konfirmasi File`}
                size="lg"
            >
                <div className="flex justify-around items-center">
                    <button className="btn-outline-danger border font-bold">
                        Hapus Setelah Download
                    </button>
                    <button className="btn-primary font-bold">
                        Download Saja
                    </button>
                </div>
            </ModalStatic>
        );
    };
    return (
        <>
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-4 w-full">
                    <div className="flex justify-start items-center gap-2">
                        <button
                            className={`${
                                checkedItems?.length
                                    ? "btn-outline-danger"
                                    : "btn-outline-primary"
                            } py-1`}
                            onClick={() => {
                                const dataToCheck = filteredData ?? files;
                                if (checkedItems?.length) {
                                    setCheckedItems([]); // Batalkan semua
                                } else {
                                    const allIds = dataToCheck
                                        .filter((item) => {
                                            if (title == "Pengajuan") {
                                                return !!item.file_size;
                                            } else if (
                                                title == "Laporan Lembur"
                                            ) {
                                                return (
                                                    !!item.foto_awal_size ||
                                                    !!item.foto_akhir_size
                                                );
                                            } else {
                                                return true;
                                            }
                                        })
                                        .map((item) => item.id);
                                    setCheckedItems(allIds); // Pilih semua
                                }
                            }}
                        >
                            {checkedItems?.length ? "Batalkan" : "Pilih Semua"}
                        </button>
                        {checkedItems?.length > 0 && (
                            <>
                                <span className="border-primary border text-primary text-sm font-bold p-1 rounded-lg">
                                    Dipilih: {checkedItems.length}
                                </span>
                                <button
                                    className={`btn-primary py-1`}
                                    onClick={() => setConfirm(true)}
                                >
                                    Download
                                </button>
                            </>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {filteredData && (
                            <>
                                <span className="border-primary border text-primary text-sm font-bold p-1 rounded-lg">
                                    Hasil filter: {filteredData.length}
                                </span>
                            </>
                        )}
                        <button
                            className="btn-primary py-1"
                            onClick={() => setShowFilter(!showFilter)}
                        >
                            <FontAwesomeIcon icon={faFilter} /> Filter
                        </button>
                        {filteredData && (
                            <>
                                <button
                                    className="btn-outline-danger py-1 px-2"
                                    onClick={() => setFilteredData(null)}
                                >
                                    Hapus Filter
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <ModalFilter />
                <ModalConfirm />
                <div className="overflow-x-auto">
                    <Table className="w-full table-auto rounded border-collapse border">
                        <thead className="sticky top-0 text-xs text-gray-700 uppercase min-h-10 w-full">
                            {table?.getHeaderGroups()?.map((headerGroup) => (
                                <tr
                                    className="text-center"
                                    key={headerGroup.id}
                                >
                                    <th></th>
                                    {headerGroup.headers.map((header) => {
                                        // console.log(header.column);
                                        return (
                                            <th
                                                key={header.id}
                                                colSpan={header.colSpan}
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <>
                                                        <div
                                                            {...{
                                                                className:
                                                                    header.column.getCanSort()
                                                                        ? "cursor-pointer select-none"
                                                                        : "",
                                                                onClick:
                                                                    header.column.getToggleSortingHandler(),
                                                            }}
                                                        >
                                                            {flexRender(
                                                                header.column
                                                                    .columnDef
                                                                    .header,
                                                                header.getContext()
                                                            )}
                                                            {header.column.getCanSort() &&
                                                                ({
                                                                    asc: (
                                                                        <FontAwesomeIcon
                                                                            icon={
                                                                                faSortUp
                                                                            }
                                                                            className="ms-1"
                                                                        />
                                                                    ),
                                                                    desc: (
                                                                        <FontAwesomeIcon
                                                                            icon={
                                                                                faSortDown
                                                                            }
                                                                            className="ms-1"
                                                                        />
                                                                    ),
                                                                }[
                                                                    header.column.getIsSorted()
                                                                ] ?? (
                                                                    <FontAwesomeIcon
                                                                        icon={
                                                                            faUnsorted
                                                                        }
                                                                        className="ms-1"
                                                                    />
                                                                ))}
                                                        </div>
                                                    </>
                                                )}
                                            </th>
                                        );
                                    })}
                                    <th></th>
                                </tr>
                            ))}
                        </thead>
                        <tbody className="overflow-y-scroll max-h-screen bg-white">
                            {(filteredData || files) &&
                            (filteredData || files)?.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-4 text-center"
                                    >
                                        Data tidak ada
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((item, i) => {
                                    const file = item.original;
                                    return (
                                        <tr
                                            key={i}
                                            className="hover:bg-gray-50 text-center"
                                            onClick={() =>
                                                toggleCheckbox(file.id)
                                            }
                                        >
                                            <td className="p-2 border">
                                                <Checkbox
                                                    id={`cb-${file.id}`}
                                                    checked={checkedItems.includes(
                                                        file.id
                                                    )}
                                                    onChange={() =>
                                                        toggleCheckbox(file.id)
                                                    }
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                />
                                            </td>
                                            <td className="p-2 border text-nowrap">
                                                {file.id}
                                            </td>
                                            <td className="p-2 border">
                                                {fullWaktuIndo(file.created_at)}
                                            </td>
                                            {title == "Pengajuan" && (
                                                <>
                                                    <td className="p-2 border text-nowrap">
                                                        {formatSize(
                                                            file.file_size
                                                        )}
                                                    </td>
                                                    <td className="p-2 border">
                                                        {file.file_size > 0 ? (
                                                            <ButtonPreview
                                                                file={file.file}
                                                            />
                                                        ) : (
                                                            "File sudah dibackup"
                                                        )}
                                                    </td>
                                                </>
                                            )}
                                            {title == "Laporan Lembur" && (
                                                <>
                                                    <td className="p-2 border text-nowrap">
                                                        {formatSize(
                                                            file.foto_awal_size
                                                        )}
                                                    </td>
                                                    <td className="p-2 border">
                                                        {file.file_size > 0 ? (
                                                            <ButtonPreview
                                                                file={
                                                                    file.foto_awal
                                                                }
                                                            />
                                                        ) : (
                                                            "File sudah dibackup"
                                                        )}
                                                    </td>
                                                    <td className="p-2 border text-nowrap">
                                                        {formatSize(
                                                            file.foto_akhir_size
                                                        )}
                                                    </td>
                                                    <td className="p-2 border">
                                                        {file.file_size > 0 ? (
                                                            <ButtonPreview
                                                                file={
                                                                    file.foto_akhir
                                                                }
                                                            />
                                                        ) : (
                                                            "File sudah dibackup"
                                                        )}
                                                    </td>
                                                </>
                                            )}
                                            <td className="p-2 border flex justify-center items-center">
                                                <Tooltip content="Download">
                                                    <button
                                                        onClick={(e) => {
                                                            setConfirm(file);
                                                            e.stopPropagation();
                                                        }}
                                                        className="btn-outline-primary border px-2 py-1"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faDownload}
                                                        />
                                                    </button>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </Table>
                </div>
                {dataTable?.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2">
                        <div className="flex justify-center p-2 border-b border-primary gap-1">
                            <button
                                className="btn-outline-primary border p-1"
                                onClick={() => table.firstPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <FontAwesomeIcon icon={faBackwardFast} />
                            </button>
                            <button
                                className="btn-outline-primary border p-1"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <FontAwesomeIcon icon={faCaretLeft} />
                            </button>
                            <span className="flex items-center gap-1 rounded border border-primary text-neutral-500 px-2">
                                <strong>
                                    {table.getState().pagination.pageIndex + 1}
                                </strong>
                                dari
                                <strong>
                                    {table.getPageCount().toLocaleString()}
                                </strong>
                            </span>
                            <button
                                className="btn-outline-primary border p-1"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <FontAwesomeIcon icon={faCaretRight} />
                            </button>
                            <button
                                className="btn-outline-primary border p-1"
                                onClick={() => table.lastPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <FontAwesomeIcon icon={faForwardFast} />
                            </button>
                        </div>

                        <div className="flex justify-between my-3 text-gray-600">
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
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1">
                                    Cari di halaman:
                                    <input
                                        type="number"
                                        min="1"
                                        max={table.getPageCount()}
                                        defaultValue={
                                            table.getState().pagination
                                                .pageIndex + 1
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
                            <div>
                                Hasil: {table.getRowCount().toLocaleString()}{" "}
                                Rows
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {previewPhoto && (
                <PreviewDoc
                    show={!!previewPhoto}
                    handleClose={() => setPreviewPhoto(null)}
                    item={previewPhoto}
                    filePath={
                        title == "Pengajuan"
                            ? "/assets/absen/"
                            : title == "Laporan Lembur"
                            ? "/assets/laporan_lembur/"
                            : null
                    }
                />
            )}
        </>
    );
};

export default TableListFile;
