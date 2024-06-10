import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutComponent() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    }, [navigate]);

    return null;
}

export default LogoutComponent;
