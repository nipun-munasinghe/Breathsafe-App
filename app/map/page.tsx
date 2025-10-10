'use client';

import React, {useEffect, useState} from 'react';
import {Activity, Info, Loader, RefreshCw, Search} from 'lucide-react';
import SensorsMapComponent from "@/components/map/SensorsMapComponent";
import {SensorData} from "@/types/map";
import {SensorPopup} from "@/components/map/SensorPopup";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import {getSensorswithLatestData} from "@/service/sensorApi";
import {useRouter} from "next/navigation";

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
    const router = useRouter();

    useEffect(() => {
        const fetchSensors = async () => {
            setIsLoading(true);
            try {
                const response = await getSensorswithLatestData();
                if (response?.success) {
                    setSensors(response.data);
                }
                if(response?.error){
                    console.error('Error fetching sensors:', response.error);
                }
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
            const matchesSearch = sensor.sensorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sensor.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'ALL' || sensor.sensorStatus === statusFilter;
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
        router.push(`/sensor/${sensor.sensorId}`);
    };

    // Calculate statistics
    const onlineSensors = sensors.filter(s => s.sensorStatus === 'ONLINE').length;
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
                                    <option value="ERROR">Error</option>
                                </select>

                                <select
                                    value={aqiFilter}
                                    onChange={(e) => setAqiFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none"
                                >
                                    <option value="ALL">All AQI</option>
                                    <option value="GOOD">Good</option>
                                    <option value="MODERATE">Moderate</option>
                                    <option value="UNHEALTHY_SENSITIVE">Unhealthy for Sensitive</option>
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