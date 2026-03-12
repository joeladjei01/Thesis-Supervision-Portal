import { useNavigate } from "react-router";
import {
  MdOutlineHome,
  MdArrowBack,
  MdLockOutline,
} from "react-icons/md";

const ForbiddenError = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Main Content */}
        <div className="text-center">
          {/* Animated 403 Text */}
          <div className="mb-8 relative">
            <h1 className="text-9xl font-bold text-amber-200/40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
              403
            </h1>
            <div className="relative z-10 flex items-center justify-center gap-4">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
                <MdLockOutline className="size-10 text-amber-600 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h2 className="text-4xl font-Jost font-bold text-gray-900 mb-3">
            Access Forbidden
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed font-Jost">
            You don't have permission to access this resource. If you believe
            this is a mistake, please contact your administrator.
          </p>

          {/* Decorative Line */}
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-yellow-400 mx-auto mb-8 rounded-full"></div>

          {/* Permission Info Box */}
          <div className="bg-white rounded-lg border-l-4 border-amber-500 p-6 mb-8 text-left shadow-md">
            <p className="text-sm text-gray-600 font-Inter">
              <span className="font-semibold text-gray-900">
                What this means:
              </span>{" "}
              You lack the required permissions to view this page.
            </p>
            <p className="text-sm text-gray-600 font-Inter mt-2">
              • Your role may not have access to this resource
            </p>
            <p className="text-sm text-gray-600 font-Inter">
              • Your account might need special approval
            </p>
            <p className="text-sm text-gray-600 font-Inter">
              • Contact an administrator to request access
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/", { replace: true })}
              className="group flex items-center justify-center gap-2 px-8 py-3 bg-ug-blue text-white font-Jost font-semibold rounded-lg hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <MdOutlineHome className="size-5" />
              Go to Home
            </button>

            <button
              onClick={() => navigate(-1)}
              className="group flex items-center justify-center gap-2 px-8 py-3 bg-gray-200 text-gray-800 font-Jost font-semibold rounded-lg hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
            >
              <MdArrowBack className="size-5" />
              Go Back
            </button>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 font-Inter">
            Need help? Contact your administrator or{" "}
            <a
              href="mailto:support@example.com"
              className="text-ug-blue hover:underline font-semibold"
            >
              get in touch with support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenError;
