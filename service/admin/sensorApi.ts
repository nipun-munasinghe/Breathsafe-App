import privateAxios from '@/lib/privateAxios';
import { AdminSensor, SensorListResponse, SensorFormData } from '@/types/sensors/admin';

// Original API calls
/*
export const getSensors = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<SensorListResponse> => {
  try {
    const response = await privateAxios.get<SensorListResponse>('/admin/sensors', {
      params: { page, limit, search }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch sensors');
  }
};

export const createSensor = async (sensorData: SensorFormData): Promise<AdminSensor> => {
  try {
    const response = await privateAxios.post<AdminSensor>('/admin/sensors', sensorData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create sensor');
  }
};

export const updateSensor = async (id: number, sensorData: SensorFormData): Promise<AdminSensor> => {
  try {
    const response = await privateAxios.put<AdminSensor>(`/admin/sensors/${id}`, sensorData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update sensor');
  }
};

export const deleteSensor = async (id: number): Promise<void> => {
  try {
    await privateAxios.delete(`/admin/sensors/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete sensor');
  }
};
*/

// Dummy data implementations
const mockSensors: AdminSensor[] = [
  {
    id: 1,
    name: "AQM-2024-001",
    location: "Colombo Central Park",
    latitude: 6.9271,
    longitude: 79.8612,
    lastCO2Reading: 420,
    lastAQIReading: 45,
    status: 'Active',
    lastReadingTime: "2025-09-23T08:30:00.000Z",
    isOnline: true,
    createdAt: "2025-09-01T10:00:00.000Z",
    updatedAt: "2025-09-23T08:30:00.000Z"
  },
  {
    id: 2,
    name: "AQM-2024-002",
    location: "Kandy City Center",
    latitude: 7.2906,
    longitude: 80.6337,
    lastCO2Reading: 385,
    lastAQIReading: 38,
    status: 'Active',
    lastReadingTime: "2025-09-23T08:25:00.000Z",
    isOnline: true,
    createdAt: "2025-09-02T11:00:00.000Z",
    updatedAt: "2025-09-23T08:25:00.000Z"
  },
  {
    id: 3,
    name: "AQM-2024-003",
    location: "Galle Harbor Area",
    latitude: 6.0329,
    longitude: 80.2168,
    lastCO2Reading: null,
    lastAQIReading: null,
    status: 'Inactive',
    lastReadingTime: null,
    isOnline: false,
    createdAt: "2025-09-03T09:00:00.000Z",
    updatedAt: "2025-09-20T16:00:00.000Z"
  },
  {
    id: 4,
    name: "AQM-2024-004",
    location: "Negombo Beach Road",
    latitude: 7.2083,
    longitude: 79.8358,
    lastCO2Reading: 456,
    lastAQIReading: 52,
    status: 'Active',
    lastReadingTime: "2025-09-23T08:20:00.000Z",
    isOnline: true,
    createdAt: "2025-09-04T14:00:00.000Z",
    updatedAt: "2025-09-23T08:20:00.000Z"
  },
  {
    id: 5,
    name: "AQM-2024-005",
    location: "Kegalle Industrial Zone",
    latitude: 7.2513,
    longitude: 80.3464,
    lastCO2Reading: 478,
    lastAQIReading: 58,
    status: 'Active',
    lastReadingTime: "2025-09-23T08:15:00.000Z",
    isOnline: true,
    createdAt: "2025-09-05T12:00:00.000Z",
    updatedAt: "2025-09-23T08:15:00.000Z"
  }
];

export const getSensors = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<SensorListResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  let filteredSensors = [...mockSensors];

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredSensors = filteredSensors.filter(sensor =>
      sensor.name.toLowerCase().includes(searchLower) ||
      sensor.location.toLowerCase().includes(searchLower) ||
      sensor.status.toLowerCase().includes(searchLower)
    );
  }

  // Apply pagination
  const startIndex = (page - 1) * limit;
  const paginatedSensors = filteredSensors.slice(startIndex, startIndex + limit);

  return {
    sensors: paginatedSensors,
    total: filteredSensors.length,
    page,
    limit
  };
};

export const createSensor = async (sensorData: SensorFormData): Promise<AdminSensor> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const newSensor: AdminSensor = {
    id: mockSensors.length + 1,
    ...sensorData,
    lastCO2Reading: null,
    lastAQIReading: null,
    lastReadingTime: null,
    isOnline: sensorData.status === 'Active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mockSensors.push(newSensor);
  return newSensor;
};

export const updateSensor = async (id: number, sensorData: SensorFormData): Promise<AdminSensor> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const index = mockSensors.findIndex(sensor => sensor.id === id);
  if (index === -1) {
    throw new Error('Sensor not found');
  }

  const updatedSensor = {
    ...mockSensors[index],
    ...sensorData,
    isOnline: sensorData.status === 'Active',
    updatedAt: new Date().toISOString()
  };

  mockSensors[index] = updatedSensor;
  return updatedSensor;
};

export const deleteSensor = async (id: number): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const index = mockSensors.findIndex(sensor => sensor.id === id);
  if (index === -1) {
    throw new Error('Sensor not found');
  }

  mockSensors.splice(index, 1);
};