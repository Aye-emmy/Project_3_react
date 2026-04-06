import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
            <div className="error-container">
                <div className="error-card">
                    {/* Abstract 404 Illustration */}
                    <div className="illustration floating">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#e9f5ef" d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,76.4,-44.7C83.7,-31.3,87.1,-15.7,85.6,-0.9C84,14,77.5,27.9,68.9,40.1C60.3,52.3,49.6,62.7,37.1,69.8C24.5,76.9,10.2,80.7,-3.7,87.1C-17.6,93.5,-31.1,102.6,-43,100.1C-54.9,97.6,-65.2,83.5,-73.4,69.5C-81.5,55.5,-87.5,41.6,-89.9,27.2C-92.3,12.8,-91.1,-2.1,-86.3,-15.3C-81.5,-28.5,-73.1,-40,-62.7,-48.9C-52.3,-57.8,-39.9,-64.1,-27.6,-72.1C-15.3,-80.1,-3.1,-89.8,10.4,-91.6C23.9,-93.4,31.3,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
                            <circle cx="100" cy="100" r="40" fill="#198754" opacity="0.1" />
                            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="40" fontWeight="bold" fill="#198754">?</text>
                        </svg>
                    </div>

                    <h1 className="error-code">404</h1>
                    <h2 className="fw-bold h4 text-dark mb-3">Lost in Space?</h2>
                    <p className="text-muted mb-5 px-lg-4">
                        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                    </p>

                    <div className="d-grid d-sm-flex justify-content-center gap-3">
                        <button 
                            className="btn btn-dark btn-home btn-lg" 
                            onClick={() => navigate('/', { replace: true })}
                        >
                            <i className="fa-solid fa-house me-2 small"></i>
                            Go Home
                        </button>
                        
                        <button 
                            className="btn btn-outline-success btn-home btn-lg" 
                            onClick={() => window.history.back()}
                        >
                            <i className="fa-solid fa-arrow-left me-2 small"></i>
                            Back
                        </button>
                    </div>
                </div>

                <p className="mt-4 text-muted small">
                    Need help? <a href="#" className="text-success text-decoration-none fw-bold">Contact Support</a>
                </p>
            </div>
        </div>
    );
};

export default NotFound;