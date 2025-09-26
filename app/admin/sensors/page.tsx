'use client';

import React, { useState, useEffect } from 'react';
import { AdminSensor } from '@/types/sensors/admin';
import { CardSensorList } from '@/components/admin/sensors/CardSensorList';
import { EditSensorModal } from '@/components/admin/sensors/EditSensorModal';
import { ClearSensorDataModal } from '@/components/admin/sensors/ClearSensorDataModal';
import { getSensors, updateSensorReadings, clearSensorData } from '@/service/admin/sensorApi';

const AdminSensors: React.FC = () => {
  const [sensors, setSensors] = useState<AdminSensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSensor, setSelectedSensor] = useState<AdminSensor | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSensors, setTotalSensors] = useState(0);

  // Load sensors
  const loadSensors = async () => {
    setLoading(true);
    try {
      const response = await getSensors(currentPage, 10, searchTerm);
      setSensors(response.sensors);
      setTotalSensors(response.total);
    } catch (error) {
      console.error('Error loading sensors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSensors();
  }, [currentPage, searchTerm]);

  const handleEdit = (sensor: AdminSensor) => {
    console.log('Opening edit modal for sensor:', sensor.id);
    setSelectedSensor(sensor);
    setShowEditModal(true);
  };

  const handleClearData = (sensor: AdminSensor) => {
    console.log('Opening clear data modal for sensor:', sensor.id);
    setSelectedSensor(sensor);
    setShowClearDataModal(true);
  };

  // Update sensor readings
  const handleUpdateSensor = async (readingsData: any) => {
    if (!selectedSensor) return;

    try {
      await updateSensorReadings(selectedSensor.id, readingsData);
      await loadSensors(); // Reload the list
      console.log('Sensor readings updated successfully');
    } catch (error) {
      console.error('Error updating sensor readings:', error);
      throw error;
    }
  };

  // Clear sensor data
  const handleClearSensorData = async () => {
    if (!selectedSensor) return;

    try {
      await clearSensorData(selectedSensor.id);
      await loadSensors(); // Reload the list
      console.log('Sensor data cleared successfully');
    } catch (error) {
      console.error('Error clearing sensor data:', error);
    }
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <>
      <div className="w-full mb-12 xl:mb-0 px-4">
        <CardSensorList
          sensors={sensors}
          loading={loading}
          totalSensors={totalSensors}
          onEdit={handleEdit}
          onClearData={handleClearData}
          onSearch={handleSearch}
          onRefresh={loadSensors}
        />
      </div>

      {/* Edit Modal */}
      <EditSensorModal
        sensor={selectedSensor}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedSensor(null);
        }}
        onConfirm={handleUpdateSensor}
      />

      {/* Clear Data Modal */}
      <ClearSensorDataModal
        sensor={selectedSensor}
        isOpen={showClearDataModal}
        onClose={() => {
          setShowClearDataModal(false);
          setSelectedSensor(null);
        }}
        onConfirm={handleClearSensorData}
      />
    </>
  );
};
export default AdminSensors;