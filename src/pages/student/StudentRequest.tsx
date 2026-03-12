import { BookOpen, GitPullRequestIcon, MessageCircle, MessageCircleQuestionIcon, MessageSquareQuote, MessageSquareTextIcon, Sparkles } from 'lucide-react';
import RequestTab from '../../components/request/RequestTab';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import userStore from '../../store';
import useRequestStore from '../../store/useRequestStore';
import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query';


const StudentRequest = () => {
  const { setAllRequests, allRequest, setRefresh } = useRequestStore()
  const { person, userInfo } = userStore()
  const axios = useAxiosPrivate();

  const isStudent = import.meta.env.VITE_STUDENT_ROLE;
  const ADMIN = import.meta.env.VITE_ADMIN_ROLE
  const DEPARTMENT = import.meta.env.VITE_DEPARTMENT_ROLE

  const url = isStudent === userInfo.role ? `/students/supervisor-requests/${person.id}/student/`
    : userInfo.role === ADMIN ? "/students/supervisor-requests/admin/"
      : userInfo.role === DEPARTMENT ? "/students/supervisor-requests/department/"
        : `/students/supervisor-requests/${person?.id}/supervisor/`;


      


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





  return (
    <div>
      <div className='rounded-lg grid grid-cols-1 md:grid-cols-3 overflow-hidden border border-gray-300'>
        <div className='col-span-1 md:col-span-1'>
          <RequestTab
            requests={allRequest}
          />
        </div>
        <div className='hidden md:block col-span-2'>
          <div className="flex flex-col items-center justify-center h-[80vh] bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 border border-gray-200">
            <div className="relative w-full text-center mx-aut p-8">
              <div className="mb-8 relative">
                <div className="w-32 h-32 mx-auto bg-blue-800 rounded-full flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <MessageSquareTextIcon size={60} className="text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-blue-800 mb-2 bg-gradient-to-r ">
                Select a Request
              </h2>

              <div className="text-center">

                <p className="text-sm text-gray-500 mt-2">
                  Select from your available requests on the left
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}

export default StudentRequest