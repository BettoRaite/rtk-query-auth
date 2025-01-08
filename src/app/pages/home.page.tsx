import { FaReact } from "react-icons/fa";
import { SiRedux } from "react-icons/si";
import { Link } from "react-router-dom"; // Corrected import for react-router-dom

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4 text-center">
        Welcome to react-redux auth example!
      </h1>
      <div className="flex justify-center m-20 gap-20">
        <FaReact className="text-cyan-400 text-6xl" />
        <SiRedux className="text-pink-400 text-6xl" />
      </div>
      <p className="text-lg text-gray-600 mb-6">Choose an option below:</p>
      <Link
        to="/signup"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
      >
        Sign Up
      </Link>
      <Link
        to="/dashboard"
        className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
      >
        Dashboard
      </Link>
    </div>
  );
}
