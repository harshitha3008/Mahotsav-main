import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import axios from "axios";
// Import the event data from eventForm.js
import { getSubEvents } from "../services/eventForm";
// Import our new RegistrationForm component
import RegistrationForm from "./RegistrationForm";
import UserRegistrationsComponent from "./UserRegistrationsComponent";

const UserEventsComponent = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [eventDetails, setEventDetails] = useState([]);
  const [selectedEventDetail, setSelectedEventDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);
  const [showRegistrations, setShowRegistrations] = useState(false);

  // Main event categories
  const events = [
    { title: "cultural", img: "../non-technical.jpeg" },
    { title: "Sports", img: "../sports.jpeg" },
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

  // Function to handle event registration
  const handleRegister = () => {
    setShowRegistrationForm(true);
  };

  // Handle registration success
  const handleRegistrationSuccess = (regId) => {
    setRegistrationId(regId);
    setRegistrationSuccess(true);
    setShowRegistrationForm(false);
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setRegistrationSuccess(false);
      setRegistrationId(null);
    }, 5000);
  };

  // Function to render event detail view
  const renderEventDetailView = () => {
    if (!selectedEventDetail) return null;
    
    const event = selectedEventDetail;
    
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
          Back to {selectedSubCategory}
        </button>

        {/* <button 
          onClick={() => setShowRegistrations(true)}
          className="button-theme py-2 px-4 rounded-lg flex items-center gap-2 mb-4"
        >
          <Calendar size={16} />
          View My Registrations
        </button> */}
        
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Event Image - Left Column */}
          <div className="w-full lg:w-1/4">
            <div className="h-64 md:h-80 rounded-lg overflow-hidden border-2 border-theme">
              <img 
                src={event.imageUrl} 
                alt={event.eventName} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "../placeholder.jpg";
                }}
              />
            </div>
          </div>
          
          {/* Event Rules - Middle Column */}
          <div className="w-full lg:w-2/4">
            <h2 className="text-3xl font-bold text-theme-secondary mb-4">{event.eventName}</h2>
            
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-theme-secondary">Category</h3>
              <p className="text-theme-primary">
                {event.eventCategory} 
                {event.participantCategory !== 'no category' && ` - ${event.participantCategory}`}
              </p>
            </div>
              
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-theme-secondary">Rules</h3>
              <div className="h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-gray-800">
                <p className="text-theme-primary">{event.rules}</p>
                
                {/* Prizes Section - Inside scrollable area */}
                <div className="mt-4">
                  <h4 className="text-lg font-medium text-theme-secondary">Prizes</h4>
                  
                  {event.participantCategory === 'no category' && event.prizes?.['no category'] && (
                    <div className="mb-2">
                      <ul className="text-theme-primary">
                        {event.prizes['no category'].map((prize, index) => (
                          <li key={index}>{prize.name}: ₹{prize.amount}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {event.prizes?.men && event.participantCategory !== 'no category' && (
                    <div className="mb-2">
                      <h5 className="text-base font-medium text-theme-secondary">Men's Category</h5>
                      <ul className="text-theme-primary">
                        {event.prizes.men.map((prize, index) => (
                          <li key={index}>{prize.name}: ₹{prize.amount}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {event.prizes?.women && event.participantCategory !== 'no category' && (
                    <div>
                      <h5 className="text-base font-medium text-theme-secondary">Women's Category</h5>
                      <ul className="text-theme-primary">
                        {event.prizes.women.map((prize, index) => (
                          <li key={index}>{prize.name}: ₹{prize.amount}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Fallback for old format */}
                  {!event.prizes?.men && !event.prizes?.women && !event.prizes?.['no category'] && event.prize && (
                    <ul className="text-theme-primary">
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
              <h3 className="text-xl font-semibold text-theme-secondary">Contact</h3>
              <ul className="text-theme-primary">
                {event.contactPersons && event.contactPersons.map((contact, index) => (
                  <li key={index} className="mb-1">{contact.name}: {contact.phone}</li>
                ))}
              </ul>
            </div>
            
            {/* Register Button */}
            {registrationSuccess ? (
              <div className="bg-green-600 text-white py-3 px-6 rounded-lg font-bold text-center">
                <p>Registration Successful!</p>
                {registrationId && <p className="mt-1">Generated Event ID: {registrationId}</p>}
              </div>
            ) : (
              <button 
                className="w-full button-theme py-3 px-6 rounded-lg font-bold"
                onClick={handleRegister}
              >
                Register Now
              </button>
            )}
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
          className="text-theme-secondary hover:underline text-sm mb-6 flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          Back to {selectedEvent} Events
        </button>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-theme-secondary"></div>
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
                  boxShadow: "0px 0px 10px rgba(var(--theme-secondary-rgb), 0.5)",
                }}
                className="relative bg-theme-card bg-opacity-70 border-2 border-theme rounded-2xl p-4 w-56 h-64 overflow-hidden transition-all duration-300 cursor-pointer"
                onClick={() => handleEventDetailClick(event)}
              >
                {/* Image Box */}
                <motion.div
                  className="relative h-40 rounded-lg overflow-hidden flex items-center justify-center bg-theme-primary"
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
                  <h2 className="text-lg font-bold text-theme-secondary">{event.eventName}</h2>
                  {event.participantCategory !== 'no category' && (
                    <p className="text-xs text-theme-primary">{event.participantCategory}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-theme-primary py-10">
            No events found for this category.
          </div>
        )}
      </>
    );
  };

  // Function to get sub-events from eventForm.js based on selected category
  const getSubEventsByCategory = (category) => {
    if (category === "cultural" || category === "Sports") {
      return getSubEvents(category.toLowerCase());
    }
    return [];
  };

  return (
    <div className="min-h-[500px]">
      {/* Registration Form Modal */}
      {showRegistrationForm && selectedEventDetail && (
        <RegistrationForm 
          event={selectedEventDetail}
          onClose={() => setShowRegistrationForm(false)}
          onSuccess={handleRegistrationSuccess}
        />
      )}
      
      {showRegistrations ? (
        <div>
          <button
            onClick={() => setShowRegistrations(false)}
            className="text-theme-secondary hover:underline text-sm mb-6 flex items-center gap-1"
          >
            <ArrowLeft size={16} />
            Back to Events
          </button>
          <UserRegistrationsComponent />
        </div>
      ) : (
        <>
          {/* Heading */}
          <h2 className="text-2xl font-bold text-theme-secondary mb-6">
            {selectedEventDetail ? selectedEventDetail.eventName :
              selectedSubCategory ? selectedSubCategory :
              selectedEvent === "Sports" ? "Sports Events" :
              selectedEvent === "cultural" ? "Cultural Events" :
              "Explore Our Events"}
          </h2>

          {/* Content based on navigation state */}
          {selectedEventDetail ? (
            renderEventDetailView()
          ) : selectedSubCategory ? (
            renderEventCards()
          ) : selectedEvent ? (
            <>
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="text-theme-secondary hover:underline text-sm mb-6 flex items-center gap-1"
              >
                <ArrowLeft size={16} />
                Back to Events
              </button>

              {/* Sub-Event Cards */}
              <div className="flex flex-wrap justify-center gap-6">
                {getSubEventsByCategory(selectedEvent).map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0px 0px 10px rgba(var(--theme-secondary-rgb), 0.5)",
                    }}
                    className="relative bg-theme-card bg-opacity-70 border-2 border-theme rounded-2xl p-4 w-56 h-64 overflow-hidden transition-all duration-300 cursor-pointer"
                    onClick={() => handleSubCategoryClick(event.title)}
                  >
                    {/* Image Box */}
                    <motion.div
                      className="relative h-40 rounded-lg overflow-hidden flex items-center justify-center bg-theme-primary"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.img
                        src={event.img}
                        alt={event.title}
                        className="h-full w-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "../placeholder.jpg";
                        }}
                      />
                    </motion.div>

                    {/* Event Title */}
                    <h2 className="mt-3 text-center text-lg font-bold text-theme-secondary">
                      {event.title}
                    </h2>
                  </motion.div>
                ))}
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
                  transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 0px 10px rgba(var(--theme-secondary-rgb), 0.5)",
                  }}
                  className="relative bg-theme-card bg-opacity-70 border-2 border-theme 
                            rounded-2xl p-4 w-56 h-64 overflow-hidden 
                            transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedEvent(event.title)}
                >
                  {/* Image Box */}
                  <motion.div
                    className="relative h-40 rounded-lg overflow-hidden flex items-center justify-center bg-theme-primary"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.img
                      src={event.img}
                      alt={event.title}
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "../placeholder.jpg";
                      }}
                    />
                  </motion.div>

                  {/* Event Title */}
                  <h2 className="mt-3 text-center text-lg font-bold text-theme-secondary">
                    {event.title}
                  </h2>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserEventsComponent;