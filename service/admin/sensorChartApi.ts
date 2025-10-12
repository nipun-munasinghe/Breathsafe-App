import privateAxios from '@/lib/privateAxios';
import { Sensor, SensorStats, ChartData } from '@/types/sensors/admin';

//backend response types to match your DTOs
interface SensorChartDTO {
  timestamp: string;
  co2Level: number;
  aqiValue: number;
}

interface SensorDetailsDTO {
  id: number;
  location: string;
  name: string;
}

interface SensorChartResponseDTO {
  sensorDetails: SensorDetailsDTO;
  chartData: SensorChartDTO[];
  totalRecords: number;
}

//single API call to returns all data
export const getSensorChartData = async (sensorId: string): Promise<SensorChartResponseDTO> => {
  try {
    const response = await privateAxios.get<SensorChartResponseDTO>(
      `/sensorData/${sensorId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('Chart data response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch sensor chart data');
  }
};

//transform backend data to frontend format
export const transformSensorData = (backendData: SensorChartResponseDTO) => {
  //Validate data exists
  if (!backendData || !backendData.sensorDetails) {
    throw new Error('Invalid sensor data received');
  }

  //Transform to Sensor type
  const sensor: Sensor = {
    id: backendData.sensorDetails.id,
    name: backendData.sensorDetails.name,
    location: backendData.sensorDetails.location,
    latitude: 0,
    longitude: 0,
    isActive: true
  };

  //Transform to ChartData type
  const chartData: ChartData = {
    labels: (backendData.chartData || []).map(item => {
      const date = new Date(item.timestamp);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric'
      });
    }),
    co2Data: (backendData.chartData || []).map(item => Number(item.co2Level) || 0),
    aqiData: (backendData.chartData || []).map(item => Number(item.aqiValue) || 0)
  };

  //transform to SensorStats type
  const stats: SensorStats = {
    todaysReadings: backendData.totalRecords || 0,
    sensorStatus: "Active",
    lastAQIReading: backendData.chartData && backendData.chartData.length > 0 
      ? backendData.chartData[backendData.chartData.length - 1].aqiValue 
      : 0,
    monitoring: "24/7 Real-time"
  };

  return { sensor, chartData, stats };
};

export const getSensorById = async (id: string): Promise<Sensor> => {
  const backendData = await getSensorChartData(id);
  return transformSensorData(backendData).sensor;
};

export const getSensorDataByWeek = async (id: string): Promise<ChartData> => {
  const backendData = await getSensorChartData(id);
  return transformSensorData(backendData).chartData;
};

export const getSensorStats = async (id: string): Promise<SensorStats> => {
  const backendData = await getSensorChartData(id);
  return transformSensorData(backendData).stats;
};