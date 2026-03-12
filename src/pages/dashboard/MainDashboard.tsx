import React from "react";
import userStore from "../../store/index";
import AdminDashboard from "../admin/AdminDashboard";
import DepartmentDashboard from "../department/DepartmentDashboard";
import SupervisorDashboard from "../supervisor/SupervisorDashboard";
import StudentDashboard from "../student/StudentDashboard";
const STUDENT_ROLE = import.meta.env.VITE_STUDENT_ROLE;
const DEPARTMENT_ROLE = import.meta.env.VITE_DEPARTMENT_ROLE;
const SUPERVISOR_ROLE = import.meta.env.VITE_SUPERVISOR_ROLE;
const ADMIN_ROLE = import.meta.env.VITE_ADMIN_ROLE;

function MainDashboard() {
  const { userInfo } = userStore();
  return (
    <>
      {userInfo.role === ADMIN_ROLE && <AdminDashboard />}
      {userInfo.role === SUPERVISOR_ROLE && <SupervisorDashboard />}
      {userInfo.role === DEPARTMENT_ROLE && <DepartmentDashboard />}
      {userInfo.role === STUDENT_ROLE && <StudentDashboard />}
    </>
  );
}

export default MainDashboard;
