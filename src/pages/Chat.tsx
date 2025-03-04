import { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import "./styles/Chat.css";

function Chat({ selectedFriend, currentUser }:
              { selectedFriend: { friendUser: string; friendId: string };
                currentUser: {currentUsername: string; uid: string} | null
              }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const socket = useSocket();

  // Update Selected room when clicking a friend
  useEffect(() => {
    if (!socket || !selectedFriend || !currentUser) return;
    setCurrentRoom([currentUser.uid, selectedFriend.friendId].sort().join('-'));
  }, [socket, selectedFriend]);


  useEffect(() => {
    if (!socket || !currentRoom || !currentUser) return;

    // Fetch previous messages when switching rooms
    const fetchMessages = async () => {

      try {
        const response = await fetch(`http://localhost:5000/api/messages/${currentRoom}`);
          if (response.ok) {
            const data = await response.json();
            setMessages(
              data.map((msg: { sender_id: string; content: string }) => ({
                username: msg.sender_id == currentUser.uid ? currentUser.currentUsername.charAt(0).toUpperCase() + currentUser.currentUsername.slice(1) : selectedFriend.friendUser,
                message: msg.content
              }))
            );
          }
      } catch (error) {
        console.error("Failed to fetch old messages:", error);
      }
    };

    fetchMessages();
  }, [socket, currentRoom]);





  // Emit joinRoom when currentRoom changes
  useEffect(() => {
    if (!socket || !currentRoom) return;

    // Join/Switch Rooms
    socket.emit('joinRoom', currentRoom);
    
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
    if (!socket || !message.trim() || !currentRoom || !currentUser) return;
    try{
      console.log("Test1");
      const response = await fetch('http://localhost:5000/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include", // For cookies
        body: JSON.stringify({"sender_id" : currentUser.uid, "receiver_id": selectedFriend.friendId, "content" : message, "roomId": currentRoom})
      });

      console.log("Test2");
      if (response.ok){
        console.log("Message sent successfully");
      }
    } catch(error){
      console.log("Test3");
      console.error("Error occured while sending message:", error);
    }
    console.log("Test4");
    console.log("Message sent to back:", message);
    socket.emit('sendMessage', { username: currentUser.currentUsername, message: message, roomId: currentRoom });
    setMessage('');
  };

  return (
    <div className="Chat">
      <div className="chatHeader">
        <h1>Chatting with {selectedFriend ? selectedFriend.friendUser : '...'}</h1>
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
