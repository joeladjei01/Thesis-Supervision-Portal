import { Link } from "react-router";

export default function ResetPassword() {
  return (
    <>
      <div className="mt-10 border-1 border-gray-200 p-8 sm:rounded-lg sm:px-10  shadow-lg">
        <div className="mb-10">
          <h3 className="text-lg font-black text-gray-900 text-center">
            Set new Password
          </h3>
        </div>
        <div>
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <p className="text-sm/6 text-gray-500">
              Forgot password?{" "}
              <Link
                className="text-blue-500 hover:text-blue-700 hover:cursor-pointer"
                to="auth/password-reset-request"
              >
                Reset
              </Link>{" "}
            </p>

            <div className="flex gap-2 justify-center content-center">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600
          hover:cursor-pointer"
              >
                Submit
              </button>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-white px-3 py-1 text-sm/8 font-semibold text-indigo-500 border border-indigo-500 shadow-sm hover:text-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
          hover:cursor-pointer"
              >
                Request Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
