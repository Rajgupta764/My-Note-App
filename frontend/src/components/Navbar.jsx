import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import image from "./edit-icon.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <img src={image} alt="NoteApp Logo" className="h-9 w-9 drop-shadow-lg rounded-full" />
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-wide bg-via-indigo-500 bg-opacity-20 text-white px-3 py-1 rounded-lg hover:bg-opacity-30 transition"
            >
              NoteApp
            </Link>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="hidden sm:inline text-white font-medium text-sm">
                  👋 Hello, <span className="font-semibold">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-xl transition duration-200 shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:underline font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-indigo-600 hover:text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
