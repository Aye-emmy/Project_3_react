import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Receipt = () => {
    const navigate = useNavigate();
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState('');
    const userRole = localStorage.getItem('userRole');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId'); 
        setCurrentUserId(userId);

        const fetchReceipts = async () => {
            try {
                const response = await axios.get('https://project-3-node.onrender.com/api/getReceipt', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setReceipts(response.data.data || []);
            } catch (error) {
                console.error('Error fetching receipts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReceipts();
    }, []);

    const getTransactionType = (receipt) => {
        const isOutgoing = receipt.createdBy === currentUserId;
        return {
            type: isOutgoing ? 'outgoing' : 'incoming',
            label: isOutgoing ? 'Sent' : 'Received',
            icon: isOutgoing ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down',
            color: isOutgoing ? 'danger' : 'success'
        };
    };

    const handleReceiptClick = (receiptId) => {
            if (userRole === 'admin') {
                navigate(`/admin-dashboard/receipt/${receiptId}`);
                return; 
            }
        navigate(`/dashboard/receipt/${receiptId}`);
    };

    const navigateToTransfer = () => {
        if (userRole === 'admin') {
            navigate(`/admin-dashboard/transfer`);
            return; 
        }
        navigate(`/dashboard/transfer`);
    }

    return (
        <div className="container py-4">
            <div className="receipt-container">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <div>
                        <h3 className="fw-bold mb-0 text-success">Transactions</h3>
                        <p className="text-muted small mb-0">Click on a transaction to view full details</p>
                    </div>
                    <span className="badge bg-dark rounded-pill px-3">{receipts.length} total</span>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status"></div>
                    </div>
                ) : receipts.length > 0 ? (
                    <div className="d-flex flex-column gap-3">
                        {receipts.map((receipt, index) => {
                            const transactionType = getTransactionType(receipt);
                            const amount = Number(receipt.amount || 0);
                            
                            return (
                                <div 
                                    key={receipt._id || index} 
                                    className="receipt-card p-3 shadow-sm"
                                    style={{
                                        borderRadius: '15px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        border: '1px solid #e0e0e0'
                                    }}
                                    onClick={() => handleReceiptClick(receipt._id)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                                    }}
                                >
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <div className={`p-3 rounded-circle me-3`} style={{
                                                background: transactionType.color === 'success' ? '#e8f5e9' : '#fee2e2',
                                                width: '50px',
                                                height: '50px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <i className={`${transactionType.icon} fa-lg`} style={{
                                                    color: transactionType.color === 'success' ? '#28a745' : '#dc3545'
                                                }}></i>
                                            </div>
                                            <div>
                                                <h6 className="mb-0 fw-bold">
                                                    {transactionType.type === 'outgoing' 
                                                        ? `To: ${receipt.toAccountName}` 
                                                        : `From: ${receipt.fromAccountName}`}
                                                </h6>
                                                <small className="text-muted">
                                                    {receipt.date || receipt.createdAt ? 
                                                        new Date(receipt.date || receipt.createdAt).toLocaleDateString() : 
                                                        'Today'}
                                                </small>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <div className={`fw-bold ${transactionType.color === 'success' ? 'text-success' : 'text-danger'}`}>
                                                {transactionType.type === 'outgoing' ? '-' : '+'}
                                                ₦{amount.toLocaleString()}
                                            </div>
                                            <small className="text-muted">{receipt.toAccountNumber}</small>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                            <i className="fa-solid fa-receipt fs-1 text-muted opacity-50"></i>
                        </div>
                        <h5 className="fw-bold">No Transaction History</h5>
                        <p className="text-muted small px-4">Your transfer receipts will appear here once you make your first transaction.</p>
                        <button 
                            className="btn btn-success btn-sm px-4 mt-2 rounded-pill shadow-sm" 
                            onClick={() => navigateToTransfer()}
                        >
                            Make a Transfer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Receipt;