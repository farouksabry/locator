import axios from "axios"
import { useNavigate, useSearchParams } from "react-router";
import { getCsrfToken } from "../../utils/csrf";
import { useEffect, useState } from "react";


export default function VerifyEmail() {
    // Get token
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    // Verification status
    const [status, setStatus] = useState("Verifying your email...");
    const navigate = useNavigate();

    const verify_email = async () => {
        const csrf = getCsrfToken();
        try {
            await axios.post("/api/verify-email/", { token },
                {
                    headers: {
                        'X-CSRFToken': csrf,
                    }
                }
            );

            // On success
            setStatus("Email Verified successfully! Redirecting...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            // Verification failed
            setStatus("Verification failed.")
        }
    };

    useEffect(() => {
        if (!token) {
            setStatus("Verification failed.");
            return;
        }

        verify_email();
    }, [token]);

    return (
        <div className="container mt-5 text-center">
            <h4>{status}</h4>
        </div>
    );
}
