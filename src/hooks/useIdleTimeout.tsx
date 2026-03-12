import { useEffect, useCallback } from "react";

const useIdleTimeout = (onIdle, timeout = 900000) => {
  // Default 15 mins
  const handleLogout = useCallback(() => {
    onIdle();
  }, [onIdle]);

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(handleLogout, timeout);
    };

    // Events to track user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    // Add event listeners
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Initialize timer
    resetTimer();

    // Cleanup: remove listeners and clear timer when component unmounts
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timer) clearTimeout(timer);
    };
  }, [handleLogout, timeout]);
};

export default useIdleTimeout;
