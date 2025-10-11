"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    Chart,
    DoughnutController,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { getNotificationPreferenceStats } from "@/service/admin/subscriptionApi";
import { AdminNotificationStats } from "@/types/subscription/adminSubscription";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { FileDown } from "lucide-react";

Chart.register(DoughnutController, ArcElement, Title, Tooltip, Legend);

export default function CardNotificationStats() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<Chart | null>(null);
    const pdfContentRef = useRef<HTMLDivElement | null>(null);
    const [stats, setStats] = useState<AdminNotificationStats | null>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getNotificationPreferenceStats();
            if (response.success && response.data) {
                setStats(response.data);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!canvasRef.current || !stats) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Email Enabled", "Email Disabled"],
                datasets: [
                    {
                        data: [stats.emailNotificationsEnabled, stats.emailNotificationsDisabled],
                        backgroundColor: ["#10b981", "#f43f5e"],
                        hoverBackgroundColor: ["#059669", "#e11d48"],
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: { position: "bottom", labels: { color: "rgba(0,0,0,0.7)" } },
                    title: { display: false },
                },
            },
        });

        return () => {
            chartRef.current?.destroy();
        };
    }, [stats]);

    const handleDownloadPdf = async () => {
        if (!pdfContentRef.current) return;
        setIsGeneratingPdf(true);
        try {
            const canvas = await html2canvas(pdfContentRef.current, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "pt",
                format: "a4",
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 40; // 40pt margin

            const imgProps = pdf.getImageProperties(imgData);
            const aspectRatio = imgProps.width / imgProps.height;
            
            let renderWidth = pdfWidth - 2 * margin;
            let renderHeight = renderWidth / aspectRatio;

            if (renderHeight > pdfHeight - 2 * margin) {
                renderHeight = pdfHeight - 2 * margin;
                renderWidth = renderHeight * aspectRatio;
            }

            // Center horizontally
            const xOffset = (pdfWidth - renderWidth) / 2;
            
            // Position from top with margin (no vertical centering)
            const yOffset = margin;

            pdf.addImage(imgData, "PNG", xOffset, yOffset, renderWidth, renderHeight);
            pdf.save("notification-preferences-stats.pdf");
        } catch (error) {
            console.error("Failed to generate PDF:", error);
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded bg-white">
            <div ref={pdfContentRef}>
                <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                    <h6 className="uppercase text-gray-400 mb-1 text-xs font-semibold">
                        Preferences
                    </h6>
                    <h2 className="text-gray-700 text-xl font-semibold">
                        Notification Settings
                    </h2>
                    {stats && (
                        <p className="text-sm text-gray-500 mt-1">
                            Total Active Subscriptions: {stats.totalActiveSubscriptions}
                        </p>
                    )}
                </div>
                <div className="p-4 flex-auto">
                    <div className="relative h-[350px]">
                        <canvas ref={canvasRef}></canvas>
                    </div>
                </div>
            </div>

            <div className="px-4 py-3 border-t border-gray-200 text-right">
                <button
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf || !stats}
                    className="bg-blue-500 text-white active:bg-blue-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FileDown size={16} className="inline-block mr-1" />
                    {isGeneratingPdf ? "Generating PDF..." : "Report"}
                </button>
            </div>
        </div>
    );
}