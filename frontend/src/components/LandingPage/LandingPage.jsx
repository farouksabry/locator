import { Link } from "react-router";
import Footer from "../Footer/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./LandingPage.module.css"

export default function LandingPage() {
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Hero Section */}
            <header className={`${styles.header} text-light text-center position-relative py-5`}>
                <div className="container">

                    {/* Top-right login button */}
                    <div className="position-absolute top-0 end-0 p-3">
                        <Link to="/login" className="btn btn-outline-light">
                            Login
                        </Link>
                    </div>

                    {/* Hero content */}
                    <img
                        src="/images/logo.png"
                        alt="Where to Find Logo"
                        width={150}
                        className="img-fluid mb-3"
                        style={{ filter: "brightness(0.9)" }}
                    />
                    <h1 className="display-5 fw-bold mb-3">Find Anything, Anywhere</h1>
                    <p className="lead mb-4">
                        Connect with communities in each region to locate the things you need.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Get Started
                        </Link>
                        <Link to="/about" className="btn btn-outline-light btn-lg">
                            Learn More
                        </Link>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-5 bg-light flex-grow-1">
                <div className="container">
                    <h2 className="text-center mb-5">How It Works</h2>
                    <div className="row text-center">
                        <div className="col-md-4 mb-4">
                            <div className="p-4 border rounded shadow-sm h-100">
                                <h4>Create a Post</h4>
                                <p>Share what you are looking for and the region you need help in.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="p-4 border rounded shadow-sm h-100">
                                <h4>Get Answers</h4>
                                <p>Community members in your area can respond with helpful tips.</p>
                            </div>
                        </div>
                        <div className="col-md-4 mb-4">
                            <div className="p-4 border rounded shadow-sm h-100">
                                <h4>Find What You Need</h4>
                                <p>Follow the guidance and discover exactly what you were looking for.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call-to-action Section */}
            <section
                className="py-5 text-center text-light"
                style={{
                    background: "linear-gradient(135deg, #cfdcebff 0%, #6c839cff 100%)",
                }}
            >
                <div className="container">
                    <h2 className="mb-3 fw-bold">Join Our Community</h2>
                    <p className="lead mb-4">
                        Discover and share what matters in your region. It's free and easy to start.
                    </p>
                    <Link to="/register" className="btn btn-light btn-lg px-4 py-2 fw-semibold">
                        Get Started
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
