// indexedDB-model-cache.js
export const openDB = () =>
    new Promise((resolve, reject) => {
        const request = indexedDB.open("FaceAPIModelCache", 1);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("models")) {
                db.createObjectStore("models");
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

export const saveModelToIndexedDB = async (key, blob) => {
    const db = await openDB();
    const tx = db.transaction("models", "readwrite");
    tx.objectStore("models").put(blob, key);
    return tx.complete;
};

export const getModelFromIndexedDB = async (key) => {
    const db = await openDB();
    const tx = db.transaction("models", "readonly");
    return tx.objectStore("models").get(key);
};
