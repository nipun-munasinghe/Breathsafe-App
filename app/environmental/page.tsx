"use client";
import { useState } from "react";
import Tabs from "@/components/environmental/Tabs";
import StatsGrid from "@/components/environmental/StatsGrid";
import AirQualityChart from "@/components/environmental/AirQualityChart";
import DataManagement from "@/components/environmental/DataManagement";
import Analytics from "@/components/environmental/Analytics";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const Page = () => {
  const [tab, setTab] = useState("overview");

  return (
    <>
        <Header />
        <div className="bg-emerald-950 min-h-screen">
            <div className="container mx-auto pt-15 pb-8 px-4">
                <div className="main-wrapper rounded-3xl bg-gradient-to-br from-green-100 to-orange-100 p-6 shadow-2xl animate-fade-in">
                    <div className="header text-center mb-12">
                        <h1 className="text-4xl font-bold text-emerald-950 mb-2">Environmental Data Management</h1>
                        <p className="text-lg text-gray-500">Complete sensor data processing and quality management for air quality monitoring</p>
                    </div>

                    <Tabs tab={tab} setTab={setTab} />
                    
                    <div className="mt-6">
                        {tab === "overview" && (
                        <>
                            <StatsGrid />
                            <AirQualityChart />
                        </>
                        )}
                        {tab === "data management" && (
                        <div>
                            <DataManagement />
                        </div>
                        )}
                        {tab === "analytics" && (
                        <div>
                            <Analytics />
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </>
  );
};
export default Page;