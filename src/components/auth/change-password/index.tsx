/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useLocation } from "react-router";
import usePageTile from "../../../hooks/usePageTitle";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import userStore from "../../../store";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const validationSchema = Yup.object().shape({
  new_password: Yup.string()
    .min(2, "Password must be at least 8 characters")
    .required("Password is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("new_password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

function ChangePassword() {
  const [showPassword, setShowPassword] = useState("password");
  const [showConfirmPassword, setShowConfirmPassword] = useState("password");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const axiosPrivate = useAxiosPrivate();
  const { updateUserInfo, userInfo } = userStore();

  const togglePasswordType = () => {
    setShowPassword(showPassword === "password" ? "text" : "password");
  };

  const toggleConfirmPasswordType = () => {
    setShowConfirmPassword(
      showConfirmPassword === "password" ? "text" : "password"
    );
  };

  usePageTile("Thesis flow - Change Password");

  const formik = useFormik({
    initialValues: {
      new_password: "",
      confirm_password: "",
    },
    validationSchema,
    onSubmit: async () => {
      try {
        await axiosPrivate.post("accounts/change-password/", {
          email,
          new_password: formik.values.new_password,
        });

        toast.success("Change password successful!");
        updateUserInfo({
          ...userInfo,
          has_changed_password: true,
        });
        navigate("/", { replace: true }); // Redirect to the previous page or home
      } catch (error: any) {
        console.error(
          "Change password failed:",
          error.response?.data || error.message
        );
        toast.error(
          "Change password failed: " +
            (error.response?.data?.detail || "An error occurred")
        );
      } finally {
        formik.setSubmitting(false); // Reset submitting state
      }
    },
  });

  return (
    <div className="mt-10 border-1 border-gray-200 p-8 sm:rounded-lg sm:px-10 shadow-lg">
      <div className="mb-10">
        <h3 className="text-lg font- font-semibold text-slate-700 text-center">
          Change Password
        </h3>
        <p className="text-xs text-gray-500 text-center font-montserrat">
          Please set your new password for your account. This password will be
          used for future logins and ensuring the security of your account.
        </p>
      </div>

      <div>
        <form className="space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Password
            </label>
            <div className="mt-2 relative">
              <input
                id="new_password"
                name="new_password"
                type={showPassword}
                value={formik.values.new_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400  focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
              />

              <button
                type={"button"}
                onClick={togglePasswordType}
                className={"absolute top-1 right-1 text-blue-800 p-1"}
              >
                {showPassword === "text" ? <Eye /> : <EyeOff />}
              </button>

              {formik.touched.new_password && formik.errors.new_password ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.new_password}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Confirm Password
            </label>
            <div className="mt-2 relative">
              <input
                id="confirm_password"
                name="confirm_password"
                type={showConfirmPassword}
                value={formik.values.confirm_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400  focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
              />

              <button
                type={"button"}
                onClick={toggleConfirmPasswordType}
                className={"absolute top-1 right-1 text-blue-800 p-1"}
              >
                {showConfirmPassword === "text" ? <Eye /> : <EyeOff />}
              </button>

              {formik.touched.confirm_password &&
              formik.errors.confirm_password ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.confirm_password}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <button
              type="submit"
              // onClick={() => formik.handleSubmit()}
              className="flex w-full justify-center rounded-md ug-blue-background px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
    hover:cursor-pointer"
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {formik.isSubmitting ? "Loading..." : "Set Password & Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
