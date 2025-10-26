import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import NavBar from '../Navbar/NavBar';
import Footer from '../Footer/Footer';

export default function AuthLayout() {
    const { isLoggedIn } = useContext(AuthContext);
    return (
        <>
            {isLoggedIn ? (
                <>
                    <NavBar />
                    <Outlet />
                    <Footer />
                </>
            ) : (
                <Navigate to="login" />
            )}
        </>
    )
}
