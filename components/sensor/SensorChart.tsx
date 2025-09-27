'use client';
import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ChartData } from '@/types/sensors/admin';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SensorChartProps {
  data: ChartData;
  sensorName: string;
  isLoading?: boolean;
}

const SensorChart: React.FC<SensorChartProps> = ({ data, sensorName, isLoading }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `${sensorName} - Air Quality Data (Past Week)`,
        color: '#064e3b',
        font: { size: 18, weight: 700 as const },
        padding: 20
      },
      legend: { 
        labels: { color: '#374151', usePointStyle: true },
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#84cc16',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      }
    },
    scales: {
      x: { 
        title: {
          display: true,
          text: 'Days of Week',
          color: '#4b5563',
          font: { size: 14, weight: 600 as const }
        },
        ticks: { color: '#6b7280' }, 
        grid: { color: 'rgba(132,204,22,0.1)' } 
      },
      'y-co2': { 
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'CO₂ Level (ppm)',
          color: '#84cc16',
          font: { size: 14, weight: 600 as const }
        },
        ticks: { 
          color: '#84cc16',
          callback: function(value: any) {
            return value + ' ppm';
          }
        }, 
        grid: { color: 'rgba(132,204,22,0.1)' } 
      },
      'y-aqi': {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Air Quality Index',
          color: '#059669',
          font: { size: 14, weight: 600 as const }
        },
        ticks: { 
          color: '#059669',
          callback: function(value: any) {
            return 'AQI ' + value;
          }
        },
        grid: { drawOnChartArea: false },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'CO₂ Level (ppm)',
        data: data.co2Data,
        borderColor: '#84cc16',
        backgroundColor: 'rgba(132,204,22,0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y-co2',
        pointBackgroundColor: '#84cc16',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Air Quality Index',
        data: data.aqiData,
        borderColor: '#059669',
        backgroundColor: 'rgba(5,150,105,0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y-aqi',
        pointBackgroundColor: '#059669',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  // Create chart
  useEffect(() => {
    if (!chartRef.current || isLoading) return;

    // Destroy existing chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create new chart instance
    chartInstanceRef.current = new ChartJS(chartRef.current, {
      type: 'line',
      data: chartData,
      options: options,
    });

    // Cleanup function
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data, sensorName, isLoading]);

  // Update chart data when props change
  useEffect(() => {
    if (chartInstanceRef.current && !isLoading) {
      chartInstanceRef.current.data = chartData;
      chartInstanceRef.current.update();
    }
  }, [data, isLoading]);

  const downloadPDF = async () => {
    if (!chartContainerRef.current) return;
    
    try {
      const canvas = await html2canvas(chartContainerRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`${sensorName.replace(/\s+/g, '_')}_air_quality_report.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur rounded-2xl p-6 mb-8 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-lime-200 rounded w-1/3 mx-auto mb-6"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div ref={chartContainerRef} className="relative bg-white/80 backdrop-blur rounded-2xl p-6 mb-8 shadow-lg border border-lime-200/50">
      <button
        onClick={downloadPDF}
        className="absolute top-4 right-4 z-10 p-3 rounded-xl bg-gradient-to-r from-lime-600 to-emerald-600 text-white hover:from-lime-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
        title="Download Chart as PDF"
        aria-label="Download Chart as PDF"
      >
        <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>

      <div className="w-full h-80 md:h-96 lg:h-[28rem]">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};
export default SensorChart;