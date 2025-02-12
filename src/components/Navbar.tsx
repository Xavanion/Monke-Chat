import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import logo from '../assets/orangutan.png';
import './styles/Navbar.css';




function Navbar(){
    const [showDropdown, setDropdown] = useState(false); // Used for dropdown menu on account
    const [username, setUser] = useState('');
    const isAuthenticated = useAuth();
    const navigate = useNavigate();

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
                navigate('/');
            } else {
                console.error('Logout Failed');
            }
        } catch ( error ) {
            console.error('Logout Error', error)
        }
    }

    const toggleDropdown = () => setDropdown(prev => !prev);

    // Open Dropdown
    useEffect(() => {
        try{

        } catch (error){
            console.error('Error occorued opening dropdown', error);
            navigate('/');
        }
    },[showDropdown])

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
                        <Link to="/chat">Chat</Link>
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
                            <li >
                                <Link to="/" onClick={handleLogout}>
                                {username} <FontAwesomeIcon icon={faCaretDown} />
                                </Link>
                            </li>
                        )
                    }
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
