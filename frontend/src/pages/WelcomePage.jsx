import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaUser, FaCalendarAlt, FaListAlt, FaLock } from "react-icons/fa";
import UserEventsComponent from "../components/UserEventsComponent";
// import ThemeContext from "../context/ThemeContext";
import UserRegistrationsComponent from "../components/UserRegistrationsComponent";

const WelcomePage = () => {
  // const { theme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  
  // For profile editing
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    college: "",
    phone: "",
    dob: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // For password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    
    if (!userInfo) {
      navigate("/");
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      
      // Fetch user profile data to get the most up-to-date information
      const fetchUserProfile = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${parsedUser.token}`,
            },
          };
          
          const { data } = await axios.get(
            "http://localhost:10000/api/users/profile",
            config
          );
          
          const userData = { ...parsedUser, ...data };
          setUser(userData);
          
          // Initialize form data
          setFormData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            college: userData.college || "",
            phone: userData.phone || "",
            dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : ""
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          // Add this to handle unauthorized errors - redirect to login
          if (error.response && error.response.status === 401) {
            localStorage.removeItem("userInfo");
            navigate("/");
          }
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserProfile();
    } catch (error) {
      console.error("Error parsing user info:", error);
      navigate("/");
    }
  }, [navigate]);

  // Handle input change for profile form
  const handleProfileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const { data } = await axios.put(
        "http://localhost:10000/api/users/profile",
        formData,
        config
      );
      
      // Update local storage with new user data
      const updatedUser = { ...user, ...data };
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Update failed. Please try again."
      );
    }
  };

  // Handle input change for password form
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      await axios.put(
        "http://localhost:10000/api/users/changepassword",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        config
      );
      
      setPasswordSuccess("Password changed successfully!");
      
      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      setPasswordError(
        error.response && error.response.data.message
          ? error.response.data.message
          : "Password change failed. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-primary flex items-center justify-center">
        <div className="text-theme-primary text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-primary">
      <Header />
      
      {/* Welcome Banner */}
      <div className="bg-theme-primary py-4 border-b border-theme">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-theme-secondary">Welcome, {user?.firstName}!</h2>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-1/4">
            <div className="bg-theme-card bg-opacity-70 rounded-lg p-4 border border-theme shadow-lg">
              <nav>
                <ul>
                  <li className="mb-2">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`flex items-center gap-3 w-full p-3 rounded-md transition-colors ${
                        activeTab === "profile" ? "bg-theme-secondary text-theme-primary" : "text-theme-primary hover:bg-theme-secondary"
                      }`}
                    >
                      <FaUser />
                      <span>Profile</span>
                    </button>
                  </li>
                  <li className="mb-2">
                    <button
                      onClick={() => setActiveTab("events")}
                      className={`flex items-center gap-3 w-full p-3 rounded-md transition-colors ${
                        activeTab === "events" ? "bg-theme-secondary text-theme-primary" : "text-theme-primary hover:bg-theme-secondary"
                      }`}
                    >
                      <FaCalendarAlt />
                      <span>Events</span>
                    </button>
                  </li>
                  <li className="mb-2">
                    <button
                      onClick={() => setActiveTab("registered")}
                      className={`flex items-center gap-3 w-full p-3 rounded-md transition-colors ${
                        activeTab === "registered" ? "bg-theme-secondary text-theme-primary" : "text-theme-primary hover:bg-theme-secondary"
                      }`}
                    >
                      <FaListAlt />
                      <span>Registered Events</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("password")}
                      className={`flex items-center gap-3 w-full p-3 rounded-md transition-colors ${
                        activeTab === "password" ? "bg-theme-secondary text-theme-primary" : "text-theme-primary hover:bg-theme-secondary"
                      }`}
                    >
                      <FaLock />
                      <span>Change Password</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="w-full md:w-3/4">
            <div className="bg-theme-card bg-opacity-70 rounded-lg p-6 border border-theme shadow-2xl shadow-theme-secondary/20 min-h-[500px]">
              {/* Profile Content */}
              {activeTab === "profile" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-theme-secondary">Your Profile</h2>
                    {!editing ? (
                      <button
                        onClick={() => setEditing(true)}
                        className="button-theme font-bold py-2 px-4 rounded"
                      >
                        Edit Details
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditing(false);
                          // Reset form data to current user data
                          setFormData({
                            firstName: user.firstName || "",
                            lastName: user.lastName || "",
                            email: user.email || "",
                            college: user.college || "",
                            phone: user.phone || "",
                            dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : ""
                          });
                          setError("");
                          setSuccess("");
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                  
                  {/* Display MHID (read only) */}
                  <div className="mb-6 p-4 bg-theme-primary rounded-lg border border-theme">
                    <p className="text-theme-secondary font-bold">Mahotsav ID:</p>
                    <p className="text-3xl font-bold text-theme-primary">{user?.mhid}</p>
                    <p className="text-sm text-gray-400 mt-2">Your Mahotsav ID cannot be changed</p>
                  </div>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-500 rounded-md text-white">
                      {error}
                    </div>
                  )}
                  
                  {success && (
                    <div className="mb-4 p-3 bg-green-900 bg-opacity-50 border border-green-500 rounded-md text-white">
                      {success}
                    </div>
                  )}
                  
                  {editing ? (
                    // Edit form
                    <form onSubmit={handleProfileSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-theme-secondary mb-2">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleProfileChange}
                            className="w-full input-theme p-2 rounded-md focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-theme-secondary mb-2">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleProfileChange}
                            className="w-full input-theme p-2 rounded-md focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-theme-secondary mb-2">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleProfileChange}
                            className="w-full input-theme p-2 rounded-md focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-theme-secondary mb-2">Date of Birth</label>
                          <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleProfileChange}
                            className="w-full input-theme p-2 rounded-md focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-theme-secondary mb-2">Phone Number</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleProfileChange}
                            className="w-full input-theme p-2 rounded-md focus:outline-none"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-theme-secondary mb-2">College</label>
                          <input
                            type="text"
                            name="college"
                            value={formData.college}
                            onChange={handleProfileChange}
                            className="w-full input-theme p-2 rounded-md focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="button-theme font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Display user info
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-theme-primary rounded-lg border border-theme">
                        <p className="text-theme-secondary font-bold">First Name:</p>
                        <p className="text-theme-primary text-lg">{user?.firstName}</p>
                      </div>
                      <div className="p-4 bg-theme-primary rounded-lg border border-theme">
                        <p className="text-theme-secondary font-bold">Last Name:</p>
                        <p className="text-theme-primary text-lg">{user?.lastName}</p>
                      </div>
                      <div className="p-4 bg-theme-primary rounded-lg border border-theme">
                        <p className="text-theme-secondary font-bold">Email:</p>
                        <p className="text-theme-primary text-lg">{user?.email}</p>
                      </div>
                      <div className="p-4 bg-theme-primary rounded-lg border border-theme">
                        <p className="text-theme-secondary font-bold">Date of Birth:</p>
                        <p className="text-theme-primary text-lg">
                          {user?.dob ? new Date(user.dob).toLocaleDateString() : "Not set"}
                        </p>
                      </div>
                      <div className="p-4 bg-theme-primary rounded-lg border border-theme">
                        <p className="text-theme-secondary font-bold">Phone Number:</p>
                        <p className="text-theme-primary text-lg">{user?.phone}</p>
                      </div>
                      <div className="p-4 bg-theme-primary rounded-lg border border-theme">
                        <p className="text-theme-secondary font-bold">College:</p>
                        <p className="text-theme-primary text-lg">{user?.college}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Events Content */}
              
              {activeTab === "events" && (
                <div>
                  <h2 className="text-2xl font-bold text-theme-secondary mb-6">Upcoming Events</h2>
                  <UserEventsComponent />
                </div>
              )}
              
              {/* Registered Events Content */}
              {activeTab === "registered" && (
              <div>
                <h2 className="text-2xl font-bold text-theme-secondary mb-6">Your Registered Events</h2>
                <UserRegistrationsComponent />
              </div>
            )}
              
              {/* Change Password Content */}
              {activeTab === "password" && (
                <div>
                  <h2 className="text-2xl font-bold text-theme-secondary mb-6">Change Password</h2>
                  
                  {passwordError && (
                    <div className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-500 rounded-md text-white">
                      {passwordError}
                    </div>
                  )}
                  
                  {passwordSuccess && (
                    <div className="mb-4 p-3 bg-green-900 bg-opacity-50 border border-green-500 rounded-md text-white">
                      {passwordSuccess}
                    </div>
                  )}
                  
                  <form onSubmit={handlePasswordSubmit} className="bg-theme-primary p-6 rounded-lg border border-theme">
                    <div className="mb-4">
                      <label className="block text-theme-secondary mb-2">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full input-theme p-2 rounded-md focus:outline-none"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-theme-secondary mb-2">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full input-theme p-2 rounded-md focus:outline-none"
                        required
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-theme-secondary mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full input-theme p-2 rounded-md focus:outline-none"
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="button-theme font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WelcomePage;