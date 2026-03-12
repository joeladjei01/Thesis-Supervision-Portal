import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";
import { MdOutlineHome, MdArrowBack } from "react-icons/md";
import { MdWarning } from "react-icons/md";

const RouteErrorElement = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let statusCode = 500;
  let title = "Something Went Wrong";
  let message = "An unexpected error occurred while processing your request.";
  let icon = "⚠️";
  let details = "";

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;

    switch (error.status) {
      case 404:
        title = "Page Not Found";
        message = "The page you're looking for doesn't exist.";
        icon = "🔍";
        break;
      case 403:
        title = "Access Forbidden";
        message = "You don't have permission to access this resource.";
        icon = "🔒";
        break;
      case 500:
        title = "Server Error";
        message = "Something went wrong on our end. Please try again later.";
        icon = "⚠️";
        details = error.statusText || "";
        break;
      case 503:
        title = "Service Unavailable";
        message =
          "The server is temporarily unavailable. Please try again in a few moments.";
        icon = "🛠️";
        break;
      default:
        title = `Error ${error.status}`;
        message = error.statusText || "An error occurred.";
        icon = "❌";
        details = JSON.stringify(error.data, null, 2);
    }
  } else if (error instanceof Error) {
    title = "Application Error";
    message = error.message || "An unexpected error occurred.";
    icon = "💥";
    details = error.stack || "";
  }

  return (
    <div
      className={`w-full min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center px-4`}
    >
      <div className="max-w-2xl w-full">
        {/* Main Content */}
        <div className="flex flex-col text-center">
          {/* Animated Status Code */}
          <div className="mx-auto">
            <MdWarning size={80} className="text-red-600" />
          </div>
          <div className="relative">
            <h1 className="text-8xl text-slate-700 font-bold opacity-80">
              {statusCode}
            </h1>
          </div>

          {/* Error Message */}
          <h2 className="text-3xl font-Jost font-bold text-gray-700 mb-3">
            {title}
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed font-Jost">
            {message}
          </p>

          {/* Decorative Line */}
          <div className="w-24 h-1 bg-gradient-to-r from-ug-blue to-ug-gold mx-auto mb-8 rounded-full"></div>

          {/* Error Details - Development Only */}
          {import.meta.env.NODE_ENV === "development" && details && (
            <div className="bg-white rounded border-l-4 border-red-500 p-6 mb-8 text-left max-h-64 overflow-y-auto">
              <details className="cursor-pointer">
                <summary className="font-semibold text-red-900 hover:text-red-700 transition-colors mb-4">
                  Error Details (Development Only)
                </summary>
                <code className="block bg-red-50 text-red-900 p-3 rounded text-xs font-mono overflow-x-auto">
                  {details}
                </code>
              </details>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/", { replace: true })}
              className="group flex items-center justify-center gap-2 px-8 py-3 bg-ug-blue text-white font-Jost font-semibold rounded-lg hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <MdOutlineHome className="size-5" />
              Go Home
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
            Need help?{" "}
            <a
              href="mailto:support@example.com"
              className="text-ug-blue hover:underline font-semibold"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RouteErrorElement;
