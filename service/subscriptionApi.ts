import privateAxios from "@/lib/privateAxios";
import ToastUtils from "@/utils/toastUtils";
import { SubscriptionCreatePayload, SubscriptionItem, SubscriptionUpdatePayload } from "@/types/subscription";

export const getMySubscriptions = async (): Promise<SubscriptionItem[]> => {
  try {
    const res = await privateAxios.get<SubscriptionItem[]>("/subscriptions/my");
    return res.data;
  } catch (error: any) {
    ToastUtils.error("Failed to load subscriptions. " + (error?.response?.data?.message ?? ""));
    throw error;
  }
};

export const createSubscription = async (payload: SubscriptionCreatePayload): Promise<SubscriptionItem> => {
  try {
    const res = await privateAxios.post<SubscriptionItem>("/subscriptions", payload);
    ToastUtils.success("Subscribed successfully.");
    return res.data;
  } catch (error: any) {
    ToastUtils.error("Subscription failed. " + (error?.response?.data?.message ?? ""));
    throw error;
  }
};

export const updateSubscription = async (id: number, payload: SubscriptionUpdatePayload): Promise<SubscriptionItem> => {
  try {
    const res = await privateAxios.patch<SubscriptionItem>(`/subscriptions/${id}`, payload);
    ToastUtils.success("Subscription updated.");
    return res.data;
  } catch (error: any) {
    ToastUtils.error("Update failed. " + (error?.response?.data?.message ?? ""));
    throw error;
  }
};

export const unsubscribe = async (id: number): Promise<void> => {
  try {
    await privateAxios.delete<void>(`/subscriptions/${id}`);
    ToastUtils.success("Unsubscribed.");
  } catch (error: any) {
    ToastUtils.error("Unsubscribe failed. " + (error?.response?.data?.message ?? ""));
    throw error;
  }
};

export const isSubscribedToSensor = async (sensorId: number): Promise<boolean> => {
  try {
    const res = await privateAxios.get<boolean>(`/subscriptions/check`, { params: { sensorId } });
    return res.data;
  } catch (error: any) {
    ToastUtils.error("Failed to check subscription. " + (error?.response?.data?.message ?? ""));
    throw error;
  }
};