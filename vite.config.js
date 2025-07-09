import { defineConfig, loadEnv } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [
            laravel({
                input: "resources/js/app.jsx",
                refresh: true,
            }),
            react(),
        ],
        define: {
            __APP_NAME__: JSON.stringify(env.VITE_APP_NAME),
            // Tambahkan variabel lain jika perlu
        },
        server: {
            hmr: true,
            // watch: {
            //     usePolling: true,
            // },
        },
        optimizeDeps: {
            esbuildOptions: {
                target: "esnext",
            },
        },
    };
});
