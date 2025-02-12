import { useState } from 'react';
import './styles/Account.css';




function CreateAccount(){
    const [loginForm, setLogin] = useState({user: '', pass: '', email: ''})
    const [showPass, setVisibility] = useState(false);

    const isValidUsername = (username: string): boolean => {
        return /^[a-zA-Z0-9_]+$/.test(username); // Allows letters, numbers, and underscores
      };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        if (!isValidUsername(loginForm.user)){
            return;
        }


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


    

    const togglePassVisibility = () => {setVisibility(!showPass)};

    return(
        <div className='login-wrapper'>
            <h1>Create an Account</h1>
            <form className='login-form' onSubmit={handleSubmit}>
                <label>
                    <input
                        required
                        type="text"
                        placeholder="Username"
                        name="user"
                        value={loginForm.user}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    <input
                        required
                        className='pass-field'
                        type={showPass ? "text" : "password"}
                        placeholder="Password"
                        name="pass"
                        value={loginForm.pass}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    <input
                        required
                        type="text"
                        placeholder='Email'
                        name='email'
                        value={loginForm.email}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    <input type="checkbox" onChange={togglePassVisibility}/> <span>Show Password</span>
                </label>
                <div>
                    <button type="submit" id="pass-check">
                        Create Account
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateAccount;
