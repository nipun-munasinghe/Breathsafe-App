export type SensorSubscriptionCount = {
  sensorId: number;
  sensorName: string;
  subscriptionCount: number;
};

export type TimeSeriesPoint = {
  date: string; // ISO yyyy-MM-dd
  count: number;
};

export type AdminSubscriptionSummary = {
  totalSubscriptions: number;
  totalSensors: number;
  sensorsWithSubscriptions: number;
  sensorsWithoutSubscriptions: string[];
};