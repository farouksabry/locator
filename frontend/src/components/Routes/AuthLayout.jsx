import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import NavBar from '../Navbar/NavBar';

export default function AuthLayout() {
    const { isLoggedIn } = useContext(AuthContext);
    return (
        <>
            {isLoggedIn ? (
                <>
                    <NavBar />
                    <Outlet />
                </>
            ) : (
                <Navigate to="login" />
            )}
        </>
    )
}
