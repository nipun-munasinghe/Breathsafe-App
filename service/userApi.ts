import { LoginResponse, UserData, userLogin } from "@/types/user/types";
import ToastUtils from "@/utils/toastUtils";
import publicAxios from "@/lib/publicAxios";
import { apiResponse } from "@/types/common";
import privateAxios from "@/lib/privateAxios";
import { UserProfile } from "@/types/user";

export const registerUser = async (userData: UserData) => {
  try {
    await publicAxios.post("/auth/register", userData);
    ToastUtils.success("Registration successful!");
  } catch (error: any) {
    ToastUtils.error("Registration failed. Please try again." + error);
  }
};

export const loginUser = async (
  user: userLogin
): Promise<apiResponse<LoginResponse> | null> => {
  try {
    const response = await publicAxios.post<LoginResponse>("/auth/login", user);
    ToastUtils.success("Login successful!");
    return { success: true, data: response.data };
  } catch (error: any) {
    ToastUtils.error("Login failed. " + error.response.data.message);
    return { success: false, error: error.response.data.message };
  }
};

export const getUserDetails =
  async (): Promise<apiResponse<UserProfile> | null> => {
    try {
      const response = await privateAxios.get<UserProfile>("/user");
      return { success: true, data: response.data };
    } catch (error: any) {
      ToastUtils.error(
        "Failed to fetch user details. " + error.response.data.message
      );
      return { success: false, error: error.response.data.message };
    }
  };

export const updateUserProfile = async (
  userData: Partial<UserProfile>
): Promise<apiResponse<UserProfile> | null> => {
  try {
    const response = await privateAxios.put<UserProfile>("/user", userData);
    ToastUtils.success("Profile updated successfully!");
    return { success: true, data: response.data };
  } catch (error: any) {
    ToastUtils.error(
      "Failed to update profile. " + error.response.data.message
    );
    return { success: false, error: error.response.data.message };
  }
};
