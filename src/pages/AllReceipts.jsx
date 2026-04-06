import axios from 'axios';
import React, { useEffect, useState } from 'react'


const AllReceipts = () => {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedIndexes, setExpandedIndexes] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchReceipts = async () => {
            try {
                const response = await axios.get('https://project-3-node.onrender.com/api/getAllReceipt', {
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

    const toggleExpand = (index) => {
        setExpandedIndexes(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index) 
                : [...prev, index]
        );
    };

    return (
        <div className="container py-4">

            <div className="receipt-container">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <div>
                        <h3 className="fw-bold mb-0 text-success">Transactions</h3>
                        <p className="text-muted small mb-0">Tap a record to view full receipt</p>
                    </div>
                    <span className="badge bg-dark rounded-pill px-3">{receipts.length} total</span>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status"></div>
                    </div>
                ) :  (
                    <div className="d-flex flex-column gap-3">
                        {receipts.map((receipt, index) => {
                            const isExpanded = expandedIndexes.includes(index);
                            return (
                                <div key={index} className={`receipt-card p-3 ${isExpanded ? 'expanded' : ''}`}>
                                    {/* Short / Mini Form - Clickable */}
                                    <div className="mini-view" onClick={() => toggleExpand(index)}>
                                        <div className="d-flex align-items-center">
                                            <div className="bg-light p-2 rounded me-3 d-none d-sm-block text-success">
                                                <i className="fa-solid fa-arrow-right-long"></i>
                                            </div>
                                            <div>
                                                <p className="text-muted mb-0" style={{fontSize: '13px'}}>Sender</p>
                                                <h6 className="mb-0 fw-bold"> {receipt.fromAccountName}</h6>
                                                <small className="text-muted">{receipt.date || 'Today'}</small>
                                            </div>
                                        </div>
                                        <div className="text-end d-flex align-items-center">
                                            <span className="amount-text me-3">
                                                +₦{Number(receipt.amount).toLocaleString()}
                                            </span>
                                            <div className="btn btn-sm btn-light rounded-circle p-1">
                                                <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} small text-muted`}></i>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Full Details - Shown only if index is in expandedIndexes */}
                                    {isExpanded && (
                                        <div className="details-pane">
                                            <div className="row g-3">
                                                <div className="col-6">
                                                    <label className="extra-small-label text-uppercase text-muted fw-bold">Sender</label>
                                                    <p className="mb-0 small fw-semibold text-truncate">{receipt.fromAccountName}</p>
                                                    <p className="text-muted mb-0" style={{fontSize: '11px'}}>{receipt.fromAccountNumber}</p>
                                                </div>
                                                <div className="col-6">
                                                    <label className="extra-small-label text-uppercase text-muted fw-bold">Beneficiary Account</label>
                                                    <p className="mb-0 small fw-semibold">{receipt.toAccountName}</p>
                                                    <p className="text-muted mb-0" style={{fontSize: '11px'}}>{receipt.toAccountNumber}</p>
                                                </div>
                                                <div className="col-6">
                                                    <label className="extra-small-label text-uppercase text-muted fw-bold">Time</label>
                                                    <p className="mb-0 small">{receipt.time || 'N/A'}</p>
                                                    <p className="mb-0 small">{receipt.date || 'N/A'}</p>
                                                </div>
                                                <div className="col-6">
                                                    <label className="extra-small-label text-uppercase text-muted fw-bold">Status</label>
                                                    <p className="mb-0 small text-success fw-bold">
                                                        <i className="fa-solid fa-circle-check me-1"></i> Success
                                                    </p>
                                                </div>
                                                <div className="col-6">
                                                    <label className="extra-small-label text-uppercase text-muted fw-bold"> Reference ID </label>
                                                    <p className="mb-0 small fw-semibold">{receipt._id}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 pt-3 border-top d-flex gap-2">
                                                <button className="btn btn-success btn-sm w-100 fw-bold py-2 shadow-sm">
                                                    <i className="fa-solid fa-file-pdf me-2"></i>Download
                                                </button>
                                                <button className="btn btn-outline-secondary btn-sm w-100 fw-bold py-2 shadow-sm">
                                                    <i className="fa-solid fa-share-nodes me-2"></i>Share
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) 
            }
            </div>
        </div>
    );
};

export default AllReceipts