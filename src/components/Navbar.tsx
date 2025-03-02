import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useFetchUser } from '../hooks/useFetchUser';
import { useLogout } from '../hooks/useLogout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import logo from '../assets/orangutan.png';
import './styles/Navbar.css';




function Navbar(){
    const { username, setUser, uid, showDropdown, setDropdown } = useFetchUser();
    const navigate = useNavigate();
    const handleLogout = useLogout();
    const toggleDropdown = () => setDropdown(prev => !prev);
    const [showFriend, setFriend] = useState(false);
    const toggleFriend = () => setFriend(prev => !prev);
    const [requestName, setRequest] = useState('');

    // Open Dropdown
    useEffect(() => {
        try{

        } catch (error){
            console.error('Error occorued opening dropdown', error);
            navigate('/');
        }
    },[showDropdown])


    async function addFriend(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        try{
            const response = await fetch('http://localhost:5000/api/friendRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include", // For cookies
                body: JSON.stringify({user: username.toLowerCase(), friend: requestName.toLowerCase(), userId: uid})
            });

            const data = await response.json();
    
            if (!response.ok){
                throw new Error(data.message || "Error adding friend");
            }

            setFriend(false);
        } catch(error){
            console.error("Error occured while adding friend:", error);
        }
        
    };


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
                    {true && (
                        <>
                            {showFriend && (
                                <div className='friendRequestInput'>
                                    <form className='friendSubmit' onSubmit={addFriend}>
                                        <input placeholder='Enter Friends User...'
                                            type='text'
                                            value={requestName}
                                            onChange={(e) => setRequest(e.target.value)}/>
                                        <button type='submit'>Send</button>
                                    </form>
                                </div>
                            )}
                            <li>
                                <button onClick={toggleFriend} className='expandFriendButton'>+</button>
                            </li>
                        </>
                    )}
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
