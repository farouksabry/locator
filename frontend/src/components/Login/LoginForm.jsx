import { useContext, useState } from 'react';
import axios from 'axios';
import { getCsrfToken } from '../../utils/csrf';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';

import login from '@/assets/images/login5.png'

function LoginForm() {
    const { setIsLoggedIn } = useContext(AuthContext);
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const csrf = await getCsrfToken();

        try {
            const response = await axios.post('/api/login/', credentials,
                {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken': csrf,
                    }
                }
            );
            setIsLoggedIn(true);
            setUser(response.data.user);
            setError('');
            navigate("/");
        }
        catch (error) {
            setError('Invalid Credentials.');
        }
    };

    return (
        <>
            <div className="container-fluid text-center p-0">
                <div className="row m-0">
                    <div className="col-6 p-0">
                        <img className="w-100 min-vh-100 object-fit-cover" src={login} alt="Login image" />
                    </div>
                    <div className="col-6 p-0">
                        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100" id="login-form">
                            <h1 className='logo'>Where to find</h1>
                            <form className='w-50' onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <input type="email" name="email" value={credentials.email} className="form-control" placeholder="Email address" id="email" aria-describedby="emailHelp" onChange={handleChange} required />
                                    <div id="emailHelp" className="form-text text-start">We'll never share your email with anyone else.</div>
                                </div>
                                <div className="mb-3">
                                    <input type="password" name="password" value={credentials.password} className="form-control" placeholder="Password" id="password" onChange={handleChange} required />
                                </div>
                                <button type="submit" className="btn large-btn w-100">Log in</button>
                            </form>
                            <hr className='mt-3 border-top border-dark' />
                            <Link className="link-text" to="/register/">Create new account</Link>
                            {error && <div className='alert alert-danger my-2'>{error}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginForm;
