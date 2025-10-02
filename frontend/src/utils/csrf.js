import axios from "axios";

// Getting CSRF Token for the current user
export const getCsrfToken = async () => {
    try {
        const response = await axios.get('/api/csrf/', {
            withCredentials: true,
        });

        return response.data.csrf_token;
    }
    catch(error) {
        console.error('Failed to get CSRF token', error);
        return null;
    };
};
