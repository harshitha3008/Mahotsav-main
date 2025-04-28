import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch(`/api/events/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const handleBack = () => {
    navigate('/view-events');
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If it's already a full URL, use it as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Remove any leading slash and "uploads/" to avoid duplication
    const cleanedPath = imageUrl.replace(/^\/+/, '').replace(/^uploads\//, '');
    return `${API_URL}/uploads/${cleanedPath}`;
  };
  

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-[#A3CFF0] text-2xl">Loading event details...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] p-8">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-[#A3CFF0] mb-8 hover:underline"
          >
            <ArrowLeft size={20} />
            <span>Back to Events</span>
          </button>
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Error</h3>
            <p>{error || 'Event not found'}</p>
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
          <span>Back to Events</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Image */}
          <div className="w-full lg:w-1/4">
            <div className="h-64 md:h-80 rounded-lg overflow-hidden border-2 border-[#A3CFF0]">
              {event.imageUrl ? (
                <img 
                src={getImageUrl(event.imageUrl)} 
                alt={event.eventName} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  console.log(getImageUrl(event.imageUrl));
                  e.target.src = `${API_URL}/api/placeholder/400/320`;
                }}
              />              
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-[#303030]">
                  <Calendar size={64} className="text-[#A3CFF0]/50" />
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Event Details */}
          <div className="w-full lg:w-2/4">
            <h2 className="text-3xl font-bold text-[#A3CFF0] mb-4">{event.eventName}</h2>
            
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-[#A3CFF0]">Category</h3>
              <p className="text-gray-300">
                {event.eventCategory} 
                {event.participantCategory && event.participantCategory !== 'no category' && 
                  ` - ${event.participantCategory}`}
              </p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-[#A3CFF0]">Rules</h3>
              <div className="h-48 overflow-y-auto pr-2 bg-[#232323] p-4 rounded-lg scrollbar-thin scrollbar-track-[#303030]">
                <p className="text-gray-300">{event.rules}</p>
                
                {/* Prizes Section */}
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-[#A3CFF0] mb-2">Prizes</h4>
                  
                  {/* New Prize Format */}
                  {event.prizes && (
                    <>
                      {/* No Category Prizes */}
                      {event.participantCategory === 'no category' && 
                        event.prizes['no category'] && (
                        <div className="mb-3">
                          <ul className="text-gray-300">
                            {event.prizes['no category'].map((prize, index) => (
                              <li key={index} className="mb-1">
                                {prize.name}: ₹{prize.amount}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Men's Prizes */}
                      {event.prizes.men && event.participantCategory !== 'no category' && (
                        <div className="mb-3">
                          <h5 className="text-base font-medium text-[#A3CFF0]">Men's Category</h5>
                          <ul className="text-gray-300">
                            {event.prizes.men.map((prize, index) => (
                              <li key={index} className="mb-1">
                                {prize.name}: ₹{prize.amount}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Women's Prizes */}
                      {event.prizes.women && event.participantCategory !== 'no category' && (
                        <div className="mb-3">
                          <h5 className="text-base font-medium text-[#A3CFF0]">Women's Category</h5>
                          <ul className="text-gray-300">
                            {event.prizes.women.map((prize, index) => (
                              <li key={index} className="mb-1">
                                {prize.name}: ₹{prize.amount}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Old Prize Format Fallback */}
                  {(!event.prizes || 
                    (!event.prizes.men && 
                     !event.prizes.women && 
                     !event.prizes['no category'])) && 
                    event.prize && (
                    <ul className="text-gray-300">
                      {event.prize.first && <li className="mb-1">First Prize: ₹{event.prize.first}</li>}
                      {event.prize.second && <li className="mb-1">Second Prize: ₹{event.prize.second}</li>}
                      {event.prize.third && <li className="mb-1">Third Prize: ₹{event.prize.third}</li>}
                    </ul>
                  )}
                  
                  {/* Array Format Fallback */}
                  {Array.isArray(event.prizes) && event.prizes.length > 0 && (
                    <div className="mb-3">
                      <ul className="text-gray-300">
                        {event.prizes.map((prize, index) => (
                          <li key={index} className="mb-1">
                            {prize.position}: {prize.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Contact Info */}
          <div className="w-full lg:w-1/4">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#A3CFF0] mb-3">Contact</h3>
              {event.contactPersons && event.contactPersons.length > 0 ? (
                <ul className="text-gray-300 bg-[#232323] p-4 rounded-lg">
                  {event.contactPersons.map((contact, index) => (
                    <li key={index} className="mb-3 flex items-center">
                      <div className="w-8 h-8 bg-[#A3CFF0]/20 rounded-full flex items-center justify-center mr-2">
                        <span className="text-[#A3CFF0] font-bold">{contact.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="text-[#A3CFF0]">{contact.name}</div>
                        <div className="text-[#A3CFF0]/70">{contact.phone}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#A3CFF0]/70">No contact information available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;