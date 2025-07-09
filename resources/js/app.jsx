// import "../css/app.css";
import "../css/app.css";
import "./bootstrap";
// import "flowbite";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import ErrorBoundary from "./Components/ErrorBoundary";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";
const AppWrapper = ({ App, props }) => {
    const [isLoaded, setIsLoaded] = useState(import.meta.env.DEV);

    useEffect(() => {
        // console.log("🚀 ~ AppWrapper ~ import.meta.env.PROD:", import.meta.env);
        // Delay sedikit agar splash screen terlihat lebih smooth
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 1500); // 1 detik delay (ubah sesuai keperluan)

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <AnimatePresence>
                {!isLoaded && (
                    <motion.div
                        key="splash"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-radial from-neutral-100 via-sky-500 to-neutral-300 from-50% to-100% z-50"
                    >
                        <div className="text-center">
                            <motion.img
                                src="/assets/logo/logo-crc.png"
                                alt="loader"
                                width={150}
                                height={150}
                                className="drop-shadow-xl mx-auto"
                                initial={{ opacity: 0, y: 60 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                            <p className="mt-4 text-md badge px-5 bg-primary text-white font-bold">
                                {appName}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isLoaded && (
                <ErrorBoundary>
                    <Provider store={store}>
                        <App {...props} />
                    </Provider>
                </ErrorBoundary>
            )}
        </>
    );
};

createInertiaApp({
    title: (title) => `${title} | ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        // Cek apakah elemen sudah memiliki root React
        const root = el._reactRootContainer ?? createRoot(el);
        el._reactRootContainer = root; // simpan root di element DOM

        root.render(<AppWrapper App={App} props={props} />);
    },
    progress: {
        color: "#4B5563",
    },
});
