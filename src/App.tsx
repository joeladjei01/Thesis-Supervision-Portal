import router from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import "react-quill/dist/quill.snow.css";
import { AlertProvider } from "./components/shared/ui/Alert";
import { ErrorBoundary } from "./components/shared/errors";
import { useCallback, useEffect, useState } from "react";
import userStore from "./store";
import useActiveSessionStore from "./store/useActiveSessionStore";

function App() {
  const [client] = useState(() => new QueryClient());
  const { isLogin } = userStore();
  const { sessionExpiry, setSessionExpiry } = useActiveSessionStore();

  const updateExpireDate = useCallback(() => {
    if (sessionExpiry) return;
    const expireDate = Date.now() + 5 * 60 * 1000;
    localStorage.setItem("expireDate", expireDate.toString());
    setSessionExpiry(false);
  }, []);

  const checkInactivity = useCallback(() => {
    if (sessionExpiry) return;
    const expireDate = localStorage.getItem("expireDate");
    if (!expireDate || Number(expireDate) < Date.now()) {
      setSessionExpiry(true);
    } else {
      setSessionExpiry(false);
    }
  }, [setSessionExpiry]);

  useEffect(() => {
    if (sessionExpiry) return;
    const interval = setInterval(() => {
      checkInactivity();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!isLogin) return;
    updateExpireDate();

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((e) => window.addEventListener(e, updateExpireDate));

    return () => {
      events.forEach((e) => window.removeEventListener(e, updateExpireDate));
    };
  }, [isLogin, updateExpireDate]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={client}>
        <AlertProvider>
          <RouterProvider router={router} />
          <Toaster position="top-center" reverseOrder={false} />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </AlertProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
