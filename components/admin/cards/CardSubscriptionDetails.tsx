"use client";

import React, { useEffect, useState } from "react";
import { getAllSubscriptionDetails } from "@/service/admin/subscriptionApi";
import { AdminSubscriptionDetail } from "@/types/subscription/adminSubscription";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileDown } from "lucide-react";

export default function CardSubscriptionDetails() {
    const [subscriptions, setSubscriptions] = useState<AdminSubscriptionDetail[]>([]);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getAllSubscriptionDetails();
            if (response.success && response.data) {
                setSubscriptions(response.data);
            }
        };
        fetchData();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const handleDownloadPdf = () => {
        setIsGeneratingPdf(true);
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "pt",
            format: "a4",
        });

        const title = "All Active Subscription Details";
        const fontSize = 16;
        doc.setFontSize(fontSize);
        const textWidth = doc.getStringUnitWidth(title) * fontSize / doc.internal.scaleFactor;
        const xOffset = (doc.internal.pageSize.getWidth() - textWidth) / 2;

        doc.text(title, xOffset, 40); // Centered title near the top

        autoTable(doc, {
            startY: 60, // Start table below the title
            head: [['Username', 'Sensor Name', 'Location', 'Subscribed At']],
            body: subscriptions.map(sub => [
                sub.username,
                sub.sensorName,
                sub.sensorLocation,
                formatDate(sub.subscribedAt)
            ]),
            styles: { fontSize: 9, cellPadding: 8, overflow: 'linebreak' },
            headStyles: { fillColor: [76, 81, 191], textColor: [255, 255, 255], fontStyle: 'bold' },
            margin: { top: 30, right: 30, bottom: 30, left: 30 },
            theme: 'striped',
            didParseCell: (data) => {
                data.cell.styles.halign = 'left';
            }
        });

        doc.save("all-subscription-details.pdf");
        setIsGeneratingPdf(false);
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-base text-blueGray-700">All Active Subscription Details</h3>
                    </div>
                    <div className="relative w-auto pl-4 flex-initial">
                        <button
                            onClick={handleDownloadPdf}
                            disabled={isGeneratingPdf || subscriptions.length === 0}
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
                    <thead>
                        <tr>
                            <th className="px-6 py-3 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Username</th>
                            <th className="px-6 py-3 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Sensor Name</th>
                            <th className="px-6 py-3 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Location</th>
                            <th className="px-6 py-3 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">Subscribed At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions.map((sub) => (
                            <tr key={sub.subscriptionId}>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">{sub.username}</td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{sub.sensorName}</td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{sub.sensorLocation}</td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">{formatDate(sub.subscribedAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}