import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="bg-white min-vh-100">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
                
                body { font-family: 'Inter', sans-serif; color: #1a1a1a; }
                .hero-section { padding: 80px 0; background: #eaf1ea; }
                .hero-title { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800; letter-spacing: -1.5px; line-height: 1.1; }
                .feature-card { border: 1px solid #eee; border-radius: 24px; transition: all 0.3s ease; background: #fff; height: 100%; }
                .feature-card:hover { border-color: #000800; box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
                .icon-box { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
                .btn-pill { border-radius: 100px; padding: 12px 30px; font-weight: 700; }
                .mockup-img { border-radius: 32px; box-shadow: 0 40px 80px rgba(0,0,0,0.1); max-width: 100%; height: auto; }
                .dropdown-item i { width: 20px; text-align: center; }
            `}</style>

            <Navbar />

            {/* Hero Section */}
            <header className="hero-section">
                <div className="container px-lg-5 text-center">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill mb-4 fw-bold">
                                Join 500,000+ users banking with Nova
                            </div>
                            <h1 className="hero-title mb-4">
                                Simple banking for <br />
                                <span className="text-success">your ambitious goals.</span>
                            </h1>
                            <p className="lead text-secondary mb-5 mx-auto" style={{ maxWidth: '700px' }}>
                                The modern way to spend, save, and grow your money. Open an account in 2 minutes right from your phone.
                            </p>
                            <div className="d-flex justify-content-center gap-3 mb-5">
                                <Link to="/signup" className="btn btn-dark btn-pill btn-lg">Get Started</Link>
                                <Link to="/about" className="btn btn-outline-dark btn-pill btn-lg">See How it Works</Link>
                            </div>
                            
                            <div className="mt-5">
                                <img 
                                    src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200" 
                                    alt="Nova Dashboard Preview" 
                                    className="mockup-img w-75"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Value Props */}
            <section className="py-5 bg-success bg-opacity-80">
                <div className="container px-lg-5">
                    <div className="row g-4 text-start">
                        <div className="col-md-4">
                            <div className="feature-card p-4">
                                <div className="icon-box bg-success bg-opacity-10 text-success mb-4">
                                    <i className="fa-solid fa-bolt"></i>
                                </div>
                                <h4 className="fw-bold">Lightning Fast</h4>
                                <p className="text-muted">Instant alerts for every transaction and transfers that arrive before you can blink.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card p-4">
                                <div className="icon-box bg-primary bg-opacity-10 text-primary mb-4">
                                    <i className="fa-solid fa-lock"></i>
                                </div>
                                <h4 className="fw-bold">Bank-grade Security</h4>
                                <p className="text-muted">Your funds are protected by multi-factor authentication and insured by the NDIC.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card p-4">
                                <div className="icon-box bg-info bg-opacity-10 text-info mb-4">
                                    <i className="fa-solid fa-piggy-bank"></i>
                                </div>
                                <h4 className="fw-bold">Smart Savings</h4>
                                <p className="text-muted">Automate your savings and earn up to 15% annual interest on your balanced funds.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home