import { Routes, Route } from 'react-router'
import './App.css'
import LoginForm from '@/components/Login/LoginForm'
import Home from '@/components/Home/Home'
import Register from '@/components/Register/Register'
import PublicLayout from '@/components/Routes/PublicLayout'
import AuthLayout from '@/components/Routes/AuthLayout'
import Profile from '@/components/Profile/Profile'
import VerifyEmail  from '@/components/Auth/VerifyEmail'
import ForgotPassword from '@/components/Password/ForgotPassword'
import PasswordReset from '@/components/Password/PasswordReset'
import { AuthContext } from './context/AuthContext'
import { useContext } from 'react'

function App() {
    const { isLoggedIn } = useContext(AuthContext);
    if (isLoggedIn === null) return null;

    return (
        <>
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route index element={<Home />} />
                    <Route path='profile/:slug' element={<Profile />} />
                </Route>
                <Route element={<PublicLayout />}>
                    <Route path='login' element={<LoginForm />} />
                    <Route path='register' element={<Register />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/password-reset" element={<PasswordReset />} />
                </Route>
            </Routes>
        </>
    )
}

export default App;
