import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Users, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchEventsByAdmin } from '../services/eventAPI';

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoading(true);
        const response = await fetchEventsByAdmin();
        
        if (response.success) {
          setEvents(response.events);
          
          // Extract unique categories
          const uniqueCategories = [...new Set(response.events.map(event => event.eventCategory))];
          setCategories(uniqueCategories);
        } else {
          setError('Failed to fetch events');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching events');
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const getEventsByCategory = (category) => {
    return events.filter(event => event.eventCategory === category);
  };

  const EventCard = ({ event }) => (
    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg border border-[#A3CFF0] hover:shadow-xl transition-all duration-300 flex flex-col max-w-xs mx-auto">
      {event.imageUrl ? (
        <div className="h-64 overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={event.eventName} 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-64 bg-[#A3CFF0] flex items-center justify-center">
          <Calendar size={48} className="text-blue-400 opacity-50" />
        </div>
      )}
      <div className="p-4 flex flex-col items-center text-center">
        <h3 className="text-2xl font-bold text-[#A3CFF0] mb-1">{event.eventName}</h3>
        <div className="flex items-center justify-center gap-2 text-gray-400 mb-4">
          <Users size={16} />
          <span>{event.participantCategory}</span>
        </div>
        <button 
          className="px-4 py-2 bg-[#A3CFF0] bg-opacity-30 text-[#1a1a1a] rounded-lg hover:bg-opacity-40 transition-colors duration-300 w-full"
          onClick={() => navigate(`/event-details/${event._id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-[#A3CFF0] text-2xl">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-blue-400 mb-8 hover:underline"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>
          <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-[#A3CFF0] mb-8 hover:underline"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        <h1 className="text-4xl font-bold text-[#A3CFF0] mb-12">My Events</h1>

        {events.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <p className="text-[#A3CFF0] opacity-80 text-xl">You haven't created any events yet.</p>
          </div>
        ) : (
          <>
            {categories.map(category => (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold text-[#A3CFF0] mb-6 border-b border-[#A3CFF0] border-opacity-30 pb-2">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {getEventsByCategory(category).map(event => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewEvents;