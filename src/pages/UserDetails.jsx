import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDetails = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({ fullName: '', phoneNumber: '' });
    const [isUpdating, setIsUpdating] = useState(false);
    const token = localStorage.getItem('token');

    const getUserDetails = async () => {
        try {
            const response = await axios.get('https://project-3-node.onrender.com/api/getUser', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = response.data.data;
            setUser(data);
            setEditData({
                fullName: data.fullName || '',
                phoneNumber: data.phoneNumber || ''
            });
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUserDetails();
    }, []);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this user? This action is permanent.")) {
            try {
                const response = await axios.delete('https://project-3-node.onrender.com/api/deleteUser', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if(response.status === 403) {
                alert(response.data.message || 'You do not have permission to perform this action.');
                return;
            }
            alert(response.data.message || 'Account deleted successfully.');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userRole');
            navigate('/', { replace: true });
            } catch (error) {
                console.log(error);
                alert(error.response?.data?.message || 'Error deleting account. Please try again.');
            }
        }
    };

    const handleEditClick = () => {
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const response = await axios.patch(`https://project-3-node.onrender.com/api/updateUser`, editData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert(response.data.message || 'Profile updated successfully!');
            setUser({ ...user, ...editData });
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-warning border-0 shadow-sm">
                    User information could not be retrieved. Please log in again.
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-5" style={{ backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
            <style>{`
                .user-card {
                    background: white;
                    border: 1px solid #e3e6f0;
                    border-radius: 15px;
                    box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.1);
                    overflow: hidden;
                }
                .detail-header {
                    padding: 2rem;
                    border-bottom: 1px solid #edf2f9;
                    background: #fff;
                }
                .detail-row {
                    display: flex;
                    align-items: center;
                    padding: 1.25rem 2rem;
                    border-bottom: 1px solid #f8f9fc;
                }
                .detail-row:last-child {
                    border-bottom: none;
                }
                .detail-label {
                    width: 35%;
                    color: #858796;
                    font-weight: 700;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .detail-value {
                    width: 65%;
                    color: #4e73df;
                    font-weight: 500;
                    font-size: 1rem;
                }
                .avatar-circle {
                    width: 64px;
                    height: 64px;
                    background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    font-weight: 700;
                    font-size: 1.5rem;
                    box-shadow: 0 4px 10px rgba(78, 115, 223, 0.3);
                }
                .action-footer {
                    background: #f8f9fc;
                    padding: 1.5rem 2rem;
                    border-top: 1px solid #e3e6f0;
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }
                .btn-manage {
                    padding: 0.6rem 1.5rem;
                    font-weight: 600;
                    border-radius: 10px;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .btn-manage-edit {
                    background: #4e73df;
                    color: white;
                    border: none;
                }
                .btn-manage-edit:hover {
                    background: #2e59d9;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(78, 115, 223, 0.2);
                }
                .btn-manage-delete {
                    background: #fff;
                    color: #e74a3b;
                    border: 1px solid #eaecf4;
                }
                .btn-manage-delete:hover {
                    background: #fff5f5;
                    border-color: #e74a3b;
                    color: #be2617;
                }
                /* Modal */
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(30, 30, 45, 0.6);
                    backdrop-filter: blur(5px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .custom-modal {
                    background: white;
                    width: 95%;
                    max-width: 480px;
                    border-radius: 20px;
                    animation: zoomIn 0.2s ease-out;
                }
                @keyframes zoomIn {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .form-control-pill {
                    border-radius: 10px;
                    padding: 0.75rem 1rem;
                    border: 1px solid #d1d3e2;
                }
            `}</style>

            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-7">
                    <div className="mb-4">
                        <h3 className="fw-bold text-dark">Profile Settings</h3>
                        <p className="text-muted">Manage your account information and preferences</p>
                    </div>

                    <div className="user-card">
                        {/* Top Profile Section */}
                        <div className="detail-header d-flex align-items-center">
                            <div className="avatar-circle me-4">
                                {user.fullName ? user.fullName[0] : 'U'}
                            </div>
                            <div>
                                <h4 className="mb-1 fw-bold text-dark">{user.fullName}</h4>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="badge bg-success-soft text-success rounded-pill px-3 py-2" style={{ backgroundColor: '#eafaf1', fontSize: '0.7rem' }}>
                                        <i className="bi bi-patch-check-fill me-1"></i> VERIFIED ACCOUNT
                                    </span>
                                    <span className="text-muted small">ID: {user._id?.substring(0, 8)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Middle Data Section */}
                        <div className="card-body p-0">
                            <div className="detail-row">
                                <div className="detail-label">Full Name</div>
                                <div className="detail-value text-dark">{user.fullName}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Email Address</div>
                                <div className="detail-value text-dark">{user.email}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Phone Number</div>
                                <div className="detail-value text-dark">{user.phoneNumber || 'Not linked'}</div>
                            </div>
                            <div className="detail-row">
                                <div className="detail-label">Account Role</div>
                                <div className="detail-value">
                                    <span className="text-uppercase fw-bold" style={{ fontSize: '0.85rem' }}>{user.role || 'Member'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Action Section */}
                        <div className="action-footer">
                            <button onClick={handleDelete} className="btn-manage btn-manage-delete">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                                </svg>
                                Delete Account
                            </button>
                            <button onClick={handleEditClick} className="btn-manage btn-manage-edit">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                </svg>
                                Edit Information
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            {isEditModalOpen && (
                <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
                    <div className="custom-modal p-4" onClick={e => e.stopPropagation()}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold m-0">Edit Profile</h5>
                            <button className="btn-close" onClick={() => setIsEditModalOpen(false)}></button>
                        </div>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">FULL NAME</label>
                                <input
                                    type="text" name="fullName"
                                    className="form-control form-control-pill"
                                    value={editData.fullName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">PHONE NUMBER</label>
                                <input
                                    type="tel" name="phoneNumber"
                                    className="form-control form-control-pill"
                                    value={editData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div className="d-flex gap-2 mt-4">
                                <button type="button" className="btn btn-light w-100 py-2 fw-bold" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" disabled={isUpdating}>
                                    {isUpdating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserDetails;