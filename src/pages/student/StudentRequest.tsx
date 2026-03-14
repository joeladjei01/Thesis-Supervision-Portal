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
      <div className='rounded-xl grid grid-cols-1 md:grid-cols-3 overflow-hidden border border-border bg-card shadow-sm'>
        <div className='col-span-1 md:col-span-1'>
          <RequestTab
            requests={allRequest}
          />
        </div>
        <div className='hidden md:block col-span-2 relative'>
          <div className="flex flex-col items-center justify-center h-[80vh] bg-gradient-to-br from-background via-muted/20 to-secondary/5 border-l border-border transition-colors duration-500">
            <div className="relative w-full text-center p-8 z-10">
              <div className="mb-8 relative flex justify-center">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center shadow-inner border border-primary/20 transform rotate-3 hover:rotate-0 transition-all duration-500 group">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <MessageSquareTextIcon size={40} className="text-primary-foreground" />
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-3 tracking-tight">
                Select a Request
              </h2>

              <div className="text-center">

                <p className="text-sm text-muted-foreground mt-2 max-w-[200px] mx-auto font-medium leading-relaxed">
                  Select from your available requests on the left to view details
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