import './styles/Account.css'


function Account(){
    return (
        <div className='login-wrapper'>
            <h1>Welcome</h1>
            <form className='login-form'>
                <label>
                    <input type="text" placeholder="Username"/>
                </label>
                <label>
                    <input type="password" placeholder="Password"/>
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Account;
