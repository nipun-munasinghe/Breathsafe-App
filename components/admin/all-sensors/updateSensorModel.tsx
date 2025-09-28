"use client";

import React, { useState, useEffect } from "react";
import { X, MapPin, Calendar, Battery, Clock, Save } from "lucide-react";
import dynamic from "next/dynamic";

// Load MapSelector client-side to avoid SSR issues
const MapSelector = dynamic(() => import("@/components/requests/MapSelector"), { ssr: false });

type SensorStatus = "ONLINE" | "OFFLINE" | "MAINTENANCE" | "ERROR";

interface Sensor {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: SensorStatus;
  installationDate: string;
  lastMaintenance?: string;
  batteryLevel?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UpdateSensorModalProps {
  sensor: Sensor | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSensor: Partial<Sensor>) => void;
}

const UpdateSensorModal: React.FC<UpdateSensorModalProps> = ({
  sensor,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Sensor>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const statusOptions: SensorStatus[] = ["ONLINE", "OFFLINE", "MAINTENANCE", "ERROR"];

  useEffect(() => {
    if (sensor) {
      setFormData({
        ...sensor,
        installationDate: sensor.installationDate ? new Date(sensor.installationDate).toISOString().slice(0, 16) : "",
        lastMaintenance: sensor.lastMaintenance ? new Date(sensor.lastMaintenance).toISOString().slice(0, 16) : "",
      });
    }
  }, [sensor]);

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      location: address,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      const updatedSensor = {
        ...formData,
        installationDate: formData.installationDate ? new Date(formData.installationDate).toISOString() : sensor?.installationDate,
        lastMaintenance: formData.lastMaintenance ? new Date(formData.lastMaintenance).toISOString() : sensor?.lastMaintenance,
      };

      onSave(updatedSensor);
      onClose();
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to update sensor");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !sensor) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-green-600 to-emerald-800 p-6 rounded-t-2xl">
          <h3 className="text-xl font-bold text-white flex items-center">
            <MapPin className="w-6 h-6 mr-2" />
            Edit Sensor
          </h3>
          <p className="text-green-100 text-sm mt-1">Update sensor details and location</p>
        </div>

        {submitError && (
          <div className="p-4 mx-4 mt-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <span className="text-red-800 text-sm font-medium">{submitError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sensor Name *</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Colombo Central CO₂ Sensor"
                className="w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold transition-colors border-gray-300 focus:ring-2 focus:ring-lime-600 focus:border-lime-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-lime-600" />
                Installation Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.installationDate || ""}
                onChange={(e) => setFormData({...formData, installationDate: e.target.value})}
                className="w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold transition-colors border-gray-300 focus:ring-2 focus:ring-lime-600 focus:border-lime-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select
                value={formData.status || ""}
                onChange={(e) => setFormData({...formData, status: e.target.value as SensorStatus})}
                className="w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold transition-colors border-gray-300 focus:ring-2 focus:ring-lime-600 focus:border-lime-600"
                required
              >
                <option value="" disabled>Select status</option>
                {statusOptions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2 text-lime-600" />
                Last Maintenance
              </label>
              <input
                type="datetime-local"
                value={formData.lastMaintenance || ""}
                onChange={(e) => setFormData({...formData, lastMaintenance: e.target.value})}
                className="w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold transition-colors border-gray-300 focus:ring-2 focus:ring-lime-600 focus:border-lime-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Battery className="w-4 h-4 mr-2 text-lime-600" />
                Battery Level (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.batteryLevel || ""}
                onChange={(e) => setFormData({...formData, batteryLevel: e.target.value ? parseInt(e.target.value) : undefined})}
                placeholder="0-100"
                className="w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold transition-colors border-gray-300 focus:ring-2 focus:ring-lime-600 focus:border-lime-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Active Status</label>
              <button
                type="button"
                onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                className={`w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold flex items-center justify-between transition-colors ${
                  formData.isActive ? "border-lime-600 bg-lime-50" : "border-gray-300 bg-white"
                }`}
              >
                <span className="text-gray-700">{formData.isActive ? "Active" : "Inactive"}</span>
                <span className={`w-3 h-3 rounded-full ${formData.isActive ? "bg-green-500" : "bg-gray-400"}`}></span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Select Location on Map *</label>
              <MapSelector
                onLocationSelect={handleLocationSelect}
                selectedLat={formData.latitude}
                selectedLng={formData.longitude}
                className="w-full h-72"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Latitude *</label>
                <input
                  type="number"
                  value={formData.latitude || ""}
                  onChange={(e) => setFormData({...formData, latitude: e.target.value ? parseFloat(e.target.value) : 0})}
                  placeholder="6.9271"
                  className="w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold transition-colors border-gray-300 focus:ring-2 focus:ring-lime-600 focus:border-lime-600"
                  required
                  step="any"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Longitude *</label>
                <input
                  type="number"
                  value={formData.longitude || ""}
                  onChange={(e) => setFormData({...formData, longitude: e.target.value ? parseFloat(e.target.value) : 0})}
                  placeholder="79.8612"
                  className="w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold transition-colors border-gray-300 focus:ring-2 focus:ring-lime-600 focus:border-lime-600"
                  required
                  step="any"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Auto-filled from map selection"
                  className="w-full px-3 py-3 text-sm border rounded-lg outline-none font-semibold transition-colors border-gray-300 focus:ring-2 focus:ring-lime-600 focus:border-lime-600"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Click on the map to autofill this field.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-white font-semibold flex items-center gap-2 bg-lime-600 hover:bg-emerald-950 disabled:bg-lime-300 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
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

export default UpdateSensorModal;
