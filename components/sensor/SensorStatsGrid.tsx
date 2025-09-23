'use client';
import React from 'react';
import { Activity, Calendar, Wifi, Clock } from 'lucide-react';
import { SensorStats } from '@/types/sensor/types';

interface SensorStatsGridProps {
  stats: SensorStats;
  isLoading?: boolean;
}

const SensorStatsGrid: React.FC<SensorStatsGridProps> = ({ stats, isLoading }) => {
  const getStatusColor = (status: string) => {
    return status === 'Active' 
      ? 'text-green-600 bg-green-100 border-green-200' 
      : 'text-red-600 bg-red-100 border-red-200';
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-600'; // Good
    if (aqi <= 100) return 'text-yellow-600'; // Moderate
    if (aqi <= 150) return 'text-orange-600'; // Unhealthy for Sensitive
    if (aqi <= 200) return 'text-red-600'; // Unhealthy
    if (aqi <= 300) return 'text-purple-600'; // Very Unhealthy
    return 'text-gray-800'; // Hazardous
  };

  const statsData = [
    {
      label: "Today's Readings",
      value: isLoading ? "..." : stats.todaysReadings.toLocaleString(),
      icon: Calendar,
      color: "lime",
      isStatus: false
    },
    {
      label: "Sensor Status",
      value: isLoading ? "..." : stats.sensorStatus,
      icon: Wifi,
      color: "emerald",
      isStatus: true
    },
    {
      label: "Last AQI Reading",
      value: isLoading ? "..." : stats.lastAQIReading.toString(),
      icon: Activity,
      color: "lime",
      isAQI: true
    },
    {
      label: "Monitoring",
      value: isLoading ? "..." : stats.monitoring,
      icon: Clock,
      color: "emerald",
      isStatus: false
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div 
            key={stat.label} 
            className="bg-white/80 backdrop-blur p-6 rounded-2xl border border-lime-200/50 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${
                stat.color === 'lime' 
                  ? 'from-lime-100 to-lime-200' 
                  : 'from-emerald-100 to-emerald-200'
              }`}>
                <IconComponent className={`w-6 h-6 ${
                  stat.color === 'lime' ? 'text-lime-600' : 'text-emerald-600'
                }`} />
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold mb-1 ${
                stat.isStatus && !isLoading 
                  ? getStatusColor(stats.sensorStatus).split(' ')[0] 
                  : stat.isAQI && !isLoading
                    ? getAQIColor(stats.lastAQIReading)
                    : stat.color === 'lime' ? 'text-lime-600' : 'text-emerald-600'
              }`}>
                {stat.isStatus && !isLoading ? (
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(stats.sensorStatus)}`}>
                    {stat.value}
                  </span>
                ) : stat.isAQI && !isLoading ? (
                  <span>
                    {stat.value} <span className="text-sm">AQI</span>
                  </span>
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default SensorStatsGrid;