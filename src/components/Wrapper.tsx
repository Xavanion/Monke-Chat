import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './styles/Wrapper.css'

function Wrapper(){
    return(
        <div className='wrapper'>
            <Navbar />
            <div className='content'>
                <Outlet />
            </div>
        </div>
    )
}


export default Wrapper;
