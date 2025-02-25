import { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { useFetchUser } from "../hooks/useFetchUser";
import "./styles/Chat.css";

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ username: string; message: string }[]>([]);
  const socket = useSocket();
  const { username, setUser, showDropdown, setDropdown } = useFetchUser();

  useEffect(() => {
    if (socket) {
        socket.on('receiveMessage', ( data ) => {
          setMessages((prevMessages) => [...prevMessages, { username: data.username, message: data.message }]);
        });
    }

    return () => {
        if (socket) {
            socket.off('receiveMessage');
        }
    };
  }, [socket]);

  async function sendMessage(){
    if (socket && message.trim()){
      try{
        const response = await fetch('http://localhost:5000/api/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: "include", // For cookies
          body: JSON.stringify(message)
        });
        if (response && response.status == 200){
          console.log("Message sent successfully");
        }
      } catch(error){
        console.error("Error occured while sending message:", error);
      }
      socket.emit('sendMessage', { username, message });
      setMessage('');
    }
  };


  const handleKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter'){
      sendMessage();
    }
  };

  return (
    <div className="Chat">
      <div className="chatHeader">
        <h1>Chatting with</h1>
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
        onKeyDown={handleKey}
        onChange={(e) => setMessage(e.target.value)}
        autoFocus
        />
        <button onClick={sendMessage} className="messageButton">Send</button>
      </div>
    </div>
  );
}

export default Chat;
