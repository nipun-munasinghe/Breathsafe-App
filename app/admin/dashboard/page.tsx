"use client";

import React from "react";
import CardSubscriptionCounts from "@/components/admin/cards/CardSubscriptionCounts";
import CardSubscriptionDetails from "@/components/admin/cards/CardSubscriptionDetails";
import CardTopUsers from "@/components/admin/cards/CardTopUsers";
import CardNotificationStats from "@/components/admin/cards/CardNotificationStats";

const Dashboard: React.FC = () => {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full xl:w-8/12 mb-4 xl:mb-0 px-2">
                    <CardSubscriptionCounts />
                </div>
                <div className="w-full xl:w-4/12 px-2">
                    <CardNotificationStats />
                </div>
            </div>
            <div className="flex flex-wrap mt-4 mb-4">
                <div className="w-full xl:w-8/12 mb-4 xl:mb-0 px-2">
                    <CardSubscriptionDetails />
                </div>
                <div className="w-full xl:w-4/12 px-2">
                    <CardTopUsers />
                </div>
            </div>
        </>
    );
};

export default Dashboard;