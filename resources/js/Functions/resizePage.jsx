import { useEffect, useState } from "react";

function useResize() {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    let cat;

    // Function to handle resize
    const handleResize = () => {
        setScreenWidth(window.innerWidth);
    };

    useEffect(() => {
        // Add event listener on component mount
        window.addEventListener("resize", handleResize);

        // Cleanup on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    switch (screenWidth) {
        case this < 480:
            cat = "xs";
            break;
        case this < 576:
            cat = "sm";
            break;
        case this < 768:
            cat = "md";
            break;
        case this < 992:
            cat = "lg";
            break;
        case this < 1200:
            cat = "xl";
            break;
        case this < 1400:
            cat = "xxl";
            break;

        default:
            break;
    }

    return { screenWidth, cat };
}

export default useResize;
