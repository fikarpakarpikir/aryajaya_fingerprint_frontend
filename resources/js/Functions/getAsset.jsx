import axios from "axios";

const getAsset = async (assetPath) => {
    try {
        const response = await axios.get(
            // `http://your-laravel-url.com/${assetPath}`,
            // `http://192.168.8.101:8000/${assetPath}`,
            `/Get/${assetPath}`,
            {
                responseType: "blob",
            }
        );
        const url = URL.createObjectURL(response.data);
        return url;
    } catch (error) {
        console.error("Error fetching asset:", error);
        throw error;
    }
};

export default getAsset;
