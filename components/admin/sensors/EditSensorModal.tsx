'use client';

import React, { useState, useEffect } from 'react';
import { AdminSensor, SensorReadingsFormData } from '@/types/sensors/admin';
import { Edit, X, Activity, Gauge, Settings, AlertCircle, Info } from 'lucide-react';

//validation errors interface
interface ValidationErrors {
  lastCO2Reading?: string;
  lastAQIReading?: string;
}

interface EditSensorModalProps {
  sensor: AdminSensor | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (readingsData: SensorReadingsFormData) => void;
}

export const EditSensorModal: React.FC<EditSensorModalProps> = ({
  sensor,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [formData, setFormData] = useState<SensorReadingsFormData>({
    lastCO2Reading: null,
    lastAQIReading: null
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (sensor) {
      setFormData({
        lastCO2Reading: sensor.lastCO2Reading,
        lastAQIReading: sensor.lastAQIReading
      });
      //clear errors when new sensor data is loaded
      setErrors({});
      setSubmitError(null);
    }
  }, [sensor]);

  //validation function
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    //CO2 Level validation
    if (formData.lastCO2Reading !== null) {
      if (formData.lastCO2Reading < 0) {
        newErrors.lastCO2Reading = 'CO₂ level must be a positive value';
      } else if (formData.lastCO2Reading > 50000) {
        newErrors.lastCO2Reading = 'CO₂ level cannot exceed 50,000 ppm (unrealistic value)';
      } else if (!Number.isInteger(formData.lastCO2Reading)) {
        newErrors.lastCO2Reading = 'CO₂ level must be a whole number';
      }
    }

    //AQI Level validation
    if (formData.lastAQIReading !== null) {
      if (formData.lastAQIReading < 0) {
        newErrors.lastAQIReading = 'AQI level must be a positive value';
      } else if (formData.lastAQIReading > 500) {
        newErrors.lastAQIReading = 'AQI level cannot exceed 500';
      } else if (!Number.isInteger(formData.lastAQIReading)) {
        newErrors.lastAQIReading = 'AQI level must be a whole number';
      }
    }

    // Check if both readings are null
    if (formData.lastCO2Reading === null && formData.lastAQIReading === null) {
      newErrors.lastCO2Reading = 'At least one reading (CO₂ or AQI) must be provided';
      newErrors.lastAQIReading = 'At least one reading (CO₂ or AQI) must be provided';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time field validation
  const validateField = (fieldName: keyof SensorReadingsFormData, value: any) => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case 'lastCO2Reading':
        delete newErrors.lastCO2Reading;
        if (value !== null && value !== '') {
          if (value < 0) {
            newErrors.lastCO2Reading = 'CO₂ level must be positive';
          } else if (value > 50000) {
            newErrors.lastCO2Reading = 'CO₂ level too high (max: 50,000 ppm)';
          }
        }
        break;

      case 'lastAQIReading':
        delete newErrors.lastAQIReading;
        if (value !== null && value !== '') {
          if (value < 0) {
            newErrors.lastAQIReading = 'AQI level must be positive';
          } else if (value > 500) {
            newErrors.lastAQIReading = 'AQI level too high (max: 500)';
          }
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    //validate form before submit
    if (!validateForm()) {
      setSubmitError('Please fix the errors above before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      await onConfirm(formData);
      onClose();
    } catch (error: any) {
      console.error('Failed to update sensor readings:', error);
      setSubmitError(error.message || 'Failed to update sensor readings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({
      lastCO2Reading: null,
      lastAQIReading: null
    });
    setErrors({});
    setSubmitError(null);
  };

  // Helper function to get AQI color based on value
  const getAQIColor = (aqi: number | null) => {
    if (!aqi) return 'text-gray-500';
    if (aqi <= 50) return 'text-green-600'; // Good
    if (aqi <= 100) return 'text-yellow-600'; // Moderate
    if (aqi <= 150) return 'text-orange-600'; // Unhealthy for Sensitive
    if (aqi <= 200) return 'text-red-600'; // Unhealthy
    if (aqi <= 300) return 'text-purple-600'; // Very Unhealthy
    return 'text-gray-800'; // Hazardous
  };

  // Helper function to get CO2 color based on value
  const getCO2Color = (co2: number | null) => {
    if (!co2) return 'text-gray-500';
    if (co2 < 400) return 'text-green-600'; // Excellent
    if (co2 < 600) return 'text-lime-600'; // Good
    if (co2 < 1000) return 'text-yellow-600'; // Acceptable
    if (co2 < 5000) return 'text-orange-600'; // Poor
    return 'text-red-600'; // Very Poor
  };

  // Helper function to get status badge based on backend enum
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            🟢 Online
          </span>
        );
      case 'OFFLINE':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            🔴 Offline
          </span>
        );
      case 'MAINTENANCE':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            🔧 Maintenance
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            ⚠️ Error
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            ❓ Unknown
          </span>
        );
    }
  };

  // Error message component
  const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex items-center mt-1 text-red-600 text-xs">
      <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );

  if (!isOpen || !sensor) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-lime-600 to-emerald-600 p-4 sm:p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Update Sensor Readings</h2>
                <p className="text-lime-100 text-xs sm:text-sm mt-1">Edit CO₂ and AQI values only</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Sensor Info (Read-only) */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-lime-500 to-emerald-500 w-12 h-12 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">{sensor.id}</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">{sensor.name}</h3>
              <p className="text-gray-600 text-sm">{sensor.location}</p>
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {sensor.lastReadingTime ? new Date(sensor.lastReadingTime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'No data'}
              </p>
            </div>
          </div>

          {/* Current Status Display (Read-only) */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Settings className="w-4 h-4 mr-2 text-slate-600" />
                <span className="text-sm font-medium text-gray-700">Current Status:</span>
              </div>
              {getStatusBadge(sensor.status)}
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-6">
              Status is managed by system operations and cannot be changed here
            </p>
          </div>
        </div>

        {/* General Error Message */}
        {submitError && (
          <div className="p-4 mx-4 mt-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800 text-sm font-medium">{submitError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {/* CO2 Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-lime-600" />
              CO₂ Level (ppm)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="50000"
                step="1"
                value={formData.lastCO2Reading || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : null;
                  setFormData({ ...formData, lastCO2Reading: value });
                  validateField('lastCO2Reading', value);
                }}
                className={`w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold transition-colors ${
                  errors.lastCO2Reading 
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-2 focus:ring-lime-600 focus:border-lime-600'
                } ${getCO2Color(formData.lastCO2Reading)}`}
                placeholder="Enter CO₂ reading (e.g., 420)"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                ppm
              </div>
            </div>
            
            {/* CO2 Error Message */}
            {errors.lastCO2Reading && <ErrorMessage message={errors.lastCO2Reading} />}
            
            {/* CO2 Level Indicator */}
            <div className="mt-2 text-xs">
              {formData.lastCO2Reading && !errors.lastCO2Reading && (
                <div className={`inline-flex items-center px-2 py-1 rounded-full ${
                  formData.lastCO2Reading < 400 ? 'bg-green-100 text-green-800' :
                  formData.lastCO2Reading < 600 ? 'bg-lime-100 text-lime-800' :
                  formData.lastCO2Reading < 1000 ? 'bg-yellow-100 text-yellow-800' :
                  formData.lastCO2Reading < 5000 ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {formData.lastCO2Reading < 400 ? 'Excellent' :
                   formData.lastCO2Reading < 600 ? 'Good' :
                   formData.lastCO2Reading < 1000 ? 'Acceptable' :
                   formData.lastCO2Reading < 5000 ? 'Poor' : 'Very Poor'}
                </div>
              )}
            </div>
          </div>

          {/* AQI Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Gauge className="w-4 h-4 mr-2 text-emerald-600" />
              Air Quality Index (AQI)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="500"
                step="1"
                value={formData.lastAQIReading || ''}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : null;
                  setFormData({ ...formData, lastAQIReading: value });
                  validateField('lastAQIReading', value);
                }}
                className={`w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold transition-colors ${
                  errors.lastAQIReading 
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600'
                } ${getAQIColor(formData.lastAQIReading)}`}
                placeholder="Enter AQI reading (e.g., 45)"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                AQI
              </div>
            </div>
            
            {/* AQI Error Message */}
            {errors.lastAQIReading && <ErrorMessage message={errors.lastAQIReading} />}
            
            {/* AQI Level Indicator */}
            <div className="mt-2 text-xs">
              {formData.lastAQIReading && !errors.lastAQIReading && (
                <div className={`inline-flex items-center px-2 py-1 rounded-full ${
                  formData.lastAQIReading <= 50 ? 'bg-green-100 text-green-800' :
                  formData.lastAQIReading <= 100 ? 'bg-yellow-100 text-yellow-800' :
                  formData.lastAQIReading <= 150 ? 'bg-orange-100 text-orange-800' :
                  formData.lastAQIReading <= 200 ? 'bg-red-100 text-red-800' :
                  formData.lastAQIReading <= 300 ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {formData.lastAQIReading <= 50 ? 'Good' :
                   formData.lastAQIReading <= 100 ? 'Moderate' :
                   formData.lastAQIReading <= 150 ? 'Unhealthy for Sensitive' :
                   formData.lastAQIReading <= 200 ? 'Unhealthy' :
                   formData.lastAQIReading <= 300 ? 'Very Unhealthy' : 'Hazardous'}
                </div>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 text-sm">Validation Rules</h4>
                <ul className="text-blue-700 text-xs mt-1 space-y-1">
                  <li>• CO₂ levels: Must be positive, maximum 50,000 ppm</li>
                  <li>• AQI values: Must be positive, maximum 500 (EPA scale)</li>
                  <li>• At least one reading (CO₂ or AQI) must be provided</li>
                  <li>• Values must be whole numbers (no decimals)</li>
                  <li>• Sensor status is managed by system operations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className="w-full sm:flex-1 px-4 py-3 bg-gradient-to-r from-lime-600 to-emerald-600 text-white hover:from-lime-700 hover:to-emerald-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-medium"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Updating Readings...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Update Readings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};