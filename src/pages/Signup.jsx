import React, { useState } from 'react'
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const Signup = () => {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    let formik = useFormik({
        initialValues: {
            fullName: "",
            phoneNumber: "",
            email: "",
            password: "",
            policy: false,
            role: "",
            adminCode: "",
        },

        validationSchema: yup.object({
            fullName: yup.string().required('Full name is required'),
            phoneNumber: yup.string().matches(/^(?:\+234|0)[789]\d{9}$/, "Phone Number must be in this format: 08012345678 or +2348012345678").required('Phone Number is Required'),
            email: yup.string().email('Invalid Email format').required('Email is required'),
            password: yup.string().required("Password is required").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character"),
            policy: yup.bool().oneOf([true], 'Terms and Policy must be Agreed'),
            role: yup.string().oneOf(['user', 'admin'], 'Please select a role').required('Selecting a role is required'),
            adminCode: yup.string().when('role', {
                is: 'admin', then: (schema) => schema.required('Admin code is required').oneOf(['1234'], 'Incorrect Admin Code'), otherwise: (schema) => schema.notRequired(),
            })
        }),

        onSubmit: async (values) => {
            try {
                let response = await axios.post('https://project-3-node.onrender.com/api/signUp', {
                    fullName: values.fullName,
                    phoneNumber: values.phoneNumber,
                    email: values.email,
                    password: values.password,
                    role: values.role,
                })

                if (response.data.status == '400') {
                    alert('Server error. Please try again later.');
                    return;
                }

                alert(response.data.message)
                navigate('/login');
            } catch (error) {
                console.log(error);
                alert('User Creation Error')
            }
        }
    })

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <div className="container-fluid min-vh-100 d-flex align-items-center py-5">
                <div className="row w-100 g-0">
                    {/* Sign Up Form Section */}
                    <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center px-4 px-lg-5">
                        <div className="w-100" style={{ maxWidth: '480px' }}>
                            {/* Security Notice */}
                            <div className="bg-light p-3 rounded-4 mb-4 d-flex align-items-center">
                                <i className="fa-solid fa-shield-halved text-success me-3 fs-4"></i>
                                <div>
                                    <p className="mb-0 small text-secondary">Please, check your browser's address bar to be sure you're on</p>
                                    <span className="fw-semibold text-success">https://app.novabank.com</span>
                                </div>
                            </div>
                            {/* Sign Up Form */}
                            <div className="bg-white p-4 p-xl-5 rounded-4 shadow-sm">
                                <form onSubmit={formik.handleSubmit}>
                                    <h3 className="h4 fw-bold mb-2">
                                        Create your <span className="text-success">Nova</span> account
                                    </h3>
                                    <p className="text-secondary mb-4 small">
                                        Fill in your details to get started with Nova Banking
                                    </p>
                                    {/* Full Name Field */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Full Name:</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg bg-light border-0"
                                            placeholder="John Doe"
                                            name='fullName'
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                        />
                                        {(formik.touched.fullName && formik.errors.fullName) && <small className='text-danger'>{formik.errors.fullName}</small>}
                                    </div>
                                    {/* Phone Number Field */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Phone Number:</label>
                                        <input
                                            type="tel"
                                            className="form-control form-control-lg bg-light border-0"
                                            placeholder="08012345678 or +2348012345678"
                                            name='phoneNumber'
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                        />
                                        {(formik.touched.phoneNumber && formik.errors.phoneNumber) && <small className='text-danger'>{formik.errors.phoneNumber}</small>}
                                    </div>
                                    {/* Email Field */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Email Address:</label>
                                        <input
                                            type="email"
                                            className="form-control form-control-lg bg-light border-0"
                                            placeholder="example@gmail.com"
                                            name='email'
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                        />
                                        {(formik.touched.email && formik.errors.email) && <small className='text-danger'>{formik.errors.email}</small>}
                                    </div>
                                    {/* Password Field */}
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Password:</label>
                                        <div className="position-relative">
                                            <input
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                className={`form-control form-control-lg bg-light border-0 pe-5 ${formik.touched.password && formik.errors.password ? '' : ''}`}
                                                placeholder="Create a strong password"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.password}
                                            />

                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="btn position-absolute end-0 top-50 translate-middle-y border-0 me-1"
                                                style={{ zIndex: 10, background: 'transparent' }}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                <i className={`fa-regular ${showPassword ? 'fa-eye' : 'fa-eye-slash'} text-secondary`}></i>
                                            </button>
                                            {formik.touched.password && formik.errors.password && (
                                                <small className="text-danger d-block mt-1">{formik.errors.password}</small>
                                            )}

                                        </div>
                                    </div>
                                    {/* Role */}
                                    <div className="mb-4">
                                        <label className="fw-bold mb-2">Select Role</label>
                                        <div className="d-flex gap-4 mb-3">
                                            {/* User Option */}
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="role"
                                                    value="user"
                                                    id="roleUser"
                                                    onChange={formik.handleChange}
                                                    checked={formik.values.role === "user"}
                                                />
                                                <label className="form-check-label" htmlFor="roleUser">User</label>
                                            </div>

                                            {/* Admin Option */}
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="role"
                                                    value="admin"
                                                    id="roleAdmin"
                                                    onChange={formik.handleChange}
                                                    checked={formik.values.role === "admin"}
                                                />
                                                <label className="form-check-label" htmlFor="roleAdmin">Admin</label>
                                            </div>
                                        </div>

                                        {/* Conditional Admin Code Input */}
                                        {formik.values.role === 'admin' && (
                                            <div className="mt-2 animate__animated animate__fadeIn">
                                                <label className="small fw-bold text-success">Enter Admin Secret Code</label>
                                                <input
                                                    type="password"
                                                    name="adminCode"
                                                    placeholder="Type here"
                                                    className={`form-control form-control-sm ${formik.touched.adminCode && formik.errors.adminCode ? 'is-invalid' : ''}`}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.adminCode}
                                                />
                                                {formik.touched.adminCode && formik.errors.adminCode && (
                                                    <div className="invalid-feedback">{formik.errors.adminCode}</div>
                                                )}
                                            </div>
                                        )}

                                        {/* General Role Error */}
                                        {formik.touched.role && formik.errors.role && (
                                            <small className="text-danger d-block mt-1">{formik.errors.role}</small>
                                        )}
                                    </div>
                                    {/* Terms and Conditions */}
                                    <div className="mb-4">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" id="termsCheck" name='policy' onBlur={formik.handleBlur}
                                                onChange={formik.handleChange} />
                                            <label className="form-check-label small text-secondary" htmlFor="termsCheck">
                                                I agree to Nova's <Link to="#" className="text-success text-decoration-none">Terms of Service</Link> and
                                                <Link to="#" className="text-success text-decoration-none"> Privacy Policy</Link>
                                            </label>
                                            <br />
                                            {(formik.touched.policy && formik.errors.policy) && <small className='text-danger'>{formik.errors.policy}</small>}
                                        </div>
                                    </div>
                                    {/* Sign In Link */}
                                    <p className="small text-secondary mb-4">
                                        Already have an account? <Link to="/login" className="text-success text-decoration-none fw-semibold">Sign in</Link>
                                    </p>
                                    {/* Create Account Button */}
                                    <button type="submit" className="btn btn-success btn-lg w-100 rounded-pill fw-semibold" disabled={formik.isSubmitting} >
                                        {formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
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
                    {/* Image Section - Hidden on mobile, visible on large screens */}
                    <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center bg-light p-5">
                        <div className="text-center" style={{ maxWidth: '500px' }}>
                            <img
                                src="/Mobile login-pana.svg"
                                alt="Mobile sign up illustration"
                                className="img-fluid"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/500x500?text=Sign+Up';
                                }}
                            />
                            <h4 className="fw-bold mt-4 text-success">Join Nova Today!</h4>
                            <p className="text-secondary">Start your journey to smarter banking with modern financial tools</p>
                            {/* Feature List */}
                            <div className="text-start mt-4">
                                <div className="d-flex align-items-center mb-2">
                                    <i className="fa-solid fa-circle-check text-success me-2"></i>
                                    <span className="small">No monthly fees</span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="fa-solid fa-circle-check text-success me-2"></i>
                                    <span className="small">Instant account setup</span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <i className="fa-solid fa-circle-check text-success me-2"></i>
                                    <span className="small">24/7 customer support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Optional: Add this for mobile image at bottom */}
                <div className="d-lg-none text-center mt-4 px-4">
                    <img
                        src="/Mobile login-pana.svg"
                        alt="Mobile sign up illustration"
                        className="img-fluid"
                        style={{ maxHeight: '150px' }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x150?text=Sign+Up';
                        }}
                    />
                    <h5 className="fw-bold mt-3 text-success">Join Nova Today!</h5>
                </div>
            </div>
        </div>
    )
}


export default Signup