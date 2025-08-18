import ModalStatic from "@/Components/ReactStrap/ModalStatic";

export const NotifCameraNotAllowed = ({ show }) => {
    // console.log("🚀 ~ checkCameraPermission ~ access:");
    return (
        <ModalStatic
            show={show}
            title="Kamera Tidak Diizinkan"
            buttonShow={false}
        >
            <div className="text-center">
                <a
                    target="_blank"
                    className="btn-primary mb-3"
                    href={
                        "https://support.google.com/chrome/answer/2693767?sjid=7886610782270602611-NC#zippy="
                    }
                >
                    Buka Cara Mengaktifkan Kamera di Web
                </a>
                <br />
                Jika sudah mengizinkan, silakan refresh halaman
                <br />
                <button
                    className="btn-primary mt-3"
                    type="button"
                    onClick={() => location.reload()}
                >
                    Refresh
                </button>
            </div>
        </ModalStatic>
    );
};
