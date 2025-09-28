import * as yup from "yup";

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

export interface SensorDataDisplayDTO {
  sensorId: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: SensorStatus;
  createdAt: string;
  dataId: number;
  co2Level: number | null;
  aqiValue: number | null;
  timestamp: string | null;
}

//delete response interface
export interface DeleteSensorDataResponse {
  message: string;
}

export const statusOptions: SensorStatus[] = [
    "ONLINE",
    "OFFLINE", 
    "MAINTENANCE",
    "ERROR",
];

export const sensorValidationSchema = yup.object({
    name: yup
        .string()
        .required("Sensor name is required")
        .min(3, "Sensor name must be at least 3 characters")
        .max(100, "Sensor name must be less than 100 characters")
        .trim(),
    installationDate: yup
        .string()
        .required("Installation date is required")
        .test("valid-date", "Please enter a valid date", (value) => {
            if (!value) return false;
            const date = new Date(value);
            return !isNaN(date.getTime());
        })
        .test(
            "not-future",
            "Installation date cannot be in the future",
            (value) => {
                if (!value) return true;
                const date = new Date(value);
                return date <= new Date();
            }
        ),
    isActive: yup.boolean().required("Active status is required"),
    status: yup
        .string()
        .required("Status is required")
        .oneOf(statusOptions, "Please select a valid status"),
    latitude: yup
        .number()
        .required("Latitude is required")
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90")
        .typeError("Latitude must be a valid number"),
    longitude: yup
        .number()
        .required("Longitude is required")
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180")
        .typeError("Longitude must be a valid number"),
    location: yup
        .string()
        .required("Location is required")
        .min(5, "Location must be at least 5 characters")
        .max(200, "Location must be less than 200 characters")
        .trim(),
});

export interface CreateSensorFormData {
    name: string;
    installationDate: string;
    isActive: boolean;
    status: SensorStatus | "";
    latitude: number | null;
    longitude: number | null;
    location: string;
}