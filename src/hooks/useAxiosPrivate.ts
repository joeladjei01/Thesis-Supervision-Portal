import { axiosPrivate } from "../utils/axios";
import { useEffect } from "react";
import userStore from "../store";
import { useNavigate } from "react-router";
import { useStudentDataStore } from "../store/useStudentDataStore";
import useRequestStore from "../store/useRequestStore";
import { useDepartmentDataStore } from "../store/useDepartmentDataStore";
import { useSupervisorDataStore } from "../store/useSupervisorDataStore";
import { handleLogout } from "../utils/utils";

function useAxiosPrivate() {
  const { accessToken, refreshToken, userInfo, reset, updateAccessToken } =
    userStore();
  const navigate = useNavigate();
  const { reset: resetDepartment } = useDepartmentDataStore();
  const { reset: resetStudent } = useStudentDataStore();
  const { reset: resetSupervisor } = useSupervisorDataStore();
  const setAllRequests = useRequestStore((state) => state.setAllRequests);

  const getNewAccessToken = async () => {
    try {
      const response: any = await axiosPrivate.post("/auth/refresh/", {
        refresh: refreshToken,
      });
      const newAccessToken = response.data.access;
      updateAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing access token:", error);
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
      throw error;
    }
  };

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers) {
          config.headers = {};
        }
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      },
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await getNewAccessToken();
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (error) {
            console.error("Error during token refresh in interceptor:", error);
          }
        }
        return Promise.reject(error);
      },
    );
    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  return axiosPrivate;
}

export default useAxiosPrivate;
