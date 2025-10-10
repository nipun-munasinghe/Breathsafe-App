'use client';

import React, { JSX, useState, useEffect, useCallback } from 'react';
import { AdminSensor, SensorDataDisplayDTO } from '@/types/sensors/admin';
import { getSensorDisplayData } from '@/service/admin/sensorDataApi';
import { ClearSensorDataModal } from './ClearSensorDataModal';
import { EditSensorModal } from './EditSensorModal';
import { updateSensorReadings } from '@/service/admin/sensorDataApi';
import { Search, RefreshCw, Activity, Edit, RotateCcw, MapPin, ExternalLink, Wifi, WifiOff, Eye, AlertCircle, Settings } from 'lucide-react';
import Link from 'next/link';

//convert SensorDataDisplayDTO to AdminSensor format with correct field names and null safety
const convertToAdminSensor = (displayData: SensorDataDisplayDTO): AdminSensor => {
  return {
    id: displayData.sensorId || 0,
    name: displayData.name || 'Unknown Sensor',
    location: displayData.location || 'Unknown Location',
    latitude: displayData.latitude || 0,
    longitude: displayData.longitude || 0,
    lastCO2Reading: displayData.co2Level,
    lastAQIReading: displayData.aqiValue,
    status: displayData.status || 'UNKNOWN',
    lastReadingTime: displayData.timestamp,
    isOnline: displayData.status === 'ONLINE',
    createdAt: displayData.createdAt || new Date().toISOString(),
    updatedAt: displayData.createdAt || new Date().toISOString()
  };
};

const SensorCard: React.FC<{ 
  sensor: AdminSensor;
  sensorDataId?: number;
  onEdit: (sensor: AdminSensor) => void;
  onClearData: (sensor: AdminSensor, dataId?: number) => void;
  formatDate: (dateString: string | null) => string;
  openInMaps: (lat: number, lng: number) => void;
  getStatusBadge: (status: string) => JSX.Element;
}> = ({ sensor, sensorDataId, onEdit, onClearData, formatDate, openInMaps, getStatusBadge }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
    {/* Header with ID and Status */}
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <div className="bg-gradient-to-br from-lime-500 to-emerald-500 w-10 h-10 rounded-full flex items-center justify-center mr-3">
          <span className="text-white font-bold text-sm">{sensor.id}</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm">{sensor.name}</h3>
          <p className="text-xs text-gray-500">
            Sensor ID: {sensor.id}
            {sensorDataId && <span className="ml-2">Data ID: {sensorDataId}</span>}
          </p>
        </div>
      </div>
      {getStatusBadge(sensor.status)}
    </div>

    {/* Location */}
    <div className="mb-3">
      <div className="flex items-start mb-1">
        <MapPin className="w-4 h-4 text-lime-600 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-slate-700 text-sm">{sensor.location}</p>
          <div className="flex items-center text-gray-500 text-xs mt-1">
            <span className="font-mono">
              {sensor.latitude.toFixed(4)}, {sensor.longitude.toFixed(4)}
            </span>
            <button
              onClick={() => openInMaps(sensor.latitude, sensor.longitude)}
              className="ml-2 text-lime-600 hover:text-lime-700 p-1 hover:bg-lime-50 rounded"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Readings */}
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-600 mb-1">CO₂ Level</p>
        <p className="font-bold text-slate-800">
          {sensor.lastCO2Reading ? `${sensor.lastCO2Reading} ppm` : 'No data'}
        </p>
      </div>
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-600 mb-1">AQI Value</p>
        <p className="font-bold text-slate-800">
          {sensor.lastAQIReading ? sensor.lastAQIReading : 'No data'}
        </p>
      </div>
    </div>

    {/* Last Reading Time */}
    <div className="mb-4">
      <p className="text-xs text-gray-600">Last Reading: {formatDate(sensor.lastReadingTime)}</p>
      <p className="text-xs text-gray-500">Created: {formatDate(sensor.createdAt)}</p>
    </div>

    {/* Actions */}
    <div className="flex space-x-2">
      <Link href={`/sensor/${sensor.id}`} className="flex-1">
        <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-xs font-medium">
          <Eye className="w-3 h-3 mr-1" />
          View
        </button>
      </Link>
      <button
        onClick={() => onEdit(sensor)}
        className="flex-1 bg-lime-600 text-white px-3 py-2 rounded-lg hover:bg-lime-700 transition-colors flex items-center justify-center text-xs font-medium"
      >
        <Edit className="w-3 h-3 mr-1" />
        Edit
      </button>
      <button
        onClick={() => onClearData(sensor, sensorDataId)}
        disabled={!sensor.lastCO2Reading && !sensor.lastAQIReading}
        className="flex-1 bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RotateCcw className="w-3 h-3 mr-1" />
        Clear Data
      </button>
    </div>
  </div>
);

export const CardSensorList: React.FC = () => {
  const [sensors, setSensors] = useState<AdminSensor[]>([]);
  const [sensorDisplayData, setSensorDisplayData] = useState<SensorDataDisplayDTO[]>([]);
  const [filteredSensors, setFilteredSensors] = useState<AdminSensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  //modal states
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); // Add this
  const [selectedSensor, setSelectedSensor] = useState<AdminSensor | null>(null);
  const [selectedDataId, setSelectedDataId] = useState<number | undefined>();

  //load real sensor data from backend
  const loadSensors = useCallback(async () => {
    setLoading(true);
    try {
      const displayData = await getSensorDisplayData();
      setSensorDisplayData(displayData);
      const convertedSensors = displayData.map(convertToAdminSensor);
      setSensors(convertedSensors);
      
      // apply search filter to new data with null safety
      if (searchTerm.trim() === '') {
        setFilteredSensors(convertedSensors);
      } else {
        const searchLower = searchTerm.toLowerCase();
        const filtered = convertedSensors.filter(sensor => {
          // Add null safety checks
          const name = sensor.name || '';
          const location = sensor.location || '';
          const status = sensor.status || '';
          
          return name.toLowerCase().includes(searchLower) ||
                 location.toLowerCase().includes(searchLower) ||
                 status.toLowerCase().includes(searchLower);
        });
        setFilteredSensors(filtered);
      }
    } catch (error) {
      console.error('Error loading sensors:', error);
      setSensors([]);
      setFilteredSensors([]);
      setSensorDisplayData([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    loadSensors();
  }, [loadSensors]);

  //apply filter whenever sensors data changes with NULL SAFETY
  useEffect(() => {
    if (!sensors || sensors.length === 0) {
      setFilteredSensors([]);
      return;
    }

    if (searchTerm.trim() === '') {
      setFilteredSensors(sensors);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = sensors.filter(sensor => {
        // add null safety checks
        if (!sensor) return false;
        
        const name = (sensor.name || '').toString().toLowerCase();
        const location = (sensor.location || '').toString().toLowerCase();
        const status = (sensor.status || '').toString().toLowerCase();
        
        return name.includes(searchLower) ||
               location.includes(searchLower) ||
               status.includes(searchLower);
      });
      setFilteredSensors(filtered);
    }
  }, [sensors, searchTerm]);

  //Updated search handler
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleRefresh = () => {
    loadSensors();
  };

  const formatDate = useCallback((dateString: string | null) => {
    if (!dateString) return 'No data';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const openInMaps = useCallback((lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  }, []);

  //handle edit with real API integration
  const handleEdit = (sensor: AdminSensor) => {
    console.log('Edit sensor readings:', sensor);
    setSelectedSensor(sensor);
    setEditModalOpen(true);
  };

  //handle edit confirmation with real API call
  const handleEditConfirm = async (readingsData: any) => {
    if (!selectedSensor) return;

    try {
      //find the corresponding data ID
      const displayDataItem = sensorDisplayData.find(item => item.sensorId === selectedSensor.id);
      if (!displayDataItem?.dataId) {
        throw new Error('No data ID found for this sensor');
      }

      //call the real API
      const updatedSensor = await updateSensorReadings(displayDataItem.dataId, readingsData);
      
      //update local state
      setSensors(prevSensors => 
        prevSensors.map(sensor => 
          sensor.id === updatedSensor.id ? updatedSensor : sensor
        )
      );

      console.log('Sensor readings updated successfully:', updatedSensor);
      
      //refresh the list to get the latest data
      setTimeout(() => loadSensors(), 500);
      
    } catch (error) {
      console.error('Failed to update sensor readings:', error);
      throw error;
    }
  };

  //handle clear data
  const handleClearData = (sensor: AdminSensor, dataId?: number) => {
    console.log('Clear data for sensor:', sensor, 'Data ID:', dataId);
    
    //find the corresponding data ID from display data
    const displayDataItem = sensorDisplayData.find(item => item.sensorId === sensor.id);
    const actualDataId = dataId || displayDataItem?.dataId;
    
    if (!actualDataId) {
      alert('No data ID found - cannot delete data');
      return;
    }
    
    setSelectedSensor(sensor);
    setSelectedDataId(actualDataId);
    setClearModalOpen(true);
  };

  //handle modal confirm
  const handleModalConfirm = () => {
    console.log('Data clearing confirmed for sensor:', selectedSensor);
  };

  //handle successful deletion
  const handleDeleteSuccess = () => {
    console.log('Data deleted successfully, refreshing list...');
    loadSensors();
  };

  //handle modal close
  const handleModalClose = () => {
    setClearModalOpen(false);
    setSelectedSensor(null);
    setSelectedDataId(undefined);
  };

  //handle edit modal close
  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedSensor(null);
  };

  //status Badge
  const getStatusBadge = useCallback((status: string) => {
    const safeStatus = status || 'UNKNOWN';
    switch (safeStatus) {
      case 'ONLINE':
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <Wifi className="w-3 h-3 mr-1" />
            Online
          </span>
        );
      case 'OFFLINE':
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <WifiOff className="w-3 h-3 mr-1" />
            Offline
          </span>
        );
      case 'MAINTENANCE':
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <Settings className="w-3 h-3 mr-1" />
            Maintenance
          </span>
        );
      case 'ERROR':
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            Error
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <WifiOff className="w-3 h-3 mr-1" />
            Unknown
          </span>
        );
    }
  }, []);

  return (
    <>
      <div className="relative flex flex-col break-words bg-white w-full mb-6 shadow-lg rounded-2xl border border-gray-100">
        {/* Header - Always visible */}
        <div className="rounded-t-2xl mb-0 px-4 sm:px-6 py-4 sm:py-6 border-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-lime-600 to-emerald-600 p-2 sm:p-3 rounded-xl mr-3 sm:mr-4">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl sm:text-2xl text-slate-900">Sensor Data Display</h3>
                <p className="text-gray-600 text-sm sm:text-base">Real-time air quality monitoring ({filteredSensors.length} sensors)</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search sensors..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none w-full sm:w-64"
                />
              </div>

              <button
                onClick={handleRefresh}
                className="bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-700 transition-colors flex items-center justify-center"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 pb-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-lime-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">Loading sensors...</p>
              </div>
            </div>
          ) : filteredSensors.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchTerm ? 'No Sensors Found' : 'No Sensors Available'}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? `No sensors match "${searchTerm}"` : 'No sensors available to display'}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile View - Cards */}
              <div className="block lg:hidden">
                <div className="space-y-4">
                  {filteredSensors.map((sensor) => {
                    const displayDataItem = sensorDisplayData.find(item => item.sensorId === sensor.id);
                    return (
                      <SensorCard 
                        key={sensor.id} 
                        sensor={sensor}
                        sensorDataId={displayDataItem?.dataId}
                        onEdit={handleEdit}
                        onClearData={handleClearData}
                        formatDate={formatDate}
                        openInMaps={openInMaps}
                        getStatusBadge={getStatusBadge}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Desktop View - Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="items-center bg-transparent w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Sensor Details
                      </th>
                      <th className="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Location
                      </th>
                      <th className="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Last Readings
                      </th>
                      <th className="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Status
                      </th>
                      <th className="px-6 bg-slate-50 text-slate-500 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSensors.map((sensor) => {
                      const displayDataItem = sensorDisplayData.find(item => item.sensorId === sensor.id);
                      return (
                        <tr key={sensor.id} className="hover:bg-slate-50 transition-colors">
                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            <div className="flex items-center">
                              <div className="bg-gradient-to-br from-lime-500 to-emerald-500 w-10 h-10 rounded-full flex items-center justify-center mr-4">
                                <span className="text-white font-bold text-sm">{sensor.id}</span>
                              </div>
                              <div>
                                <span className="font-bold text-slate-600">{sensor.name}</span>
                                <div className="text-xs text-gray-500 mt-1">
                                  Created: {formatDate(sensor.createdAt)}
                                  {displayDataItem?.dataId && <><br />Data ID: {displayDataItem.dataId}</>}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            <div>
                              <div className="flex items-center mb-1">
                                <MapPin className="w-4 h-4 text-lime-600 mr-1" />
                                <span className="font-semibold text-slate-700">{sensor.location}</span>
                              </div>
                              <div className="flex items-center text-gray-500">
                                <span className="font-mono text-xs">
                                  {sensor.latitude.toFixed(4)}, {sensor.longitude.toFixed(4)}
                                </span>
                                <button
                                  onClick={() => openInMaps(sensor.latitude, sensor.longitude)}
                                  className="ml-2 text-lime-600 hover:text-lime-700 p-1 hover:bg-lime-50 rounded"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </td>

                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            <div>
                              <div className="flex items-center mb-1">
                                <span className="text-gray-600">CO₂:</span>
                                <span className="ml-2 font-semibold text-slate-700">
                                  {sensor.lastCO2Reading ? `${sensor.lastCO2Reading} ppm` : 'No data'}
                                </span>
                              </div>
                              <div className="flex items-center mb-1">
                                <span className="text-gray-600">AQI:</span>
                                <span className="ml-2 font-semibold text-slate-700">
                                  {sensor.lastAQIReading ? sensor.lastAQIReading : 'No data'}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                Last: {formatDate(sensor.lastReadingTime)}
                              </div>
                            </div>
                          </td>

                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            {getStatusBadge(sensor.status)}
                          </td>

                          <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            <div className="flex space-x-2">
                              <Link href={`/sensor/${sensor.id}`}>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-xs font-medium">
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </button>
                              </Link>
                              <button
                                onClick={() => handleEdit(sensor)}
                                className="bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-700 transition-colors flex items-center text-xs font-medium"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleClearData(sensor, displayDataItem?.dataId)}
                                disabled={!sensor.lastCO2Reading && !sensor.lastAQIReading}
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <RotateCcw className="w-3 h-3 mr-1" />
                                Clear Data
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Clear Sensor Data Modal */}
      <ClearSensorDataModal
        sensor={selectedSensor}
        sensorDataId={selectedDataId}
        isOpen={clearModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        onSuccess={handleDeleteSuccess}
      />

      {/* Edit Sensor Readings Modal */}
      <EditSensorModal
        sensor={selectedSensor}
        isOpen={editModalOpen}
        onClose={handleEditModalClose}
        onConfirm={handleEditConfirm}
      />
    </>
  );
};