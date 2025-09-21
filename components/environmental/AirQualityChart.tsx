import React, { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { FaDownload } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: "Air Quality Trend - Past Week",
      color: "#064e3b",
      font: { size: 18, weight: 700 },
    },
    legend: { 
      labels: { color: "#374151" },
      position: "top" as const,
    },
  },
  scales: {
    x: { 
      ticks: { color: "#6b7280" }, 
      grid: { color: "rgba(132,204,22,0.1)" } 
    },
    y: { 
      ticks: { color: "#6b7280" }, 
      grid: { color: "rgba(132,204,22,0.1)" } 
    },
  },
};

const data = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "PM2.5 (µg/m³)",
      data: [22, 28, 15, 32, 18, 25, 20],
      borderColor: "#84cc16",
      backgroundColor: "rgba(132,204,22,0.1)",
      tension: 0.4,
      fill: true,
    },
    {
      label: "PM10 (µg/m³)",
      data: [35, 42, 28, 48, 30, 38, 32],
      borderColor: "#65a30d",
      backgroundColor: "rgba(101,163,13,0.1)",
      tension: 0.4,
      fill: true,
    },
  ],
};

const AirQualityChart = () => {
  const chartRef = useRef(null);

  const downloadChart = () => {
    if (!chartRef.current) return;
    
    const chart = chartRef.current;
    const link = document.createElement("a");
    link.download = "air-quality-trend.png";
    link.click();
  };

  return (
    <div className="relative bg-white/60 rounded-lg p-4 mb-6 chart-container">
      {/* Download Button */}
      <button
        onClick={downloadChart}
        aria-label="Download Chart"
        className="absolute top-4 right-4 p-2 rounded-full bg-lime-400 hover:bg-lime-500 text-white transition z-10"
        title="Download Chart"
      >
        <FaDownload size={18} />
      </button>

      {/* Chart - responsive height */}
      <div className="w-full h-64 sm:h-48 md:h-64 lg:h-80">
        <Line 
          ref={chartRef} 
          data={data} 
          options={options}
        />
      </div>
    </div>
  );
};
export default AirQualityChart;