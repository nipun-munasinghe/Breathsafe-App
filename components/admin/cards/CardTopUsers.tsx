"use client";

import React, { useEffect, useState } from "react";
import { getTopSubscribingUsers } from "@/service/admin/subscriptionApi";
import { AdminTopUser } from "@/types/subscription/adminSubscription";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileDown } from "lucide-react";

export default function CardTopUsers() {
    const [topUsers, setTopUsers] = useState<AdminTopUser[]>([]);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getTopSubscribingUsers(5);
            if (response.success && response.data) {
                setTopUsers(response.data);
            }
        };
        fetchData();
    }, []);

    const getProgressPercentage = (count: number): number => {
        if (!topUsers || topUsers.length === 0) return 0;
        const maxCount = topUsers[0].subscriptionCount;
        return maxCount > 0 ? (count / maxCount) * 100 : 0;
    };

    const handleDownloadPdf = () => {
        setIsGeneratingPdf(true);
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4",
        });

        const title = "Top 5 Subscribing Users";
        const fontSize = 16;
        doc.setFontSize(fontSize);
        const textWidth = doc.getStringUnitWidth(title) * fontSize / doc.internal.scaleFactor;
        const xOffset = (doc.internal.pageSize.getWidth() - textWidth) / 2;

        doc.text(title, xOffset, 40); // Centered title near the top

        autoTable(doc, {
            startY: 60, // Start table below the title
            head: [['Username', 'Subscriptions']],
            body: topUsers.map(user => [
                user.username,
                user.subscriptionCount
            ]),
            styles: { fontSize: 9, cellPadding: 8, overflow: 'linebreak' },
            headStyles: { fillColor: [76, 81, 191], textColor: [255, 255, 255], fontStyle: 'bold' },
            margin: { top: 30, right: 30, bottom: 30, left: 30 },
            theme: 'striped',
            didParseCell: (data) => {
                data.cell.styles.halign = 'left';
            }
        });

        doc.save("top-subscribing-users.pdf");
        setIsGeneratingPdf(false);
    };

    const progressColors = ["bg-red-500", "bg-emerald-500", "bg-purple-500", "bg-sky-500", "bg-orange-500"];

    return (
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-base text-blueGray-700">Top Subscribing Users</h3>
                    </div>
                    <div className="relative w-auto pl-4 flex-initial">
                        <button
                            onClick={handleDownloadPdf}
                            disabled={isGeneratingPdf || topUsers.length === 0}
                            className="bg-blue-500 text-white active:bg-blue-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FileDown size={16} className="inline-block mr-1" />
                            {isGeneratingPdf ? "Generating PDF..." : "Report"}
                        </button>
                    </div>
                </div>
            </div>
            <div className="block w-full overflow-x-auto">
                <table className="items-center w-full bg-transparent border-collapse">
                    <thead className="thead-light">
                        <tr>
                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Username</th>
                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Subscriptions</th>
                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {topUsers.map((user, index) => (
                            <tr key={user.userId}>
                                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">{user.username}</th>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{user.subscriptionCount}</td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <div className="flex items-center">
                                        <div className="relative w-full">
                                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                                <div
                                                    style={{ width: `${getProgressPercentage(user.subscriptionCount)}%` }}
                                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${progressColors[index % progressColors.length]}`}
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
}