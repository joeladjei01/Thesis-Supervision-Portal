import { useNavigate } from "react-router";
import { MdOutlineHome, MdArrowBack } from "react-icons/md";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Main Content */}
        <div className="text-center">
          {/* Animated 404 Text */}
          <div className="mb-8 relative">
            <h1 className="text-9xl font-bold text-ug-blue/20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
              404
            </h1>
            <div className="relative z-10 flex items-center justify-center gap-4">
              <div className="w-20 h-20 bg-ug-blue/10 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-4xl">🔍</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h2 className="text-4xl font-Jost font-bold text-gray-900 mb-3">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed font-Jost">
            Oops! The page you're looking for seems to have wandered off. It
            might have been moved, renamed, or never existed in the first place.
          </p>

          {/* Decorative Line */}
          <div className="w-24 h-1 bg-gradient-to-r from-ug-blue to-ug-gold mx-auto mb-8 rounded-full"></div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/", { replace: true })}
              className="group flex items-center justify-center gap-2 px-8 py-3 bg-ug-blue text-white font-Jost font-semibold rounded-lg hover:bg-blue-900 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <MdOutlineHome className="size-5 group-hover:rotate-0 transition-transform" />
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
            If you think this is a mistake, please{" "}
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

export default PageNotFound;
