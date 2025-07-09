import axios from "axios";

const sendDataGeneral = async ({
    data,
    route,
    handleClose = null,
    prosesReducer = null,
    slicer = null,
    messageFailedReducer = null,
    dispatch = null,
    waitUntilFinish = false,
    useRedux = true,
    onProgress = null,
}) => {
    if (!waitUntilFinish && handleClose) {
        // console.log("close");
        handleClose();
    }
    if (dispatch && prosesReducer) {
        dispatch(prosesReducer("loading"));
    }
    try {
        const formData = data;
        const csrfToken = document.querySelector('input[name="_token"]').value;

        axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

        const response = await axios.post(route, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    if (onProgress) {
                        onProgress(progress);
                    }
                    // console.log(progress); // Log progress
                }
            },
        });

        if (response.status === 200) {
            // Perform actions if the request is successful
            // console.log(dispatch, slicer);

            if (dispatch) {
                if (prosesReducer) {
                    dispatch(prosesReducer("success"));
                }
                if (slicer) {
                    if (useRedux) {
                        dispatch(slicer(response.data));
                    } else {
                        slicer(response.data);
                    }
                    // console.log("slicer");
                }
                // console.log("proses");
                if (messageFailedReducer) {
                    dispatch(messageFailedReducer(null));
                }
            }
            if (waitUntilFinish && handleClose && onProgress >= 100) {
                handleClose();
            }
            if (waitUntilFinish && handleClose) {
                handleClose();
            }
            return response;
        }
    } catch (error) {
        // console.error("Error response: ", error); // Log error to console

        if (dispatch) {
            if (prosesReducer) {
                dispatch(prosesReducer("success"));
                dispatch(prosesReducer("failed"));
            }
            if (messageFailedReducer) {
                console.log(error.response);
                dispatch(messageFailedReducer(error.response?.data?.message));
            }
        }
        handleClose();
        throw error;
    }
};

export default sendDataGeneral;
