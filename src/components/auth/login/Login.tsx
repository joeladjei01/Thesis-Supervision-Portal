/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router";
import { loginSchema } from "../../../utils/validationSchema";
import axiosInstance from "../../../utils/axios";
import toast from "react-hot-toast";
import userStore from "../../../store";
import { useLocation } from "react-router";
import usePageTile from "../../../hooks/usePageTitle";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

function Login() {
  const {
    isLogin,
    updateAccessToken,
    updateUserInfo,
    updateIsLogin,
    updatePerson,
    updateRefreshToken,
  } = userStore();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const [showPassword, setShowPassword] = useState<"password" | "text">(
    "password"
  );

  usePageTile("Thesis flow - Login");

  const togglePasswordType = () => {
    setShowPassword(showPassword === "password" ? "text" : "password");
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: { data: any } = await axiosInstance.post(
          "accounts/auth/",
          values
        );
        // Handle successful login, e.g., store token, redirect, etc.
        const { user } = response.data;
        console.log(response.data);
        user.role === import.meta.env.VITE_STUDENT_ROLE && updatePerson(user.student)
        user.role === import.meta.env.VITE_SUPERVISOR_ROLE && updatePerson(user.supervisor);
        user.role === import.meta.env.VITE_DEPARTMENT_ROLE && updatePerson(user.department);
        const { access, refresh } = response.data.token;
        updateAccessToken(access);
        updateRefreshToken(refresh);
        updateUserInfo(user);
        updateIsLogin(true);

        toast.success("Login successful!");
        navigate("/", { replace: true });
        // Redirect to the previous page or home
      } catch (error: any) {
        // Handle login error, e.g., show error message
        console.error("Login failed:", error.response?.data || error.message);
        toast.error(
          "Login failed: " +
          (error.response?.data?.detail || "An error occurred")
        );
      } finally {
        formik.setSubmitting(false); // Reset submitting state
      }
    },
  });

  useEffect(() => {
    if (isLogin) {
      navigate(from, { replace: true });
    }
  }, [isLogin, navigate, from]);

  // if (isLogin) {
  //   navigate("/", { replace: true });
  //   return null; // Prevent rendering the login form
  // }
  return (
    <div className="mt-12 bg-white dark:bg-card border border-gray-200 dark:border-border px-8 py-4 rounded-2xl transition-all duration-300">
      <div className="mb-10 text-center">
        <h3 className="text-3xl font-jost tracking-wide text-primary dark:text-blue-400">
          Welcome
        </h3>
        <p className="mt-2 font-inter text-sm  text-gray-500 dark:text-gray-400">
          Sign in to Thesis Supervision Portal
        </p>
      </div>

      <div>
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-400 mb-1.5"
            >
              <Mail className="w-4 h-4 text-primary dark:text-blue-400" />
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                className="block w-full rounded-lg bg-white dark:bg-secondary/5 border border-gray-300 dark:border-border px-4 py-2.5 text-base text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:ring-blue-500/20 dark:focus:border-blue-500 placeholder:text-gray-400 outline-none sm:text-sm"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-xs mt-1.5 font-medium animate-fadeIn">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <div>
              <label
                htmlFor="password"
                className="flex gap-2 items-center text-sm font-medium text-blue-900 dark:text-blue-400 mb-1.5"
              >
                <Lock className="w-4 h-4 text-primary dark:text-blue-400" />
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword}
                  placeholder="••••••••"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-lg bg-white dark:bg-secondary/5 border border-gray-300 dark:border-border px-4 py-2.5 text-base text-gray-900 dark:text-white transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:focus:ring-blue-500/20 dark:focus:border-blue-500 placeholder:text-gray-400 outline-none sm:text-sm"
                />
                <button
                  type="button"
                  onClick={togglePasswordType}
                  className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-primary dark:hover:text-blue-400 transition-colors p-1"
                >
                  {showPassword === "text" ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-xs mt-1.5 font-medium animate-fadeIn">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 flex justify-between">
              Forgot your password?{" "}
              <Link
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline transition-all"
                to="/auth/reset-password-request"
              >
                Reset here
              </Link>
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="flex w-full justify-center items-center gap-2 rounded-lg bg-primary hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {formik.isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
