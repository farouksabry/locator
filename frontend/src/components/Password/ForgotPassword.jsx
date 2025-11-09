import api from "../../api/axios"
import { useState } from "react"
import { Link } from "react-router"
import { getCsrfToken } from "../../utils/csrf";

export default function ForgotPassword() {
    const [error, setError] = useState(null);
    const [email, setEmail] = useState("");
    const [emailNotification, setEmailNotification] = useState(null);

    const resetPassword = async (e) => {
        e.preventDefault();
        const csrf = getCsrfToken();

        try {
            const response = await api.post('/api/password-reset/', {
                email: email,
            }, {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': csrf,
                }
            });

            // Clear input
            setEmail("");

            // If the user was found and an email was sent
            if (response.data.userFound === true) {
                setEmailNotification("An email was sent to you to change your password.");
            }
        } catch (error) {
            setError(error.response.data.error);
        }
    };

    // Set email
    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100 p-3">
            <div className="card w-100 w-md-75 w-lg-50">
                <div className="card-header text-center fw-bold">
                    Forgot your password ?
                </div>
                <div className="card-body">
                    {emailNotification ? (
                        <>
                            <div className="alert alert-success my-2">{emailNotification}</div>
                            <Link className="btn large-btn w-100 text-white" to="/login">Login</Link>
                        </>
                    ) : (
                        <>
                            <p className="text-muted">Please enter your email address to search for your account.</p>
                            <form className="row g-2 justify-content-center" onSubmit={resetPassword}>
                                <div className="col-12 col-md-8">
                                    <input type="email" name="email" onChange={handleEmail} value={email} className="form-control" placeholder="Email address" id="email" required autoFocus />
                                </div>
                                <div className="col-6 col-md-2">
                                    <button type="submit" className="btn large-btn w-100" disabled={!email.trim()}>Search</button>
                                </div>
                                <div className="col-6 col-md-2">
                                    <Link to="/login" className="text-white btn btn-secondary">Cancel</Link>
                                </div>
                            </form>
                        </>
                    )}
                    {error && (
                        <div className="alert alert-danger mt-3">{error}</div>
                    )}
                </div>
            </div>
        </div>
    )
}
