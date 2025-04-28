import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, Trash2, Calendar, User, Phone, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const UserRegistrationsComponent = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "confirmed", "cancelled"

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      
      if (!userInfo || !userInfo.token) {
        setError("You need to be logged in to view registrations");
        setLoading(false);
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const { data } = await axios.get("/api/registrations", config);
      setRegistrations(data);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : "Failed to fetch your registrations"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRegistration = async (id) => {
    if (window.confirm("Are you sure you want to remove this registration? This cannot be undone.")) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        
        // Use DELETE request to completely remove the registration
        await axios.delete(`/api/registrations/${id}`, config);
        
        // Remove from local state
        setRegistrations(registrations.filter(reg => reg._id !== id));
        
        // If currently viewing the registration that was removed, go back to list
        if (selectedRegistration && selectedRegistration._id === id) {
          setSelectedRegistration(null);
        }
      } catch (err) {
        alert(
          err.response && err.response.data.message
            ? err.response.data.message
            : "Failed to remove registration"
        );
      }
    }
  };

  const handleViewRegistration = (registration) => {
    setSelectedRegistration(registration);
  };

  const handleBack = () => {
    setSelectedRegistration(null);
  };

  // Filter registrations based on status
  const filteredRegistrations = filterStatus === "all" 
    ? registrations 
    : registrations.filter(reg => reg.status === filterStatus);

  // Render detailed view of a registration
  const renderRegistrationDetail = () => {
    if (!selectedRegistration) return null;
    
    const reg = selectedRegistration;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-theme-card bg-opacity-70 text-theme-primary w-full"
      >
        <button
          onClick={handleBack}
          className="text-theme-secondary hover:underline text-sm mb-6 flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          Back to Registrations
        </button>
        
        <div className="bg-theme-card border-2 border-theme rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-theme-secondary">
              Registration Details
            </h2>
            <div className="text-lg font-semibold px-3 py-1 rounded-full"
                 style={{
                   backgroundColor: reg.status === 'confirmed' ? 'rgba(0, 200, 83, 0.2)' : 
                                    reg.status === 'cancelled' ? 'rgba(244, 67, 54, 0.2)' : 
                                    'rgba(255, 193, 7, 0.2)',
                   color: reg.status === 'confirmed' ? '#00c853' : 
                          reg.status === 'cancelled' ? '#f44336' : 
                          '#ffc107'
                 }}
            >
              {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
            </div>
          </div>
          
          <div className="bg-theme-primary bg-opacity-10 border border-theme rounded-lg p-4 mb-6">
            <h3 className="text-xl font-semibold text-theme-secondary mb-2">
              Registration ID
            </h3>
            <p className="text-2xl font-mono font-bold text-theme-secondary">
              {reg.registrationId}
            </p>
            <p className="text-sm text-theme-primary opacity-70 mt-1 flex items-center gap-1">
              <Calendar size={14} />
              Registered on {new Date(reg.createdAt).toLocaleDateString()} at {new Date(reg.createdAt).toLocaleTimeString()}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Information */}
            <div className="bg-theme-primary bg-opacity-10 border border-theme rounded-lg p-4">
              <h3 className="text-xl font-semibold text-theme-secondary mb-4">
                Event Information
              </h3>
              
              <div className="mb-4">
                <h4 className="text-sm text-theme-primary opacity-70">Event Name</h4>
                <p className="text-lg text-theme-secondary">{reg.eventDetails.eventName}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm text-theme-primary opacity-70">Category</h4>
                <p className="text-lg text-theme-secondary">{reg.eventDetails.eventCategory}</p>
              </div>
              
              {reg.eventDetails.subCategory && reg.eventDetails.subCategory !== 'no category' && (
                <div>
                  <h4 className="text-sm text-theme-primary opacity-70">Sub-Category</h4>
                  <p className="text-lg text-theme-secondary">{reg.eventDetails.subCategory}</p>
                </div>
              )}
            </div>
            
            {/* User Information */}
            <div className="bg-theme-primary bg-opacity-10 border border-theme rounded-lg p-4">
              <h3 className="text-xl font-semibold text-theme-secondary mb-4">
                Participant Information
              </h3>
              
              <div className="mb-4">
                <h4 className="text-sm text-theme-primary opacity-70">Name</h4>
                <p className="text-lg text-theme-secondary flex items-center gap-1">
                  <User size={16} />
                  {reg.userDetails.name}
                </p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm text-theme-primary opacity-70">MHID</h4>
                <p className="text-lg text-theme-secondary">{reg.userDetails.userId}</p>
              </div>
              
              <div>
                <h4 className="text-sm text-theme-primary opacity-70">Phone</h4>
                <p className="text-lg text-theme-secondary flex items-center gap-1">
                  <Phone size={16} />
                  {reg.userDetails.phone}
                </p>
              </div>
            </div>
          </div>
          
          {/* Add navigation to event details if available */}
          <div className="mt-6 flex justify-between">
            <Link 
              to="/events"
              className="text-theme-secondary hover:underline flex items-center gap-1"
            >
              View all events
            </Link>
            
            {/* Remove Registration Button */}
            <button
              onClick={() => handleRemoveRegistration(reg._id)}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Trash2 size={16} />
              Remove Participation
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Render list of registrations
  const renderRegistrationsList = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-secondary"></div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-red-500 text-white p-4 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      );
    }
    
    if (registrations.length === 0) {
      return (
        <div className="text-center text-theme-primary py-10">
          <p className="text-xl mb-4">You haven't registered for any events yet.</p>
          <Link to="/events" className="button-theme py-2 px-4 rounded-lg inline-block">
            Explore events now
          </Link>
        </div>
      );
    }

    // When filtered results are empty
    if (filteredRegistrations.length === 0) {
      return (
        <div className="text-center text-theme-primary py-10">
          <p className="text-xl">No {filterStatus} registrations found.</p>
          <button 
            onClick={() => setFilterStatus("all")}
            className="text-theme-secondary hover:underline mt-2 inline-block"
          >
            Show all registrations
          </button>
        </div>
      );
    }
    
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRegistrations.map((reg) => (
            <motion.div
              key={reg._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-theme-card bg-opacity-70 border-2 border-theme rounded-lg p-4 relative"
            >
              
              {/* Registration ID */}
              <div className="mb-3">
                <h3 className="text-sm text-theme-primary opacity-70">Registration ID</h3>
                <p className="text-lg font-mono font-bold text-theme-secondary">{reg.registrationId}</p>
              </div>
              
              {/* Event Name */}
              <div className="mb-3">
                <h3 className="text-sm text-theme-primary opacity-70">Event</h3>
                <p className="text-xl font-bold text-theme-secondary">{reg.eventDetails.eventName}</p>
              </div>
              
              {/* Category */}
              <div className="mb-3">
                <h3 className="text-sm text-theme-primary opacity-70">Category</h3>
                <p className="text-theme-secondary">
                  {reg.eventDetails.eventCategory}
                  {reg.eventDetails.subCategory && reg.eventDetails.subCategory !== 'no category' && 
                    ` - ${reg.eventDetails.subCategory}`}
                </p>
              </div>
              
              {/* Registration Date */}
              <div className="mb-4">
                <h3 className="text-sm text-theme-primary opacity-70">Registered On</h3>
                <p className="text-theme-secondary flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(reg.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={() => handleViewRegistration(reg)}
                  className="button-theme py-2 px-3 rounded-lg flex items-center gap-1"
                >
                  <Eye size={16} />
                  View Details
                </button>
                
                <button
                  onClick={() => handleRemoveRegistration(reg._id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-[500px]">
      <h2 className="text-2xl font-bold text-theme-secondary mb-6">
        {selectedRegistration ? "Registration Details" : "My Event Registrations"}
      </h2>
      
      {selectedRegistration ? renderRegistrationDetail() : renderRegistrationsList()}
    </div>
  );
};

export default UserRegistrationsComponent;