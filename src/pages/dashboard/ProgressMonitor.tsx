import React from 'react'
import AdminProgressMonitor from '../admin/AdminProgressMonitor';
import UniversityAdminDashboard from '../../components/progress-mointor/ProgressM';
import userStore from '../../store';
const STUDENT_ROLE = import.meta.env.VITE_STUDENT_ROLE;
const DEPARTMENT_ROLE = import.meta.env.VITE_DEPARTMENT_ROLE;
const SUPERVISOR_ROLE = import.meta.env.VITE_SUPERVISOR_ROLE;
const ADMIN_ROLE = import.meta.env.VITE_ADMIN_ROLE;




const ProgressMonitor = () => {
    const userInfo = userStore(state => state.userInfo);

  return (
    <>
      {userInfo.role === ADMIN_ROLE && <AdminProgressMonitor />}
      {userInfo.role === SUPERVISOR_ROLE && <UniversityAdminDashboard />}
      {userInfo.role === DEPARTMENT_ROLE && <UniversityAdminDashboard />}
      {userInfo.role === STUDENT_ROLE && <UniversityAdminDashboard />}
    </>
  )
}

export default ProgressMonitor