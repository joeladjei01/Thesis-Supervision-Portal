import { useNavigate } from "react-router";
import { MdOutlineHome, MdArrowBack } from "react-icons/md";

interface GenericErrorProps {
  statusCode?: number;
  title?: string;
  message?: string;
  icon?: string;
  showDetails?: boolean;
  errorDetails?: string;
  onRetry?: () => void;
  customAction?: {
    label: string;
    action: () => void;
  };
}

const GenericError: React.FC<GenericErrorProps> = ({
  statusCode = 400,
  title = "Something Went Wrong",
  message = "An error occurred while processing your request. Please try again.",
  icon = "⚠️",
  showDetails = false,
  errorDetails = "",
  onRetry,
  customAction,
}) => {
  const navigate = useNavigate();
  const gradientFrom =
    statusCode >= 500
      ? "from-red-50"
      : statusCode >= 400
        ? "from-amber-50"
        : "from-blue-50";
  const gradientTo =
    statusCode >= 500
      ? "to-pink-50"
      : statusCode >= 400
        ? "to-yellow-50"
        : "to-blue-50";
  const accentColor =
    statusCode >= 500 ? "red" : statusCode >= 400 ? "amber" : "blue";
  const bgColor =
    statusCode >= 500
      ? "bg-red-100"
      : statusCode >= 400
        ? "bg-amber-100"
        : "bg-blue-100";

  return (
    <div
      className={`w-full min-h-screen bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center px-4`}
    >
      <div className="max-w-2xl w-full">
        {/* Main Content */}
        <div className="text-center">
          {/* Animated Status Code */}
          <div className="mb-8 relative">
            <h1
              className={`text-9xl font-bold opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap`}
            >
              {statusCode}
            </h1>
            <div className="relative z-10 flex items-center justify-center gap-4">
              <div
                className={`${bgColor} w-20 h-20 rounded-full flex items-center justify-center animate-bounce`}
              >
                <span className="text-4xl">{icon}</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h2 className="text-4xl font-Jost font-bold text-gray-900 mb-3">
            {title}
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed font-Jost">
            {message}
          </p>

          {/* Decorative Line */}
          <div
            className={`w-24 h-1 bg-gradient-to-r from-${accentColor}-500 to-${accentColor}-400 mx-auto mb-8 rounded-full`}
          ></div>

          {/* Error Details */}
          {showDetails && errorDetails && (
            <div className="bg-white rounded-lg border-l-4 border-gray-300 p-6 mb-8 text-left shadow-md">
              <p className="text-sm text-gray-600 font-Inter whitespace-pre-wrap break-words">
                {errorDetails}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate("/", { replace: true })}
              className="group flex items-center justify-center gap-2 px-8 py-3 bg-ug-blue text-white font-Jost font-semibold rounded-lg hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
            >
              <MdOutlineHome className="size-5" />
              Go Home
            </button>

            {onRetry && (
              <button
                onClick={onRetry}
                className="group flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white font-Jost font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
              >
                <span>🔄</span>
                Retry
              </button>
            )}

            {customAction && (
              <button
                onClick={customAction.action}
                className="group flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white font-Jost font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
              >
                {customAction.label}
              </button>
            )}

            <button
              onClick={() => navigate(-1)}
              className="group flex items-center justify-center gap-2 px-8 py-3 bg-gray-200 text-gray-800 font-Jost font-semibold rounded-lg hover:bg-gray-300 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
            >
              <MdArrowBack className="size-5" />
              Go Back
            </button>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 font-Inter">
            If you need help, please{" "}
            <a
              href="mailto:support@example.com"
              className="text-ug-blue hover:underline font-semibold"
            >
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenericError;
