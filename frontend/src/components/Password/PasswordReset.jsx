import axios from "axios";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router"
import { getCsrfToken } from "../../utils/csrf";
import { object, string, ref } from "yup";

export default function PasswordReset() {
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");
    const navigate = useNavigate();

    // New password, user id and password reset token
    const [credentials, setCredentials] = useState({
        uid: uid,
        token: token,
        password: "",
        confirm_password: "",
    });

    async function validateForm(data) {
        let schema = object({
            password: string().label("Password").required().min(8),
            confirm_password: string().label("Password confirmation").oneOf([ref('password'), null], 'Passwords do not match.'),
        });

        try {
            await schema.validate(data, { abortEarly: false });
            setError("");
            return true;
        } catch (errors) {
            setError(errors.errors);
            return false;
        }
    }

    // Submit change password
    const changePassword = async (e) => {
        e.preventDefault();
        const validation = await validateForm(credentials);
        if (!validation)
            return false;

        const csrf = getCsrfToken();

        try {
            await axios.post("/api/password-reset/", credentials, {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': csrf,
                }
            });

            navigate("/login");
        } catch (error) {
            setError(error.response.data.error);
        }
    };

    // Set form inputs, passowrd and password confirmation
    const handlePasswordInput = (e) => {
        setCredentials((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Check whether the form is complete
    const isFormComplete = Object.values(credentials).every((value) => value.trim() !== "");

    return (
        <>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="w-50">
                    <form onSubmit={changePassword}>
                        <input type="password" name="password" onChange={handlePasswordInput} className="form-control" aria-describedby="passwordHelpBlock" placeholder="New password" autoFocus />
                        <div id="passwordHelpBlock" className="form-text mb-3">
                            Your password must be 8-20 characters long, contain letters, numbers and special characters.
                        </div>
                        <input type="password" name="confirm_password" onChange={handlePasswordInput} className="form-control mb-3" placeholder="Confirm password" />
                        <button type="submit" className="btn large-btn my-2 me-2" disabled={!isFormComplete} >Change password</button>
                        <Link to="/login"><button className="btn btn-secondary my-2">Cancel</button></Link>
                    </form>

                    {error && typeof (error) === 'object' && (
                        error.map((err) => (
                            <div key={err} className="alert alert-danger my-2">{err}</div>
                        ))
                    )}

                    {error && typeof (error) === 'string' && (
                        <div className="alert alert-danger my-2">{error}</div>
                    )}
                </div>
            </div>
        </>
    )
}
