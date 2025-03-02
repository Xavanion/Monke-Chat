import { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { useFetchUser } from "../hooks/useFetchUser";
import "./styles/Chat.css";

function Chat({ selectedFriend }: { selectedFriend: { username: string; id: string } | null }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const { username, uid, isLoading } = useFetchUser();
  const socket = useSocket();

  // Update Selected room when clicking a friend
  useEffect(() => {
    if (!socket || !selectedFriend || !uid) return;
    setCurrentRoom([uid, selectedFriend.id].sort().join('-'));
  }, [socket, selectedFriend]);

  // Emit joinRoom when currentRoom changes
  useEffect(() => {
    if (!socket || !currentRoom) return;

    // Join/Switch Rooms
    socket.emit('joinRoom', currentRoom);
    console.log("Joined Room", currentRoom);
    
    // Clear chat of previous messages
    setMessages([]);

    // Leave on cleanup
    return () => {
      socket.emit('leaveRoom', currentRoom);
    };
  }, [socket, currentRoom]);

  // Handle incoming messages
  useEffect(() => {
    if (!socket) return;

    // Handle Recieving Messages
    socket.on('receiveMessage', ( data ) => {
      setMessages((prevMessages) => [...prevMessages, { username: data.username, message: data.message }]);
    });

    return () => { 
        if (socket) {
            socket.off('receiveMessage');
        }
    };
  }, [socket]);


  // Send Message
  async function sendMessage(){
    if (!socket || !message.trim() || !currentRoom) return;

    try{
      const response = await fetch('http://localhost:5000/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include", // For cookies
        body: JSON.stringify({"message" : message, "username" : username, "roomId": currentRoom})
      });

      if (response.ok){
        console.log("Message sent successfully");
      }
    } catch(error){
      console.error("Error occured while sending message:", error);
    }
    socket.emit('sendMessage', { username, message, roomId: currentRoom });
    setMessage('');
  };

  return (
    <div className="Chat">
      <div className="chatHeader">
        <h1>Chatting with {selectedFriend ? selectedFriend.username : '...'}</h1>
      </div>
      <div className="messageBoxContainer">
          {messages.map((msg, index) => (
            <div key={index} className="messageBox">
              <span className="messageUser">{msg.username}:</span>
              {msg.message}
            </div>
          ))}
      </div>
      <div className="textBox">
        <input
          placeholder="Send Message"
          value = {message}
          className="textInput"
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          onChange={(e) => setMessage(e.target.value)}
          autoFocus
        />
        <button onClick={sendMessage} className="messageButton">
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
