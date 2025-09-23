'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Thermometer, Droplets, Wind, ArrowLeft, AlertCircle } from 'lucide-react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { ProtectedRoute } from '@/components/common/protectedRoute';
import SensorStatsGrid from '@/components/sensor/SensorStatsGrid';
import SensorChart from '@/components/sensor/SensorChart';
import { getSensorById, getSensorDataByWeek, getSensorStats } from '@/service/sensorApi';
import { Sensor, ChartData, SensorStats, AQICategory } from '@/types/sensor/types';
import ToastUtils from '@/utils/toastUtils';

export default function SensorDetails() {
  const params = useParams();
  const router = useRouter();
  const sensorId = params.id as string;

  const [sensor, setSensor] = useState<Sensor | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [stats, setStats] = useState<SensorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API calls
  /*
  useEffect(() => {
    const fetchSensorData = async () => {
      if (!sensorId) return;

      setIsLoading(true);
      setError(null);

      try {
        const [sensorData, weekData, statsData] = await Promise.all([
          getSensorById(sensorId),
          getSensorDataByWeek(sensorId),
          getSensorStats(sensorId)
        ]);

        setSensor(sensorData);
        setChartData(weekData);
        setStats(statsData);
      } catch (error: any) {
        console.error('Error fetching sensor data:', error);
        setError(error.message || 'Failed to load sensor data');
        ToastUtils.error('Failed to load sensor data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSensorData();
  }, [sensorId]);
  */

  // Dummy data
  useEffect(() => {
    const fetchSensorData = async () => {
      if (!sensorId) return;

      setIsLoading(true);
      setError(null);

      try {
        const [sensorData, weekData, statsData] = await Promise.all([
          getSensorById(sensorId),
          getSensorDataByWeek(sensorId),
          getSensorStats(sensorId)
        ]);

        setSensor(sensorData);
        setChartData(weekData);
        setStats(statsData);
      } catch (error: any) {
        console.error('Error fetching sensor data:', error);
        setError(error.message || 'Failed to load sensor data');
        ToastUtils.error('Failed to load sensor data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSensorData();
  }, [sensorId]);

  /*const getAQIColor =*/ (category: AQICategory) => {
    switch (category) {
      case AQICategory.GOOD:
        return 'text-green-600 bg-green-100';
      case AQICategory.MODERATE:
        return 'text-yellow-600 bg-yellow-100';
      case AQICategory.UNHEALTHY_FOR_SENSITIVE:
        return 'text-orange-600 bg-orange-100';
      case AQICategory.UNHEALTHY:
        return 'text-red-600 bg-red-100';
      case AQICategory.VERY_UNHEALTHY:
        return 'text-purple-600 bg-purple-100';
      case AQICategory.HAZARDOUS:
        return 'text-gray-800 bg-gray-300';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (error) {
    return (
      <ProtectedRoute>
        <Header />
        <main className="min-h-screen" style={{ background: "linear-gradient(to bottom, #064E3B 0%, #0F172A 30%, #FFFFFF 50%, #FFFFFF 100%)" }}>
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mt-20 text-center">
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Sensor</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => router.back()}
                  className="bg-lime-600 text-white px-6 py-2 rounded-lg hover:bg-lime-700 transition"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Header />
      
      <main className="min-h-screen" style={{ background: "linear-gradient(to bottom, #064E3B 0%, #0F172A 30%, #FFFFFF 50%, #FFFFFF 100%)" }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          
          {/* Back Button */}
          <div className="mt-20 mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center text-white hover:text-lime-200 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Map
            </button>
          </div>

          {/* Sensor Header */}
          <div className="text-center mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-lime-600">
              <div className="flex flex-col lg:flex-row items-center justify-center mb-6">
                <div className="bg-gradient-to-br from-lime-600 to-emerald-600 p-4 rounded-2xl mb-4 lg:mb-0 lg:mr-6 shadow-lg">
                  <Wind className="w-12 h-12 text-white" />
                </div>
                <div className="text-center lg:text-left">
                  <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
                    {isLoading ? 'Loading...' : sensor?.name}
                  </h1>
                  <div className="h-1 w-20 bg-gradient-to-r from-lime-600 to-emerald-600 rounded-full mx-auto lg:mx-0 mb-3"></div>
                  <div className="flex items-center justify-center lg:justify-start text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{isLoading ? 'Loading location...' : sensor?.location}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                Real-time air quality monitoring data including CO₂ levels and Air Quality Index measurements 
                from this sensor location. Data is updated continuously for accurate environmental monitoring.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <SensorStatsGrid 
            stats={stats || { todaysReadings: 0, sensorStatus: '0', lastAQIReading: 0, monitoring: '...' }}
            isLoading={isLoading}
          />

          {/* Chart Section */}
          <SensorChart 
            data={chartData || { labels: [], co2Data: [], aqiData: [] }}
            sensorName={sensor?.name || 'Sensor'}
            isLoading={isLoading}
          />

          {/* Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-lime-200/50">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Thermometer className="w-5 h-5 mr-2 text-lime-600" />
                About CO₂ Monitoring
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>Carbon dioxide (CO₂) levels are measured in parts per million (ppm) and indicate air quality and ventilation effectiveness.</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-800">Good</div>
                    <div className="text-sm text-green-600"> &lt;400 ppm</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="font-semibold text-yellow-800">Elevated</div>
                    <div className="text-sm text-yellow-600">400-1000 ppm</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border border-lime-200/50">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <Droplets className="w-5 h-5 mr-2 text-emerald-600" />
                Air Quality Index (AQI)
              </h3>
              <div className="space-y-3 text-gray-600">
                <p>The AQI is a standardized way to measure and report daily air quality, helping you understand pollution levels.</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-800">Good</div>
                    <div className="text-sm text-green-600">0-50 AQI</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="font-semibold text-yellow-800">Moderate</div>
                    <div className="text-sm text-yellow-600">51-100 AQI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </ProtectedRoute>
  );
}