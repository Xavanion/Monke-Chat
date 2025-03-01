import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Account from './pages/Account';
import Contact from './pages/Contact';
import Chatroom from './pages/Chatroom';
import Navbar from './components/Navbar';
import CreateAccount from './pages/CreateAccount';
import { useSocket } from './hooks/useSocket';
import './components/styles/Wrapper.css';

function App() {
  const socket = useSocket();
  
  return(
      <BrowserRouter>
        <div className='app-content'>
          <Navbar />
          <div className='content-container'>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/account" element={<Account />}/>
                <Route path="/contact" element={<Contact />} />
                <Route path="/chat" element={<Chatroom />} />
                <Route path="/create-account" element={<CreateAccount />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    )
}

export default App
