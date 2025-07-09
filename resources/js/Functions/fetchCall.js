import axios from "axios";
// import { errorAxiosHandling } from "./crudGeneral";

const getUrlString = (params) => {
    const { method, basePath, queryParams } = params || {};

    // Construct query parameters dynamically
    const queryString = queryParams
        ? new URLSearchParams(
              Object.entries(queryParams).reduce((acc, [key, value]) => {
                  if (value !== undefined) acc[key] = value.toString();
                  return acc;
              }, {})
          ).toString()
        : "";

    // Construct the final URL
    const url = `${method}${basePath ? `/${basePath}` : ""}${
        queryString ? `?${queryString}` : ""
    }`;
    // const url = `/api/${method}${basePath ? `/${basePath}` : ""}${
    //     queryString ? `?${queryString}` : ""
    // }`;
    return url;
};

export const fetchCall = async (
    route,
    start = () => null,
    finish = () => null,
    failure = () => null
) => {
    start();

    try {
        const response = await axios.get(getUrlString({ method: route }));
        if (response.status !== 200) {
            failure();
            throw new Error("Failed to fetch data");
        }

        // const responseData = await response.data;
        const responseData = response.data; // Explicitly cast response data

        return responseData;
    } catch (error) {
        // if (failure) {
        failure();
        if (axios.isAxiosError(error)) {
            console.error("Axios Error:", error.message);
        } else {
            console.error("Unexpected Error:", error);
        }
        // 	// dispatch(failure(errorAxiosHandling(error)));
        // 	throw failure;
        // }
    } finally {
        finish();
    }
};
