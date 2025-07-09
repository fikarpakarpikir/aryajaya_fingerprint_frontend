import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
const flowbite = require("flowbite-react/tailwind");
// const flowbiteReact = require("flowbite-react/plugin/tailwindcss");

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
        "./resources/js/**/*.{js,jsx,ts,tsx}",
        // "./node_modules/flowbite-react/**/*.js",
        flowbite.content(),
        // ".flowbite-react/class-list.json",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // background: "#f7fafb",
                // foreground: "#171717",
                // primary: "#0a73a4",
                // primary2: "#036694",
                // primary3: rgb(52, 84, 110),
                // secondary: "#d1d1d1",
                // secondary2: "#f0f0f0",
                // tertiary: "#ffba00",
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "var(--primary)",
                primary2: "var(--primary2)",
                primary3: "var(--primary3)",
                secondary: "var(--secondary)",
                secondary2: "var(--secondary2)",
                tertiary: "var(--tertiary)",
            },
            fontFamily: {
                playfair: ['"Playfair DIsplay"'],
                alice: ['"Alice"'],
                timesNewRoman: ["Times New Roman"],
            },
            link: {
                base: "block py-2 pl-3 pr-4 md:p-0",
                active: {
                    on: "bg-primary text-white px-3 py-1 rounded-lg font-bold",
                    off: "border-b border-gray-100 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-cyan-700 md:dark:hover:bg-transparent md:dark:hover:text-white",
                },
                disabled: {
                    on: "text-gray-400 hover:cursor-not-allowed dark:text-gray-600",
                    off: "",
                },
            },
            borderRadius: {
                "3xl": "3rem",
                "2xl": "2rem",
                xl: "1rem",
            },
        },
    },
    safelist: [
        {
            pattern:
                /bg-(orange|emerald|zinc|red|amber|sky|teal|stone|gray)-(100|200|300|400|500|600|700)/,
        },
        {
            pattern:
                /border-(orange|emerald|zinc|red|amber|sky|teal|stone|gray)-(50|100|200|300|400|500|600|700)/,
        },
        {
            pattern:
                /text-(orange|emerald|zinc|red|amber|sky|teal|stone|gray)-(50|100|200|300|400|500|600|700)/,
        },
        {
            pattern:
                /to-(orange|emerald|zinc|red|amber|sky|teal|stone|gray)-(50|100|200|300|400|500|600|700)/,
        },
    ],

    plugins: [
        forms,
        flowbite.plugin(),
        // flowbiteReact,
    ],
};
