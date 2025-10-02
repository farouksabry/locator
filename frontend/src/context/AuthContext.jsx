import { createContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { getCsrfToken } from "../utils/csrf";
import { useNavigate } from "react-router";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const logged = async () => {
            const csrf = await getCsrfToken();

            try {
                const response = await axiosInstance.post("/api/check-auth/", {}, {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken': csrf,
                    }
                });

                setIsLoggedIn(response.data.logged);
                if (response.data.logged) {
                    setUser(response.data.user);
                }
            } catch (error) {
                setIsLoggedIn(false);
            }
        }
        logged();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}
