'use client';

import React, { useState, useEffect } from 'react';
import { AdminSensor, SensorFormData } from '@/types/sensors/admin';
import { Edit, X } from 'lucide-react';

interface EditSensorModalProps {
  sensor: AdminSensor | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (sensorData: SensorFormData) => void;
}

export const EditSensorModal: React.FC<EditSensorModalProps> = ({
  sensor,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [formData, setFormData] = useState<SensorFormData>({
    name: '',
    location: '',
    latitude: 0,
    longitude: 0,
    status: 'Active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (sensor) {
      setFormData({
        name: sensor.name,
        location: sensor.location,
        latitude: sensor.latitude,
        longitude: sensor.longitude,
        status: sensor.status
      });
    }
  }, [sensor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onConfirm(formData);
      onClose();
    } catch (error) {
      console.error('Failed to update sensor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({
      name: '',
      location: '',
      latitude: 0,
      longitude: 0,
      status: 'Active'
    });
  };

  if (!isOpen || !sensor) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-lime-600 to-emerald-600 p-4 sm:p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Edit className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-white" />
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Edit Sensor</h2>
                <p className="text-lime-100 text-xs sm:text-sm mt-1">Update sensor information</p>
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

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sensor Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none"
              required
              placeholder="e.g., AQM-2024-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none"
              required
              placeholder="e.g., Colombo Central Park"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude *
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none"
                required
                placeholder="6.9271"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude *
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none"
                required
                placeholder="79.8612"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="w-full sm:flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 px-4 py-2 bg-lime-600 text-white hover:bg-lime-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Update Sensor
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};