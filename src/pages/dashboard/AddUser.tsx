import userStore from "../../store/index";
import AdminAddUser from "../../components/add-user/AdminAddUser";
import Department from "../../components/add-user/department";

const ADMIN_ROLE = import.meta.env.VITE_ADMIN_ROLE;
const SUPERVISOR_ROLE = import.meta.env.VITE_SUPERVISOR_ROLE;
const DEPARTMENT_ROLE = import.meta.env.VITE_DEPARTMENT_ROLE;
const STUDENT_ROLE = import.meta.env.VITE_STUDENT_ROLE;

const AddUser = () => {
  const { userInfo } = userStore();
  return (
    <>
      {userInfo.role === ADMIN_ROLE && <AdminAddUser />}
      {userInfo.role === SUPERVISOR_ROLE && "Supervisor Panel"}
      {userInfo.role === DEPARTMENT_ROLE && <Department />}
      {userInfo.role === STUDENT_ROLE && "Student Panel"}
    </>
  );
};

export default AddUser;
