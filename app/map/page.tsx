'use client';

import React, {useEffect, useState, useMemo} from 'react';
import {Activity, Info, Loader, MapPin, RefreshCw, Search} from 'lucide-react';
import SensorsMapComponent from "@/components/map/SensorsMapComponent";
import {aqiConfig, SensorData, statusConfig} from "@/types/map";
import {SensorPopup} from "@/components/map/SensorPopup";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

const SensorsMapPage: React.FC = () => {
    const [sensors, setSensors] = useState<SensorData[]>([]);
    const [filteredSensors, setFilteredSensors] = useState<SensorData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSensor, setSelectedSensor] = useState<SensorData | null>(null);
    const [popupPosition, setPopupPosition] = useState({x: 0, y: 0});
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [aqiFilter, setAqiFilter] = useState<string>('ALL');

    const mockSensors: SensorData[] = useMemo(() => [
        {
            sensorId: 1,
            name: "Sensor A",
            location: "Colombo",
            latitude: 6.9271,
            longitude: 79.8612,
            status: "ONLINE",
            isActive: true,
            temperature: 27.5,
            humidity: 65.2,
            co2Level: 410.0,
            aqiValue: 45,
            aqiCategory: "GOOD",
            dataTimestamp: "2025-09-27T19:30:00"
        },
        {
            sensorId: 2,
            name: "Sensor B",
            location: "Kandy",
            latitude: 7.2906,
            longitude: 80.6337,
            status: "ONLINE",
            isActive: true,
            temperature: 24.8,
            humidity: 72.1,
            co2Level: 425.0,
            aqiValue: 78,
            aqiCategory: "MODERATE",
            dataTimestamp: "2025-09-27T19:28:00"
        },
        {
            sensorId: 3,
            name: "Sensor C",
            location: "Galle",
            latitude: 6.0535,
            longitude: 80.2210,
            status: "MAINTENANCE",
            isActive: false,
            temperature: 29.2,
            humidity: 68.9,
            co2Level: 395.0,
            aqiValue: 125,
            aqiCategory: "UNHEALTHY_FOR_SENSITIVE",
            dataTimestamp: "2025-09-27T18:45:00"
        },
    ], []);

    // Fetch sensors data - FIXED: removed mockSensors from dependency array
    useEffect(() => {
        const fetchSensors = async () => {
            setIsLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
                setSensors(mockSensors);
            } catch (error) {
                console.error('Failed to fetch sensors:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSensors();
    }, []);

    // Filter sensors
    useEffect(() => {
        const filtered = sensors.filter(sensor => {
            const matchesSearch = sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sensor.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'ALL' || sensor.status === statusFilter;
            const matchesAqi = aqiFilter === 'ALL' || sensor.aqiCategory === aqiFilter;

            return matchesSearch && matchesStatus && matchesAqi;
        });

        setFilteredSensors(filtered);
    }, [sensors, searchTerm, statusFilter, aqiFilter]);

    // Handle sensor hover
    const handleSensorHover = (sensor: SensorData | null, position?: { x: number; y: number }) => {
        if (sensor && position) {
            setSelectedSensor(sensor);
            setPopupPosition(position);
            setIsPopupVisible(true);
        } else {
            setIsPopupVisible(false);
        }
    };

    // Handle sensor click
    const handleSensorClick = (sensor: SensorData) => {
        console.log(sensor);
    };

    // Calculate statistics
    const onlineSensors = sensors.filter(s => s.status === 'ONLINE').length;
    const goodAqi = sensors.filter(s => s.aqiCategory === 'GOOD').length;
    const averageAqi = sensors.length > 0
        ? Math.round(sensors.reduce((sum, s) => sum + s.aqiValue, 0) / sensors.length)
        : 0;

    return (
        <>
            <Header/>
            <div className="min-h-screen pt-20">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <div className="flex flex-col lg:flex-row items-center justify-between">
                                <div className="flex items-center mb-4 lg:mb-0">
                                    <div
                                        className="bg-gradient-to-br from-lime-600 to-emerald-600 p-4 rounded-2xl mr-4 shadow-lg">
                                        <Activity className="w-8 h-8 text-white"/>
                                    </div>
                                    <div className="text-left">
                                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Air Quality Network</h1>
                                        <p className="text-gray-600">Real-time monitoring across Sri Lanka</p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center space-x-6">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-lime-600">{onlineSensors}</p>
                                        <p className="text-sm text-gray-500">Online</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-emerald-600">{goodAqi}</p>
                                        <p className="text-sm text-gray-500">Good AQI</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600">{averageAqi}</p>
                                        <p className="text-sm text-gray-500">Avg AQI</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border border-gray-100">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center space-x-4 flex-1">
                                <div className="relative flex-1 max-w-md">
                                    <Search
                                        className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"/>
                                    <input
                                        type="text"
                                        placeholder="Search sensors or locations..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none w-full"/>
                                </div>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none"
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="ONLINE">Online</option>
                                    <option value="OFFLINE">Offline</option>
                                    <option value="MAINTENANCE">Maintenance</option>
                                </select>

                                <select
                                    value={aqiFilter}
                                    onChange={(e) => setAqiFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none"
                                >
                                    <option value="ALL">All AQI</option>
                                    <option value="GOOD">Good</option>
                                    <option value="MODERATE">Moderate</option>
                                    <option value="UNHEALTHY_FOR_SENSITIVE">Unhealthy for Sensitive</option>
                                    <option value="UNHEALTHY">Unhealthy</option>
                                    <option value="VERY_UNHEALTHY">Very Unhealthy</option>
                                    <option value="HAZARDOUS">Hazardous</option>
                                </select>
                            </div>

                            <button
                                onClick={() => window.location.reload()}
                                className="bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-950 transition-colors flex items-center"
                            >
                                <RefreshCw className="w-4 h-4 mr-2"/>
                                Refresh
                            </button>
                        </div>
                    </div>

                    {/* Map Container - FIXED: Removed dynamic import and loading wrapper */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="h-96 lg:h-[600px] relative">
                            {isLoading ? (
                                <div
                                    className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-orange-100">
                                    <div className="text-center">
                                        <Loader className="w-12 h-12 text-lime-600 animate-spin mx-auto mb-4"/>
                                        <p className="text-gray-600 font-medium">Loading sensors...</p>
                                    </div>
                                </div>
                            ) : (
                                <SensorsMapComponent
                                    sensors={filteredSensors}
                                    onSensorHover={handleSensorHover}
                                    onSensorClick={handleSensorClick}/>
                            )}

                            {/* Legend */}
                            {!isLoading && (
                                <div
                                    className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg z-[1000]">
                                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                                        <Info className="w-4 h-4 mr-2"/>
                                        AQI Legend
                                    </h4>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 rounded-full mr-2"
                                                 style={{backgroundColor: '#10b981'}}></div>
                                            <span>Good (0-50)</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 rounded-full mr-2"
                                                 style={{backgroundColor: '#F59E0B'}}></div>
                                            <span>Moderate (51-100)</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 rounded-full mr-2"
                                                 style={{backgroundColor: '#F97316'}}></div>
                                            <span>Unhealthy for Sensitive (101-150)</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 rounded-full mr-2"
                                                 style={{backgroundColor: '#ef4444'}}></div>
                                            <span>Unhealthy (151-200)</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sensor List */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSensors.map(sensor => {
                            const aqiData = aqiConfig[sensor.aqiCategory];
                            const statusData = statusConfig[sensor.status];
                            const StatusIcon = statusData.icon;

                            return (
                                <div
                                    key={sensor.sensorId}
                                    onClick={() => handleSensorClick(sensor)}
                                    className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 hover:shadow-xl transition-shadow cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{sensor.name}</h3>
                                            <div className="flex items-center text-gray-600 text-sm mt-1">
                                                <MapPin className="w-3 h-3 mr-1"/>
                                                {sensor.location}
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <StatusIcon className="w-4 h-4 mr-1" style={{color: statusData.color}}/>
                                            <span className="text-xs font-medium" style={{color: statusData.color}}>
                                            {statusData.label}
                                        </span>
                                        </div>
                                    </div>

                                    <div
                                        className="rounded-lg p-3 mb-3"
                                        style={{backgroundColor: aqiData.bgColor}}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-medium" style={{color: aqiData.textColor}}>
                                                    AQI
                                                </p>
                                                <p className="text-xl font-bold" style={{color: aqiData.color}}>
                                                    {sensor.aqiValue}
                                                </p>
                                            </div>
                                            <p className="text-xs font-semibold" style={{color: aqiData.textColor}}>
                                                {aqiData.label}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div className="text-center">
                                            <p className="text-gray-500">Temp</p>
                                            <p className="font-semibold text-slate-900">{sensor.temperature}°C</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-500">Humidity</p>
                                            <p className="font-semibold text-slate-900">{sensor.humidity}%</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-500">CO₂</p>
                                            <p className="font-semibold text-slate-900">{sensor.co2Level}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* Sensor Popup */}
                <SensorPopup
                    sensor={selectedSensor!}
                    isVisible={isPopupVisible}
                    position={popupPosition}
                    onClose={() => setIsPopupVisible(false)}/>
            </div>
            <Footer/>
        </>
    );
};

export default SensorsMapPage;