import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
    const [isAuthenticated, setAuthentication] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const token = document.cookie.split('; ').find(row => row.startsWith('jwt='));
            if (token) {
                setAuthentication(true);
            } else {
                setAuthentication(false);
                navigate('/account');
            }
        };

        checkAuth();
    }, [navigate]);

    return isAuthenticated;
};
