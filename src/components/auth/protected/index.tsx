import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import userStore from "../../../store";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Loading from "../../../components/shared/loader/Loading";
import toast from "react-hot-toast";

function Protected({
  children,
}: {
  children: ReactNode;
  allowRoles: string[];
}) {
  const { reset, isLogin, userInfo, person, } = userStore();
  const location = useLocation();
  const axios = useAxiosPrivate();


  const { data: validUser, isLoading } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      let ID;
      let url;
      if (userInfo?.role === import.meta.env.VITE_DEPARTMENT_ROLE) {
        ID = person?.department.id;
        url = `/departments/retrieve/${ID}/`;
      } else if (userInfo?.role === import.meta.env.VITE_STUDENT_ROLE) {
        ID = person?.student.id;
        url = `/students/retrieve/${ID}/`;
      } else if (userInfo?.role === import.meta.env.VITE_SUPERVISOR_ROLE) {
        ID = person?.id;
        url = `/supervisors/supervisor/retrieve/${ID}/`;
      } else {
        ID = person?.id;
        url = `/account/retrieve/${ID}/`;
      }
      try {
        // if (!ID) {
        //   await logout();
        //   return;
        // }
        const response = await axios.get(`${url}`);
        if( response.status === 200)  {return true } else{ throw new Error("Invalid user")}
      } catch (error) {
        console.error("Error fetching user info:", error);
        toast.error("Invalid user")
    reset(); // Reset user state in the store
    localStorage.removeItem("user-store");
        return false;
      }
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <Loading />;
  }

  return !isLogin && !validUser ? (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  ) : !userInfo.has_changed_password ? (
    <Navigate
      to="/auth/change-password"
      state={{ email: userInfo.email }}
      replace
    />
  ) : (
    children
  );
}

export default Protected;
