import { isImage, isPDF } from "@/Functions/dataSelect";
import ModalStatic from "./ReactStrap/ModalStatic";
import { useRef, useState } from "react";

import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf-worker.js";

const PreviewDoc = ({
    show,
    handleClose,
    item,
    filePath = "/assets/absen/",
}) => {
    // console.log(item);
    const file = item.keterangan ? item?.keterangan : item;
    const fileUrl = file ? `${filePath}${file}` : null;
    const refIframe = useRef(null);

    const thisIsImage = fileUrl && isImage(file);
    const thisIsPDF = fileUrl && isPDF(file);
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }
    return (
        <ModalStatic
            show={show}
            handleClose={handleClose}
            title={`Detail ID #${item?.id}`}
            size={thisIsPDF ? "xl" : "md"}
        >
            {thisIsImage && (
                <img
                    src={fileUrl}
                    alt={`Keterangan ID #${item?.id}`}
                    className="rounded"
                />
            )}

            {thisIsPDF && (
                <>
                    {/* <iframe
                        type="application/pdf"
                        width="100%"
                        height="500px"
                        src={URL.createObjectURL(
                            `/assets/absen/${item.keterangan}#toolbar=0`
                        )}
                    /> */}
                    <Document
                        file={`/assets/absen/${file}`}
                        loading={"Please wait i am loading"}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={(error) => console.log(error)}
                    >
                        <Page pageNumber={pageNumber} />
                    </Document>

                    <p>
                        Page {pageNumber} of {numPages}
                    </p>
                    <br />
                    <a className="btn-primary" href={fileUrl} target="_blank">
                        Download PDF
                    </a>
                </>
            )}

            {!thisIsImage && !thisIsPDF && item?.content}
        </ModalStatic>
    );
};

export default PreviewDoc;
