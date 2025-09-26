export interface SubscriptionItem {
  id: number;
  alertThreshold: number;
  emailNotifications: boolean;
  isActive: boolean;
  createdAt: string;

  sensorId: number;
  sensorName: string;
  sensorLocation: string;
  latitude: number;
  longitude: number;
  sensorStatus?: string;
}

export interface SubscriptionCreatePayload {
  sensorId: number;
  alertThreshold?: number;
  emailNotifications?: boolean;
}

export interface SubscriptionUpdatePayload {
  alertThreshold?: number;
  emailNotifications?: boolean;
  isActive?: boolean;
}