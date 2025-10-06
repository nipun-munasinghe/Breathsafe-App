"use client";

import React, { useEffect, useState } from "react";
import SensorList from "@/components/admin/all-sensors/sensor_List";
import UpdateSensorModal from "@/components/admin/all-sensors/updateSensorModel";
import { deleteSensor, updateSensor, getAllSensors } from "@/service/sensorApi";
import ToastUtils from "@/utils/toastUtils";
import { SensorStatus } from "@/types/sensors/admin";

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
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [editingSensor, setEditingSensor] = useState<Sensor | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSensors = async () => {
    setLoading(true);
    try {
      const response = await getAllSensors();
      if (response?.success && response.data) {
        setSensors(response?.data);
      } else {
        ToastUtils.error("Failed to fetch sensors." + response?.error);
      }
    } catch (error) {
      console.error("Failed to fetch sensors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  const handleEdit = (sensor: Sensor) => {
    setEditingSensor(sensor);
    setShowEditModal(true);
  };

  const handleSave = async (updatedSensor: Partial<Sensor>) => {
    if (!editingSensor) return;

    try {
      const updateData = {
        name: updatedSensor.name as string,
        location: updatedSensor.location as string,
        latitude: updatedSensor.latitude as number,
        longitude: updatedSensor.longitude as number,
        status: updatedSensor.status as SensorStatus,
        installationDate: updatedSensor.installationDate as string,
        lastMaintenance: updatedSensor.lastMaintenance as string,
        isActive: updatedSensor.isActive as boolean,
        batteryLevel: updatedSensor.batteryLevel ?? null,
      };

      const response = await updateSensor(editingSensor.id, updateData);

      if (response?.success) {
        setSensors((prev) =>
          prev.map((sensor) =>
            sensor.id === editingSensor.id
              ? { ...sensor, ...updatedSensor }
              : sensor
          )
        );

        ToastUtils.success("Sensor updated successfully");
        setShowEditModal(false);
        setEditingSensor(null);

        await fetchSensors();
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Unknown error";
      ToastUtils.error("Failed to update sensor: " + message);
    }
  };

  const handleDelete = async (sensorId: number) => {
    if (confirm("Are you sure you want to delete this sensor?")) {
      setSensors((prev) => prev.filter((sensor) => sensor.id !== sensorId));
      const response = await deleteSensor(sensorId);
      if (!response?.success) {
        ToastUtils.error("Failed to delete sensor. " + response?.error);
        await fetchSensors();
      }
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

