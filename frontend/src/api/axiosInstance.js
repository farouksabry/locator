import axios from "axios";
import { getCsrfToken } from "../utils/csrf";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url.includes("/api/token/refresh/")) {
            window.location.replace("/login");
            return Promise.reject(error);
        }

        const csrf = await getCsrfToken();

        // If access token expired
        if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                await axios.post("/api/token/refresh/", {}, {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken': csrf,
                    }
                });

                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                try {
                    await axios.post("/api/logout/", {}, {
                        withCredentials: true,
                        headers: {
                            'X-CSRFToken': csrf,
                        }
                    });

                    window.location.replace("/login");
                } catch (error) {
                    return Promise.reject(error);
                }

                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
