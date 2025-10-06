import React from "react";
import {aqiConfig, SensorData, statusConfig} from "@/types/map";
import {Clock, Droplets, MapPin, Thermometer, Wind} from "lucide-react";
import {useRouter} from "next/navigation";

export const SensorPopup: React.FC<{
    sensor: SensorData;
    isVisible: boolean;
    position: { x: number; y: number };
    onClose: () => void;
}> = ({sensor, isVisible, position}) => {
    const router = useRouter();

    if (!isVisible) return null;

    const aqiData = aqiConfig[sensor.aqiCategory];
    const statusData = statusConfig[sensor.status];
    const StatusIcon = statusData.icon;

    const formatTimestamp = (timestamp: string) => {
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleSensorClick = () => {
        router.push(`/sensor/${sensor.sensorId}`);
    };

    return (
        <div
            className="fixed z-1000 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-80"
            style={{
                left: `${Math.min(position.x, window.innerWidth - 320)}px`,
                top: `${Math.max(position.y - 350, 10)}px`
            }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{sensor.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mr-1"/>
                        {sensor.location}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        <StatusIcon className="w-4 h-4 mr-1" style={{color: statusData.color}}/>
                        <span className="text-sm font-medium" style={{color: statusData.color}}>
              {statusData.label}
            </span>
                    </div>
                </div>
            </div>

            {/* AQI Display */}
            <div
                className="rounded-xl p-4 mb-4"
                style={{backgroundColor: aqiData.bgColor}}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium" style={{color: aqiData.textColor}}>
                            Air Quality Index
                        </p>
                        <p className="text-2xl font-bold" style={{color: aqiData.color}}>
                            {sensor.aqiValue}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold" style={{color: aqiData.textColor}}>
                            {aqiData.label}
                        </p>
                        <p className="text-xs" style={{color: aqiData.textColor}}>
                            Range: {aqiData.range}
                        </p>
                    </div>
                </div>
            </div>

            {/* Sensor Readings */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center text-gray-600 text-sm mb-1">
                        <Thermometer className="w-4 h-4 mr-1"/>
                        Temperature
                    </div>
                    <p className="text-lg font-bold text-slate-900">{sensor.temperature}°C</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center text-gray-600 text-sm mb-1">
                        <Droplets className="w-4 h-4 mr-1"/>
                        Humidity
                    </div>
                    <p className="text-lg font-bold text-slate-900">{sensor.humidity}%</p>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 col-span-2">
                    <div className="flex items-center text-gray-600 text-sm mb-1">
                        <Wind className="w-4 h-4 mr-1"/>
                        CO₂ Level
                    </div>
                    <p className="text-lg font-bold text-slate-900">{sensor.co2Level} ppm</p>
                </div>
            </div>

            {/* Last Updated */}
            <div className="flex items-center text-xs text-gray-500 mb-4">
                <Clock className="w-3 h-3 mr-1"/>
                Last updated: {formatTimestamp(sensor.dataTimestamp)}
            </div>

            {/* Action Button */}
            <button
                onClick={handleSensorClick}
                className="w-full bg-gradient-to-r from-lime-600 to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-lime-700 hover:to-emerald-700 transition-all"
            >
                View 24-Hour Data
            </button>
        </div>
    );
};