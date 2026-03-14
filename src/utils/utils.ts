import { axiosPrivate } from "./axios";

const ADMIN = import.meta.env.VITE_ADMIN_ROLE;
const SUPERVISOR = import.meta.env.VITE_SUPERVISOR_ROLE;
const STUDENT = import.meta.env.VITE_STUDENT_ROLE;

export const handleLogout = async (
  navigate: any,
  userInfo: any,
  refreshToken: string,
  reset: () => void,
  resetDepartment: () => void,
  resetStudent: () => void,
  resetSupervisor: () => void,
  setAllRequests: (requests: any[]) => void,
) => {
  try {
    await axiosPrivate.post("/accounts/auth/sign-out/", {
      refresh: refreshToken,
      email: userInfo.email,
    });

    navigate("/auth/login", { replace: true });
    userInfo.role === STUDENT && resetStudent();
    userInfo.role === SUPERVISOR && resetSupervisor();
    userInfo.role === ADMIN && resetDepartment();
    setAllRequests([]);
    reset(); // Reset user state in the store
    localStorage.removeItem("user-store");
  } catch (error) {
    console.log(error);
    navigate("/auth/login", { replace: true });
    reset(); // Reset user state in the store
    localStorage.removeItem("user-store");
    // reset();
  }
};


export const cardDefaultStyle = "border-2 bg-card grow rounded-xl border-border px-8 py-6"