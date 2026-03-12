import { useNavigate } from "react-router";
import { MdOutlineHome, MdArrowBack } from "react-icons/md";

const ServerError = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Main Content */}
        <div className="text-center">
          {/* Animated 500 Text */}
          <div className="mb-8 relative">
            <h1 className="text-9xl font-bold text-red-200/40 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
              500
            </h1>
            <div className="relative z-10 flex items-center justify-center gap-4">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-4xl">⚠️</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h2 className="text-4xl font-Jost font-bold text-gray-900 mb-3">
            Server Error
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed font-Jost">
            Something went wrong on our end. Our team has been notified and is
            working to fix the issue. Please try again later.
          </p>

          {/* Decorative Line */}
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-orange-400 mx-auto mb-8 rounded-full"></div>

          {/* Error Details Box */}
          <div className="bg-white rounded-lg border-l-4 border-red-500 p-6 mb-8 text-left shadow-md">
            <p className="text-sm text-gray-600 font-Inter">
              <span className="font-semibold text-gray-900">Error Code:</span>{" "}
              HTTP 500 - Internal Server Error
            </p>
            <p className="text-sm text-gray-600 font-Inter mt-2">
              If the problem persists, please contact our support team with this
              error code.
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
              Try Again
            </button>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 font-Inter">
            For urgent issues, please{" "}
            <a
              href="mailto:support@example.com"
              className="text-ug-blue hover:underline font-semibold"
            >
              email support
            </a>{" "}
            or call our helpline.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
