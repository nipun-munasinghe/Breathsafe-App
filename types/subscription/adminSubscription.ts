export interface AdminSubscriptionCount {
  sensorId: number;
  sensorName: string;
  subscriberCount: number;
}

export interface AdminSubscriptionDetail {
  subscriptionId: number;
  userId: number;
  username: string;
  sensorId: number;
  sensorName: string;
  sensorLocation: string;
  subscribedAt: string;
  isActive: boolean;
  emailNotifications: boolean;
  alertThreshold: number;
}

export interface AdminTopUser {
  userId: number;
  username: string;
  subscriptionCount: number;
}

export interface AdminNotificationStats {
  emailNotificationsEnabled: number;
  emailNotificationsDisabled: number;
  totalActiveSubscriptions: number;
}