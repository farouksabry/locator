import { Link } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer id="footer" className="py-4 px-5 bg-dark text-light border-top border-secondary">
            <div className="container-fluid">
                <div className="row align-items-start justify-content-between gy-4">
                    {/* Left: Logo and description */}
                    <div className="col-12 col-md-6 d-flex flex-column flex-md-row align-items-start">
                        <img
                            src="/images/logo.png"
                            alt="logo"
                            width={120}
                            className="img-fluid mb-3 mb-md-0 me-md-3"
                            style={{ filter: "brightness(0.9)" }}
                        />
                        <div>
                            <h4 className="logo mb-2">Where to find</h4>
                            <p className={`text-light ${styles.customTextWidth} mb-0`}>
                                Everyone is always looking for something.<br />
                                Limit your search scope and ask the people of each region
                                in each country to help you find it.
                            </p>
                        </div>
                    </div>

                    {/* Middle: Links */}
                    <div className="col-12 col-md-3">
                        <h6 className="text-uppercase fw-bold mb-3">Links</h6>
                        <ul className="list-unstyled d-flex flex-column gap-2">
                            <li>
                                <a href="mailto:contact@wheretofind.org" className="text-decoration-none text-light">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <Link to="/about" className="text-decoration-none text-light">
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer bottom */}
                <div className="text-center small text-secondary mt-4">
                    &copy; {new Date().getFullYear()} Locator | Farouk Sabry. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
