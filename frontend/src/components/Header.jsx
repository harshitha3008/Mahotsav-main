import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Mahotsav-logo.png";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext.jsx"; // Updated import with .jsx extension

const Header = ({ onAdminLoginClick, onUserLoginClick, onUserRegisterClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    onAdminLoginClick();
  };
  
  const handleUserLogin = (e) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    onUserLoginClick();
  };
  
  const handleRegister = (e) => {
    e.preventDefault();
    onUserRegisterClick();
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 flex justify-between items-center px-6 py-4 bg-black shadow-md z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
      {/* Logo */}
      <div>
        <img src={logo} alt="Mahotsav Logo" className="h-10" />
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-6 relative">
        {/* Only show navigation links if user is not logged in */}
        {!user && (
          <>
            <a href="#home" className="text-white hover:text-[#A3CFF0]">Home</a>
            <a href="#about" className="text-white hover:text-[#A3CFF0]">About</a>
            <a href="#gallery" className="text-white hover:text-[#A3CFF0]">Gallery</a>
            <a href="#contact" className="text-white hover:text-[#A3CFF0]">Contact Us</a>
          </>
        )}

        {!user ? (
          // Show login and register buttons if user is not logged in
          <>
            <div className="relative">
              <button 
                className="px-4 py-2 bg-[#A3CFF0] text-black rounded hover:bg-[#89BCE6] cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Login
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-18 bg-[#1a1a1a] text-white shadow-lg rounded-md overflow-hidden border border-[#A3CFF0]">
                  <a href="#" onClick={handleUserLogin} className="block px-4 py-2 hover:bg-[#A3CFF0] hover:text-black cursor-pointer">User</a>
                  <a href="#" onClick={handleAdminLogin} className="block px-4 py-2 hover:bg-[#A3CFF0] hover:text-black cursor-pointer">Admin</a>
                </div>
              )}
            </div>

            <button 
              className="px-4 py-2 bg-[#A3CFF0] text-black rounded hover:bg-[#89BCE6] cursor-pointer"
              onClick={handleRegister}
            >
              Register
            </button>
          </>
        ) : (
              <div className="absolute right-0 mt-2 w-32 bg-[#1a1a1a] text-white shadow-lg rounded-md overflow-hidden border border-[#A3CFF0]">
                <a onClick={handleLogout} className="block px-4 py-2 hover:bg-[#A3CFF0] hover:text-black cursor-pointer">Logout</a>
              </div>
        )}
      </nav>
    </header>
  );
};

export default Header;