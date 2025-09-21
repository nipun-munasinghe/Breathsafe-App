"use client";

import React from "react";
import AdminNavbar from "@/components/admin/NavBar";
const Sidebar = dynamic(() => import("@/components/admin/SideBar"), { ssr: false });
import HeaderStats from "@/components/admin/HeaderStats"
import FooterAdmin from "@/components/admin/FooterAdmin";
import dynamic from "next/dynamic";

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Sidebar />
            <div className="relative md:ml-64 bg-blueGray-100 min-h-screen">
                <AdminNavbar />
                {/* Header */}
                <HeaderStats />
                <div className="px-4 md:px-10 mx-auto w-full -m-24">
                    {children}
                    <FooterAdmin />
                </div>
            </div>
        </>
    );
}
