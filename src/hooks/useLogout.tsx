import { useFetchUser } from "./useFetchUser";

// Delete cookie/reset variables
export const useLogout = () => {
    const { setUser, setDropdown } = useFetchUser();

    const handleLogout = async () => {
        try{
            const response = await fetch('http://localhost:5000/api/logout',{
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok){
                console.log('Logged out');
                setUser('');
                setDropdown(false);
                window.location.href = '/';
            } else {
                console.error('Logout Failed');
            }
        } catch ( error ) {
            console.error('Logout Error', error)
        }
    };
    return handleLogout;
}
