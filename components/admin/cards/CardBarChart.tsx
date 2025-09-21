"use client";

import React, { useEffect, useRef } from "react";
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

// Register Chart.js components (required for v3+)
Chart.register(
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
);

export default function CardBarChart() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        // Destroy previous chart instance if it exists
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: new Date().getFullYear().toString(),
                        backgroundColor: "#ed64a6",
                        borderColor: "#ed64a6",
                        data: [30, 78, 56, 34, 100, 45, 13],
                        barThickness: 8,
                    },
                    {
                        label: (new Date().getFullYear() - 1).toString(),
                        backgroundColor: "#4c51bf",
                        borderColor: "#4c51bf",
                        data: [27, 68, 86, 74, 10, 4, 87],
                        barThickness: 8,
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    title: {
                        display: false,
                        text: "Orders Chart",
                    },
                    tooltip: {
                        mode: "index",
                        intersect: false,
                    },
                    legend: {
                        labels: {
                            color: "rgba(0,0,0,.7)",
                        },
                        align: "end",
                        position: "bottom",
                    },
                },
                interaction: {
                    mode: "nearest",
                    intersect: true,
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: "Month",
                        },
                        grid: {
                            color: "rgba(33, 37, 41, 0.3)",
                        },
                    },
                    y: {
                        display: true,
                        title: {
                            display: false,
                            text: "Value",
                        },
                        grid: {
                            color: "rgba(33, 37, 41, 0.2)",
                        },
                    },
                },
            },
        });

        return () => {
            chartRef.current?.destroy();
        };
    }, []);

    return (
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h6 className="uppercase text-gray-400 mb-1 text-xs font-semibold">
                            Performance
                        </h6>
                        <h2 className="text-gray-700 text-xl font-semibold">
                            Total orders
                        </h2>
                    </div>
                </div>
            </div>
            <div className="p-4 flex-auto">
                <div className="relative h-[350px]">
                    <canvas ref={canvasRef}></canvas>
                </div>
            </div>
        </div>
    );
}
