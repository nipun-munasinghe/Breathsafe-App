import { toast, Bounce, ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
};

const ToastUtils = {
    success: (message: string, options?: ToastOptions) =>
        toast.success(message, { ...defaultOptions, ...options }),

    error: (message: string, options?: ToastOptions) =>
        toast.error(message, { ...defaultOptions, ...options }),

    warn: (message: string, options?: ToastOptions) =>
        toast.warn(message, { ...defaultOptions, ...options }),

    info: (message: string, options?: ToastOptions) =>
        toast.info(message, { ...defaultOptions, ...options }),
};

export default ToastUtils;