import { useContext } from "react";
import Footer from "../Footer/Footer"
import NavBar from "../Navbar/NavBar"
import { useNavigate } from "react-router"
import { AuthContext } from "../../context/AuthContext";


export default function About() {
    const router = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);

    return (
        <>
            <div className="container-fluid mt-5 pt-5">
                <NavBar />
                <div className="row align-items-center m-5">
                    {/* Left: Text Section */}
                    <div className="col-md-6 mb-5 mb-md-0">
                        <h1 className="fw-bold mb-4 display-5 text-dark">
                            About <span className="main-text-color">Where to Find</span>
                        </h1>

                        <p className="lead mb-3">
                            Welcome to <strong>Where to Find</strong> — the community-driven platform
                            that helps people discover, share, and locate things all around them.
                        </p>

                        <p className="mb-3">
                            Our mission is simple: <strong>connect communities</strong> and make searching
                            for items easier by letting people help each other.
                        </p>

                        <p className="mb-4">
                            Whether you're looking for something specific or just want to help others,
                            <strong> Where to Find</strong> brings people together to make finding anything possible.
                        </p>
                        <div>
                            <p className="text-muted">If you have any questions, please do not hesitate to contact us at
                                <a href="mailto:contact@wheretofind.org" className="cursor-pointer text-decoration-underline ms-1 main-text-color">contact@wheretofind.org</a>
                            </p>
                        </div>
                        {isLoggedIn ? (
                            <button className="btn btn-dark rounded-pill px-4 py-2" onClick={() => router('/')}>
                               View Posts
                            </button>
                        ) : (
                            <button className="btn btn-dark rounded-pill px-4 py-2" onClick={() => router('/register')}>
                                Join the Community
                            </button>
                        )}
                    </div>

                    {/* Right: Image Section */}
                    <div className="col-md-6 text-center">
                        <img
                            src="/images/login8.png"
                            alt="Community illustration"
                            className="img-fluid rounded-4 shadow-sm"
                            style={{ maxWidth: "90%", transition: "transform 0.3s" }}
                            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
