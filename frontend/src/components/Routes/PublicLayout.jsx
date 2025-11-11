import { useContext } from 'react'
import { Outlet, Navigate } from 'react-router'
import { AuthContext } from '../../context/AuthContext'


export default function PublicLayout() {
    const { isLoggedIn } = useContext(AuthContext);
    return !isLoggedIn ? <Outlet /> : <Navigate to="/" />
}
