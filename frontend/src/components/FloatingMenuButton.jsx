import React, { useState } from "react";
import { Calendar, Clock, Landmark, MapPin, X } from "lucide-react";
import { motion } from "framer-motion";

const MapPopup = ({ onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative bg-[#1a1a1a] border border-[#A3CFF0] rounded-lg shadow-lg p-6 max-w-4/5 max-h-4/5"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 bg-[#A3CFF0] p-1 rounded-full hover:bg-[#8AB6E8] transition-colors z-10"
        >
          <X size={24} color="black" />
        </button>

        <h1 className="text-xl font-bold text-[#A3CFF0] mb-4 text-center">
          Venue Map
        </h1>

        <motion.div
          className="p-1 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.img 
            src="/map.jpg" 
            alt="Venue Map" 
            className="w-[600px] h-auto object-contain"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const menuItems = [
  { id: 1, name: "Events", icon: <Calendar size={25} color="black" />, x: -60, y: -60 },
  { id: 2, name: "Schedule", icon: <Clock size={25} color="black" />, x: 60, y: -60 },
  { id: 3, name: "Hospitality", icon: <Landmark size={25} color="black" />, x: -60, y: 60 },
  { id: 4, name: "Map", icon: <MapPin size={25} color="black" />, x: 60, y: 60 },
];

const FloatingMenuButton = ({ onEventClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const handleEventClick = () => {
    if (onEventClick) {
      onEventClick();
    }
    setIsOpen(false);
  };

  const openSchedulePage = () => {
    window.open("/schedule", "_blank");
  };

  const openHospitalityPage = () => {
    window.open("/HospitalityPage", "_blank");
  };

  const openMapPopup = () => {
    setIsOpen(false);
    setIsMapOpen(true);
  };

  const closeMapPopup = () => {
    setIsMapOpen(false);
  };

  return (
    <>
      {isMapOpen && <MapPopup onClose={closeMapPopup} />}

      <div className={`fixed transition-all duration-500 ${
        isOpen ? "bottom-15 right-15" : "bottom-4 right-4"
      } flex flex-col items-center`}>
        <div className="relative">
          {/* Speech Bubble */}
          <div className={`absolute -top-16 left-1/3 transform -translate-x-1/2 
            bg-black text-white border-2 border-[#43A5A3] 
            rounded-lg shadow-lg px-4 py-1 w-28 text-center
            transition-all duration-300 ${
              isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100 animate-bounce"
            }`}>
            <span className="text-sm">Click for more</span>
          </div>

          {menuItems.map((item) => (
            <div 
              key={item.id} 
              className={`absolute transition-all duration-500 ${
                isOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"
              }`}
              style={{ 
                transform: isOpen 
                  ? `translate(${item.x}px, ${item.y}px)` 
                  : "translate(0, 0)",
              }}
              onClick={
                item.name === "Events" 
                  ? handleEventClick 
                  : item.name === "Schedule"
                  ? openSchedulePage 
                  : item.name === "Hospitality" 
                  ? openHospitalityPage 
                  : item.name === "Map"
                  ? openMapPopup
                  : undefined
              }
            >
              <div className="bg-[#A3CFF0] p-2 rounded-full shadow-lg flex justify-center items-center w-12 h-12 
                hover:bg-[#8AB6E8] transition-colors duration-300 cursor-pointer">
                {item.icon}
              </div>
            </div>
          ))}

          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={`bg-[#A3CFF0] p-5 rounded-full shadow-xl hover:bg-[#8AB6E8] 
              transition-colors duration-300 relative z-10 ${
                isOpen ? "" : "animate-bounce"
            }`}
          >
            <div className="w-6 h-1 bg-black mb-1"></div>
            <div className="w-6 h-1 bg-black mb-1"></div>
            <div className="w-6 h-1 bg-black"></div>
          </button>
        </div>
      </div>
    </>
  );
};

export default FloatingMenuButton;