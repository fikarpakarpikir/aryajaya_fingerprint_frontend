import { useState } from "react";

const ListFillProfile = ({ quest, fill }) => {
    const [showEdit, setShowEdit] = useState(false);
    return (
        <div className="mb-2">
            <span className="">{quest}</span>
            <br />
            {showEdit ? (
                <span onDoubleClick={() => setShowEdit(false)}>
                    Coming Soon.. cancel
                </span>
            ) : (
                <span
                    className="fw-bold "
                    onDoubleClick={() => setShowEdit(true)}
                >
                    {quest == "No WA" ? (
                        <span className="ms-1">
                            <a
                                className="fa-brands fa-whatsapp me-1 fs-5"
                                href={`https://wa.me/+62${fill}`}
                            ></a>
                            <a href={`https://wa.me/+62${fill}`}>+62{fill}</a>
                        </span>
                    ) : (
                        <span className="ms-1">{fill}</span>
                    )}
                </span>
            )}
            <br />
        </div>
    );
};

export default ListFillProfile;
