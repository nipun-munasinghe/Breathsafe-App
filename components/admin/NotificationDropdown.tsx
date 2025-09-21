"use client";

import React, { useState, useRef } from "react";
import { createPopper } from "@popperjs/core";

const NotificationDropdown: React.FC = () => {
    const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
    const btnDropdownRef = useRef<HTMLAnchorElement | null>(null);
    const popoverDropdownRef = useRef<HTMLDivElement | null>(null);

    const openDropdownPopover = () => {
        if (btnDropdownRef.current && popoverDropdownRef.current) {
            createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
                placement: "bottom-start",
            });
        }
        setDropdownPopoverShow(true);
    };

    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };

    return (
        <>
            <a
                className="text-blueGray-500 block py-1 px-3"
                href="#"
                ref={btnDropdownRef}
                onClick={(e) => {
                    e.preventDefault();
                    if (dropdownPopoverShow) {
                        closeDropdownPopover();
                    } else {
                        openDropdownPopover();
                    }
                }}
            >
                <i className="fas fa-bell"></i>
            </a>

            <div
                ref={popoverDropdownRef}
                className={`${
                    dropdownPopoverShow ? "block" : "hidden"
                } bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1 min-w-48`}
            >
                <a
                    href="#"
                    className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                    onClick={(e) => e.preventDefault()}
                >
                    Action
                </a>
                <a
                    href="#"
                    className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                    onClick={(e) => e.preventDefault()}
                >
                    Another action
                </a>
                <a
                    href="#"
                    className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                    onClick={(e) => e.preventDefault()}
                >
                    Something else here
                </a>
                <div className="h-0 my-2 border border-solid border-blueGray-100" />
                <a
                    href="#"
                    className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                    onClick={(e) => e.preventDefault()}
                >
                    Separated link
                </a>
            </div>
        </>
    );
};

export default NotificationDropdown;
