import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const Authguard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/login', { replace: true });
        }
    }, [token, navigate]);

    if (!token) {
        return null;
    }

    
    return <Outlet />;
};

export default Authguard;