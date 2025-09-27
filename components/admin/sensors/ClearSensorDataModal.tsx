'use client';

import React, { useState } from 'react';
import { AdminSensor } from '@/types/sensors/admin';
import { clearSensorData } from '@/service/admin/sensorDataApi';
import { RotateCcw, AlertTriangle, X, MapPin, Calendar, Database, CheckCircle } from 'lucide-react';

interface ClearSensorDataModalProps {
  sensor: AdminSensor | null;
  sensorDataId?: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSuccess?: () => void;
}

export const ClearSensorDataModal: React.FC<ClearSensorDataModalProps> = ({
  sensor,
  sensorDataId,
  isOpen,
  onClose,
  onConfirm,
  onSuccess
}) => {
  const [isClearing, setIsClearing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClearData = async () => {
    if (!sensor || !sensorDataId) {
      setError('Invalid sensor data - cannot proceed with deletion');
      return;
    }

    setIsClearing(true);
    setError(null);
    
    try {
      //call the real API to delete sensor data
      await clearSensorData(sensorDataId);
      
      setShowSuccess(true);
      onConfirm();
      onSuccess?.();
      
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
      
    } catch (error: any) {
      console.error('Failed to clear sensor data:', error);
      setError(error.message || 'Failed to clear sensor data');
    } finally {
      setIsClearing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'text-green-600';
      case 'OFFLINE':
        return 'text-red-600';
      case 'MAINTENANCE':
        return 'text-yellow-600';
      case 'ERROR':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusDisplayText = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'Online';
      case 'OFFLINE':
        return 'Offline';
      case 'MAINTENANCE':
        return 'Maintenance';
      case 'ERROR':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  if (!isOpen || !sensor) return null;

  //success state
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Data Cleared Successfully!</h2>
          <p className="text-gray-600 mb-4">
            Sensor data for <strong>{sensor.name}</strong> has been cleared.
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 sm:p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Clear Sensor Data</h2>
                <p className="text-orange-100 text-xs sm:text-sm mt-1">This will delete the data row permanently</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1 text-sm">Error</h3>
                  <p className="text-red-700 text-xs">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Warning Message */}
          <div className="bg-orange-50 border-l-4 border-orange-400 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 mb-1 text-sm sm:text-base">
                  Permanently Delete Sensor Data?
                </h3>
                <p className="text-orange-700 text-xs sm:text-sm">
                  You are about to permanently delete the data row for <strong className="font-semibold">{sensor.name}</strong>. 
                  This action cannot be undone.
                  {sensorDataId && <><br /><strong>Data ID: {sensorDataId}</strong></>}
                </p>
              </div>
            </div>
          </div>

          {/* Sensor Summary Card */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{sensor.id}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                  {sensor.name}
                </h4>
                <div className="flex items-center text-gray-600 text-xs sm:text-sm mt-1">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{sensor.location}</span>
                </div>
              </div>
            </div>

            {/* Current Data Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs sm:text-sm">
              <div className="bg-white rounded-lg p-3">
                <span className="text-gray-600 block">Status</span>
                <span className={`font-semibold ${getStatusColor(sensor.status)}`}>
                  {getStatusDisplayText(sensor.status)}
                </span>
              </div>
              <div className="bg-white rounded-lg p-3">
                <span className="text-gray-600 block">Last Reading</span>
                <span className="font-semibold text-gray-800">
                  {sensor.lastReadingTime ? formatDate(sensor.lastReadingTime) : 'No data'}
                </span>
              </div>
              <div className="bg-white rounded-lg p-3">
                <span className="text-gray-600 block">CO₂ Level</span>
                <span className="font-semibold text-red-600">
                  {sensor.lastCO2Reading ? `${sensor.lastCO2Reading} ppm` : 'No data'}
                </span>
              </div>
              <div className="bg-white rounded-lg p-3">
                <span className="text-gray-600 block">AQI Value</span>
                <span className="font-semibold text-red-600">
                  {sensor.lastAQIReading ? sensor.lastAQIReading : 'No data'}
                </span>
              </div>
            </div>

            <div className="flex items-center text-gray-500 text-xs mt-3 pt-3 border-t border-gray-200">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Created: {formatDate(sensor.createdAt)}</span>
            </div>
          </div>

          {/* What Will Happen */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Database className="w-4 h-4 text-red-600 mr-2" />
              <h4 className="font-medium text-red-900 text-sm">This will permanently delete:</h4>
            </div>
            <ul className="text-red-800 text-xs space-y-1">
              <li>• Complete data row from database</li>
              <li>• CO₂ and AQI readings</li>
              <li>• Timestamp information</li>
              <li>• Historical record</li>
            </ul>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-900 text-sm mb-1">⚠️ Warning:</h4>
                <p className="text-yellow-800 text-xs">
                  This operation permanently deletes the data row and cannot be reversed. 
                  The sensor configuration will remain intact for future data collection.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isClearing}
              className="w-full sm:flex-1 px-4 py-3 sm:py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleClearData}
              disabled={isClearing || !sensorDataId}
              className="w-full sm:flex-1 px-4 py-3 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
            >
              {isClearing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  <span className="text-sm">Deleting...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  <span className="text-sm">Delete Data</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile-specific confirmation text */}
          <div className="block sm:hidden text-center pt-2">
            <p className="text-xs text-gray-500">
              Tap &quot;Delete Data&quot; to permanently remove this data row
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};