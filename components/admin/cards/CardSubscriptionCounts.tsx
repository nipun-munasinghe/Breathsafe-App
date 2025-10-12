"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    Chart,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { getSubscriptionCounts } from "@/service/admin/subscriptionApi";
import { AdminSubscriptionCount } from "@/types/subscription/adminSubscription";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { FileDown } from "lucide-react";

Chart.register(
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
);

export default function CardSubscriptionCounts() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<Chart | null>(null);
    const pdfContentRef = useRef<HTMLDivElement | null>(null);
    const [chartData, setChartData] = useState<AdminSubscriptionCount[]>([]);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getSubscriptionCounts();
            if (response.success && response.data) {
                setChartData(response.data);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!canvasRef.current || chartData.length === 0) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
            type: "bar",
            data: {
                labels: chartData.map((d) => d.sensorName),
                datasets: [
                    {
                        label: "Subscribers",
                        backgroundColor: "#4c51bf",
                        borderColor: "#4c51bf",
                        data: chartData.map((d) => d.subscriberCount),
                        barThickness: 12,
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    title: { display: false },
                    legend: { display: false },
                    tooltip: { mode: "index", intersect: false },
                },
                scales: {
                    x: {
                        display: true,
                        title: { display: false, text: "Sensor" },
                        grid: { display: false },
                    },
                    y: {
                        display: true,
                        title: { display: false, text: "Count" },
                        grid: { color: "rgba(33, 37, 41, 0.1)" },
                    },
                },
            },
        });

        return () => {
            chartRef.current?.destroy();
        };
    }, [chartData]);

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
            pdf.save("subscribers-per-sensor.pdf");
        } catch (error) {
            console.error("Failed to generate PDF:", error);
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded">
            <div ref={pdfContentRef}>
                <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                    <h6 className="uppercase text-gray-400 mb-1 text-xs font-semibold">
                        Subscriptions
                    </h6>
                    <h2 className="text-gray-700 text-xl font-semibold">
                        Subscribers per Sensor
                    </h2>
                </div>
                <div className="p-4 flex-auto">
                    <div className="relative h-[372px]">
                        <canvas ref={canvasRef}></canvas>
                    </div>
                </div>
            </div>

            <div className="px-4 py-3 border-t border-gray-200 text-right">
                <button
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf || chartData.length === 0}
                    className="bg-blue-500 text-white active:bg-blue-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FileDown size={16} className="inline-block mr-1" />
                    {isGeneratingPdf ? "Generating PDF..." : "Report"}
                </button>
            </div>
        </div>
    );
}