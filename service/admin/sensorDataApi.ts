import privateAxios from '@/lib/privateAxios';
import { AdminSensor, SensorListResponse, SensorFormData, SensorReadingsFormData, SensorStatus, SensorDataDisplayDTO } from '@/types/sensors/admin';

//API calls
//fetch sensor data for display in table
export const getSensorDisplayData = async (): Promise<SensorDataDisplayDTO[]> => {
  try {
    const response = await privateAxios.get<SensorDataDisplayDTO[]>('/sensorData');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching sensor display data:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch sensor data');
  }
};

//delete sensor data function
export const deleteSensorData = async (dataId: number): Promise<void> => {
  try {
    const response = await privateAxios.delete(`/sensorData/${dataId}`);
    
    //Check if response indicates success
    if (response.status === 200) {
      console.log('Sensor data deleted successfully:', response.data);
      return;
    }
    
    throw new Error('Delete operation failed');
  } catch (error: any) {
    console.error('Error deleting sensor data:', error);
    
    //handle different error scenarios
    if (error.response?.status === 404) {
      throw new Error('Sensor data not found');
    } else if (error.response?.status === 401) {
      throw new Error('Unauthorized access');
    } else if (error.response?.status === 400) {
      throw new Error(error.response?.data?.message || 'Invalid request');
    }
    
    throw new Error(error.response?.data?.message || 'Failed to delete sensor data');
  }
};

//dummy data
const mockSensors: AdminSensor[] = [
  {
    id: 1,
    name: "AQM-2024-001",
    location: "Colombo Central Park",
    latitude: 6.9271,
    longitude: 79.8612,
    lastCO2Reading: 420,
    lastAQIReading: 45,
    status: 'ONLINE',
    lastReadingTime: "2025-09-23T08:30:00.000Z",
    isOnline: true,
    createdAt: "2025-09-01T10:00:00.000Z",
    updatedAt: "2025-09-23T08:30:00.000Z"
  }
];

export const getSensors = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<SensorListResponse> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  let filteredSensors = [...mockSensors];

  //Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredSensors = filteredSensors.filter(sensor =>
      sensor.name.toLowerCase().includes(searchLower) ||
      sensor.location.toLowerCase().includes(searchLower) ||
      sensor.status.toLowerCase().includes(searchLower)
    );
  }

  //Apply pagination
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
    isOnline: sensorData.status === 'ONLINE',
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
    isOnline: sensorData.status === 'ONLINE',
    updatedAt: new Date().toISOString()
  };

  mockSensors[index] = updatedSensor;
  return updatedSensor;
};

//only updates readings
export const updateSensorReadings = async (id: number, readingsData: SensorReadingsFormData): Promise<AdminSensor> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const index = mockSensors.findIndex(sensor => sensor.id === id);
  if (index === -1) {
    throw new Error('Sensor not found');
  }

  //validate readings before update
  if (readingsData.lastCO2Reading !== null && readingsData.lastCO2Reading < 0) {
    throw new Error('CO₂ level cannot be negative');
  }
  
  if (readingsData.lastAQIReading !== null && readingsData.lastAQIReading < 0) {
    throw new Error('AQI level cannot be negative');
  }

  if (readingsData.lastCO2Reading !== null && readingsData.lastCO2Reading > 50000) {
    throw new Error('CO₂ level exceeds maximum allowed value');
  }

  if (readingsData.lastAQIReading !== null && readingsData.lastAQIReading > 500) {
    throw new Error('AQI level exceeds maximum allowed value');
  }

  const updatedSensor = {
    ...mockSensors[index],
    lastCO2Reading: readingsData.lastCO2Reading,
    lastAQIReading: readingsData.lastAQIReading,
    lastReadingTime: new Date().toISOString(),
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

//function to clear sensor data
export const clearSensorData = async (dataId: number): Promise<void> => {
  try {
    await deleteSensorData(dataId);
    console.log(`Sensor data cleared successfully for ID: ${dataId}`);
  } catch (error) {
    console.error('Error clearing sensor data:', error);
    throw error;
  }
};