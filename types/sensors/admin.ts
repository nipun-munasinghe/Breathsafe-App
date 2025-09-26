export type SensorStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'ERROR';

export interface AdminSensor {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  lastCO2Reading: number | null;
  lastAQIReading: number | null;
  status: SensorStatus;
  lastReadingTime: string | null;
  isOnline: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SensorFormData {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: SensorStatus;
}

export interface SensorListResponse {
  sensors: AdminSensor[];
  total: number;
  page: number;
  limit: number;
}
export interface SensorReadingsFormData {
  lastCO2Reading: number | null;
  lastAQIReading: number | null;
}

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