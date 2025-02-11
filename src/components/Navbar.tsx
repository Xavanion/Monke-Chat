import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/orangutan.png';
import './styles/Navbar.css';



function Navbar(){
    const [showDropdown, setDropdown] = useState(false); // Used for dropdown menu on account
    const [username, setUser] = useState('');
    const isAuthenticated = useAuth();
    const navigate = useNavigate();

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
                        setUser(data.user);
                        setDropdown(true);
                    }
                } catch ( error ){
                    console.error('User Authentication Failed:', error)
                }
            }
        };

        fetchUser();
    }, [isAuthenticated]);

    const handleLogout = async () => {
        try{
            const response = await fetch('http://localhost:5000/api/logout',{
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok){
                console.log('Logged out');
                setUser('');
                setDropdown(false);
                navigate('/login');
            } else {
                console.error('Logout Failed');
            }
        } catch ( error ) {
            console.error('Logout Error', error)
        }
    }

    const toggleDropdown = () => setDropdown(prev => !prev);

    return(
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="name">
                    <img className="image" src={logo} alt="Logo"/>
                    Monke
                </Link>
            </div>
            <div className="navbar-center">
                <ul className="nav-links">
                {isAuthenticated && (
                    <li>
                        <Link to="/products">Products</Link>
                    </li>
                )}
                </ul>
            </div>
            <div className="navbar-right">
                <ul className="nav-links">
                    <li>
                        <Link to="/contact">Contact</Link>
                    </li>
                    <li>
                        <Link to="/about">About Us</Link>
                    </li>
                    {
                    !username ? (
                        <li>
                            <Link to="/account" className="user-icon">
                                Sign in
                            </Link>
                        </li>
                        ) : (
                            <li>
                                Logged In
                            </li>
                        )
                    }
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
