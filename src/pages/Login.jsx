import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';


const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const validationSchema = yup.object({
        email: yup.string().email('Enter a valid email address').required('Email is required'),
        password: yup.string().required('Password is required'),
    });


    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {

            try {
                const response = await axios.post('https://project-3-node.onrender.com/api/login', {
                    email: values.email,
                    password: values.password
                })
                if (response.data.status == '404') {
                    alert('Invalid email or password. Please try again.');
                    return;
                }
                if (response.data.status == '400') {
                    alert('Server error. Please try again later.');
                    return;
                }
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.data.isUser._id);
                localStorage.setItem('userRole', response.data.data.isUser.role);
                if (response.data.data.isUser.role === 'admin') {
                    navigate('/admin-dashboard', { replace: true });
                } else  {
                    navigate('/dashboard', { replace: true });
                }
                
            } catch (error) {
                console.error("Login Error:", error);
                alert('Invalid email or password. Please try again.');
            }
        }
    });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <div className="container-fluid min-vh-100 d-flex align-items-center py-5">
                <div className="row w-100 g-0">

                    {/* Sign In Form Section */}
                    <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center px-4 px-lg-5">
                        <div className="w-100" style={{ maxWidth: '450px' }}>
                            <div className="bg-light p-3 rounded-4 mb-4 d-flex align-items-center">
                                <i className="fa-solid fa-shield-halved text-success me-3 fs-4"></i>
                                <div>
                                    <p className="mb-0 small text-secondary">Please, check your browser's address bar to be sure you're on</p>
                                    <span className="fw-semibold text-success">https://app.novabank.com</span>
                                </div>
                            </div>

                            {/* Sign In Form */}
                            <div className="bg-white p-4 p-xl-5 rounded-4 shadow-sm border">
                                <form onSubmit={formik.handleSubmit}>
                                    <h3 className="h4 fw-bold mb-2">
                                        Sign in to your <span className="text-success">Nova</span> account now
                                    </h3>
                                    <p className="text-secondary mb-4 small">
                                        To sign in, please type in your registered email address
                                    </p>

                                    {/* Email Field */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Email Address:</label>
                                        <input
                                            name="email"
                                            type="email"
                                            className={`form-control form-control-lg bg-light border-0 ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                            placeholder="example@gmail.com"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.email}
                                        />
                                        {formik.touched.email && formik.errors.email && (
                                            <div className="invalid-feedback small">{formik.errors.email}</div>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    {/* Password Field with Eye Icon */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Password:</label>
                                        <div className="position-relative">
                                            <input
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                className={`form-control form-control-lg bg-light border-0 pe-5 ${formik.touched.password && formik.errors.password ? '' : ''}`}
                                                placeholder="************"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.password}
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="btn position-absolute end-0 top-50 translate-middle-y border-0 me-2"
                                                style={{ zIndex: 10, background: 'transparent' }}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                <i className={`fa-regular ${showPassword ? 'fa-eye' : 'fa-eye-slash'} text-secondary`}></i>
                                            </button>
                                            {formik.touched.password && formik.errors.password && (
                                                <div className="invalid-feedback d-block small">{formik.errors.password}</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sign Up Link */}
                                    <p className="small text-secondary mb-4">
                                        New to <span className="text-success">Nova</span>? Sign up <Link to="/signup" className="text-success text-decoration-none fw-semibold">here</Link>
                                    </p>

                                    {/* Sign In Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-success btn-lg w-100 rounded-pill fw-semibold"
                                        disabled={formik.isSubmitting}
                                    >
                                        {formik.isSubmitting ? 'Signing in...' : 'Sign in'}
                                    </button>
                                </form>
                            </div>

                            <div className="container mt-5">
                                <div className="row justify-content-center">
                                    <div className="col-12 text-center">
                                        <button
                                            type="submit"
                                            className="btn btn-success d-block mx-auto w-75 w-md-50 rounded-pill fw-semibold px-4 py-3 shadow-sm"
                                            onClick={() => navigate('/')}
                                        >
                                            <i className="fa-solid fa-house me-2"></i>
                                            Home
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Section - Hidden on mobile */}
                    <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center bg-light p-5">
                        <div className="text-center" style={{ maxWidth: '500px' }}>
                            <img
                                src="/Mobile login.gif"
                                alt="Mobile login animation"
                                className="img-fluid"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/500x500?text=Mobile+Login';
                                }}
                            />
                            <h4 className="fw-bold mt-4 text-success">Welcome Back!</h4>
                            <p className="text-secondary">Access your account securely and manage your finances on the go</p>
                        </div>
                    </div>
                </div>

                {/* Mobile image at bottom */}
                <div className="d-lg-none text-center mt-4 px-4 w-100">
                    <img
                        src="/Mobile login.gif"
                        alt="Mobile login animation"
                        className="img-fluid"
                        style={{ maxHeight: '200px' }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x200?text=Mobile+Login';
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;