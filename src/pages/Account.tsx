import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './styles/Account.css';


function Account(){
    const [loginForm, setLogin] = useState({user: '', pass: ''})
    const navigate = useNavigate();
    const [showPass, setVisibility] = useState(false);


    const isValidUsername = (username: string): boolean => {
        return /^[a-zA-Z0-9_]+$/.test(username); // Allows letters, numbers, and underscores
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();

        if (!isValidUsername(loginForm.user)){
            alert("Invalid Username");
            return;
        }

        try{
            const response = await fetch('http://localhost:5000/api/sign-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include", // For cookies
                body: JSON.stringify(loginForm)
            });
            const data = await response.json();

            // Handle Response
            if (!response.ok){
                console.log('Login Failed:', data)
                setLogin((prev) => ({
                    ...prev,
                    pass: '', // Reset password field on failure
                }));
            }

            navigate('/');
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
    return (
        <>
        <div className='login-wrapper'>
            <h1>Welcome Back</h1>
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
                    <input type="checkbox" onChange={togglePassVisibility}/> <span>Show Password</span>
                </label>
                <div>
                    <button type="submit">Submit</button><br/><br/>
                    <span>Don't Have an account?&nbsp;</span>
                    <Link to="/create-account">
                        Sign Up!
                    </Link>
                </div>
            </form>
        </div>
        <div>
            
        </div>
        </>
    )
}

export default Account;
