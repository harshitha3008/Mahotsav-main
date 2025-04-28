import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook

const LoginPage = ({ isOpen, onClose, initialMHID }) => {
  const navigate = useNavigate();
  const { login, user } = useAuth(); // Use the auth context
  const [formData, setFormData] = useState({
    mhid: initialMHID || "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMHIDInfo, setShowMHIDInfo] = useState(!!initialMHID);

  useEffect(() => {
    // Update MHID if initialMHID changes
    if (initialMHID) {
      setFormData(prev => ({
        ...prev,
        mhid: initialMHID
      }));
      setShowMHIDInfo(true);
    }
    
    // Check if user is already logged in using the auth context
    if (user && isOpen) {
      navigate("/welcome");
    }
  }, [navigate, isOpen, initialMHID, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError("");
      
      // Send login request to backend API
      const response = await axios.post('http://localhost:10000/api/users/login', formData);
      
      // Use the login function from AuthContext instead of directly setting localStorage
      login(response.data);
      
      // Reset form
      setFormData({
        mhid: "",
        password: "",
      });
      
      // Close modal and navigate to welcome page
      onClose();
      navigate('/welcome');
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Invalid Mahotsav ID or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    // Close the login modal and navigate to register
    onClose();
    navigate("/register");
  };

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-300">
      <div className="absolute inset-0 bg-[#1a1a1a]/50"></div>
      <div className="bg-[#1a1a1a] rounded-lg p-8 max-w-md w-full border border-[#A3CFF0] shadow-2xl shadow-[#A3CFF0]/20 relative z-10 animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#A3CFF0]">Login</h2>
          <button
            onClick={onClose}
            className="text-[#A3CFF0] hover:text-white transition-colors duration-200"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        
        {showMHIDInfo && (
          <div className="bg-[#1a1a1a] bg-opacity-20 border border-[#A3CFF0] text-white px-4 py-2 rounded mb-4">
            <p>Registration successful! Your Mahotsav ID: <span className="font-bold">{initialMHID}</span></p>
            <p className="text-sm mt-1">Please use this ID along with your password to login.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="mhid" className="block text-[#A3CFF0] text-sm font-bold">
                Mahotsav ID
              </label>
              <input
                type="text"
                id="mhid"
                name="mhid"
                value={formData.mhid}
                onChange={handleInputChange}
                className="shadow appearance-none border border-[#A3CFF0] bg-[#1a1a1a] bg-opacity-50 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-[#89BCE6] focus:ring-1 focus:ring-[#89BCE6] transition-all duration-200"
                placeholder="e.g. MH261"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-[#A3CFF0] text-sm font-bold">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="shadow appearance-none border border-[#A3CFF0] bg-[#1a1a1a] bg-opacity-50 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-[#89BCE6] focus:ring-1 focus:ring-[#89BCE6] transition-all duration-200"
                required
              />
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className="bg-[#A3CFF0] hover:bg-[#89BCE6] text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          
          <div className="text-center mt-4 text-[#A3CFF0]">
            <p>Don't have an account? <button type="button" className="text-white hover:underline" onClick={handleRegisterClick}>Register here</button></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;