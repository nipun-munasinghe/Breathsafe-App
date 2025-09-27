"use client";

import React, { useState } from "react";
import Link from "next/link";

import NotificationDropdown from "@/components/admin/dropdown/NotificationDropdown";
import UserDropdown from "@/components/admin/dropdown/UserDropdown";

const Sidebar: React.FC = () => {
  const [collapseShow, setCollapseShow] = useState("hidden");

  // helper to check if link is active
  const isActive = (path: string) =>
    typeof window !== "undefined" && window.location.pathname === path;

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>

          {/* Brand */}
          <Link href="/" className="group inline-flex items-center gap-2">
            <span
              className={
                "inline-grid h-9 w-9 place-items-center rounded-xl ring-1 bg-gradient-to-br from-green-100 to-orange-100 ring-black/5"
              }
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
                <path
                  d="M5 12c0-3.866 3.134-7 7-7a7 7 0 0 1 0 14h-1.5a1.5 1.5 0 0 1-1.5-1.5v-3.25a.75.75 0 0 0-1.5 0V18A2 2 0 0 1 5 20"
                  fill="currentColor"
                  className={"text-lime-600"}
                />
              </svg>
            </span>
            <span className={"text-xl font-bold tracking-tight text-slate-900"}>
              Breath<span className={"text-lime-600"}>Safe</span>
            </span>
          </Link>

          {/* User (mobile) */}
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
              <NotificationDropdown />
            </li>
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>

          {/* Collapse */}
          <div
            className={`md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded ${collapseShow}`}
          >
            {/* Collapse header (mobile only) */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    href="/"
                  >
                    BreathSafe
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Search (mobile only) */}
            <form className="mt-6 mb-4 md:hidden">
              <div className="mb-3 pt-0">
                <input
                  type="text"
                  placeholder="Search"
                  className="border-0 px-3 py-2 h-12 border border-solid border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                />
              </div>
            </form>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />

            {/* Admin Layout Pages */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Activity Overview
            </h6>
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
                <Link
                  className={`text-xs uppercase py-3 font-bold block ${
                    isActive("/admin/dashboard")
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500"
                  }`}
                  href="/admin/dashboard"
                >
                  <i
                    className={`fas fa-tv mr-2 text-sm ${
                      isActive("/admin/dashboard")
                        ? "opacity-75"
                        : "text-blueGray-300"
                    }`}
                  ></i>{" "}
                  Dashboard
                </Link>
              </li>

              <li className="items-center">
                <Link
                  className={`text-xs uppercase py-3 font-bold block ${
                    isActive("/admin/maps")
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500"
                  }`}
                  href="/admin/maps"
                >
                  <i
                    className={`fas fa-map-marked mr-2 text-sm ${
                      isActive("/admin/maps")
                        ? "opacity-75"
                        : "text-blueGray-300"
                    }`}
                  ></i>{" "}
                  Maps
                </Link>
              </li>
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />

            {/* Auth Layout Pages */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Request Management
            </h6>
            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="items-center">
                <Link
                  className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                  href="/admin/new-requests"
                >
                  <i className="fas fa-inbox text-blueGray-400 mr-2 text-sm"></i>{" "}
                  New Requests
                </Link>
              </li>

              <li className="items-center">
                <Link
                  className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                  href="/"
                >
                  <i className="fas fa-check-square text-blueGray-300 mr-2 text-sm"></i>{" "}
                  Approved Requests
                </Link>
              </li>
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />

            {/* No Layout Pages */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Sensor Management
            </h6>
            <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="items-center">
                <Link
                  className={`text-xs uppercase py-3 font-bold block ${
                    isActive("/admin/create-sensor")
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500"
                  }`}
                  href="/admin/create-sensor"
                >
                  <i
                    className={`fas fa-plus-circle mr-2 text-sm ${
                      isActive("/admin/create-sensor")
                        ? "opacity-75"
                        : "text-blueGray-400"
                    }`}
                  ></i>{" "}
                  Add Sensor
                </Link>
              </li>

              <li className="items-center">
                <Link
                  className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                  href="/admin/sensors"
                >
                  <i className="fas fa-list text-blueGray-400 mr-2 text-sm"></i>{" "}
                  Sensor Data
                </Link>
              </li>
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
