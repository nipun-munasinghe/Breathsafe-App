import { apiResponse } from "@/types/common";
import privateAxios from "@/lib/privateAxios";
import ToastUtils from "@/utils/toastUtils";
import {
  AdminNotificationStats,
  AdminSubscriptionCount,
  AdminSubscriptionDetail,
  AdminTopUser,
} from "@/types/subscription/adminSubscription";

const API_BASE_URL = "/admin/subscriptions";

export const getSubscriptionCounts = async (): Promise<apiResponse<AdminSubscriptionCount[]>> => {
  try {
    const response = await privateAxios.get<AdminSubscriptionCount[]>(`${API_BASE_URL}/counts`);
    return { success: true, data: response.data };
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || "Failed to fetch subscription counts.";
    ToastUtils.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const getAllSubscriptionDetails = async (): Promise<apiResponse<AdminSubscriptionDetail[]>> => {
  try {
    const response = await privateAxios.get<AdminSubscriptionDetail[]>(`${API_BASE_URL}/details/all`);
    return { success: true, data: response.data };
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || "Failed to fetch all subscription details.";
    ToastUtils.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const getTopSubscribingUsers = async (limit: number = 10): Promise<apiResponse<AdminTopUser[]>> => {
  try {
    const response = await privateAxios.get<AdminTopUser[]>(`${API_BASE_URL}/trends/top-users`, {
      params: { limit },
    });
    return { success: true, data: response.data };
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || "Failed to fetch top subscribing users.";
    ToastUtils.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};

export const getNotificationPreferenceStats = async (): Promise<apiResponse<AdminNotificationStats>> => {
  try {
    const response = await privateAxios.get<AdminNotificationStats>(`${API_BASE_URL}/trends/notification-stats`);
    return { success: true, data: response.data };
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || "Failed to fetch notification preference stats.";
    ToastUtils.error(errorMessage);
    return { success: false, error: errorMessage };
  }
};