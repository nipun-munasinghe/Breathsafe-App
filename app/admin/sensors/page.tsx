'use client';

import React, { useState, useEffect } from 'react';
import { AdminSensor } from '@/types/sensors/admin';
import { CardSensorList } from '@/components/admin/sensors/CardSensorList';
import { EditSensorModal } from '@/components/admin/sensors/EditSensorModal';
import { DeleteSensorModal } from '@/components/admin/sensors/DeleteSensorModal';
import { getSensors, updateSensorReadings, deleteSensor } from '@/service/admin/sensorApi';

const AdminSensors: React.FC = () => {
  const [sensors, setSensors] = useState<AdminSensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSensor, setSelectedSensor] = useState<AdminSensor | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const handleDelete = (sensor: AdminSensor) => {
    console.log('Opening delete modal for sensor:', sensor.id);
    setSelectedSensor(sensor);
    setShowDeleteModal(true);
  };

  //updateSensorReadings
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

  const handleDeleteSensor = async () => {
    if (!selectedSensor) return;

    try {
      await deleteSensor(selectedSensor.id);
      await loadSensors(); // Reload the list
      console.log('Sensor deleted successfully');
    } catch (error) {
      console.error('Error deleting sensor:', error);
    }
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); //reset to first page when searching
  };

  return (
    <>
      <div className="w-full mb-12 xl:mb-0 px-4">
        <CardSensorList
          sensors={sensors}
          loading={loading}
          totalSensors={totalSensors}
          onEdit={handleEdit}
          onDelete={handleDelete}
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

      {/* Delete Modal */}
      <DeleteSensorModal
        sensor={selectedSensor}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedSensor(null);
        }}
        onConfirm={handleDeleteSensor}
      />
    </>
  );
};

export default AdminSensors;