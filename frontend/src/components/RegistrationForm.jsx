import React, { useState, useEffect } from "react";
import axios from "axios";
import api from '../services/api';

const RegistrationForm = ({ event, onClose, onSuccess }) => {
  // In RegistrationForm.jsx, within the useState initialization  
  const [formData, setFormData] = useState({
  eventId: event._id,
  eventName: event.eventName,
  // Standardize the category case to match what's expected in the backend
  eventCategory: event.eventCategory.toLowerCase() === 'sports' ? 'Sports' : 
                (event.eventCategory.toLowerCase() === 'cultural' ? 'cultural' : event.eventCategory),
  // Make sure subCategory is properly handled
  subCategory: event.participantCategory && event.participantCategory !== 'no category' ? 
               event.participantCategory : 'no category',
  userId: "",
  name: "",
  phone: "",
});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);

  // Add this at the top of your component for debugging
useEffect(() => {
  const userInfo = localStorage.getItem("userInfo");
  console.log("User info in localStorage:", userInfo);
  
  if (userInfo) {
    try {
      const parsedInfo = JSON.parse(userInfo);
      console.log("Parsed user info:", parsedInfo);
      console.log("MHID:", parsedInfo.mhid);
    } catch (err) {
      console.error("Error parsing user info:", err);
    }
  }
}, []);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        
        if (!userInfo || !userInfo.token) {
          setError("You need to be logged in to register");
          return;
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        
        const { data } = await axios.get("/api/users/profile", config);
        
        setUserData(data);
        
        // Make sure MHID is set from both sources - profile API and localStorage
        let mhid = data.mhid || "";
        
        // Check if MHID exists in userInfo (localStorage) as fallback
        if (!mhid && userInfo.mhid) {
          mhid = userInfo.mhid;
        }
        
        setFormData(prev => ({
          ...prev,
          userId: mhid,
          name: data.name || "",
          phone: data.phone || "",
        }));
      } catch (err) {
        setError("Failed to fetch user information");
        console.error("Error fetching user data:", err);
      }
    };
    
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      
      if (!userInfo || !userInfo.token) {
        setError("You need to be logged in to register");
        setLoading(false);
        return;
      }
      
      // Ensure we have the MHID directly from localStorage as well
      if (userInfo.mhid && !formData.userId) {
        setFormData(prev => ({
          ...prev,
          userId: userInfo.mhid
        }));
      }
      
      console.log("Registration data:", formData); // Debug - check MHID is included
      
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`
        },
      };
      
      // In your handleSubmit function, add this before making the API call
      console.log("FormData before API call:", formData);
      console.log("UserID (MHID) value:", formData.userId);

      const { data } = await axios.post(
        "http://localhost:10000/api/registrations",
        formData,
        config
      );
      
      onSuccess(data.registrationId);
    } catch (err) {
      console.error("Full error:", err); // Log the full error
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-theme-card border-2 border-theme rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-theme-secondary mb-4">Event Registration</h2>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Event Information - Read Only */}
          <div className="mb-4">
            <label className="block text-theme-primary text-sm font-medium mb-1">
              Event
            </label>
            <input
              type="text"
              value={formData.eventName}
              readOnly
              className="w-full bg-theme-primary bg-opacity-20 rounded p-2 text-theme-primary border border-theme"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-theme-primary text-sm font-medium mb-1">
              Category
            </label>
            <input
              type="text"
              value={`${formData.eventCategory}${formData.subCategory !== 'no category' ? ` - ${formData.subCategory}` : ''}`}
              readOnly
              className="w-full bg-theme-primary bg-opacity-20 rounded p-2 text-theme-primary border border-theme"
            />
          </div>
          
          {/* User Information */}
          <div className="mb-4">
            <label className="block text-theme-primary text-sm font-medium mb-1" htmlFor="userId">
              MHID
            </label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              className="w-full bg-theme-primary bg-opacity-10 rounded p-2 text-theme-primary border border-theme"
              placeholder="Your MHID"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-theme-primary text-sm font-medium mb-1" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-theme-primary bg-opacity-10 rounded p-2 text-theme-primary border border-theme"
              placeholder="Your Name"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-theme-primary text-sm font-medium mb-1" htmlFor="phone">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full bg-theme-primary bg-opacity-10 rounded p-2 text-theme-primary border border-theme"
              placeholder="Your Phone Number"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="button-theme py-2 px-6 rounded font-bold transition-colors"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;