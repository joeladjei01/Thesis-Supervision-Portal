import { useState, type ReactNode } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import userStore from "../../../store";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import Loading from "../../../components/shared/loader/Loading";
import { handleLogout } from "../../../utils/utils";
import toast from "react-hot-toast";
import { useDepartmentDataStore } from "../../../store/useDepartmentDataStore";
import { useStudentDataStore } from "../../../store/useStudentDataStore";
import { useSupervisorDataStore } from "../../../store/useSupervisorDataStore";
import useRequestStore from "../../../store/useRequestStore";

function Protected({
  children,
}: {
  children: ReactNode;
  allowRoles: string[];
}) {
  const { reset, isLogin, userInfo, person, refreshToken } = userStore();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const setAllRequests = useRequestStore((state) => state.setAllRequests);
  const { reset: resetDepartment } = useDepartmentDataStore();
  const { reset: resetStudent } = useStudentDataStore();
  const { reset: resetSupervisor } = useSupervisorDataStore();

  const { mutateAsync: logout } = useMutation({
    mutationFn: async () => {
      try {
        setLoading(true);
        await handleLogout(
          navigate,
          userInfo,
          refreshToken,
          reset,
          resetDepartment,
          resetStudent,
          resetSupervisor,
          setAllRequests,
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("An Error Occuied");
    },
    onSuccess: () => {
      navigate("/auth/login", { replace: true });
      toast.success("Logout successful!");
    },
  });

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
        ID = person?.supervisor.id;
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
        return true;
      } catch (error) {
        console.error("Error fetching user info:", error);
        return false;
      }
    },
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
