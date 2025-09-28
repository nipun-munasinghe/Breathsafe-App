"use client";

import React, { useEffect, useRef } from "react";
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register required Chart.js components
Chart.register(
    LineController,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
);

export default function CardLineChart() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        // destroy old chart if exists
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(ctx, {
            type: "line",
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: new Date().getFullYear().toString(),
                        backgroundColor: "#4c51bf",
                        borderColor: "#4c51bf",
                        data: [65, 78, 66, 44, 56, 67, 75],
                        fill: false,
                    },
                    {
                        label: (new Date().getFullYear() - 1).toString(),
                        backgroundColor: "#ffffff",
                        borderColor: "#ffffff",
                        data: [40, 68, 86, 74, 56, 60, 87],
                        fill: false,
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    title: {
                        display: false,
                        text: "Sales Charts",
                        color: "white",
                    },
                    legend: {
                        labels: {
                            color: "white",
                        },
                        align: "end",
                        position: "bottom",
                    },
                    tooltip: {
                        mode: "index",
                        intersect: false,
                    },
                },
                interaction: {
                    mode: "nearest",
                    intersect: true,
                },
                scales: {
                    x: {
                        ticks: {
                            color: "rgba(255,255,255,.7)",
                        },
                        title: {
                            display: false,
                            text: "Month",
                            color: "white",
                        },
                        grid: {
                            display: false,
                            color: "rgba(33, 37, 41, 0.3)",
                        },
                    },
                    y: {
                        ticks: {
                            color: "rgba(255,255,255,.7)",
                        },
                        title: {
                            display: false,
                            text: "Value",
                            color: "white",
                        },
                        grid: {
                            color: "rgba(255, 255, 255, 0.15)",
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
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-black/50">
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                        <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                            Overview
                        </h6>
                        <h2 className="text-white text-xl font-semibold">AQI value</h2>
                    </div>
                </div>
            </div>
            <div className="p-4 flex-auto">
                {/* Chart */}
                <div className="relative h-[350px]">
                    <canvas ref={canvasRef}></canvas>
                </div>
            </div>
        </div>
    );
}
