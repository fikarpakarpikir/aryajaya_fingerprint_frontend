const SubListSideNav = ({ subtitle, text, route, status = true, active }) => {
    return (
        status && (
            <li
                className={`${
                    subtitle == text && active
                        ? "border-primary rounded shadow my-2"
                        : "border-gray-100"
                } border-s-4 my-0 ms-4 w-full hover:text-primary`}
            >
                <a
                    className={`${
                        subtitle == text && active
                            ? "text-dark"
                            : "text-gray-500"
                    } relative ms-0 ps-2 py-1 flex w-full rounded-r-lg transition duration-300 hover:bg-neutral-100 hover:translate-x-2 hover:text-primary`}
                    href={route}
                >
                    <span className="ms-1">{text}</span>
                </a>
            </li>
        )
    );
};

export default SubListSideNav;
