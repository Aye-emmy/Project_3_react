import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [accountName, setAccountName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountAmount, setAccountAmount] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [navigate, token]);

    const display = useCallback(async () => {
        if (!token) return;

        try {
            setLoading(true);
            setError('');

            const user = await axios.get('https://project-3-node.onrender.com/api/getUserAccount', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (user.data && user.data.data) {
                const disAccountAmount = user.data.data.user?.accountAmount || '0';
                const disAccountName = user.data.data.user?.accountName || '';
                const disAccountNumber = user.data.data.user?.accountNumber || '';
                const disRole = user.data.data.role || '';

                setAccountAmount(disAccountAmount);
                setAccountName(disAccountName);
                setAccountNumber(disAccountNumber);
                setRole(disRole);
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            console.log(error);
            setError('Failed to load account information');

            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                alert('Session expired. Please login again.');
            }
        } finally {
            setLoading(false);
        }
    }, [token, navigate]);

    useEffect(() => {
        display();
    }, [display]);

    const navLinks = [
        { path: '/dashboard', label: 'Account', icon: 'fa-solid fa-house' },
        { path: 'transfer', label: 'Transfer', icon: 'fa-solid fa-paper-plane' },
        { path: 'withdraw', label: 'Withdraw', icon: 'fa-solid fa-sack-dollar' },
        { path: 'receipt', label: 'Receipts', icon: 'fa-solid fa-receipt' },
        { path: 'userDetails', label: 'User Details', icon: 'fa-solid fa-user' }
    ];

    const isLandingPage = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

    const logOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        navigate('/', { replace: true });
        alert('Logged Out');
    };

    const getInitial = () => {
        if (accountName && accountName.trim()) {
            return accountName.charAt(0).toUpperCase();
        }
        return '?';
    };

    if (loading && !accountName) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="text-center">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column flex-md-row min-vh-100 bg-light">
            {/* Sidebar */}
            <div className="sidebar bg-success text-light p-4 shadow-lg d-flex flex-column" style={{ width: '280px' }}>
                {/* Brand Header */}
                <div className="sidebar-header mb-5 px-2">
                    <h4 className="fw-bold d-flex align-items-center">
                        <i className="fa-solid fa-leaf me-2"></i>
                        NovaBank
                    </h4>
                </div>

                {/* User Profile Section */}
                <div className="user-profile-sidebar mb-4 px-2 d-flex align-items-center opacity-75">
                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center text-success me-2"
                        style={{ width: '30px', height: '30px' }}>
                        <i className="fa-solid fa-user small"></i>
                    </div>
                    <div className="overflow-hidden text-nowrap">
                        <p className="small fw-bold mb-0 text-truncate">
                            {accountName || 'Loading...'}
                        </p>
                        <small className="text-white-50">{role?.toUpperCase() || 'User'}</small>
                    </div>
                </div>

                {/* Navigation Links */}
                <ul className="nav-list list-unstyled flex-column mb-auto">
                    {navLinks.map((link) => {
                        const isActive = location.pathname.endsWith(link.path) ||
                            (link.path === '/dashboard' && isLandingPage) ||
                            location.pathname === `/dashboard/${link.path}`;
                        return (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className={`nav-link nav-item-custom p-3 d-flex align-items-center text-light ${isActive ? 'nav-item-active bg-success bg-opacity-25' : ''
                                        }`}
                                    style={{
                                        borderRadius: '10px',
                                        transition: 'all 0.3s ease',
                                        marginBottom: '5px',
                                        textDecoration: 'none'
                                    }}
                                >
                                    <i className={`${link.icon} me-3`}></i>
                                    <span className="d-none d-md-inline">{link.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Logout */}
                <div className="mt-auto d-none d-md-block pt-3 border-top border-white border-opacity-10">
                    <button
                        className="btn btn-link text-light text-decoration-none text-opacity-75 small p-0"
                        onClick={logOut}
                        style={{ cursor: 'pointer' }}
                    >
                        <i className="fa-solid fa-right-from-bracket me-2"></i>
                        Log Out
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="main-content flex-grow-1">
                <div className="container-fluid p-4">
                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            {error}
                            <button type="button" className="btn-close" onClick={() => setError('')}></button>
                        </div>
                    )}

                    {isLandingPage ? (
                        <div className="landing-content">
                            <div className="card border-0 shadow-lg mb-4" style={{
                                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                borderRadius: '20px'
                            }}>
                                <div className="card-body p-4">
                                    <p className="small mb-1 text-white-50">Total Balance</p>
                                    <h2 className="fw-bold text-white mb-4">
                                        ₦{parseFloat(accountAmount).toLocaleString()}
                                    </h2>

                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="overflow-hidden">
                                            <p className="fw-bold mb-0 text-white" style={{ fontSize: '18px' }}>
                                                {accountName || '---'}
                                            </p>
                                            <p className="small mb-0 text-white-50" style={{ fontSize: '13px' }}>
                                                {accountNumber || 'N/A'} • {role?.toUpperCase() || 'User'}
                                            </p>
                                        </div>
                                        <div className="bg-white bg-opacity-20 p-3 rounded-3 d-flex align-items-center justify-content-center"
                                            style={{ width: '50px', height: '50px' }}>
                                            <span className="text-success fw-bold fs-4">
                                                {getInitial()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <h6 className="fw-bold mb-0">Recent Activity</h6>
                                            <i className="fa-solid fa-clock text-success"></i>
                                        </div>
                                        <div className="text-center py-4">
                                            <i className="fa-solid fa-inbox fa-3x text-muted mb-3"></i>
                                            <p className="text-muted small mb-0">No recent transactions to display.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card border-0 shadow-sm p-4 rounded-4 h-100">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <h6 className="fw-bold mb-0">Savings Goal</h6>
                                            <i className="fa-solid fa-chart-line text-success"></i>
                                        </div>
                                        <div className="mb-3">
                                            <div className="progress" style={{ height: '10px', borderRadius: '10px' }}>
                                                <div className="progress-bar bg-success" style={{ width: '65%', borderRadius: '10px' }}></div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span className="small text-muted">₦0 / ₦500,000</span>
                                            <span className="small text-success fw-bold">65%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="outlet-wrapper">
                            <Outlet />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;