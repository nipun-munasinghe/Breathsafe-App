export interface SensorData {
  id: number;
  temperature: number;
  humidity: number;
  co2Level: number;
  aqiValue: number;
  aqiCategory: AQICategory;
  timestamp: string;
  sensor: Sensor;
}

export interface Sensor {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

export enum AQICategory {
  GOOD = 'GOOD',
  MODERATE = 'MODERATE',
  UNHEALTHY_FOR_SENSITIVE = 'UNHEALTHY_FOR_SENSITIVE',
  UNHEALTHY = 'UNHEALTHY',
  VERY_UNHEALTHY = 'VERY_UNHEALTHY',
  HAZARDOUS = 'HAZARDOUS'
}

export interface SensorStats {
  todaysReadings: number;
  sensorStatus: string;
  lastAQIReading: number;
  monitoring: string;
}

export interface ChartData {
  labels: string[];
  co2Data: number[];
  aqiData: number[];
}