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
                    <div className='d-flex flex-column min-vh-100'>
                        <NavBar />
                        <main className='flex-grow-1'>
                            <Outlet />
                        </main>
                        <Footer />
                    </div>
                </>
            ) : (
                <Navigate to="/login" />
            )}
        </>
    )
}
