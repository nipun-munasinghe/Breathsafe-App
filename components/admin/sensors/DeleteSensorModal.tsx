'use client';

import React, { useState } from 'react';
import { AdminSensor } from '@/types/sensors/admin';
import { Trash2, AlertTriangle, X, MapPin, Calendar } from 'lucide-react';

interface DeleteSensorModalProps {
  sensor: AdminSensor | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteSensorModal: React.FC<DeleteSensorModalProps> = ({
  sensor,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Failed to delete sensor:', error);
    } finally {
      setIsDeleting(false);
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

  // Helper function to get status color based on backend enum
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

  // Helper function to format status display text
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 sm:p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Delete Sensor</h2>
                <p className="text-red-100 text-xs sm:text-sm mt-1">This action cannot be undone</p>
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
          {/* Warning Message */}
          <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1 text-sm sm:text-base">
                  Permanently Delete Sensor?
                </h3>
                <p className="text-red-700 text-xs sm:text-sm">
                  You are about to delete <strong className="font-semibold">{sensor.name}</strong>. 
                  This will permanently remove all historical data and cannot be reversed.
                </p>
              </div>
            </div>
          </div>

          {/* Sensor Summary Card */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="bg-gradient-to-br from-red-500 to-red-600 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0">
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

            {/* Sensor Details Grid */}
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
                <span className="font-semibold text-gray-800">
                  {sensor.lastCO2Reading ? `${sensor.lastCO2Reading} ppm` : 'No data'}
                </span>
              </div>
              <div className="bg-white rounded-lg p-3">
                <span className="text-gray-600 block">AQI Value</span>
                <span className="font-semibold text-gray-800">
                  {sensor.lastAQIReading ? sensor.lastAQIReading : 'No data'}
                </span>
              </div>
            </div>

            <div className="flex items-center text-gray-500 text-xs mt-3 pt-3 border-t border-gray-200">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Created: {formatDate(sensor.createdAt)}</span>
            </div>
          </div>

          {/* What Will Be Deleted */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-900 mb-2 text-sm">What will be deleted:</h4>
            <ul className="text-amber-800 text-xs sm:text-sm space-y-1">
              <li>• All sensor configuration data</li>
              <li>• Historical CO₂ and AQI readings</li>
              <li>• Location and calibration settings</li>
              <li>• Associated reports and analytics</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 px-4 py-3 sm:py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full sm:flex-1 px-4 py-3 sm:py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  <span className="text-sm">Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span className="text-sm">Delete Permanently</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile-specific confirmation text */}
          <div className="block sm:hidden text-center pt-2">
            <p className="text-xs text-gray-500">
              Tap &quot;Delete Permanently&quot; to confirm deletion
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};