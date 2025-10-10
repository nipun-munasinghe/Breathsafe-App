import privateAxios from "@/lib/privateAxios";
import ToastUtils from "@/utils/toastUtils";
import { AdminSubscriptionSummary, SensorSubscriptionCount, TimeSeriesPoint } from "@/types/admin/subscription";

const BASE = "/admin/subscriptions";

export const getSubscriptionCountsBySensor = async (): Promise<SensorSubscriptionCount[]> => {
  try {
    const res = await privateAxios.get<SensorSubscriptionCount[]>(`${BASE}/metrics/by-sensor`);
    return res.data;
  } catch (error: any) {
    ToastUtils.error("Failed to load sensor subscription counts. " + (error?.response?.data?.message ?? ""));
    throw error;
  }
};

export const getSubscriptionDailyTrend = async (params: { from: string; to: string }): Promise<TimeSeriesPoint[]> => {
  try {
    const res = await privateAxios.get<TimeSeriesPoint[]>(`${BASE}/metrics/by-day`, { params });
    return res.data;
  } catch (error: any) {
    ToastUtils.error("Failed to load daily subscription trend. " + (error?.response?.data?.message ?? ""));
    throw error;
  }
};

export const getAdminSubscriptionSummary = async (): Promise<AdminSubscriptionSummary> => {
  try {
    const res = await privateAxios.get<AdminSubscriptionSummary>(`${BASE}/metrics/summary`);
    return res.data;
  } catch (error: any) {
    ToastUtils.error("Failed to load subscription summary. " + (error?.response?.data?.message ?? ""));
    throw error;
  }
};

export const downloadSubscriptionReport = async (params: { from: string; to: string }): Promise<Blob> => {
  try {
    const res = await privateAxios.get(`${BASE}/report`, {
      params,
      responseType: "blob",
      headers: { Accept: "application/pdf" },
    });
    return res.data as Blob;
  } catch (error: any) {
    // Try to extract backend error message even if responseType is blob
    let msg = "Report download failed.";
    try {
      const data = await error?.response?.data?.text?.();
      if (data) {
        const j = JSON.parse(data);
        msg += " " + (j?.message ?? "");
      }
    } catch {
      // ignore parse errors
    }
    ToastUtils.error(msg);
    throw error;
  }
};