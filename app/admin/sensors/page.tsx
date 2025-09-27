'use client';

import React from 'react';
import { CardSensorList } from '@/components/admin/sensors/CardSensorList';

const AdminSensors: React.FC = () => {
  return (
    <div className="w-full mb-12 xl:mb-0 px-4">
      <CardSensorList />
    </div>
  );
};

export default AdminSensors;