import { Link, useNavigate } from "react-router";
import SolidButton from "../../shared/buttons/SolidButton";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function ResetPasswordRequest() {
  const axios = useAxiosPrivate();
  const navigate = useNavigate();
  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required().label("Email"),
  });

  const {
    data,
    isPending: loading,
    mutateAsync: handleSubmit,
  } = useMutation({
    mutationFn: async (values: typeof initialValues) => {
      try {
        const { data } = await axios.post(
          "/accounts/request-password-reset/",
          values,
        );
        toast.success("Password reset link sent to your email");
        navigate("/auth/login");
        console.log(data);
      } catch (error) {
        toast.error("Failed to send password reset link");
      }
    },
  });
  return (
    <>
      <div className="mt-10 border border-gray-200 p-8 sm:rounded-lg sm:px-10 shadow-lg">
        <div className="mb-10">
          <h3 className="text-xl font-jost text-gray-900 dark:text-blue-200 text-center">
            Forgot Password?
          </h3>
          <p className="text-sm/6 font-inter text-gray-500 text-center">
            Enter your email address to receive a password reset link.
          </p>
        </div>
        <div>
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
            validationSchema={validationSchema}
          >
            {() => (
              <Form action="#" method="POST" className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md bg-white dark:bg-transparent dark:text-white px-3 py-1.5 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
                    />
                    <ErrorMessage
                      name={"email"}
                      component={"div"}
                      className={"mt-1 text-red-500 text-xs italic"}
                    ></ErrorMessage>
                  </div>
                </div>

                <p className="text-sm/6 text-gray-500">
                  <Link
                    className="text-blue-500 hover:text-blue-700 hover:cursor-pointer"
                    to="/auth/login"
                  >
                    Go back to Login
                  </Link>{" "}
                </p>

                <div>
                  <SolidButton
                    title={loading ? "Submitting..." : "Submit"}
                    type={"submit"}
                    className={" w-full py-1.5"}
                    disabled={loading}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
