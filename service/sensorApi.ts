import privateAxios from '@/lib/privateAxios';
import { SensorData, Sensor, SensorStats, ChartData } from '@/types/sensor/types';

// Original API calls
/*
export const getSensorById = async (id: string): Promise<Sensor> => {
  try {
    const response = await privateAxios.get<Sensor>(`/sensors/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch sensor data');
  }
};

export const getSensorDataByWeek = async (id: string): Promise<ChartData> => {
  try {
    const response = await privateAxios.get<ChartData>(`/sensors/${id}/data/week`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch sensor week data');
  }
};

export const getSensorStats = async (id: string): Promise<SensorStats> => {
  try {
    const response = await privateAxios.get<SensorStats>(`/sensors/${id}/stats`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch sensor stats');
  }
};
*/

// Dummy data
export const getSensorById = async (id: string): Promise<Sensor> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    id: parseInt(id),
    name: `Air Quality Sensor ${id}`,
    location: "Dummalakotuwa, Dankotuwa",
    latitude: 40.7829,
    longitude: -73.9654,
    isActive: true
  };
};

export const getSensorDataByWeek = async (id: string): Promise<ChartData> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const generateWeekData = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const co2Data = [420, 385, 456, 392, 478, 401, 423];
    const aqiData = [45, 38, 52, 41, 47, 35, 49];
    
    return { labels: days, co2Data, aqiData };
  };
  
  return generateWeekData();
};

export const getSensorStats = async (id: string): Promise<SensorStats> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    todaysReadings: 1247,
    sensorStatus: "Active",
    lastAQIReading: 47,
    monitoring: "24/7 Real-time"
  };
};