import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LeadDashboard = () => {
  const [leadInfo, setLeadInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [pageLoading, setPageLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get admin info from localStorage
    const adminInfoString = localStorage.getItem("adminInfo");
    if (!adminInfoString) {
      navigate("/");
      return;
    }

    try {
      const adminInfo = JSON.parse(adminInfoString);
      // Verify this is a lead admin
      if (adminInfo.role !== "lead") {
        navigate("/");
        return;
      }
      setLeadInfo(adminInfo);

      // Fetch registrations data once we have lead info
      fetchRegistrationsData(adminInfo.adminId);
    } catch (error) {
      console.error("Error parsing admin info:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchRegistrationsData = async (leadId) => {
    try {
      setPageLoading(true);
      // Lowercase the adminId for case-insensitive comparison
      const leadIdLower = leadId.toLowerCase();
      
      const response = await fetch("http://localhost:10000/api/registration", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch registrations");
      }
  
      const data = await response.json();
      
      // Check if data is the expected structure with registrations property
      const registrationsArray = data.registrations || data;
      
      if (!Array.isArray(registrationsArray)) {
        throw new Error("Unexpected API response format");
      }
      
      // Filter registrations that belong to this lead
      const leadRegistrations = registrationsArray.filter(reg => {
        if (!reg.registrationId) return false;
        
        const parts = reg.registrationId.split(" - ");
        if (parts.length !== 2) return false;
        
        const eventName = parts[1].toLowerCase();
        return eventName === leadIdLower;
      });
      
      setRegistrations(leadRegistrations);
      setTotalRegistrations(leadRegistrations.length);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminInfo");
    localStorage.removeItem("token");
    navigate("/");
  };

  const downloadCSV = () => {
    if (registrations.length === 0) {
      alert("No registrations to export");
      return;
    }
    
    // Create CSV header row
    const headers = ["Registration ID", "User ID", "Name", "Phone", "Registered On"];
    
    // Create CSV content rows
    const csvRows = registrations.map(registration => {
      // Extract userDetails safely
      const userDetails = registration.userDetails || {};
      const userId = userDetails.userId || "N/A";
      const name = userDetails.name || "N/A";
      const phone = userDetails.phone || "N/A";
      
      const registeredDate = registration.createdAt 
        ? new Date(registration.createdAt).toLocaleDateString() 
        : "N/A";
      
      return [
        registration.registrationId || "N/A",
        userId,
        name,
        phone,
        registeredDate
      ].join(",");
    });
    
    // Combine header and rows
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${leadInfo.adminId}_registrations.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="bg-gray-800 py-4 px-6 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-[#A3CFF0]">Lead Dashboard</h1>
          <span className="ml-4 bg-[#A3CFF0] text-[#1a1a1a] text-xs px-2 py-1 rounded-full">
            Lead
          </span>
        </div>
        <div className="flex items-center">
          <span className="mr-4 text-gray-300">Welcome, {leadInfo?.adminId}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-[#A3CFF0]">Lead Dashboard Overview</h2>
          <p className="text-gray-300 mb-4">
            Welcome to your lead dashboard. Here you can manage registrations for your events.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {/* Stats Card 1 */}
            <div className="bg-gray-700 rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-medium mb-2 text-[#A3CFF0]">Total Registrations</h3>
              <p className="text-3xl font-bold">{totalRegistrations}</p>
              <p className="text-gray-400 text-sm mt-2">Registered participants</p>
            </div>
            
            {/* Stats Card 2 */}
            <div className="bg-gray-700 rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-medium mb-2 text-[#A3CFF0]">Event Name</h3>
              <p className="text-3xl font-bold">{leadInfo?.adminId}</p>
              <p className="text-gray-400 text-sm mt-2">Your assigned event</p>
            </div>
            
            {/* Stats Card 3 */}
            <div className="bg-gray-700 rounded-lg p-4 shadow-md">
              <h3 className="text-lg font-medium mb-2 text-[#A3CFF0]">Status</h3>
              <p className="text-3xl font-bold text-green-500">Active</p>
              <p className="text-gray-400 text-sm mt-2">Event registration status</p>
            </div>
          </div>
        </div>
        
        {/* Export Button */}
        
        {/* Registrations Table */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#A3CFF0]">Registered Participants</h2>
          
          {pageLoading ? (
            <div className="flex justify-center p-8">
              <p>Loading registrations...</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <p>No registrations found for your event.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="py-3 px-4 text-left text-[#A3CFF0]">Registration ID</th>
                    <th className="py-3 px-4 text-left text-[#A3CFF0]">User ID</th>
                    <th className="py-3 px-4 text-left text-[#A3CFF0]">Name</th>
                    <th className="py-3 px-4 text-left text-[#A3CFF0]">Phone</th>
                    <th className="py-3 px-4 text-left text-[#A3CFF0]">Registered On</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration, index) => {
                    // Extract userDetails safely
                    const userDetails = registration.userDetails || {};
                    return (
                      <tr key={index} className={index % 2 === 0 ? "bg-gray-700" : "bg-gray-750"}>
                        <td className="py-3 px-4 border-t border-gray-600">{registration.registrationId}</td>
                        <td className="py-3 px-4 border-t border-gray-600">{userDetails.userId || "N/A"}</td>
                        <td className="py-3 px-4 border-t border-gray-600">{userDetails.name || "N/A"}</td>
                        <td className="py-3 px-4 border-t border-gray-600">{userDetails.phone || "N/A"}</td>
                        <td className="py-3 px-4 border-t border-gray-600">
                          {registration.createdAt 
                            ? new Date(registration.createdAt).toLocaleDateString() 
                            : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-[#A3CFF0]">Actions</h2>
          <button 
            onClick={downloadCSV}
            className="bg-[#A3CFF0] hover:bg-blue-400 text-[#1a1a1a] font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center w-full md:w-auto"
          >
            <span>Download Registrations (CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadDashboard;