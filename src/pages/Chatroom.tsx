import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import Chat from './Chat';
import "./styles/ChatRoom.css";
import { useFetchUser } from '../hooks/useFetchUser';


function Chatroom() {
    const [ friends, setFriends ] = useState<{ username: string; id: string }[]>([]);
    const { username, setUser, uid, showDropdown, setDropdown } = useFetchUser();
    const [roomId, setRoomID] = useState<string | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const navigate = useNavigate();
    const [selectedCurrentFriend, setSelectedFriend] = useState< {username: string; id: string} | null>(null);


    useEffect(() => {
        const friendRetrieval = async () => {
            try{
                const response = await fetch('http://localhost:5000/api/friendList',{
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setFriends(data.friends);
                } else{
                    console.error('Failed to fetch friends');
                }
            } catch ( error ) {
                console.error('Friend Retrieval Failed', error);
            }
        };

        friendRetrieval();

        const newSocket = io('http://localhost:5000', {
            withCredentials: true,
        });
        setSocket(newSocket);
        
        return () => {
        newSocket.disconnect(); // Clean up on unmount
        };
    }, []);


    // In case of wanting to swap to a MPA application
    const handleFriendClick = (friendID: string) => {
        if(!socket || !uid) return;
        
        setRoomID([uid, friendID].sort().join('-'));
        socket.emit('joinRoom', roomId);
    };

    return(
        <div className='chatRoom'>
            <div className='chatSidebar'>
                <h3>Friends</h3>
                {friends.map((friend) => (
                    <div key={friend.id} className="friendBox" onClick={() => {handleFriendClick(friend.id); setSelectedFriend(friend)}}>
                        <span className="friendUser">
                            {(friend.username.charAt(0).toUpperCase() + friend.username.slice(1))}
                        </span>
                    </div>
                ))}
            </div>
            <div className='chatbox'>
                {selectedCurrentFriend ? <Chat selectedFriend={selectedCurrentFriend}/> : <h1> Click Any Friend to Chat </h1>}
            </div>
        </div>
    );
}

export default Chatroom;
