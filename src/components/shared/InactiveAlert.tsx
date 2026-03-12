import React, { useEffect, useState } from "react";
import SolidButton from "./buttons/SolidButton";
import useActiveSessionStore from "../../store/useActiveSessionStore";
import userStore from "../../store";
import { useDepartmentDataStore } from "../../store/useDepartmentDataStore";
import { useStudentDataStore } from "../../store/useStudentDataStore";
import useRequestStore from "../../store/useRequestStore";
import { useSupervisorDataStore } from "../../store/useSupervisorDataStore";
import { handleLogout } from "../../utils/utils";
import { useNavigate } from "react-router";

const InactiveAlert = () => {
  const [timer, setTimer] = useState(60);

  const { sessionExpiry, setSessionExpiry } = useActiveSessionStore();
  const { isLogin, userInfo, refreshToken, updateIsLogin, reset } = userStore();
  const resetDepartment = useDepartmentDataStore((state) => state.reset);
  const resetStudent = useStudentDataStore((state) => state.reset);
  const resetSupervisor = useSupervisorDataStore((state) => state.reset);
  const setAllRequests = useRequestStore((state) => state.setAllRequests);
  const navigate = useNavigate();

  const clearUserDataOnLogout = async () => {
    try {
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
      updateIsLogin(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(sessionExpiry);
    let interval;

    if (isLogin && sessionExpiry) {
      // 1. Reset timer to starting value (e.g., 60 seconds)
      setTimer(60);

      // 2. Start the countdown
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            clearUserDataOnLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000); // Tick every 1 second
    }

    // 3. Cleanup: This stops the timer if the component unmounts
    // or if sessionExpiry changes
    return () => clearInterval(interval);
  }, [isLogin, sessionExpiry]);

  const handleActiveSession = () => {
    const expireDate = Date.now() + 6 * 1000;
    localStorage.setItem("expireDate", expireDate.toString());
    setSessionExpiry(false);
    console.log("Session extended, sessionExpiry:", sessionExpiry);
  };

  if (!sessionExpiry) {
    return null;
  }

  return (
    <div className="fixed z-60 h-dvh w-full bg-gray-900/60 backdrop-blur-lg flex items-center justify-center">
      <div className="w-120 bg-white p-4 space-y-2 rounded-md">
        <h3 className="text-gray-800">
          Your session will expire in {timer}s. Select Okay or scroll to the
          page to stay active.
        </h3>

        <div className="w-fit ml-auto">
          <SolidButton title={"Okay"} onClick={handleActiveSession} />
        </div>
      </div>
    </div>
  );
};

export default InactiveAlert;
