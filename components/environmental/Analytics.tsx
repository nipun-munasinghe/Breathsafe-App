"use client";
import React, { useRef } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { FaDownload } from "react-icons/fa";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const data = {
  labels: ["Colombo", "Kandy", "Galle", "Negombo"],
  datasets: [
    {
      label: "Average PM2.5",
      data: [25, 18, 35, 12],
      backgroundColor: "#99e540",
      borderRadius: 6,
      barThickness: 38,
      categoryPercentage: 0.6,
    },
    {
      label: "Average PM10",
      data: [42, 32, 48, 28],
      backgroundColor: "#74bb33",
      borderRadius: 6,
      barThickness: 38,
      categoryPercentage: 0.6,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: { color: "#65a30d", font: { weight: 700, size: 15 } },
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: { color: "rgba(132,204,22,0.07)" },
      ticks: { color: "#374151", font: { size: 14 } },
    },
    y: {
      grid: { color: "rgba(132,204,22,0.07)" },
      ticks: { color: "#374151", font: { size: 14 } },
      beginAtZero: true,
      max: 50,
    },
  },
};

const Analytics = () => {
  const chartRef = useRef(null);

  const downloadChart = () => {
    if (!chartRef.current) return;
    
    const chart = chartRef.current;
    const link = document.createElement("a");
    link.download = "air-quality-analytics.png";
    link.click();
  };

  return (
    <div className="relative bg-white/80 rounded-xl shadow p-8 animate-fade-in-up">
      <button
        onClick={downloadChart}
        aria-label="Download Chart"
        className="absolute top-6 right-6 p-2 rounded-full bg-lime-400 hover:bg-lime-500 text-white transition z-10"
        title="Download Chart"
      >
        <FaDownload size={20} />
      </button>

      <h2 className="text-xl font-semibold mb-6 text-emerald-900">
        Air Quality Analytics
      </h2>
      
      {/* Chart with responsive height */}
      <div className="mb-6">
        <div className="w-full h-64 sm:h-56 md:h-64 lg:h-80">
          <Bar ref={chartRef} data={data} options={options} />
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="bg-white border-l-4 border-lime-500 rounded-lg p-4 shadow-sm">
          <h3 className="text-green-700 font-semibold mb-2">Key Insights</h3>
          <p>
            <span className="font-medium text-green-700">Trend Analysis:</span>{" "}
            Air quality has improved by 15% over the past month, with PM2.5
            levels consistently below WHO guidelines.
          </p>
        </div>
        <div className="bg-orange-50 border-l-4 border-orange-400 rounded-lg p-4 shadow-sm">
          <h3 className="text-orange-700 font-semibold mb-2">Alert</h3>
          <p>
            <span className="font-medium text-orange-700">Alert:</span> Air
            Quality levels in Colombo Central have exceeded normal ranges 3
            times this week during rush hours.
          </p>
        </div>
      </div>
    </div>
  );
};
export default Analytics;