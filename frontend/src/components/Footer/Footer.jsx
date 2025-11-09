// import { Link } from "react-router";
// import "bootstrap/dist/css/bootstrap.min.css";
// import styles from "./Footer.module.css"

// export default function Footer() {
//     return (
//         <footer id="footer"className="py-4 px-5 bg-dark text-light border-top border-secondary">
//             <div className="container-fluid">
//                 <div className="align-items-start justify-content-between">
//                     {/* Left: Logo */}
//                     <div className="mb-3 mb-md-0 d-flex justify-content-center justify-content-md-start">
//                         <div className="d-flex justify-content-between align-items-center w-100">
//                             <div className="d-flex justify-content-center align-items-center">
//                                 <img
//                                     src="/images/logo.png"
//                                     alt="logo"
//                                     width={180}
//                                     className="img-fluid"
//                                     style={{ filter: "brightness(0.9)" }}
//                                 />
//                                 <div>
//                                     <h4 className="logo">Where to find</h4>
//                                     <p className={`text-light ${styles.customTextWidth}`}>
//                                         Everyone is always looking for something.<br />Limit your seach scope and ask the people of each region in each country to help you find it.
//                                     </p>
//                                 </div>
//                             </div>
//                             {/* Middle: Links */}
//                             <div className="mb-3 mb-md-0 text-center text-md-start">
//                                 <h6 className="text-uppercase fw-bold mb-3">Links</h6>
//                                 <ul className="list-unstyled d-flex flex-nowrap gap-4">
//                                     <li>
//                                         <Link to="/contact" className="text-decoration-none text-light">
//                                             Contact Us
//                                         </Link>
//                                     </li>
//                                     <li>
//                                         <Link to="/about" className="text-decoration-none text-light">
//                                             About
//                                         </Link>
//                                     </li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                     {/* Right: Copyright */}
//                     <div className="text-center small text-secondary">
//                         &copy; {new Date().getFullYear()}{" "}
//                         Locator | Farouk Sabry. All rights reserved.
//                     </div>
//                 </div>
//             </div>
//         </footer>
//     );
// }

import { Link } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Footer.module.css"

export default function Footer() {
    return (
        <footer id="footer"className="mt-auto py-4 px-5 bg-dark text-light border-top border-secondary">
            {/* Left: Logo */}
            <div className="d-flex justify-content-between align-items-center w-100">
                <div className="d-flex justify-content-center align-items-center">
                    <img
                        src="/images/logo.png"
                        alt="logo"
                        width={180}
                        className="img-fluid"
                        style={{ filter: "brightness(0.9)" }}
                    />
                    <div>
                        <h4 className="logo">Where to find</h4>
                        <p className={`text-light ${styles.customTextWidth}`}>
                            Everyone is always looking for something.<br />Limit your seach scope and ask the people of each region in each country to help you find it.
                        </p>
                    </div>
                </div>
                {/* Middle: Links */}
                <div className="mb-3 mb-md-0 text-center text-md-start">
                    <h6 className="text-uppercase fw-bold mb-3">Links</h6>
                    <ul className="list-unstyled d-flex flex-nowrap gap-4">
                        <li>
                            <Link to="/contact" className="text-decoration-none text-light">
                                Contact Us
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="text-decoration-none text-light">
                                About
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            {/* Right: Copyright */}
            <div className="text-center small text-secondary">
                &copy; {new Date().getFullYear()}{" "}
                Locator | Farouk Sabry. All rights reserved.
            </div>
        </footer>
    );
}
