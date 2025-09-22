"use client";

import React from "react";
import CardLineChart from "@/components/admin/CardLineChart";
import CardBarChart from "@/components/admin/CardBarChart";
import CardPageVisits from "@/components/admin/CardPageVisits";
import CardSocialTraffic from "@/components/admin/CardSocialTraffic";

const Dashboard: React.FC = () => {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                    <CardLineChart />
                </div>
                <div className="w-full xl:w-4/12 px-4">
                    <CardBarChart />
                </div>
            </div>
            <div className="flex flex-wrap mt-4">
                <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                    <CardPageVisits />
                </div>
                <div className="w-full xl:w-4/12 px-4">
                    <CardSocialTraffic />
                </div>
            </div>
        </>
    );
};

export default Dashboard;
