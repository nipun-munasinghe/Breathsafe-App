"use client";

import React, { useState } from "react";
import SensorList from "@/components/admin/all-sensors/sensor_List";
import UpdateSensorModal from "@/components/admin/all-sensors/updateSensorModel";

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

export default function AllSensorsPage() {
  const [sensors, setSensors] = useState<Sensor[]>([
    // Mock data - replace with actual API call
    {
      id: 1,
      name: "Colombo Central CO₂ Sensor",
      location: "Colombo 07, Sri Lanka",
      latitude: 6.9271,
      longitude: 79.8612,
      status: "ONLINE",
      installationDate: "2024-01-15T10:30:00Z",
      lastMaintenance: "2024-01-20T14:00:00Z",
      batteryLevel: 85,
      isActive: true,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-20T14:00:00Z",
    },
    {
      id: 2,
      name: "Kandy Air Quality Monitor",
      location: "Kandy, Sri Lanka",
      latitude: 7.2906,
      longitude: 80.6337,
      status: "MAINTENANCE",
      installationDate: "2024-01-10T09:15:00Z",
      lastMaintenance: "2024-01-25T11:30:00Z",
      batteryLevel: 45,
      isActive: true,
      createdAt: "2024-01-10T09:15:00Z",
      updatedAt: "2024-01-25T11:30:00Z",
    },
    {
      id: 3,
      name: "Galle Environmental Sensor",
      location: "Galle, Sri Lanka",
      latitude: 6.0535,
      longitude: 80.221,
      status: "OFFLINE",
      installationDate: "2024-01-05T08:45:00Z",
      lastMaintenance: "2024-01-15T16:20:00Z",
      batteryLevel: 15,
      isActive: false,
      createdAt: "2024-01-05T08:45:00Z",
      updatedAt: "2024-01-15T16:20:00Z",
    },
  ]);

  const [editingSensor, setEditingSensor] = useState<Sensor | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (sensor: Sensor) => {
    setEditingSensor(sensor);
    setShowEditModal(true);
  };

  const handleSave = (updatedSensor: Partial<Sensor>) => {
    if (editingSensor) {
      setSensors((prev) =>
        prev.map((sensor) =>
          sensor.id === editingSensor.id
            ? { ...sensor, ...updatedSensor }
            : sensor
        )
      );
    }
    setShowEditModal(false);
    setEditingSensor(null);
  };

  const handleDelete = (sensorId: number) => {
    if (confirm("Are you sure you want to delete this sensor?")) {
      setSensors((prev) => prev.filter((sensor) => sensor.id !== sensorId));
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingSensor(null);
  };

  return (
    <div className="px-3 md:px-4 mx-auto w-full pt-1 pb-7 mb-8">
      <SensorList
        sensors={sensors}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <UpdateSensorModal
        sensor={editingSensor}
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSave={handleSave}
      />
    </div>
  );
}
