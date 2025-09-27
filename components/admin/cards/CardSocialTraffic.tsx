"use client";

import React from "react";

interface SocialTraffic {
    referral: string;
    visitors: number;
    progress: number; // percentage
    color: string; // Tailwind bg color for the bar
}

const trafficData: SocialTraffic[] = [
    { referral: "Facebook", visitors: 1480, progress: 60, color: "bg-red-500" },
    { referral: "Facebook", visitors: 5480, progress: 70, color: "bg-emerald-500" },
    { referral: "Google", visitors: 4807, progress: 80, color: "bg-purple-500" },
    { referral: "Instagram", visitors: 3678, progress: 75, color: "bg-lightBlue-500" },
    { referral: "Twitter", visitors: 2645, progress: 30, color: "bg-emerald-500" },
];

const CardSocialTraffic: React.FC = () => {
    return (
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-base text-blueGray-700">Social traffic</h3>
                    </div>
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                        <button
                            type="button"
                            className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        >
                            See all
                        </button>
                    </div>
                </div>
            </div>
            <div className="block w-full overflow-x-auto">
                <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                    <tr>
                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            Referral
                        </th>
                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                            Visitors
                        </th>
                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {trafficData.map((row, index) => (
                        <tr key={index}>
                            <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                                {row.referral}
                            </th>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                {row.visitors.toLocaleString()}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                <div className="flex items-center">
                                    <span className="mr-2">{row.progress}%</span>
                                    <div className="relative w-full">
                                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                            <div
                                                style={{ width: `${row.progress}%` }}
                                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${row.color}`}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CardSocialTraffic;
