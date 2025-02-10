import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/orangutan.png';
import './styles/Navbar.css';

function Navbar(){
    const isAuthenticated = useAuth();

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
                    <li>
                        <Link to="/account" className="user-icon">
                            Sign in
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
