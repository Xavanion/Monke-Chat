import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import Chat from './Chat';
import "./styles/ChatRoom.css";
import { useFetchUser } from '../hooks/useFetchUser';


function Chatroom() {
    const [friends, setFriends] = useState<{ username: string; id: string }[]>([]);
    const { username, setUser, id, showDropdown, setDropdown } = useFetchUser();
    const [socket, setSocket] = useState<Socket | null>(null);
    const navigate = useNavigate();


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



      const handleFriendClick = (friendID: string) => {
        if(!socket){ return };
        
        const roomId = generateRoomID(friendID);
        socket.emit('joinRoom', roomId);
        navigate(`/dm/${roomId}`);
      };

      const generateRoomID = (friendID: string) => {
        return [id, friendID].sort().join('-')
      }

    return(
        <div className='chatRoom'>
            <div className='chatSidebar'>
                <h3>Friends</h3>
                {friends.map((friend) => (
                    <div key={friend.id} className="friendBox" onClick={() => handleFriendClick(friend.id)}>
                        <span className="friendUser">
                            {(friend.username.charAt(0).toUpperCase() + friend.username.slice(1))}
                        </span>
                    </div>
                ))}
            </div>
            <div className='chatbox'>
                <Chat />
            </div>
        </div>
    );
}

export default Chatroom;
