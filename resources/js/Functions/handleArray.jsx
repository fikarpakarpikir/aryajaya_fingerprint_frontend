import { useCallback } from "react";

const useShowArray = () => {
    const openArray = useCallback((setModalFunc, itemId) => {
        setModalFunc((prevVisibility) => ({
            ...prevVisibility,
            [itemId]: true,
        }));
    }, []);

    const closeArray = useCallback((setModalFunc, itemId) => {
        setModalFunc((prevVisibility) => ({
            ...prevVisibility,
            [itemId]: false,
        }));
    }, []);

    const openArrayinArray = useCallback((setModalFunc, parentId, childId) => {
        setModalFunc((prevVisibility) => ({
            ...prevVisibility,
            [parentId]: {
                ...prevVisibility[parentId],
                [childId]: true,
            },
        }));
    }, []);

    const closeArrayinArray = useCallback((setModalFunc, parentId, childId) => {
        setModalFunc((prevVisibility) => ({
            ...prevVisibility,
            [parentId]: {
                ...prevVisibility[parentId],
                [childId]: false,
            },
        }));
    }, []);

    return { openArray, openArrayinArray, closeArray, closeArrayinArray };
};

const useNav = () => {
    const navigateToTab = (setButton, index, setShowNav, data) => {
        nonActiveButtonNav(setButton, data, index);
        activeButtonNav(setButton, index);
        setShowNav(false);
    };
    const activeButtonNav = useCallback((setButton, navIndex) => {
        setButton((prevVisibility) => ({
            ...prevVisibility,
            [navIndex]: true,
        }));
    }, []);

    const nonActiveButtonNav = useCallback((setButton, data, navIndex) => {
        setButton(
            data.forEach((_item, i) => {
                i != navIndex ? true : false;
            })
        );
    }, []);

    return { navigateToTab, nonActiveButtonNav };
};

const initializeModalVisibility = (data) => {
    const initialModalVisibility = {};
    data.forEach((item) => {
        initialModalVisibility[item.id] = false;
    });
    return initialModalVisibility;
};

const initializeModalVisibilityinArray = (data, child) => {
    const initialModalVisibility = {};
    data.forEach((item) => {
        item[child].forEach((items) => {
            initialModalVisibility[items.id] = false;
        });
    });
    return initialModalVisibility;
};

const initializeButtonNavActive = (data) => {
    const initialButtonActive = {};
    data.forEach((item, i) => {
        initialButtonActive[i] = false;
    });
    initialButtonActive[0] = true;
    // initialButtonActive[1] = true;
    return initialButtonActive;
};

export {
    initializeModalVisibility,
    initializeModalVisibilityinArray,
    initializeButtonNavActive,
    useShowArray,
    useNav,
};
