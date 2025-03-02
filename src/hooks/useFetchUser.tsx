import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';



export const useFetchUser = () => {
    const [username, setUser] = useState('');
    const [showDropdown, setDropdown] = useState<boolean>(false);
    const [uid, setId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
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
                        setId(String(data.uid));
                        setDropdown(true);
                    }
                } catch ( error ){
                    console.error('User Authentication Failed:', error)
                } finally {
                    setIsLoading(false);
                }
            } else {
                setUser('');
                setId(null);
                setDropdown(false);
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [isAuthenticated]);

    return { username, setUser, uid, showDropdown, setDropdown, isLoading };
}
    