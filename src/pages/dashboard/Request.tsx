import React from 'react'
import userStore from "../../store/index";
import SupervisorRequest from '../supervisor/SupervisorRequest';
import DepartmentRequest from '../department/DepartmentRequest';
import StudentRequest from '../student/StudentRequest';

const ADMIN_ROLE = import.meta.env.VITE_ADMIN_ROLE;
const SUPERVISOR_ROLE = import.meta.env.VITE_SUPERVISOR_ROLE;
const DEPARTMENT_ROLE = import.meta.env.VITE_DEPARTMENT_ROLE;
const STUDENT_ROLE = import.meta.env.VITE_STUDENT_ROLE;

const Request = () => {
  const { userInfo } = userStore();

  return (
    <>
      <StudentRequest />
    </>
  )
}

export default Request