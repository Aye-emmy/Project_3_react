import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Withdraw = () => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [isValidated, setIsValidated] = useState(true); 
    const token = localStorage.getItem('token');

    const withdrawFunds = async (e) => {
        e.preventDefault();
        if (!amount || amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        
        setLoading(true);
        try {
            const response = await axios.post(
                'https://project-3-node.onrender.com/api/withdrawal', 
                { amount: parseFloat(amount) }, 
                { headers: { 'Authorization': `Bearer ${token}`} } 
            );
            alert(response.data.message || 'Withdrawal Successful!');
            setAmount('');
        } catch (error) {
            console.error("Transfer Error:", error.response?.data || error.message);
            if (error.response?.status === 401) {
                alert('Session expired. Please login again.');
                navigate('/login');
            } else {
                alert(error.response?.data?.message || 'Transfer Failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="withdraw-page-wrapper">
            <style>{`
                .withdraw-page-wrapper {
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    background-color: #f8f9fa;
                }

                .transfer-card {
                    width: 100%;
                    max-width: 480px;
                    background: #ffffff;
                    border-radius: 24px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                    overflow: hidden;
                    transition: transform 0.3s ease;
                }

                .card-inner {
                    padding: 2rem;
                }

                @media (max-width: 576px) {
                    .card-inner {
                        padding: 1.5rem;
                    }
                    .withdraw-page-wrapper {
                        padding: 0.5rem;
                        align-items: flex-start;
                        padding-top: 2rem;
                    }
                }

                .icon-container {
                    width: 64px;
                    height: 64px;
                    background: #198754;
                    color: white;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    margin-bottom: 1.25rem;
                    box-shadow: 0 4px 12px rgba(25, 135, 84, 0.2);
                }

                .form-control-custom {
                    width: 100%;
                    border: 2px solid #eef0f2;
                    border-radius: 12px;
                    padding: 1rem;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #198754;
                    text-align: center;
                    transition: all 0.2s ease;
                    outline: none;
                }

                .form-control-custom:focus {
                    border-color: #198754;
                    background-color: #fff;
                    box-shadow: 0 0 0 4px rgba(25, 135, 84, 0.1);
                }

                .form-control-custom::placeholder {
                    color: #ced4da;
                    font-weight: 400;
                }

                .form-control-custom:disabled {
                    background-color: #f8f9fa;
                    cursor: not-allowed;
                }

                .btn-withdraw {
                    background: #198754;
                    color: white;
                    border: none;
                    width: 100%;
                    padding: 1rem;
                    border-radius: 14px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                .btn-withdraw:hover:not(:disabled) {
                    background: #157347;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(25, 135, 84, 0.2);
                }

                .btn-withdraw:active:not(:disabled) {
                    transform: translateY(0);
                }

                .btn-withdraw:disabled {
                    background: #6c757d;
                    opacity: 0.65;
                    cursor: not-allowed;
                }

                .security-footer {
                    margin-top: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-size: 0.75rem;
                    color: #adb5bd;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
            `}</style>

            <div className="transfer-card">
                <div className="card-inner">
                    <div className="text-center mb-4">
                        <div className="icon-container">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
                            </svg>
                        </div>
                        <h2 className="fw-bold h4 mb-1">Withdraw Funds</h2>
                        <p className="text-muted small px-3">Securely move funds from your wallet to your linked account.</p>
                    </div>

                    <form onSubmit={withdrawFunds}>
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-uppercase text-muted mb-2 d-block text-center" style={{ letterSpacing: '1px' }}>
                                Amount to Withdraw (₦)
                            </label>
                            <input
                                type="number"
                                className="form-control-custom"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={!isValidated || loading}
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-withdraw"
                            disabled={loading || !isValidated || !amount || amount <= 0}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                'Confirm Withdrawal'
                            )}
                        </button>

                        <div className="security-footer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-success">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            NovaShield Encrypted
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Withdraw;