import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useFetchUser } from '../hooks/useFetchUser';
import { useLogout } from '../hooks/useLogout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import logo from '../assets/orangutan.png';
import './styles/Navbar.css';




function Navbar(){
    const { username, setUser, showDropdown, setDropdown } = useFetchUser();
    const navigate = useNavigate();
    const handleLogout = useLogout();
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
                {username && (
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
                    !showDropdown ? (
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
