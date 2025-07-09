import { useNav } from "@/Functions/handleArray";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePage } from "@inertiajs/react";
import { Tooltip } from "flowbite-react";
import { useState } from "react";

const FloatNavMenu = ({ listMenu, handleNav, handleActive }) => {
    const { title } = usePage().props;
    const nav = useNav();
    const [showNav, setShowNav] = useState(false);
    return (
        <div className="absolute z-40 top-0 left-0">
            <div
                className={`transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] bg-white shadow-lg text-center transform ${
                    showNav
                        ? "rounded-lg px-4 py-2 max-w-full max-h-full rounded-tl-none scale-100"
                        : "rounded-lg px-0 py-0 max-w-8 max-h-8 rounded-tl-lg scale-90 delay-300 border border-gray-300"
                }`}
            >
                {/* {!showNav ? ( */}
                <Tooltip content={`Menu ${title}`} placement="right">
                    <button
                        className={`btn-outline-primary rounded-lg border-0 p-2 transition-opacity duration-300 ${
                            !showNav
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-90 absolute"
                        }`}
                        onClick={() => setShowNav(!showNav)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5z" />
                        </svg>
                    </button>
                </Tooltip>
                {/* ) : ( */}
                <div
                    className={`transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] transform overflow-hidden ${
                        showNav
                            ? "opacity-100 scale-100 delay-300"
                            : "opacity-0 scale-95 "
                    }`}
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-400 flex items-center text-sm">
                            Menu {title}
                        </span>
                        <span
                            className="cursor-pointer text-primary rounded-full opacity-70 p-1"
                            onClick={() => setShowNav(!showNav)}
                        >
                            <FontAwesomeIcon icon={faXmarkCircle} />
                        </span>
                    </div>
                    <div className="grid grid-cols-3 items-start gap-3">
                        {listMenu.map(
                            (item, i) =>
                                !handleActive[i] && (
                                    <button
                                        className="btn-outline-primary border-0 shadow text-center p-4 w-32"
                                        onClick={() =>
                                            nav.navigateToTab(
                                                handleNav,
                                                i,
                                                setShowNav,
                                                listMenu
                                            )
                                        }
                                        key={i}
                                    >
                                        <div className="mb-4">
                                            <span className="bg-blue-200/45 rounded-lg p-2">
                                                <FontAwesomeIcon
                                                    icon={item.icon}
                                                    size="lg"
                                                />
                                            </span>
                                        </div>
                                        <div className="text-xs font-bold">
                                            {item.title}
                                        </div>
                                    </button>
                                )
                        )}
                    </div>
                </div>
                {/* )} */}
            </div>
        </div>
    );
};

export default FloatNavMenu;
