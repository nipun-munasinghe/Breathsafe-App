import axios from "axios";
import {UserData, userLogin} from "@/types/user/types";
import ToastUtils from "@/utils/toastUtils";

export const registerUser = async (userData: UserData) => {
    try {
       await axios.post('http://localhost:8080/api/v1/auth/register', userData);
       ToastUtils.success("Registration successful!");
    } catch (error: unknown) {
        ToastUtils.error("Registration failed. Please try again." + error);
    }
};

export const userValidation = async (user: userLogin) => {
    try {
        const response = await axios.post('http://localhost:8080/api/v1/auth/login', user);
        ToastUtils.success("Login successful!");
        return response.data;
    } catch (error: unknown) {
        ToastUtils.error("Login failed. Please try again." + error);
    }
};
