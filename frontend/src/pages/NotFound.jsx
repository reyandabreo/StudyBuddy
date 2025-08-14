import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-2xl flex flex-col items-center max-w-lg w-full">
        <FaExclamationTriangle className="text-yellow-400 text-6xl mb-6 drop-shadow-lg" />
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 text-transparent bg-clip-text">
          404 - Page Not Found
        </h1>
        <p className="text-white/70 text-lg mb-6 text-center">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-600 hover:to-yellow-400 text-white font-semibold px-6 py-3 rounded-lg shadow transition-all duration-200"
        >
          Go Home
        </Link>
      </div>
      <footer className="text-center text-white/30 text-xs mt-16">
        Built with 💜 using DaisyUI + TailwindCSS · © 2025 StudyAI
      </footer>
    </div>
  );
};

export default NotFound;