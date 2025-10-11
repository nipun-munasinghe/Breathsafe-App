import * as yup from "yup";

export interface SubscriptionRequest {
  sensorId: number;
}

export interface SubscriptionResponse {
  subscriptionId: number;
  alertThreshold: number;
  emailNotifications: boolean;
  isActive: boolean;
  subscribedAt: string;
  sensorId: number;
  sensorName: string;
  sensorLocation: string;
}

export interface UpdateAlertThreshold {
  alertThreshold: number;
}

export interface UpdateEmailNotification {
  enable: boolean;
}

export interface UpdateActiveStatus {
  isActive: boolean;
}

// --- Validation Schemas ---

export const updateAlertThresholdSchema = yup.object({
  alertThreshold: yup
    .number()
    .required("Alert threshold is required")
    .typeError("Alert threshold must be a number")
    .min(0, "Alert threshold cannot be negative")
    .max(1000, "Alert threshold cannot exceed 1000")
    .integer("Please enter a whole number"),
});