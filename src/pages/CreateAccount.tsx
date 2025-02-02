import { useState } from 'react';
import './styles/Account.css';




function CreateAccount(){
    const [loginForm, setLogin] = useState({user: '', pass: '', email: ''})

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        
        try{
            const response = await fetch('http://localhost:5000/api/create-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginForm)
            });
            const data = await response.json();
            
            // Handle Response
            if (response.ok){
                console.log('Account created successful:', data)
            } else{
                console.log('Account creation failed:', data)
                setLogin((prev) => ({
                    ...prev,
                    pass: '', // Reset password field on failure
                }));
            }
            console.log('Server Response:', data);
        } catch (error){
            console.error('Error: ', error);
            setLogin((prev) => ({
                ...prev,
                pass: '', // Reset password field on failure
            }));
        }
    }


    // Changes the username/password to match currently entered ones
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setLogin((prev) => ({
            ...prev,
            [event.target.name]: event.target.value, // Dynamically updates "user" or "pass"
        }));
    }



    return(
        <div className='login-wrapper'>
            <h1>Create an Account</h1>
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
                <label>
                    <input
                        type="text"
                        placeholder='Email'
                        name='email'
                        value={loginForm.email}
                        onChange={handleChange}
                    />
                </label>
                <div>
                    <button type="submit">
                        Create Account
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateAccount;
