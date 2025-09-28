"use client";

import React, {useEffect, useState} from "react";
import SensorList from "@/components/admin/all-sensors/sensor_List";
import UpdateSensorModal from "@/components/admin/all-sensors/updateSensorModel";
import {deleteSensor, getAllSensors} from "@/service/sensorApi";
import ToastUtils from "@/utils/toastUtils";
import {SensorStatus} from "@/types/sensors/admin";

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

    const fetchSensors = async () => {
        try {
            const response = await getAllSensors();
            if (response?.success) {
                setSensors(response?.data);
            }
            else{
                ToastUtils.error("Failed to fetch sensors." + response?.error);
            }
        } catch (error) {
            console.error('Failed to fetch sensors:', error);
        } finally {
        }
    };

    useEffect(() => {
        fetchSensors();
    }, []);

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

  const handleDelete = async (sensorId: number) => {
    if (confirm("Are you sure you want to delete this sensor?")) {
      setSensors((prev) => prev.filter((sensor) => sensor.id !== sensorId));
      const response = await deleteSensor(sensorId);
      if(!response?.success){
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
