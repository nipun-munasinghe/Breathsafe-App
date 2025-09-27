"use client";

import React, {useState, useRef} from "react";
import {createPopper} from "@popperjs/core";
import Image from "next/image";
import teamImg from "@/public/profile-pic.jpg";

const UserDropdown: React.FC = () => {
    const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
    const btnDropdownRef = useRef<HTMLAnchorElement | null>(null);
    const popoverDropdownRef = useRef<HTMLDivElement | null>(null);

    const openDropdownPopover = () => {
        if (btnDropdownRef.current && popoverDropdownRef.current) {
            createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
                placement: "bottom-start",
            });
            setDropdownPopoverShow(true);
        }
    };

    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };

    return (
        <>
            <a
                className="text-blueGray-500 block cursor-pointer"
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
                <div className="items-center flex">
                  <span
                      className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full overflow-hidden">
                    <Image
                        alt="User profile"
                        src={teamImg}
                        className="rounded-full border-none shadow-lg"
                        width={48}
                        height={48}
                    />
                  </span>
                </div>
            </a>

            <div
                ref={popoverDropdownRef}
                className={`${
                    dropdownPopoverShow ? "block" : "hidden"
                } bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48`}
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
                <div className="h-0 my-2 border border-solid border-blueGray-100"/>
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

export default UserDropdown;
