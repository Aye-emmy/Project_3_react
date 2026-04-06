import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ReceiptDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        const fetchReceiptDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get(`https://project-3-node.onrender.com/api/getSingleReceipt/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setReceipt(response.data.data);
            } catch (error) {
                console.error('Error fetching receipt details:', error);
                setError('Failed to load receipt details');
                if (error.response?.status === 404) {
                    setError('Receipt not found');
                }
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchReceiptDetails();
        }
    }, [id, navigate]);

    const getTransactionType = () => {
        if (!receipt) return null;
        const currentUser = localStorage.getItem('userId'); 
        const isOutgoing = receipt.createdBy === currentUser;
        return {
            type: isOutgoing ? 'outgoing' : 'incoming',
            label: isOutgoing ? 'Debit' : 'Credit',
            icon: isOutgoing ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down',
            color: isOutgoing ? 'danger' : 'success',
            bgColor: isOutgoing ? '#fee2e2' : '#e8f5e9',
            textColor: isOutgoing ? '#dc3545' : '#28a745'
        };
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        const date = receipt.time
        return date
    };

    const downloadReceipt = () => {
        console.log('Download receipt:', receipt);
        alert('Download functionality coming soon!');
    };

    const shareReceipt = () => {
        console.log('Share receipt:', receipt);
        alert('Share functionality coming soon!');
    };

    const navigateToReceipt = () =>{
        if (userRole === 'admin') {
            navigate(`/admin-dashboard/receipt`);
            return; 
        }
        navigate(`/dashboard/receipt`);
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="text-center">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading receipt details...</p>
                </div>
            </div>
        );
    }

    if (error || !receipt) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <i className="fa-solid fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                    <h4 className="text-danger">{error || 'Receipt not found'}</h4>
                    <button 
                        className="btn btn-success mt-3"
                        onClick={() => navigateToReceipt()}
                    >
                        <i className="fa-solid fa-arrow-left me-2"></i>
                        Back to Receipts
                    </button>
                </div>
            </div>
        );
    }

    const transactionType = getTransactionType();
    const amount = Number(receipt.amount || 0);
    const formattedAmount = `₦${amount.toLocaleString()}`;

    return (
        <div className="container py-4">
            <div className="receipt-details-container">
                {/* Header */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => navigateToReceipt()}
                    >
                        <i className="fa-solid fa-arrow-left me-2"></i>
                        Back
                    </button>
                    <h3 className="fw-bold mb-0 text-success">Receipt Details</h3>
                    <div style={{ width: '70px' }}></div> 
                </div>

                {/* Main Receipt Card */}
                <div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                    <div className="card-body p-0">
                        {/* Header with Transaction Type */}
                        <div className="text-center p-4 border-bottom" style={{
                            background: transactionType.bgColor,
                            borderRadius: '20px 20px 0 0'
                        }}>
                            <div className="mb-3">
                                <div className="d-inline-block p-3 rounded-circle" style={{
                                    background: 'white',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}>
                                    <i className={`${transactionType.icon} fa-2x`} style={{ color: transactionType.textColor }}></i>
                                </div>
                            </div>
                            <h4 className="fw-bold mb-2" style={{ color: transactionType.textColor }}>
                                {transactionType.label}
                            </h4>
                            <h2 className="fw-bold mb-0" style={{ fontSize: '2.5rem' }}>
                                {formattedAmount}
                            </h2>
                            <p className="text-muted small mt-2">
                                {formatDate(receipt.date || receipt.createdAt)}
                            </p>
                        </div>

                        {/* Transaction Details */}
                        <div className="p-4">
                            <div className="row g-4">
                                {/* From Section */}
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-3">
                                        <label className="text-uppercase text-muted fw-bold small mb-2">
                                            <i className="fa-solid fa-user me-1"></i> From
                                        </label>
                                        <h6 className="fw-bold mb-1">{receipt.fromAccountName}</h6>
                                        <p className="text-muted small mb-0">{receipt.fromAccountNumber}</p>
                                    </div>
                                </div>

                                {/* To Section */}
                                <div className="col-md-6">
                                    <div className="p-3 bg-light rounded-3">
                                        <label className="text-uppercase text-muted fw-bold small mb-2">
                                            <i className="fa-solid fa-user-check me-1"></i> To
                                        </label>
                                        <h6 className="fw-bold mb-1">{receipt.toAccountName}</h6>
                                        <p className="text-muted small mb-0">{receipt.toAccountNumber}</p>
                                    </div>
                                </div>

                                {/* Transaction Details Grid */}
                                <div className="col-12">
                                    <div className="row g-3">
                                        <div className="col-sm-6">
                                            <div className="border rounded-3 p-3">
                                                <label className="text-uppercase text-muted fw-bold small mb-2">
                                                    <i className="fa-regular fa-clock me-1"></i> Time
                                                </label>
                                                <p className="mb-0 fw-semibold">{formatTime(receipt.time || receipt.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="border rounded-3 p-3">
                                                <label className="text-uppercase text-muted fw-bold small mb-2">
                                                    <i className="fa-solid fa-hashtag me-1"></i> Transaction ID
                                                </label>
                                                <p className="mb-0 fw-semibold small">{receipt.transactionId || receipt._id}</p>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="border rounded-3 p-3">
                                                <label className="text-uppercase text-muted fw-bold small mb-2">
                                                    <i className="fa-solid fa-chart-line me-1"></i> Transaction Type
                                                </label>
                                                <p className="mb-0 fw-semibold">
                                                    <span className={`badge bg-${transactionType.color} bg-opacity-10 text-${transactionType.color}`}>
                                                        {transactionType.label}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="border rounded-3 p-3">
                                                <label className="text-uppercase text-muted fw-bold small mb-2">
                                                    <i className="fa-solid fa-circle-check me-1"></i> Status
                                                </label>
                                                <p className="mb-0 text-success fw-semibold">
                                                    <i className="fa-solid fa-circle-check me-1"></i> Successful
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description if available */}
                                {receipt.description && (
                                    <div className="col-12">
                                        <div className="border rounded-3 p-3">
                                            <label className="text-uppercase text-muted fw-bold small mb-2">
                                                <i className="fa-solid fa-pen me-1"></i> Description
                                            </label>
                                            <p className="mb-0">{receipt.description}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-4 border-top bg-light" style={{ borderRadius: '0 0 20px 20px' }}>
                            <div className="row g-2">
                                <div className="col-md-6">
                                    <button 
                                        className="btn btn-success w-100 py-3 fw-bold"
                                        onClick={downloadReceipt}
                                    >
                                        <i className="fa-solid fa-file-pdf me-2"></i>
                                        Download Receipt
                                    </button>
                                </div>
                                <div className="col-md-6">
                                    <button 
                                        className="btn btn-outline-success w-100 py-3 fw-bold"
                                        onClick={shareReceipt}
                                    >
                                        <i className="fa-solid fa-share-nodes me-2"></i>
                                        Share Receipt
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptDetails;