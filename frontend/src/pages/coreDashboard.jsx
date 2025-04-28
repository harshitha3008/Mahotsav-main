import React, { useEffect, useState } from 'react';
import { Plus, Eye, Edit, Trash, LogOut } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [adminId, setAdminId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAdminId(decoded.adminId);
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };
  
  const handleAddEvent = () => {
    navigate('/add-event');
  };
  
  const handleViewEvents = () => {
    navigate('/view-events');
  };
  
  const handleModifyEvent = () => {
    navigate('/modify-events');
  };

  const handleDeleteEvent = () => {
    navigate('/delete-events');
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-bold text-[#A3CFF0]">
              Welcome to the Dashboard
            </h1>
            {adminId && (
              <p className="text-2xl mt-3 text-[#A3CFF0]/80 font-medium">
                {adminId.charAt(0).toUpperCase() + adminId.slice(1)} Administrator
              </p>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 px-6 py-3 bg-[#1a1a1a] border-2 border-[#A3CFF0] rounded-xl text-[#A3CFF0] hover:bg-[#A3CFF0] hover:text-[#1a1a1a] transition-all duration-300"
          >
            <LogOut size={22} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <button 
            onClick={handleAddEvent}
            className="group bg-[#1a1a1a] border-2 border-[#A3CFF0] rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(163,207,240,0.3)]"
          >
            <div className="flex items-center gap-6">
              <div className="p-4 bg-[#A3CFF0]/10 rounded-xl group-hover:bg-[#A3CFF0] transition-colors duration-300">
                <Plus className="w-8 h-8 text-[#A3CFF0] group-hover:text-[#1a1a1a] transition-colors duration-300" />
              </div>
              <div className="text-left">
                <h3 className="text-[#A3CFF0] text-2xl font-bold mb-2">Add Event</h3>
                <p className="text-[#A3CFF0]/60 group-hover:text-[#A3CFF0]/80 transition-colors duration-300">
                  Create a new event with details
                </p>
              </div>
            </div>
          </button>

          <button 
          onClick={handleViewEvents}
           className="group bg-[#1a1a1a] border-2 border-[#A3CFF0] rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(163,207,240,0.3)]">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-[#A3CFF0]/10 rounded-xl group-hover:bg-[#A3CFF0] transition-colors duration-300">
                <Eye className="w-8 h-8 text-[#A3CFF0] group-hover:text-[#1a1a1a] transition-colors duration-300" />
              </div>
              <div className="text-left">
                <h3 className="text-[#A3CFF0] text-2xl font-bold mb-2">View Events</h3>
                <p className="text-[#A3CFF0]/60 group-hover:text-[#A3CFF0]/80 transition-colors duration-300">
                  Browse all existing events
                </p>
              </div>
            </div>
          </button>

          <button 
          onClick={handleModifyEvent}
          className="group bg-[#1a1a1a] border-2 border-[#A3CFF0] rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(163,207,240,0.3)]">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-[#A3CFF0]/10 rounded-xl group-hover:bg-[#A3CFF0] transition-colors duration-300">
              <Edit className="w-8 h-8 text-[#A3CFF0] group-hover:text-[#1a1a1a] transition-colors duration-300" />
            </div>
            <div className="text-left">
              <h3 className="text-[#A3CFF0] text-2xl font-bold mb-2">Edit Event</h3>
              <p className="text-[#A3CFF0]/60 group-hover:text-[#A3CFF0]/80 transition-colors duration-300">
                Modify existing events
              </p>
            </div>
          </div>
        </button>

          <button
          onClick={handleDeleteEvent}
           className="group bg-[#1a1a1a] border-2 border-[#A3CFF0] rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(163,207,240,0.3)]">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-[#A3CFF0]/10 rounded-xl group-hover:bg-[#A3CFF0] transition-colors duration-300">
                <Trash className="w-8 h-8 text-[#A3CFF0] group-hover:text-[#1a1a1a] transition-colors duration-300" />
              </div>
              <div className="text-left">
                <h3 className="text-[#A3CFF0] text-2xl font-bold mb-2">Delete Event</h3>
                <p className="text-[#A3CFF0]/60 group-hover:text-[#A3CFF0]/80 transition-colors duration-300">
                  Remove unwanted events
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;