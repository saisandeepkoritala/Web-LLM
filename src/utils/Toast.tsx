import { toast, type ToastOptions, type Theme } from "react-toastify";

/**
 * @param msg - The message to display
 * @param color - Hex color code (default: IPL Blue #3182ce)
 */
export const Notify = (msg: string, color: string = "#3182ce") => {
    
    const options: ToastOptions = {
        theme: "light" as Theme, 
        style: { 
            background: "white", 
            color: color,
            // We use a fallback empty string to ensure TS is happy with the template literal
            border: `1px solid ${color}20` 
        },
    };

    toast.info(msg, options);
}

