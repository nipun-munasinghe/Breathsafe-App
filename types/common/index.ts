export type apiResponse<T = any> = {
    success: boolean;
    data?: T;
    error?: string;
};