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
import { Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
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
  sensorLocation?: string;
  isLoading?: boolean;
}

const SensorChart: React.FC<SensorChartProps> = ({ 
  data, 
  sensorName, 
  sensorLocation = '',
  isLoading 
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);

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

  // Enhanced PDF generation with comprehensive report
  const downloadPDF = async () => {
    if (!chartContainerRef.current) return;
    
    setIsGeneratingPDF(true);
    
    try {
      // Capture the chart with high quality
      const canvas = await html2canvas(chartContainerRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: chartContainerRef.current.offsetWidth,
        height: chartContainerRef.current.offsetHeight,
      });
      
      // Create PDF in landscape mode for better chart visibility
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Colors
      const primaryColor = '#064e3b';
      const secondaryColor = '#84cc16';
      const textColor = '#374151';
      
      // Add header
      pdf.setFillColor(6, 78, 59); // Primary green
      pdf.rect(0, 0, pageWidth, 25, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('BreathSafe - Air Quality Report', 15, 17);
      
      // Add report generation timestamp
      const currentDate = new Date().toLocaleString();
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on: ${currentDate}`, pageWidth - 60, 17);

      // Sensor Information Section
      let yPosition = 35;
      pdf.setTextColor(textColor);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Sensor Information', 15, yPosition);
      
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Sensor Name: ${sensorName}`, 15, yPosition);
      
      if (sensorLocation) {
        yPosition += 8;
        pdf.text(`Location: ${sensorLocation}`, 15, yPosition);
      }
      
      yPosition += 8;
      pdf.text(`Monitoring Period: Past 7 Days`, 15, yPosition);
      
      yPosition += 8;
      pdf.text(`Report Type: Air Quality Data Analysis`, 15, yPosition);

      // Add chart image
      yPosition += 15;
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth - 30; // 15mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Ensure chart fits on page
      const maxHeight = pageHeight - yPosition - 30; // Leave space for footer
      const finalHeight = Math.min(imgHeight, maxHeight);
      const finalWidth = (canvas.width * finalHeight) / canvas.height;
      
      // Center the image
      const xPosition = (pageWidth - finalWidth) / 2;
      pdf.addImage(imgData, 'PNG', xPosition, yPosition, finalWidth, finalHeight);

      // Calculate data statistics
      const avgCO2 = data.co2Data.length > 0 
        ? Math.round(data.co2Data.reduce((a, b) => a + b, 0) / data.co2Data.length)
        : 0;
      const maxCO2 = data.co2Data.length > 0 ? Math.max(...data.co2Data) : 0;
      const minCO2 = data.co2Data.length > 0 ? Math.min(...data.co2Data) : 0;
      
      const avgAQI = data.aqiData.length > 0 
        ? Math.round(data.aqiData.reduce((a, b) => a + b, 0) / data.aqiData.length)
        : 0;
      const maxAQI = data.aqiData.length > 0 ? Math.max(...data.aqiData) : 0;
      const minAQI = data.aqiData.length > 0 ? Math.min(...data.aqiData) : 0;

      // Add second page for detailed statistics
      pdf.addPage();
      
      // Header for second page
      pdf.setFillColor(6, 78, 59);
      pdf.rect(0, 0, pageWidth, 25, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Data Analysis & Statistics', 15, 17);

      // Statistics Section
      yPosition = 40;
      pdf.setTextColor(textColor);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CO₂ Levels Summary (ppm)', 15, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Average CO₂ Level: ${avgCO2} ppm`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Maximum CO₂ Level: ${maxCO2} ppm`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Minimum CO₂ Level: ${minCO2} ppm`, 20, yPosition);

      yPosition += 20;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Air Quality Index Summary', 15, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Average AQI: ${avgAQI}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Maximum AQI: ${maxAQI}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Minimum AQI: ${minAQI}`, 20, yPosition);

      // Add recommendations section
      yPosition += 20;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Air Quality Assessment', 15, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      // CO2 Assessment
      let co2Status = 'Good';
      let co2Color = '#22c55e';
      if (avgCO2 > 1000) {
        co2Status = 'Poor - Ventilation Needed';
        co2Color = '#ef4444';
      } else if (avgCO2 > 800) {
        co2Status = 'Moderate - Consider Ventilation';
        co2Color = '#f59e0b';
      }
      
      pdf.text(`CO₂ Level Status: ${co2Status}`, 20, yPosition);
      
      yPosition += 10;
      // AQI Assessment
      let aqiStatus = 'Good';
      if (avgAQI > 100) {
        aqiStatus = 'Unhealthy for Sensitive Groups';
      } else if (avgAQI > 50) {
        aqiStatus = 'Moderate';
      }
      
      pdf.text(`Air Quality Status: ${aqiStatus}`, 20, yPosition);

      // Footer for all pages
      const addFooter = (pageNum: number, totalPages: number) => {
        pdf.setFontSize(8);
        pdf.setTextColor(textColor);
        pdf.setFont('helvetica', 'normal');
        
        // Footer line
        pdf.setDrawColor(200, 200, 200);
        pdf.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
        
        // Footer text
        pdf.text('Generated by BreathSafe Air Quality Monitoring System', 15, pageHeight - 8);
        pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 30, pageHeight - 8);
      };

      // Add footers to all pages
      const totalPages = pdf.internal.pages.length - 1; // Subtract 1 because pages array includes a blank first element
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        addFooter(i, totalPages);
      }

      // Save the PDF
      const fileName = `${sensorName.replace(/\s+/g, '_')}_Air_Quality_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
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
        disabled={isGeneratingPDF}
        className={`absolute top-4 right-4 z-10 p-3 rounded-xl bg-gradient-to-r from-lime-600 to-emerald-600 text-white hover:from-lime-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 group ${
          isGeneratingPDF ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title="Download Comprehensive Air Quality Report"
        aria-label="Download Chart as PDF Report"
      >
        {isGeneratingPDF ? (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </div>
        )}
      </button>

      <div className="w-full h-80 md:h-96 lg:h-[28rem]">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default SensorChart;
