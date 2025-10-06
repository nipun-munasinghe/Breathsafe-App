import { apiResponse } from "@/types/common";
import privateAxios from "@/lib/privateAxios";
import ToastUtils from "@/utils/toastUtils";
import { CreateSensorFormData, UpdateSensorFormData } from "@/types/sensors/admin";

export const createSensor = async (
  data: CreateSensorFormData
): Promise<apiResponse | null> => {
  try {
    await privateAxios.post<void>("/sensors", data);
    return { success: true };
  } catch (error: any) {
    ToastUtils.error("Sensor creation failed. " + error?.response.data.message);
    return { success: false, error: error.response.data.message };
  }
};

export const getAllSensors = async (): Promise<apiResponse | null> => {
  try {
    const response = await privateAxios.get<apiResponse>("/sensors");
    return { success: true, data: response.data };
  } catch (error: any) {
    ToastUtils.error("Retrieval failed. " + error?.response.data.message);
    return { success: false, error: error.response.data.message };
  }
};

export const deleteSensor = async (id: number): Promise<apiResponse | null> => {
  try {
    await privateAxios.delete<void>(`/sensors/${id}`);
    return { success: true };
  } catch (error: any) {
    ToastUtils.error("Request delete failed. " + error?.response.data.message);
    return { success: false, error: error.response.data.message };
  }
};

export const updateSensor = async (
  id: number,
  data: UpdateSensorFormData
): Promise<apiResponse | null> => {
  try {
    await privateAxios.put<void>(`/sensors/${id}`, data);
    return { success: true };
  } catch (error: any) {
    ToastUtils.error("Sensor update failed. " + error?.response.data.message);
    return { success: false, error: error.response.data.message };
  }
};
