import userStore from "../../store/index";
import AdminSettings from "../admin/AdminSettings";
import DepartmentSettings from "../department/DepartmentSettings";

const ADMIN_ROLE = import.meta.env.VITE_ADMIN_ROLE;
const SUPERVISOR_ROLE = import.meta.env.VITE_SUPERVISOR_ROLE;
const DEPARTMENT_ROLE = import.meta.env.VITE_DEPARTMENT_ROLE;
const STUDENT_ROLE = import.meta.env.VITE_STUDENT_ROLE;

const Settings = () => {
  const { userInfo } = userStore();
  return (
    <>
      {userInfo.role === ADMIN_ROLE && <AdminSettings />}
      {userInfo.role === SUPERVISOR_ROLE && "Supervisor Settings"}
      {userInfo.role === DEPARTMENT_ROLE && <DepartmentSettings />}
      {/* {userInfo.role === STUDENT_ROLE && "Student Panel"} */}
    </>
  );
};

export default Settings;
