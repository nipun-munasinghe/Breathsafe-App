import {LoginResponse} from "@/types/user/types";
import {apiResponse} from "@/types/common";
import ToastUtils from "@/utils/toastUtils";
import privateAxios from "@/lib/privateAxios";
import {CommunityRequestData} from "@/types/request";

export const createRequest = async (data: CommunityRequestData): Promise<apiResponse | null> => {
    try {
        await privateAxios.post<LoginResponse>("/sensorRequests", data);
        return {success: true};
    } catch (error: any) {
        ToastUtils.error("Submission failed. " + error.response.data.message);
        return {success: false, error: error.response.data.message};
    }
};