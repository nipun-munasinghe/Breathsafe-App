import privateAxios from '@/lib/privateAxios';
import { AdminSensor, SensorListResponse, SensorFormData, SensorReadingsFormData, SensorStatus, SensorDataDisplayDTO } from '@/types/sensors/admin';

// API calls
export const getSensorDisplayData = async (): Promise<SensorDataDisplayDTO[]> => {
  try {
    const response = await privateAxios.get<SensorDataDisplayDTO[]>('/sensorData');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching sensor display data:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch sensor data');
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
  },
  {
    id: 2,
    name: "AQM-2024-002",
    location: "Kandy City Center",
    latitude: 7.2906,
    longitude: 80.6337,
    lastCO2Reading: 385,
    lastAQIReading: 38,
    status: 'ONLINE',
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
    status: 'OFFLINE',
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
    status: 'MAINTENANCE',
    lastReadingTime: "2025-09-23T08:20:00.000Z",
    isOnline: false,
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
    status: 'ERROR',
    lastReadingTime: "2025-09-23T08:15:00.000Z",
    isOnline: false,
    createdAt: "2025-09-05T12:00:00.000Z",
    updatedAt: "2025-09-23T08:15:00.000Z"
  }
];

export const getSensors = async (
  page: number = 1,
  limit: number = 10,
  search?: string
): Promise<SensorListResponse> => {
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

  //Validate readings before update
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
export const clearSensorData = async (id: number): Promise<AdminSensor> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const index = mockSensors.findIndex(sensor => sensor.id === id);
  if (index === -1) {
    throw new Error('Sensor not found');
  }

  // Clear only the data, keep all configuration
  const clearedSensor = {
    ...mockSensors[index],
    lastCO2Reading: null,        // Clear CO2 reading
    lastAQIReading: null,        // Clear AQI reading
    lastReadingTime: null,       // Clear last reading time
    updatedAt: new Date().toISOString()
  };

  mockSensors[index] = clearedSensor;
  return clearedSensor;
};