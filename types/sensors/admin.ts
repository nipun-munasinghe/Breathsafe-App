export interface AdminSensor {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  lastCO2Reading: number | null;
  lastAQIReading: number | null;
  status: 'Active' | 'Inactive';
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
  status: 'Active' | 'Inactive';
}

export interface SensorListResponse {
  sensors: AdminSensor[];
  total: number;
  page: number;
  limit: number;
}