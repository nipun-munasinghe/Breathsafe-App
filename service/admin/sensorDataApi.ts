import privateAxios from '@/lib/privateAxios';
import { AdminSensor, SensorListResponse, SensorFormData, SensorReadingsFormData, SensorDataDisplayDTO } from '@/types/sensors/admin';
import ToastUtils from '@/utils/toastUtils';

//interface for sensor data update request
interface SensorDataUpdateRequest {
  dataId: number;
  aqiValue: number;
  co2Level: number;
}

//fetch sensor data for display in table
export const getSensorDisplayData = async (): Promise<SensorDataDisplayDTO[]> => {
  try {
    const response = await privateAxios.get<SensorDataDisplayDTO[]>('/sensorData');
    return response.data;
  } catch (error: any) {
    ToastUtils.error("Data retrieval failed. " + error?.response?.data?.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch sensor data');
  }
};

//update sensor readings (AQI and CO2 only)
export const updateSensorDataReadings = async (
  dataId: number,
  readingsData: SensorReadingsFormData
): Promise<SensorDataDisplayDTO> => {
  try {
    if (readingsData.lastCO2Reading === null && readingsData.lastAQIReading === null) {
      throw new Error('At least one reading (CO₂ or AQI) must be provided');
    }

    //map frontend data to backend request DTO format
    const updateRequest: SensorDataUpdateRequest = {
      dataId: dataId,
      aqiValue: readingsData.lastAQIReading!,
      co2Level: readingsData.lastCO2Reading!
    };

    const response = await privateAxios.patch<SensorDataDisplayDTO>('/sensorData', updateRequest);

    if (response.status === 200) {
      ToastUtils.success('Sensor readings updated successfully!');
      return response.data;
    }

    throw new Error('Update operation failed');
  } catch (error: any) {
    console.error('Error updating sensor readings:', error);

    //handle different errors
    if (error.response?.status === 404) {
      ToastUtils.error('Sensor data not found');
      throw new Error('Sensor data not found');
    } else if (error.response?.status === 401) {
      ToastUtils.error('Unauthorized access');
      throw new Error('Unauthorized access');
    } else if (error.response?.status === 403) {
      ToastUtils.error('Access forbidden - Please check your permissions');
      throw new Error('Access forbidden - Please check your permissions');
    } else if (error.response?.status === 400) {
      ToastUtils.error(error.response?.data?.message || 'Invalid request data');
      throw new Error(error.response?.data?.message || 'Invalid request data');
    }
    
    ToastUtils.error(error.response?.data?.message || 'Failed to update sensor readings');
    throw new Error(error.response?.data?.message || 'Failed to update sensor readings');
  }
};

//delete sensor data function
export const deleteSensorData = async (dataId: number): Promise<void> => {
  try {
    const response = await privateAxios.delete(`/sensorData/${dataId}`);
    
    if (response.status === 200) {
      ToastUtils.success('Sensor data cleared successfully!');
      return;
    }
    
    throw new Error('Delete operation failed');
  } catch (error: any) {
    console.error('Error deleting sensor data:', error);
    
    if (error.response?.status === 404) {
      ToastUtils.error('Sensor data not found');
      throw new Error('Sensor data not found');
    } else if (error.response?.status === 401) {
      ToastUtils.error('Unauthorized access');
      throw new Error('Unauthorized access');
    } else if (error.response?.status === 400) {
      ToastUtils.error(error.response?.data?.message || 'Invalid request');
      throw new Error(error.response?.data?.message || 'Invalid request');
    }
    
    throw new Error(error.response?.data?.message || 'Failed to delete sensor data');
  }
};

export const updateSensorReadings = async (dataId: number, readingsData: SensorReadingsFormData): Promise<AdminSensor> => {
  try {
    //input validation before API call
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

    //call real backend API with dataId (not sensor id)
    const updatedData = await updateSensorDataReadings(dataId, readingsData);
    
    //convert backend response to frontend AdminSensor format
    const updatedSensor: AdminSensor = {
      id: updatedData.sensorId,
      name: updatedData.name,
      location: updatedData.location,
      latitude: updatedData.latitude,
      longitude: updatedData.longitude,
      lastCO2Reading: updatedData.co2Level,
      lastAQIReading: updatedData.aqiValue,
      status: updatedData.status,
      lastReadingTime: updatedData.timestamp,
      isOnline: updatedData.status === 'ONLINE',
      createdAt: updatedData.createdAt,
      updatedAt: new Date().toISOString()
    };

    return updatedSensor;
  } catch (error: any) {
    console.error('Error updating sensor readings:', error);
    throw error;
  }
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

// Mock data for sensors
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

//get sensors with pagination and search (MOCK - replace with real API when available)
export const getSensors = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<SensorListResponse> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  let filteredSensors = [...mockSensors];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredSensors = filteredSensors.filter(sensor =>
      sensor.name.toLowerCase().includes(searchLower) ||
      sensor.location.toLowerCase().includes(searchLower) ||
      sensor.status.toLowerCase().includes(searchLower)
    );
  }

  const startIndex = (page - 1) * limit;
  const paginatedSensors = filteredSensors.slice(startIndex, startIndex + limit);

  return {
    sensors: paginatedSensors,
    total: filteredSensors.length,
    page,
    limit
  };
};

//create sensor (MOCK - replace with real API when available)
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

//update sensor info (MOCK - Replace with real API when available)
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

//delete sensor (MOCK - Replace with real API when available)
export const deleteSensor = async (id: number): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const index = mockSensors.findIndex(sensor => sensor.id === id);
  if (index === -1) {
    throw new Error('Sensor not found');
  }

  mockSensors.splice(index, 1);
};