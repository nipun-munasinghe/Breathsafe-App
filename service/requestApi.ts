import {apiResponse} from "@/types/common";
import ToastUtils from "@/utils/toastUtils";
import privateAxios from "@/lib/privateAxios";
import {CommunityRequest, CommunityRequestData} from "@/types/request";

export const createRequest = async (data: CommunityRequestData): Promise<apiResponse | null> => {
    try {
        await privateAxios.post<void>("/sensorRequests", data);
        return {success: true};
    } catch (error: any) {
        ToastUtils.error("Submission failed. " + error?.response.data.message);
        return {success: false, error: error.response.data.message};
    }
};

export const getMyRequests = async (): Promise<apiResponse | null> => {
    try {
        const response = await privateAxios.get<apiResponse>("/sensorRequests/myRequests");
        return {success: true, data: response.data};
    } catch (error: any) {
        ToastUtils.error("Retrieval failed. " + error?.response.data.message);
        return {success: false, error: error.response.data.message};
    }
};

export const deleteRequest = async (id: number): Promise<apiResponse | null> => {
    try {
        await privateAxios.delete<void>(`/sensorRequests/${id}`);
        return {success: true};
    } catch (error: any) {
        ToastUtils.error("Request delete failed. " + error?.response.data.message);
        return {success: false, error: error.response.data.message};
    }
};

export const updateRequest = async (data: CommunityRequestData, id: number): Promise<apiResponse | null> => {
    try {
        await privateAxios.put<void>(`/sensorRequests/${id}`, data);
        return {success: true};
    } catch (error: any) {
        ToastUtils.error("Submission failed. " + error?.response.data.message);
        return {success: false, error: error.response.data.message};
    }
};

export const getAllRequests = async (): Promise<apiResponse<CommunityRequest> | null> => {
    try {
        const response = await privateAxios.get<apiResponse>("/sensorRequests/all");
        return {success: true, data: response.data};
    } catch (error: any) {
        ToastUtils.error("Retrieval failed. " + error?.response.data.message);
        return {success: false, error: error.response.data.message};
    }
};