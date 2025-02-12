import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Account from './pages/Account';
import Contact from './pages/Contact';
import Chat from './pages/Chat';
import Navbar from './components/Navbar';
import CreateAccount from './pages/CreateAccount';
import './components/styles/Wrapper.css';

function App() {
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
                <Route path="/chat" element={<Chat />} />
                <Route path="/create-account" element={<CreateAccount />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    )
}

export default App
