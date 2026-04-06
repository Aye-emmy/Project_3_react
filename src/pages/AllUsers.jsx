import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [userAccount, setUserAccount] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedIndexes, setExpandedIndexes] = useState([]);
    const token = localStorage.getItem('token');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({ 
        fullName: '', 
        email: '', 
        phoneNumber: '',
        role: 'user' 
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://project-3-node.onrender.com/api/getAllUsers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUsers(response.data.data || []);
            setUserAccount(response.data.userAccount || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleExpand = (index) => {
        setExpandedIndexes(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index) 
                : [...prev, index]
        );
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await axios.delete(`https://project-3-node.onrender.com/api/deleteUserByAdmin/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert(response.data.message || 'User deleted successfully.');
                fetchUsers();
            } catch (error) {
                console.error(error);
                alert(error.response?.data?.message || 'Error deleting user. Please try again.');
            }
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setFormData({
            fullName: user.fullName || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            role: user.role || 'user'
        });
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await axios.patch(`https://project-3-node.onrender.com/api/updateUserByAdmin/${selectedUser._id}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert(response.data.message || 'User updated successfully.');
            
            setUsers(users.map(u => u._id === selectedUser._id ? { ...u, ...formData } : u));
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Update failed:", error);
            alert("Failed to update user.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getAccountInfo = (userId) => {
        return userAccount.find(acc => acc._id === userId) || null;
    };

    return (
        <div className="container py-4">
            <style>{`
                .user-card {
                    background: #fff;
                    border: 1px solid #eef0f2;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                }
                .user-card.expanded {
                    border-color: #198754;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                }
                .avatar-circle {
                    width: 45px;
                    height: 45px;
                    background: #198754;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    font-weight: bold;
                }
                .mini-view {
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .extra-small-label {
                    font-size: 10px;
                    letter-spacing: 0.5px;
                }
                .badge-role {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    padding: 4px 8px;
                    border-radius: 6px;
                }
                .account-box {
                    background: #f8f9fa;
                    border-radius: 8px;
                    padding: 10px;
                    border: 1px dashed #dee2e6;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1050;
                    padding: 20px;
                }
                .edit-modal-content {
                    background: white;
                    width: 100%;
                    max-width: 500px;
                    border-radius: 16px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    animation: slideUp 0.3s ease-out;
                    overflow: hidden;
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .modal-header-custom { padding: 1.5rem; background: #f8f9fa; border-bottom: 1px solid #eee; }
                .modal-body-custom { padding: 1.5rem; }
                .modal-footer-custom { padding: 1.25rem 1.5rem; background: #f8f9fa; border-top: 1px solid #eee; display: flex; gap: 10px; }
                .form-control-custom, .form-select-custom { border-radius: 8px; padding: 0.75rem; border: 1px solid #dee2e6; }
            `}</style>

            <div className="user-container">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <div>
                        <h3 className="fw-bold mb-0 text-success">User Management</h3>
                        <p className="text-muted small mb-0">Manage profiles and account balances</p>
                    </div>
                    <span className="badge bg-dark rounded-pill px-3">{users.length} Registered Users</span>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status"></div>
                        <p className="mt-2 text-muted">Loading data...</p>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {users.map((user, index) => {
                            const isExpanded = expandedIndexes.includes(index);
                            const account = getAccountInfo(user._id);
                            const initials = user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
                            
                            return (
                                <div key={user._id || index} className={`user-card p-3 ${isExpanded ? 'expanded' : ''}`}>
                                    <div className="mini-view" onClick={() => toggleExpand(index)}>
                                        <div className="d-flex align-items-center">
                                            <div className="avatar-circle me-3">
                                                {initials}
                                            </div>
                                            <div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <h6 className="mb-0 fw-bold">{user.fullName || 'Anonymous User'}</h6>
                                                    <span className={`badge-role ${user.role === 'admin' ? 'bg-danger text-white' : 'bg-light text-dark border'}`}>
                                                        {user.role || 'user'}
                                                    </span>
                                                </div>
                                                <small className="text-muted">{user.email || 'No email provided'}</small>
                                            </div>
                                        </div>
                                        <div className="text-end d-flex align-items-center">
                                            <div className="me-3 d-none d-md-block text-end">
                                                <div className="fw-bold text-success small">
                                                    ₦{account?.accountAmount?.toLocaleString() || '0.00'}
                                                </div>
                                                <div className="extra-small-label text-muted text-uppercase">Balance</div>
                                            </div>
                                            <div className="btn btn-sm btn-light rounded-circle p-1">
                                                <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} small text-muted`}></i>
                                            </div>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="details-pane mt-3 border-top pt-3" onClick={(e) => e.stopPropagation()}>
                                            {/* Account Summary Strip */}
                                            <div className="account-box mb-3 row g-0">
                                                <div className="col-md-4 border-end-md px-3 py-2">
                                                    <label className="extra-small-label text-uppercase text-muted fw-bold">Available Balance</label>
                                                    <h5 className="mb-0 text-success fw-bold">₦{account?.accountAmount?.toLocaleString() || '0.00'}</h5>
                                                </div>
                                                <div className="col-md-4 border-end-md px-3 py-2">
                                                    <label className="extra-small-label text-uppercase text-muted fw-bold">Total Savings</label>
                                                    <h5 className="mb-0 text-primary fw-bold">₦{account?.savings?.toLocaleString() || '0.00'}</h5>
                                                </div>
                                                <div className="col-md-4 px-3 py-2">
                                                    <label className="extra-small-label text-uppercase text-muted fw-bold">Account Status</label>
                                                    <div>
                                                        <span className="badge bg-success-subtle text-success border border-success-subtle">
                                                            {account?.status || 'Active'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row g-3 px-1">
                                                <div className="col-6 col-md-3">
                                                    <label className="extra-small-label text-uppercase text-muted fw-bold d-block mb-1">Phone</label>
                                                    <p className="mb-0 small">{user.phoneNumber || 'N/A'}</p>
                                                </div>
                                                <div className="col-6 col-md-3">
                                                    <label className="extra-small-label text-uppercase text-muted fw-bold d-block mb-1">Role</label>
                                                    <p className="mb-0 small text-capitalize">{user.role || 'User'}</p>
                                                </div>
                                                <div className="col-6 col-md-3">
                                                    <label className="extra-small-label text-uppercase text-muted fw-bold d-block mb-1">Joined</label>
                                                    <p className="mb-0 small">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                                                </div>
                                                <div className="col-6 col-md-3">
                                                    <label className="extra-small-label text-uppercase text-muted fw-bold d-block mb-1">Account ID</label>
                                                    <p className="mb-0 small text-truncate">#{account?._id?.slice(-8) || 'N/A'}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 d-flex gap-2">
                                                <button 
                                                    className="btn btn-outline-primary btn-sm w-100 fw-bold py-2"
                                                    onClick={() => handleEditClick(user)}
                                                >
                                                    <i className="fa-solid fa-user-pen me-2"></i>Edit Profile
                                                </button>
                                                <button 
                                                    className="btn btn-outline-danger btn-sm w-100 fw-bold py-2"
                                                    onClick={() => handleDelete(user._id)}
                                                >
                                                    <i className="fa-solid fa-trash me-2"></i>Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* EDIT MODAL */}
            {isEditModalOpen && (
                <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
                    <div className="edit-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header-custom d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">Update User Profile</h5>
                            <button className="btn-close" onClick={() => setIsEditModalOpen(false)}></button>
                        </div>
                        
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="modal-body-custom">
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted text-uppercase">Full Name</label>
                                    <input 
                                        type="text" 
                                        name="fullName"
                                        className="form-control form-control-custom"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted text-uppercase">Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        className="form-control form-control-custom"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label small fw-bold text-muted text-uppercase">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            name="phoneNumber"
                                            className="form-control form-control-custom"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label small fw-bold text-muted text-uppercase">Account Role</label>
                                        <select 
                                            name="role"
                                            className="form-select form-select-custom"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                            <option value="moderator">Moderator</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="alert alert-info py-2 small mb-0">
                                    <i className="fa-solid fa-circle-info me-2"></i>
                                    Financial account details can only be managed through the Ledger.
                                </div>
                            </div>
                            
                            <div className="modal-footer-custom">
                                <button type="button" className="btn btn-light w-100 fw-bold py-2" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-success w-100 fw-bold py-2" disabled={isSubmitting}>
                                    {isSubmitting ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllUsers;