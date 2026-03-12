import React, { useEffect } from 'react'
import useRequestStore from '../../store/useRequestStore'
import RequestTab from './RequestTab'
import ChartBox from './ChartBox'
import userStore from '../../store'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import usePageTile from '../../hooks/usePageTitle'

const ChatArea = () => {
    usePageTile("Requests")
    const { person, userInfo } = userStore()
    const queryClient = useQueryClient()
    const allRequest = useRequestStore(state => state.allRequest)
    const setRefresh = useRequestStore(state => state.setRefresh)

    const setAllRequests = useRequestStore(state => state.setAllRequests)
    const axios = useAxiosPrivate();

    const isStudent = import.meta.env.VITE_STUDENT_ROLE;
    const ADMIN = import.meta.env.VITE_ADMIN_ROLE
    const DEPARTMENT = import.meta.env.VITE_DEPARTMENT_ROLE

    const url = isStudent == userInfo.role ? `/students/supervisor-requests/${person.id}/student/`
        : userInfo.role === ADMIN ? "/students/supervisor-requests/admin/"
            : userInfo.role === DEPARTMENT ? "/students/supervisor-requests/department/"
                : `/students/supervisor-requests/${person.id}/supervisor/`



    const fetchRequest = async () => {
        setRefresh(true);
        try {
            const { data }: any = await axios.get(url);
            setAllRequests(data.data)
            return data.data;
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setRefresh(false);
        }
    };

    useQuery({
        queryKey: ["fetch-requests"],
        queryFn: fetchRequest
    })

    const fetchReq = () => {
        queryClient.invalidateQueries({
            queryKey: ["fetch-requests"]
        })
    }


    return (
        <div className='w-full min-h-[80vh] bg-white dark:bg-background transition-colors duration-300'>
            <div className='rounded-xl grid grid-cols-1 md:grid-cols-3 overflow-hidden border border-gray-300 dark:border-border shadow-sm'>
                <div className='hidden md:block col-span-1'>
                    <RequestTab
                        requests={allRequest}
                    />
                </div>
                <div className='col-span-1 md:col-span-2'>
                    <ChartBox fetchReq={fetchReq} />
                </div>
            </div>

        </div>
    )
}

export default ChatArea