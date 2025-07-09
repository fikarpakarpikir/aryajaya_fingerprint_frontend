import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col justify-center items-center bg-gradient-to-tr from-primary to-neutral-400 sm:justify-center sm:pt-0">
            <div className="mt-1 w-full overflow-hidden relative bg-white p-4 shadow-md sm:max-w-5xl sm:m-0 rounded-lg">
                {children}
            </div>
        </div>
    );
}
