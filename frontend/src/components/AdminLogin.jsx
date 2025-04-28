import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminLogin = ({ onClose }) => {
  const [role, setRole] = useState("core");
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on the admin-login route or being used as a popup
  const isStandalonePage = location.pathname === "/admin-login";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Send the selected role along with adminId and password
    const loginData = {
      adminId,
      password,
      role
    };

    try {
      const response = await fetch("http://localhost:10000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save admin info and token to localStorage
        localStorage.setItem("adminInfo", JSON.stringify(data));
        console.log("Login successful", data);
        localStorage.setItem("token", data.token);
        // In AdminLogin.jsx after successful login
        console.log("Token being stored:", data.token);
        // Check if this admin has full access (core role)
        if (data.accessLevel === 'full') {
          console.log("Core admin logged in, navigating to dashboard");
          
          // First close the popup if it exists, then navigate
          if (onClose) {
            onClose();
          }
          
          // Use setTimeout to ensure the popup closing animation completes before navigation
          setTimeout(() => {
            navigate("/dashboard");
          }, 100);
        } else {
          // Limited access - lead role doesn't get dashboard access
          setError("Your account doesn't have access to the dashboard");
          console.log("Limited access admin logged in");
        }
      } else {
        // Handle error based on the response status
        if (response.status === 403) {
          setError("Access denied. Only core admins can access the dashboard.");
        } else if (response.status === 401 && data.message === 'Invalid role selected') {
          setError("The selected role doesn't match your account. Please select the correct role.");
        } else {
          setError(data.message || "Invalid credentials");
        }
        console.error("Login failed", data);
      }
    } catch (error) {
      setError("An error occurred during login");
      console.error("Error during login", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (isStandalonePage) {
      navigate("/");
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <div className={`${isStandalonePage ? "min-h-screen flex items-center justify-center" : ""} bg-[#1a1a1a] px-0 rounded-2xl`}>
      <div className="border border-[#A3CFF0] rounded-2xl shadow-lg p-8 w-full max-w-md text-white relative">
        {!isStandalonePage && (
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-300 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        <h2 className="text-2xl font-bold mb-6 text-center text-[#A3CFF0]">
          Admin Login - Mahotsav
        </h2>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#A3CFF0]"
            >
              <option value="core">Core</option>
              <option value="lead">Lead</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Admin ID</label>
            <input
              type="text"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="Enter Admin ID"
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#A3CFF0]"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#A3CFF0]"
              required
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Back 
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-[#A3CFF0] text-black font-semibold rounded-lg hover:bg-[#88bde9] transition shadow-md ${loading ? 'opacity-70' : ''}`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;