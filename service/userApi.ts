import {apiResponse, LoginResponse, UserData, userLogin} from "@/types/user/types";
import ToastUtils from "@/utils/toastUtils";
import publicAxios from "@/lib/publicAxios";

export const registerUser = async (userData: UserData) => {
    try {
       await publicAxios.post('/auth/register', userData);
       ToastUtils.success("Registration successful!");
    } catch (error: unknown) {
        ToastUtils.error("Registration failed. Please try again." + error);
    }
};

export const loginUser = async (user: userLogin): Promise<apiResponse | null> => {
    try {
        const response = await publicAxios.post<LoginResponse>("/auth/login", user);
        ToastUtils.success("Login successful!");
        return { success: true, data: response.data };
    } catch (error: unknown) {
        ToastUtils.error("Login failed. " + error.response.data.message);
        return { success: false, error: error.response.data.message };
    }
};
