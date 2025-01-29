import { useState, useRef, useEffect } from 'react';
import './styles/Account.css'


function Account(){
    const [loginForm, setLogin] = useState({user: '', pass: ''})


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        
        const response = await fetch('127.0.0.1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginForm)
        });
        const data = await response.json();
        
        // Handle Response
        if (response.ok){
            console.log('Login successful:', data)
        } else{
            console.log('Login Failed:', data)
            setLogin((prev) => ({
                ...prev,
                pass: '', // Reset password field on failure
            }));
        }
        console.log('Server Response:', data);
    }


    // Changes the username/password to match currently entered ones
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setLogin((prev) => ({
            ...prev,
            [event.target.name]: event.target.value, // Dynamically updates "user" or "pass"
        }));
    }


    return (
        <div className='login-wrapper'>
            <h1>Welcome</h1>
            <form className='login-form' onSubmit={handleSubmit}>
                <label>
                    <input
                        type="text"
                        placeholder="Username"
                        name="user"
                        value={loginForm.user}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    <input
                        type="password"
                        placeholder="Password"
                        name="pass"
                        value={loginForm.pass}
                        onChange={handleChange}
                    />
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Account;
