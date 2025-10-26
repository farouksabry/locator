import { Link, useLocation, useNavigate, useParams } from "react-router"
import styles from "./NavBar.module.css"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"
import { getCsrfToken } from "../../utils/csrf"
import axiosInstance from "../../api/axiosInstance"

export default function NavBar() {
    const { setIsLoggedIn } = useContext(AuthContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const logout = async () => {
        const csrf = await getCsrfToken();

        try {
            const response = await axiosInstance.post("/api/logout/", {},
                {
                    withCredentials: true,
                    headers: {
                        'X-CSRFToken': csrf,
                    }
                }
            );

            setIsLoggedIn(false);
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 500); // changes when scroll passes 500px
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav className={`navbar fixed-top navbar-expand-lg bg-transparent ${styles.wrapper}`}>
                <div className="container-fluid">
                    <img height={70} src="/images/logo.png" alt="Logo" />
                    {location.pathname === "/" ? (
                        <Link className={`navbar-brand logo fs-3 ${scrolled ? "text-black" : "text-white"}`} to="/">Where to find</Link>
                    ) : (
                        <Link className={`navbar-brand logo fs-3 text-black`} to="/">Where to find</Link>
                    )}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse fs-6" id="navbarContent">
                        <ul className="navbar-nav w-100">
                            <li className="nav-item">
                                {location.pathname === "/" ? (
                                    <Link className={`nav-link ${scrolled ? "text-black" : "text-white"}`}  aria-current="page" to="/">Home</Link>
                                ) : (
                                    <Link className={`nav-link text-black`}  aria-current="page" to="/">Home</Link>
                                )}
                            </li>
                        </ul>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                {location.pathname === "/" ? (
                                    <Link className={`nav-link ${scrolled ? "text-black" : "text-white"}`} aria-current="page" to={`/profile/${user.slug}/`}>Profile</Link>
                                ) : (
                                    <Link className={`nav-link text-black`} aria-current="page" to={`/profile/${user.slug}/`}>Profile</Link>
                                )}
                            </li>
                            <li className="nav-item">
                                {location.pathname === "/" ? (
                                    <button type="button" onClick={logout} className={`nav-link ${scrolled ? "text-black" : "text-white"}`} aria-current="page">Logout</button>
                                ) : (
                                    <button type="button" onClick={logout} className={`nav-link text-black logout-btn`} aria-current="page">Logout</button>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}
