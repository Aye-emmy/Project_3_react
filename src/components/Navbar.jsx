import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-white sticky-top shadow-sm py-3">
                <div className="container-fluid px-lg-5">
                    {/* Logo Section (nav1) */}
                    <Link className="navbar-brand d-flex align-items-center" to="/">
                        <div className="sidebar-header mb-0 px-2">
                            <h4 className="fw-bold d-flex align-items-center mb-0">
                                <i className="fa-solid fa-leaf me-2 text-success"></i>
                                NovaBank
                            </h4>
                        </div>
                    </Link>

                    {/* Mobile Toggler */}
                    <button
                        className="navbar-toggler border-0"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Navigation Content (nav2) */}
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-3">

                            {/* Features Dropdown (nav2-1) */}
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle fw-bold text-dark"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Features
                                </a>
                                <ul className="dropdown-menu border-0 shadow-sm p-3">
                                    <li><Link className="dropdown-item py-2" to="/nova-card"><i className="fa-regular fa-credit-card me-2 text-primary"></i>Nova Card</Link></li>
                                    <li><Link className="dropdown-item py-2" to="/spend"><i className="fa-solid fa-money-bills me-2 text-success"></i>Spend</Link></li>
                                    <li><Link className="dropdown-item py-2" to="/save"><i className="fa-solid fa-piggy-bank me-2 text-warning"></i>Save</Link></li>
                                    <li><Link className="dropdown-item py-2" to="/budget"><i className="fa-solid fa-chart-pie me-2 text-info"></i>Budget</Link></li>
                                    <li><Link className="dropdown-item py-2" to="/borrow"><i className="fa-solid fa-hand-holding-dollar me-2 text-secondary"></i>Borrow</Link></li>
                                </ul>
                            </li>

                            {/* Business Beta (nav2-s) */}
                            <li className="nav-item">
                                <Link className="nav-link fw-bold text-dark d-flex align-items-center" to="/business">
                                    Business
                                    <span className="badge rounded-pill bg-info text-dark ms-1" style={{ fontSize: '0.65rem' }}>Beta</span>
                                </Link>
                            </li>

                            {/* Company Dropdown (nav2-2) */}
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle fw-bold text-dark"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Company
                                </a>
                                <ul className="dropdown-menu border-0 shadow-sm p-3">
                                    <li><Link className="dropdown-item py-2" to="/blog"><i className="fa-solid fa-newspaper me-2 text-muted"></i>Blog</Link></li>
                                    <li><Link className="dropdown-item py-2" to="/press"><i className="fa-solid fa-bullhorn me-2 text-muted"></i>Press</Link></li>
                                    <li><Link className="dropdown-item py-2" to="/careers"><i className="fa-solid fa-user-plus me-2 text-muted"></i>Join Our Team</Link></li>
                                    <li><Link className="dropdown-item py-2" to="/about"><i className="fa-solid fa-circle-info me-2 text-muted"></i>About Us</Link></li>
                                </ul>
                            </li>

                            {/* Help Dropdown (nav2-3) */}
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle fw-bold text-dark"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Help
                                </a>
                                <ul className="dropdown-menu border-0 shadow-sm p-3">
                                    <li><Link className="dropdown-item py-2" to="/help"><i className="fa-solid fa-life-ring me-2 text-danger"></i>Get help</Link></li>
                                    <li><Link className="dropdown-item py-2" to="/faqs"><i className="fa-solid fa-circle-question me-2 text-primary"></i>FAQs</Link></li>
                                    <li><Link className="dropdown-item py-2" to="/security"><i className="fa-solid fa-shield-check me-2 text-success"></i>Security</Link></li>
                                    <li><Link className="dropdown-item py-2" to="/contact"><i className="fa-solid fa-envelope me-2 text-info"></i>Contact Us</Link></li>
                                </ul>
                            </li>
                        </ul>

                        {/* Action Buttons (nav3) */}
                        <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3 mt-3 mt-lg-0">
                            <Link className="nav-link fw-bold text-dark px-3" to="/login">Sign In</Link>
                            <Link className="btn btn-dark rounded-pill px-4 py-2 fw-bold" to="/signup">Get Nova</Link>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar