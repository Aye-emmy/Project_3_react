import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Transfer = () => {
    const navigate = useNavigate();
    const [recipientAccount, setRecipientAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [loading, setLoading] = useState(false);
    const [isValidated, setIsValidated] = useState(false);
    const token = localStorage.getItem('token');

    const findAccount = async () => {
        if (!recipientAccount || recipientAccount.length < 10) return;
        setLoading(true);
        try {
            const response = await axios.post('https://project-3-node.onrender.com/api/getAccount', { recipientAccount }, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.data && response.data.data) {
                setRecipientName(response.data.data);
                setIsValidated(true);
            } else {
                setRecipientName('Account Not Found');
                setIsValidated(true);
            }
        } catch (error) {
            console.error("Lookup Error:", error);
            setRecipientName('');
            setIsValidated(false);
            alert(error.response?.data?.message || 'Error validating account. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const transferFunds = async (e) => {
        e.preventDefault();
        if (!amount || amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }
        if (!recipientAccount) {
            alert("Please verify recipient account first");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post('https://project-3-node.onrender.com/api/transfer', { amount: parseFloat(amount), accountNumber: Number(recipientAccount) }, { headers: { 'Authorization': `Bearer ${token}`} } );
            alert(response.data.message || 'Transfer Successful!');
            setRecipientAccount('');
            setAmount('');
            setRecipientName('');
            setIsValidated(false);
        } catch (error) {
            console.error("Transfer Error Details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
                request: error.request
            });
            if (error.response?.status === 401) {
                alert('Session expired. Please login again.');
                navigate('/login');
            } else if (error.response?.status === 400) {
                alert(error.response?.data?.message || 'Invalid transfer details');
            } else if (error.response?.status === 500) {
                alert('Server error. Please try again later.');
            } else if (error.request) {
                alert('No response from server. Check your connection.');
            } else {
                alert(error.response?.data?.message || 'Transfer Failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-3 py-md-5">
            <div className="transfer-card">
                <div className="card-inner">
                    <div className="text-center mb-4">
                        <div className="bg-success d-inline-flex p-3 rounded-circle mb-3 shadow-sm text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></svg>
                        </div>
                        <h2 className="fw-bold h4 mb-1">Transfer Funds</h2>
                        <p className="text-muted small px-3">Enter recipient details to move money securely.</p>
                    </div>

                    <form onSubmit={transferFunds} className="mx-auto" style={{ maxWidth: '400px' }}>
                        {/* Account Number Input */}
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-uppercase text-muted" style={{ letterSpacing: '0.5px' }}>Recipient Account</label>
                            <div className="d-flex gap-2 input-group-responsive">
                                <input
                                    type="text"
                                    className="form-control-custom flex-grow-1"
                                    placeholder="e.g. 0123456789"
                                    value={recipientAccount}
                                    onChange={(e) => {
                                        setRecipientAccount(e.target.value);
                                        setIsValidated(false);
                                        setRecipientName('');
                                    }}
                                />
                                {!isValidated && (
                                    <button
                                        className="btn btn-success fw-bold px-4"
                                        type="button"
                                        onClick={findAccount}
                                        disabled={loading || recipientAccount.length < 5}
                                        style={{ borderRadius: '12px' }}
                                    >
                                        {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Verify'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Recipient Validation Display */}
                        {recipientName && (
                            <div className="recipient-box">
                                <div className="bg-white rounded-circle p-2 me-3 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#198754" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </div>
                                <div className="overflow-hidden">
                                    <small className="text-muted d-block" style={{ fontSize: '10px', fontWeight: '800' }}>RECIPIENT</small>
                                    <span className="fw-bold text-success text-uppercase text-truncate d-block">{recipientName}</span>
                                </div>
                            </div>
                        )}

                        {/* Amount Input */}
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-uppercase text-muted" style={{ letterSpacing: '0.5px' }}>Amount (₦)</label>
                            <input
                                type="number"
                                className="form-control-custom py-3 fs-4 fw-bold text-success"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={!isValidated}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-success btn-lg w-100 fw-bold py-3 shadow-sm rounded-4"
                            disabled={loading || !isValidated || !amount}

                        >
                            {loading ? (
                                <span><span className="spinner-border spinner-border-sm me-2"></span>Confirming...</span>
                            ) : 'Confirm Transfer'}
                        </button>

                        <div className="text-center mt-4 pt-2">
                            <div className="d-inline-flex align-items-center text-muted border px-3 py-1 rounded-pill" style={{ fontSize: '11px', background: '#fafafa' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="me-2 text-success"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                Securing your transaction with NovaShield
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Transfer;