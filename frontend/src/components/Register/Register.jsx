import { useContext, useEffect, useState } from "react";
import { getCsrfToken } from "../../utils/csrf";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { object, string, ref, date } from 'yup';
import { LocationsContext } from "../../context/LocationsContext";

export default function Register() {
    const [emailNotification, setEmailNotification] = useState(null);
    const { countries, regions } = useContext(LocationsContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        dob: '',
        gender: '',
        country: '',
        region: ''
    });

    // userRegions changes the regions every time country is changed
    const [userRegions, setUserRegions] = useState([]);
    useEffect(() => {
        // Filter regions every time country is changed
        setUserRegions(regions.filter((region) => region.country == user.country));
    }, [user.country]);

    // set user data
    function getUserData(e) {
        // Clear errors
        setError("");

        // Change user values
        let myUser = { ...user };
        myUser[e.target.name] = e.target.value;
        setUser(myUser);
    }

    async function validateForm(data) {
        let schema = object({
            first_name: string()
                .label("First name")
                .required().max(150),
            last_name: string()
                .label("Last name")
                .required().max(150),
            email: string()
                .label("Email")
                .required().email(),
            password: string()
                .label("Password").required().min(8),
            confirm_password: string()
                .label("Password confirmation").oneOf([ref('password'), null], 'Passwords must match'),
            dob: date()
                .label("Date of birth")
                .typeError("Date of birth is required")
                .max(new Date(), "Date of birth cannot be in the future.")
                .required("Date of birth is required"),
            gender: string()
                .oneOf(['M', 'F', 'P'], 'Invalid gender selection')
                .label("Gender"),
            country: string()
                .label("Country").required(),
            region: string().label("City"),
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

    // Handle user registration
    const handleRegistration = async (e) => {
        e.preventDefault();

        // Validate form data
        const validation = await validateForm(user);
        if (!validation) {
            return false;
        }

        const csrf = await getCsrfToken();

        try {
            const response = await axios.post('/api/register/', user, {
                withCredentials: true,
                headers: {
                    "X-CSRFToken": csrf,
                }
            });

            // If registestration is successful
            if (response.data.registered) {
                setEmailNotification("An email was sent to your registered email to verify your account.")
            } else {
                setError(response.error);
            }
        }
        catch (errors) {
            if (errors.response && errors.response.data) {
                setError(errors.response.data);
            } else {
                setError("Registration failed.")
            }
        }
    }

    // Check whether the form is complete
    const isFormComplete = Object.values(user).every((value) => value.trim() !== "");

    return (
        <>
            {emailNotification ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="card border-success mb-3 w-50 mx-auto">
                        <div className="card-body text-success text-center">
                            <h5 className="card-title">Thank you!</h5>
                            <p className="card-text">{emailNotification}</p>
                            <Link className="mb-3 link-text" to="/login">Login</Link>
                        </div>
                    </div>
                </div>
            ) : countries.length > 0 ? (
                    <div className="d-flex flex-column align-items-center">
                        <div className="card w-30 d-flex flex-column align-items-center mt-5">
                            <div className="card-body d-flex flex-column align-items-center" id="register-form">
                                <h1 className="logo">Where to find</h1>
                                <form onSubmit={handleRegistration} className="w-30">
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="mb-3">
                                                <input onChange={getUserData} className="form-control" id="first_name" name="first_name" placeholder="First name" />
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="mb-3">
                                                <input onChange={getUserData} className="form-control" id="last_name" name="last_name" placeholder="Last name" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <input onChange={getUserData} type="email" className="form-control" id="email" name="email" placeholder="Email" />
                                    </div>
                                    <div className="mb-3">
                                        <input onChange={getUserData} type="password" className="form-control" id="password" name="password" placeholder="Password" />
                                    </div>
                                    <div className="mb-3">
                                        <input onChange={getUserData} type="password" className="form-control" id="confirm_password" name="confirm_password" placeholder="Password confirmation" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="dob" className="form-label">Date of birth</label>
                                        <input onChange={getUserData} type="date" className="form-control" id="dob" name="dob" max={new Date().toISOString().split("T")[0]} />
                                    </div>
                                    <div className="mb-3">
                                        <select onChange={getUserData} className="form-select" name="gender" defaultValue="">
                                            <option value="">Gender:</option>
                                            <option value="M">Male</option>
                                            <option value="F">Female</option>
                                            <option value="P">Prefer not to say</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <select onChange={getUserData} className="form-select" name="country">
                                            <option value="">Select your country</option>
                                            {countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <select onChange={getUserData} className="form-select" name="region">
                                            <option value="">Select your city</option>
                                            {userRegions.map((region) => <option key={region.id} value={region.id}>{region.name}</option>)}
                                        </select>
                                    </div>
                                    <button type="submit" className="btn large-btn w-100" disabled={!isFormComplete}>Sign Up</button>
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
                            <Link className="mb-3 link-text" to="/login/">Already have an account ?</Link>
                        </div>
                    </div>
                    ) : (
                    <div>Loading countries...</div>
            )}
        </>
    )
}
