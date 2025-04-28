import React, { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterForm = ({ isOpen, onClose, openLoginForm }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    phone: "",
    college: "",
    password: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [generatedMHID, setGeneratedMHID] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Check password match when either password field changes
    if (name === "password" || name === "confirmPassword") {
      if (name === "confirmPassword" && value !== formData.password) {
        setPasswordError("Passwords do not match");
      } else if (name === "password" && value !== formData.confirmPassword && formData.confirmPassword) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      // Create the request data (exclude confirmPassword as it's not needed in the backend)
      const requestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        dob: formData.dob,
        phone: formData.phone,
        college: formData.college,
        password: formData.password
      };
      
      // Send registration request to backend API
      // Uncomment this line to use the actual API
      const response = await axios.post('http://localhost:10000/api/users/register', requestData);
      
      // For development purposes, you can use this mock response
      // const response = {
      //   data: {
      //     mhid: "MH26" + Math.floor(1 + Math.random() * 100),
      //     firstName: formData.firstName,
      //     email: formData.email
      //   }
      // };
      
      // Get the MHID from the response
      setGeneratedMHID(response.data.mhid);
      setRegistrationSuccess(true);
      
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToLogin = () => {
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      dob: "",
      phone: "",
      college: "",
      password: "",
      confirmPassword: ""
    });
    setRegistrationSuccess(false);
    
    // Close registration form and open login form
    if (openLoginForm) {
      openLoginForm(generatedMHID);
    } else {
      onClose();
      navigate("/login");
    }
  };

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-300">
      <div className="absolute inset-0 bg-[#1a1a1a]/50 bg-opacity-10"></div>
      <div className="bg-[#1a1a1a] bg-opacity-70 rounded-lg p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#A3CFF0] shadow-2xl shadow-[#A3CFF0]/20 relative z-10 animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#A3CFF0]">Register</h2>
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

        {registrationSuccess ? (
          <div className="text-center py-8">
            <div className="mb-6 bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-6 py-4 rounded">
              <h3 className="text-xl font-bold mb-2">Registration Successful!</h3>
              <p>Your Mahotsav ID: <span className="font-bold">{generatedMHID}</span></p>
              <p className="mt-2">Please save this ID as you will need it to login.</p>
            </div>
            <button
              onClick={handleProceedToLogin}
              className="bg-[#A3CFF0] hover:bg-[#89BCE6] text-black font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline transition-all duration-200 transform hover:scale-[1.02]"
            >
              Proceed to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-[#A3CFF0] text-sm font-bold">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="shadow appearance-none border border-[#A3CFF0] bg-[#1a1a1a] bg-opacity-50 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-[#89BCE6] focus:ring-1 focus:ring-[#89BCE6] transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-[#A3CFF0] text-sm font-bold">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="shadow appearance-none border border-[#A3CFF0] bg-[#1a1a1a] bg-opacity-50 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-[#89BCE6] focus:ring-1 focus:ring-[#89BCE6] transition-all duration-200"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-[#A3CFF0] text-sm font-bold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="shadow appearance-none border border-[#A3CFF0] bg-[#1a1a1a] bg-opacity-50 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-[#89BCE6] focus:ring-1 focus:ring-[#89BCE6] transition-all duration-200"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="dob" className="block text-[#A3CFF0] text-sm font-bold">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="shadow appearance-none border border-[#A3CFF0] bg-[#1a1a1a] bg-opacity-50 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-[#89BCE6] focus:ring-1 focus:ring-[#89BCE6] transition-all duration-200 
                    [&::-webkit-calendar-picker-indicator]:invert-0 [&::-webkit-calendar-picker-indicator]:filter-none 
                    [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:w-6 
                    [&::-webkit-calendar-picker-indicator]:bg-[#A3CFF0] [&::-webkit-calendar-picker-indicator]:rounded-full [&::-webkit-calendar-picker-indicator]:p-1"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-[#A3CFF0] text-sm font-bold">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="shadow appearance-none border border-[#A3CFF0] bg-[#1a1a1a] bg-opacity-50 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-[#89BCE6] focus:ring-1 focus:ring-[#89BCE6] transition-all duration-200"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="college" className="block text-[#A3CFF0] text-sm font-bold">
                  College Name
                </label>
                <input
                  type="text"
                  id="college"
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  className="shadow appearance-none border border-[#A3CFF0] bg-[#1a1a1a] bg-opacity-50 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-[#89BCE6] focus:ring-1 focus:ring-[#89BCE6] transition-all duration-200"
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
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-[#A3CFF0] text-sm font-bold">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`shadow appearance-none border ${passwordError ? 'border-red-500' : 'border-[#A3CFF0]'} bg-[#1a1a1a] bg-opacity-50 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-[#89BCE6] focus:ring-1 focus:ring-[#89BCE6] transition-all duration-200`}
                  required
                />
                {passwordError && (
                  <p className="text-red-500 text-xs italic">{passwordError}</p>
                )}
              </div>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="bg-[#A3CFF0] hover:bg-[#89BCE6] text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={passwordError !== "" || loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
            
            <div className="text-center mt-4 text-[#A3CFF0]">
              <p>Already have an account? <button type="button" className="text-white hover:underline" onClick={handleProceedToLogin}>Login here</button></p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;