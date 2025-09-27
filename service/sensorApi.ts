import {apiResponse} from "@/types/common";
import privateAxios from "@/lib/privateAxios";
import ToastUtils from "@/utils/toastUtils";
import {CreateSensorFormData} from "@/types/sensors/admin";

export const createSensor = async (data: CreateSensorFormData): Promise<apiResponse | null> => {
    try {
        await privateAxios.post<void>("/sensors", data);
        return {success: true};
    } catch (error: any) {
        ToastUtils.error("Sensor creation failed. " + error?.response.data.message);
        return {success: false, error: error.response.data.message};
    }
};