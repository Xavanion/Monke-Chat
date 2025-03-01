import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';



export const useFetchUser = () => {
    const [username, setUser] = useState('');
    const [showDropdown, setDropdown] = useState<boolean>(false);
    const [id, setId] = useState<string | null>(null);
    const isAuthenticated = useAuth();

    // Fetch Username
    useEffect(()=> {
        const fetchUser = async () => {
            if (isAuthenticated) {
                try{
                    const response = await fetch('http://localhost:5000/api/username', {
                        method: 'GET',
                        credentials: 'include',
                    });
                    if (response.ok){
                        const data = await response.json();
                        const formattedUser = data.user.charAt(0).toUpperCase() + data.user.slice(1);
                        setUser(formattedUser);
                        setId(String(data.id));
                        setDropdown(true);
                    }
                } catch ( error ){
                    console.error('User Authentication Failed:', error)
                }
            } else {
                setUser('');
                setId(null);
                setDropdown(false);
            }
        };

        fetchUser();
    }, [isAuthenticated]);

    return { username, setUser, id, showDropdown, setDropdown };
}
    