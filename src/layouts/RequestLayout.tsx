import { useEffect } from 'react';
import userStore from '../store';
import useRequestStore from '../store/useRequestStore';
import { Outlet } from 'react-router';



const RequestLayout = () => {
    const userInfo = userStore((state) => state.userInfo);
    const setActiveTab = useRequestStore((state) => state.setActiveTab);
    const isStudent = import.meta.env.VITE_STUDENT_ROLE;
    
    useEffect (()=>{
        if(userInfo.role === isStudent){
            setActiveTab("admin")
        }
    }, [userInfo])

    return (
        <div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default RequestLayout