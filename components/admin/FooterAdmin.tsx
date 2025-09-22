import React from "react";

const FooterAdmin: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="block py-4">
            <div className="container mx-auto px-4">
                <hr className="mb-4 border-b-1 border-blueGray-200" />
                <div className="flex flex-wrap items-center md:justify-between justify-center">
                    {/* Left Section */}
                    <div className="w-full md:w-4/12 px-4">
                        <div className="text-sm text-blueGray-500 font-semibold py-1 text-center md:text-left">
                            Copyright © {year}{" "}
                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blueGray-500 hover:text-blueGray-700 text-sm font-semibold py-1"
                            >
                                BreathSafe
                            </a>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="w-full md:w-8/12 px-4">
                        <ul className="flex flex-wrap list-none md:justify-end justify-center">
                            <li>
                                <a
                                    href="/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                                >
                                    BreathSafe
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                                >
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                                >
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterAdmin;
