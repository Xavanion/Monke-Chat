import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Account from './pages/Account';
import Contact from './pages/Contact';
import Wrapper from './components/Wrapper';
import Products from './pages/Products';
import CreateAccount from './pages/CreateAccount';

function App() {
  return(
      <BrowserRouter>
        <div className='page-content'>
          <Routes>
            <Route path="/" element={<Wrapper />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/account" element={<Account />}/>
              <Route path="/contact" element={<Contact />} />
              <Route path="/products" element={<Products />} />
              <Route path="/create-account" element={<CreateAccount />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    )
}

export default App
