import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SubListSideNav from "./SubListSideNav";
import { useState } from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const ListSideNav = ({
    title = "",
    subtitle = "",
    text,
    route,
    icon,
    subMenu = null,
    move = false,
    active = false,
}) => {
    const [showSub, setShowSub] = useState(subMenu && active);
    // console.log(text, active);
    const baseClass = `${
        active
            ? "border-e-4 border-e-primary fw-bold text-gray-900 bg-gradient-to-r from-gray-50 to-gray-100"
            : "border-0 border-e-sky-0 text-gray-500 bg-gradient-to-r from-sky-0 to-neutral-0"
    } flex w-full transition-all duration-300 items-center p-2 my-1 rounded-lg hover:bg-gray-100 hover:text-primary hover:translate-x-2 group h-8`;

    const IconComponent = () => (
        <div
            className={`w-5 h-5 text-center ${
                active ? "text-gray-900" : "text-gray-400"
            } transition duration-75 hover:text-primary group-hover:text-gray-900`}
        >
            <FontAwesomeIcon icon={icon} />
        </div>
    );

    return (
        <>
            <li>
                {move ? (
                    <a href={route} className={baseClass}>
                        <IconComponent />
                        <span className="ms-3">{text}</span>
                    </a>
                ) : (
                    <button
                        onClick={() =>
                            subMenu ? setShowSub(!showSub) : route()
                        }
                        className={baseClass}
                    >
                        <IconComponent />
                        <span className="ms-3 me-auto">{text}</span>
                        {subMenu && (
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                className={`transition-all duration-300 ease-in-out ${
                                    showSub ? "rotate-180" : "rotate-0"
                                }`}
                            />
                        )}
                    </button>
                )}
            </li>
            {subMenu &&
                showSub &&
                subMenu.map((item, i) => (
                    <SubListSideNav
                        status={item.status}
                        subtitle={subtitle}
                        active={active}
                        text={item.text}
                        route={item.route}
                        key={i}
                    />
                ))}
        </>
    );
};

export default ListSideNav;
