import {UserData, userLogin} from "@/types/user/types";
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

export const loginUser = async (user: userLogin) => {
    try {
        const response = await publicAxios.post('/auth/login', user);
        ToastUtils.success("Login successful!");
        return response.data;
    } catch (error: unknown) {
        ToastUtils.error("Login failed. Please try again." + error);
    } 
};
