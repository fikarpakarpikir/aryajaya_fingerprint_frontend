import { useEffect } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
export const FaceAPIDBConfig = {
    name: "FaceAPI_DB",
    version: 1,
    objectStoresMeta: [
        {
            store: "models",
            storeConfig: { keyPath: "key", autoIncrement: false },
            storeSchema: [
                { name: "key", keypath: "key", options: { unique: true } },
                { name: "blob", keypath: "blob", options: { unique: false } },
            ],
        },
    ],
};

export const useFaceApiModelCache = () => {
    const { getByID, add } = useIndexedDB("models");

    const getModel = async (key) => {
        const data = await getByID(key);
        return data?.blob || null;
    };

    const saveModel = async (key, blob) => {
        // console.log("Saved to IndexedDB:", key, blob);
        await add({ key, blob });
    };

    return { getModel, saveModel };
};

export const useFaceApiCache = () => {
    const { getModel, saveModel } = useFaceApiModelCache();
    // const { getAll } = useIndexedDB("models");

    useEffect(() => {
        if (window._faceApiCachePatched) return;
        window._faceApiCachePatched = true;

        const originalFetch = window.fetch;
        window.fetch = async function (url, ...args) {
            if (url.includes("/models/")) {
                const key = url.split("/models/")[1];
                const cachedBlob = await getModel(key);

                if (cachedBlob) {
                    console.log("Mengambil dari IndexedDB:", key);
                    return new Response(cachedBlob);
                } else {
                    const response = await originalFetch(url, ...args);
                    const blob = await response.clone().blob();
                    await saveModel(key, blob);
                    return response;
                }
            }

            return originalFetch(url, ...args);
        };
    }, [getModel, saveModel]);
};
