import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import axios from "axios";

export default function EventSection({ onClose }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [eventDetails, setEventDetails] = useState([]);
  const [selectedEventDetail, setSelectedEventDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  // Main event categories
  const events = [
    { title: "cultural", img: "../non-technical.jpeg" },
    { title: "Sports", img: "../sports.jpeg" },
  ];

  // Sports sub-events
  const sportsEvents = [
    { title: "Team Events", img: "../team-events.jpeg" },
    { title: "Individual Events", img: "../individual-events.jpeg" },
    { title: "Para Sports", img: "../para-sports.jpeg" },
    { title: "Track & Field", img: "../track-field.jpg" },
  ];

  // Cultural sub-events
  const culturalEvents = [
    { title: "Music", img: "../music.jpg" },
    { title: "Dance", img: "../dance.jpg" },
    { title: "Dramatics", img: "../dramatics.jpeg" },
    { title: "Literary", img: "../literary.jpeg" },
    { title: "Fine Arts", img: "../fineart.jpeg" },
    { title: "Fashion & Spotlight", img: "../fashion&spotlight.jpeg" },
  ];

  // Fetch event details when subcategory is selected
  useEffect(() => {
    if (selectedSubCategory) {
      fetchEventDetails(selectedSubCategory);
    }
  }, [selectedSubCategory]);

  // Function to fetch event details from the backend
  const fetchEventDetails = async (category) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/events/fetchByCategory?category=${encodeURIComponent(category)}`);
      setEventDetails(response.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
      setEventDetails([]);
    } finally {
      setLoading(false);
    }
  };

  // Go back to main categories
  const handleBack = () => {
    if (selectedEventDetail) {
      setSelectedEventDetail(null);
    } else if (selectedSubCategory) {
      setSelectedSubCategory(null);
    } else {
      setSelectedEvent(null);
    }
  };

  // Handle sub-category click
  const handleSubCategoryClick = (category) => {
    setSelectedSubCategory(category);
  };

  // Handle event detail click
  const handleEventDetailClick = (event) => {
    setSelectedEventDetail(event);
  };
// Function to render event detail view
const renderEventDetailView = () => {
  if (!selectedEventDetail) return null;
  
  const event = selectedEventDetail;
  const imageUrl = event.imageUrl 
  ? (event.imageUrl.startsWith('http') 
      ? event.imageUrl 
      : `/uploads/${event.imageUrl.replace(/^uploads\//, '')}`)
  : "../placeholder.jpg";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-[#1a1a1a] text-white w-full"
    >
      <button
        onClick={handleBack}
        className="text-[#A3CFF0] hover:underline text-sm mb-6 flex items-center gap-1"
      >
        <ArrowLeft size={16} />
        Back to {selectedSubCategory}
      </button>
      
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Event Image - Left Column - Keeping original size */}
        <div className="w-full lg:w-1/4">
          <div className="h-64 md:h-80 rounded-lg overflow-hidden border-2 border-[#A3CFF0]">
            <img 
              src={event.imageUrl} 
              
              alt={event.eventName} 
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "../placeholder.jpg";
              }}
            />
            {/* console.log("Trying to load image:", event.imageUrl); */}
          </div>
        </div>
        
        {/* Event Rules - Middle Column */}
        <div className="w-full lg:w-2/4">
        <h2 className="text-3xl font-bold text-[#A3CFF0] mb-4">{event.eventName}</h2>
        
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-[#A3CFF0]">Category</h3>
          <p className="text-gray-300">
            {event.eventCategory} 
            {event.participantCategory !== 'no category' && ` - ${event.participantCategory}`}
          </p>
        </div>
          
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-[#A3CFF0]">Rules</h3>
            <div className="h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-gray-800">
              <p className="text-gray-300">{event.rules}</p>
              
              {/* Prizes Section - Inside scrollable area */}
              {/* Prizes Section - Inside scrollable area */}
              <div className="mt-4">
                <h4 className="text-lg font-medium text-[#A3CFF0]">Prizes</h4>
                
                {event.participantCategory === 'no category' && event.prizes['no category'] && (
                  <div className="mb-2">
                    <ul className="text-gray-300">
                      {event.prizes['no category'].map((prize, index) => (
                        <li key={index}>{prize.name}: ₹{prize.amount}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {event.prizes?.men && event.participantCategory !== 'no category' && (
                  <div className="mb-2">
                    <h5 className="text-base font-medium text-[#A3CFF0]">Men's Category</h5>
                    <ul className="text-gray-300">
                      {event.prizes.men.map((prize, index) => (
                        <li key={index}>{prize.name}: ₹{prize.amount}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {event.prizes?.women && event.participantCategory !== 'no category' && (
                  <div>
                    <h5 className="text-base font-medium text-[#A3CFF0]">Women's Category</h5>
                    <ul className="text-gray-300">
                      {event.prizes.women.map((prize, index) => (
                        <li key={index}>{prize.name}: ₹{prize.amount}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Fallback for old format */}
                {!event.prizes?.men && !event.prizes?.women && !event.prizes?.['no category'] && event.prize && (
                  <ul className="text-gray-300">
                    {event.prize.first && <li>First Prize: ₹{event.prize.first}</li>}
                    {event.prize.second && <li>Second Prize: ₹{event.prize.second}</li>}
                    {event.prize.third && <li>Third Prize: ₹{event.prize.third}</li>}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Info - Right Column */}
        <div className="w-full lg:w-1/4">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-[#A3CFF0]">Contact</h3>
            <ul className="text-gray-300">
              {event.contactPersons && event.contactPersons.map((contact, index) => (
                <li key={index} className="mb-1">{contact.name}: {contact.phone}</li>
              ))}
            </ul>
          </div>
          
          {/* Register Button */}
          <button 
            className="w-full bg-[#A3CFF0] text-black py-3 px-6 rounded-lg font-bold hover:bg-[#8AB6E8] transition-colors"
            onClick={() => alert('Registration functionality to be implemented')}
          >
            Register Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};


  // Function to render event cards
  const renderEventCards = () => {
    return (
      <>
        <button
          onClick={handleBack}
          className="text-[#A3CFF0] hover:underline text-sm mb-6 flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          Back to {selectedEvent} Events
        </button>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A3CFF0]"></div>
          </div>
        ) : eventDetails.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-6">
            {eventDetails.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 10px #A3CFF0, 0px 0px 20px #A3CFF0",
                }}
                className="relative bg-[#1a1a1a] border-2 border-[#A3CFF0] rounded-2xl p-4 w-56 h-64 overflow-hidden transition-all duration-300 cursor-pointer"
                onClick={() => handleEventDetailClick(event)}
              >
                {/* Image Box */}
                <motion.div
                  className="relative h-40 rounded-lg overflow-hidden flex items-center justify-center bg-gray-800"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.img
                    src={event.imageUrl}
                    alt={event.eventName}
                    className="h-full w-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "../placeholder.jpg";
                    }}
                  />
                </motion.div>

                {/* Event Title & Category */}
                <div className="mt-3 text-center">
                <h2 className="text-lg font-bold text-[#A3CFF0]">{event.eventName}</h2>
                {event.participantCategory !== 'no category' && (
                  <p className="text-xs text-gray-300">{event.participantCategory}</p>
                )}
              </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-10">
            No events found for this category.
          </div>
        )}
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-[#1a1a1a] border-2 border-[#A3CFF0] rounded-2xl p-11 relative max-w-4xl mx-auto"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 bg-[#A3CFF0] p-1 rounded-full hover:bg-[#8AB6E8] transition-colors z-10 cursor-pointer"
      >
        <X size={20} color="black" />
      </button>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-[#A3CFF0] mb-6 text-center">
        {selectedEventDetail ? selectedEventDetail.eventName :
          selectedSubCategory ? selectedSubCategory :
          selectedEvent === "Sports" ? "Sports Events" :
          selectedEvent === "cultural" ? "Cultural Events" :
          "Explore Our Events"}
      </h1>

      {/* Content based on navigation state */}
      {selectedEventDetail ? (
        renderEventDetailView()
      ) : selectedSubCategory ? (
        renderEventCards()
      ) : selectedEvent === "Sports" || selectedEvent === "cultural" ? (
        <>
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="text-[#A3CFF0] hover:underline text-sm mb-6 flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            Back to Events
          </button>

          {/* Sub-Event Cards */}
          <div className="flex flex-wrap justify-center gap-6">
            {(selectedEvent === "Sports" ? sportsEvents : culturalEvents).map(
              (event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 0px 10px #A3CFF0, 0px 0px 20px #A3CFF0",
                  }}
                  className="relative bg-[#1a1a1a] border-2 border-[#A3CFF0] rounded-2xl p-4 w-56 h-64 overflow-hidden transition-all duration-300 cursor-pointer"
                  onClick={() => handleSubCategoryClick(event.title)}
                >
                  {/* Image Box */}
                  <motion.div
                    className="relative h-40 rounded-lg overflow-hidden flex items-center justify-center bg-gray-800"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.img
                      src={event.img}
                      alt={event.title}
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>

                  {/* Event Title */}
                  <h2 className="mt-3 text-center text-lg font-bold text-[#A3CFF0]">
                    {event.title}
                  </h2>
                </motion.div>
              )
            )}
          </div>
        </>
      ) : (
        /* Main Event Cards */
        <div className="flex justify-center space-x-10">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 0px 10px #A3CFF0, 0px 0px 20px #A3CFF0",
              }}
              className="relative bg-[#1a1a1a] border-2 border-[#A3CFF0] 
                        rounded-2xl p-4 w-56 h-64 overflow-hidden 
                        transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedEvent(event.title)}
            >
              {/* Image Box */}
              <motion.div
                className="relative h-40 rounded-lg overflow-hidden flex items-center justify-center bg-gray-800"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img
                  src={event.img}
                  alt={event.title}
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              {/* Event Title */}
              <h2 className="mt-3 text-center text-lg font-bold text-[#A3CFF0]">
                {event.title}
              </h2>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}