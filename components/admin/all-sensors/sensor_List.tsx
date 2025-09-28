"use client";

import React, { useState } from "react";
import {
  Eye,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Battery,
  Activity,
  Clock,
} from "lucide-react";

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

interface SensorListProps {
  sensors: Sensor[];
  onEdit: (sensor: Sensor) => void;
  onDelete: (sensorId: number) => void;
}

const SensorList: React.FC<SensorListProps> = ({
  sensors,
  onEdit,
  onDelete,
}) => {
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const handleViewInfo = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setShowViewModal(true);
  };

  const getStatusColor = (status: SensorStatus) => {
    switch (status) {
      case "ONLINE":
        return "bg-green-100 text-green-800";
      case "OFFLINE":
        return "bg-red-100 text-red-800";
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-800";
      case "ERROR":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-lime-600 to-emerald-800 p-8">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Activity className="w-6 h-6 mr-2" />
            Sensor List
          </h2>
          <p className="text-lime-100 text-sm mt-1">
            Manage all sensors in the system
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sensors.map((sensor) => (
                <tr key={sensor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{sensor.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {sensor.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {sensor.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        sensor.status
                      )}`}
                    >
                      {sensor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        sensor.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {sensor.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewInfo(sensor)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(sensor)}
                        className="text-green-600 hover:text-green-900 p-1 rounded-lg hover:bg-green-50"
                        title="Edit Sensor"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(sensor.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50"
                        title="Delete Sensor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Info Modal */}
      {showViewModal && selectedSensor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-600 to-emerald-800 p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center">
                <MapPin className="w-6 h-6 mr-2" />
                Sensor Details
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                {selectedSensor.name}
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sensor ID
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-semibold">
                    #{selectedSensor.id}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-semibold">
                    {selectedSensor.name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-semibold">
                    {selectedSensor.location}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <span
                    className={`inline-flex px-3 py-2 text-sm font-semibold rounded-lg ${getStatusColor(
                      selectedSensor.status
                    )}`}
                  >
                    {selectedSensor.status}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-semibold">
                    {selectedSensor.latitude.toFixed(6)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-semibold">
                    {selectedSensor.longitude.toFixed(6)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-lime-600" />
                    Installation Date
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-semibold">
                    {new Date(selectedSensor.installationDate).toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-lime-600" />
                    Last Maintenance
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-semibold">
                    {selectedSensor.lastMaintenance
                      ? new Date(
                          selectedSensor.lastMaintenance
                        ).toLocaleString()
                      : "Never"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Battery className="w-4 h-4 mr-2 text-lime-600" />
                    Battery Level
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-semibold">
                    {selectedSensor.batteryLevel
                      ? `${selectedSensor.batteryLevel}%`
                      : "N/A"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Active Status
                  </label>
                  <span
                    className={`inline-flex px-3 py-2 text-sm font-semibold rounded-lg ${
                      selectedSensor.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedSensor.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Created At
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-semibold">
                    {new Date(selectedSensor.createdAt).toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Updated At
                  </label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-semibold">
                    {new Date(selectedSensor.updatedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SensorList;
