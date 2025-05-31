import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import Home from "./pages/Home"; // ✅ Add Home page
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user } = useAuth();

  // Public routes for non-authenticated users
  const PublicRoute = ({ children }) => (!user ? children : <Navigate to="/dashboard" />);

  // Protected routes for authenticated users
  const ProtectedRoute = ({ children }) => (user ? children : <Navigate to="/login" />);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
