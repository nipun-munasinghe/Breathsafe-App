import { apiResponse } from "@/types/common";
import {
  SubscriptionRequest,
  SubscriptionResponse,
  UpdateActiveStatus,
  UpdateAlertThreshold,
  UpdateEmailNotification,
} from "@/types/subscription";
import privateAxios from "@/lib/privateAxios";
import ToastUtils from "@/utils/toastUtils";

const API_BASE_URL = "/subscriptions";

export const subscribeToSensor = async (
  data: SubscriptionRequest
): Promise<apiResponse<SubscriptionResponse>> => {
  try {
    const response = await privateAxios.post<SubscriptionResponse>(API_BASE_URL, data);
    ToastUtils.success("Successfully subscribed to the sensor!");
    return { success: true, data: response.data };
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || "Subscription failed.";
    ToastUtils.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const getMySubscriptions = async (): Promise<apiResponse<SubscriptionResponse[]>> => {
  try {
    const response = await privateAxios.get<SubscriptionResponse[]>(API_BASE_URL);
    return { success: true, data: response.data };
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || "Failed to fetch subscriptions.";
    ToastUtils.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const updateAlertThreshold = async (
  subscriptionId: number,
  data: UpdateAlertThreshold
): Promise<apiResponse<SubscriptionResponse>> => {
  try {
    const response = await privateAxios.patch<SubscriptionResponse>(
      `${API_BASE_URL}/${subscriptionId}/alert-threshold`,
      data
    );
    ToastUtils.success("Alert threshold updated successfully.");
    return { success: true, data: response.data };
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || "Failed to update alert threshold.";
    ToastUtils.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const updateEmailNotifications = async (
  subscriptionId: number,
  data: UpdateEmailNotification
): Promise<apiResponse<SubscriptionResponse>> => {
  try {
    const response = await privateAxios.patch<SubscriptionResponse>(
      `${API_BASE_URL}/${subscriptionId}/email-notifications`,
      data
    );
    ToastUtils.success("Email notification settings updated.");
    return { success: true, data: response.data };
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || "Failed to update notification settings.";
    ToastUtils.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const toggleSubscriptionStatus = async (
  subscriptionId: number,
  data: UpdateActiveStatus
): Promise<apiResponse<SubscriptionResponse>> => {
  try {
    const response = await privateAxios.patch<SubscriptionResponse>(
      `${API_BASE_URL}/${subscriptionId}/toggle-active`,
      data
    );
    ToastUtils.success(`Subscription has been ${data.isActive ? 'activated' : 'deactivated'}.`);
    return { success: true, data: response.data };
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || "Failed to change subscription status.";
    ToastUtils.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const unsubscribe = async (
  subscriptionId: number
): Promise<apiResponse> => {
  try {
    await privateAxios.delete(`${API_BASE_URL}/${subscriptionId}`);
    ToastUtils.success("Successfully unsubscribed.");
    return { success: true };
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || "Unsubscribe request failed.";
    ToastUtils.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};