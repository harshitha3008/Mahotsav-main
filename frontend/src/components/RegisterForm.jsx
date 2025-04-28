import React, { useState } from "react";
import { X, Copy, Check } from "lucide-react";
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
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    server: ""
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [generatedMHID, setGeneratedMHID] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Password validation
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate fields on change
    if (name === "password") {
      const passwordError = validatePassword(value);
      setErrors(prev => ({
        ...prev,
        password: passwordError,
        confirmPassword: value !== formData.confirmPassword && formData.confirmPassword ? "Passwords do not match" : ""
      }));
    } else if (name === "confirmPassword") {
      setErrors(prev => ({
        ...prev,
        confirmPassword: value !== formData.password ? "Passwords do not match" : ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password before submission
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrors(prev => ({ ...prev, password: passwordError }));
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      return;
    }

    try {
      setLoading(true);
      setErrors(prev => ({ ...prev, server: "" }));
      
      // Create the request data
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
      const response = await axios.post('https://mahotsav-backend.onrender.com/api/users/register', requestData);
      
      // Get the MHID from the response
      setGeneratedMHID(response.data.mhid);
      setRegistrationSuccess(true);
      
    } catch (error) {
      console.error("Registration error:", error);
      
      // Extract specific error message from response if available
      if (error.response?.data?.message) {
        // Check if the error contains specific field errors
        if (typeof error.response.data.message === 'object') {
          // Handle structured validation errors from server
          const serverErrors = error.response.data.message;
          
          // Update the errors state with server validation errors
          const newErrors = { ...errors };
          
          // Map server error fields to our form fields
          Object.keys(serverErrors).forEach(field => {
            if (field === 'password') {
              newErrors.password = serverErrors[field];
            } else {
              // Add other field errors to the form
              newErrors[field] = serverErrors[field];
            }
          });
          
          setErrors(newErrors);
        } else {
          // Handle string error message
          setErrors(prev => ({ 
            ...prev, 
            server: error.response.data.message 
          }));
        }
      } else {
        // Generic error if no specific message
        setErrors(prev => ({ 
          ...prev, 
          server: "Registration failed. Please try again." 
        }));
      }
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
    setErrors({
      password: "",
      confirmPassword: "",
      server: ""
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMHID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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

        {errors.server && (
          <div className="bg-[#1a1a1a] bg-opacity-20 border border-[#A3CFF0] text-red-500 px-4 py-2 rounded mb-4">
            {errors.server}
          </div>
        )}

        {registrationSuccess ? (
          <div className="text-center py-8">
            <div className="mb-6 border border-[#A3CFF0] text-white px-6 py-4 rounded">
              <h3 className="text-xl font-bold mb-2 text-[#A3CFF0]">Registration Successful!</h3>
              <p>Your Mahotsav ID:</p>
              <div className="flex items-center justify-center mt-2 space-x-2">
                <span className="font-bold text-xl text-white">{generatedMHID}</span>
                <button
                  onClick={copyToClipboard}
                  className="ml-2 p-1 rounded hover:bg-[#A3CFF0]/20 transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-400" />
                  ) : (
                    <Copy className="h-5 w-5 text-[#A3CFF0]" />
                  )}
                </button>
              </div>
              <p className="mt-4">Please save this ID as you will need it to login.</p>
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
                {errors.firstName && (
                  <p className="text-red-500 text-xs italic mt-1">{errors.firstName}</p>
                )}
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
                {errors.lastName && (
                  <p className="text-red-500 text-xs italic mt-1">{errors.lastName}</p>
                )}
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
                {errors.email && (
                  <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
                )}
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
                {errors.dob && (
                  <p className="text-red-500 text-xs italic mt-1">{errors.dob}</p>
                )}
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
                {errors.phone && (
                  <p className="text-red-500 text-xs italic mt-1">{errors.phone}</p>
                )}
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
                {errors.college && (
                  <p className="text-red-500 text-xs italic mt-1">{errors.college}</p>
                )}
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
                  className={`shadow appearance-none border ${errors.password ? 'border-red-500' : 'border-[#A3CFF0]'} bg-[#1a1a1a] bg-opacity-50 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-[#89BCE6] focus:ring-1 focus:ring-[#89BCE6] transition-all duration-200`}
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-xs italic mt-1">{errors.password}</p>
                )}
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
                  className={`shadow appearance-none border ${errors.confirmPassword ? 'border-red-500' : 'border-[#A3CFF0]'} bg-[#1a1a1a] bg-opacity-50 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:border-[#89BCE6] focus:ring-1 focus:ring-[#89BCE6] transition-all duration-200`}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs italic mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="bg-[#A3CFF0] hover:bg-[#89BCE6] text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={loading || (errors.password || errors.confirmPassword) !== ""}
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