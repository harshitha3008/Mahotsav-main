import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const EventGallery = () => {
  const images = [
    "../gallery-img1.jpg",
    "../gallery-img2.jpg",
    "../gallery-img3.jpg",
    "../gallery-img4.jpg",
    "../gallery-img5.jpg",
    "../gallery-img6.jpg",
    "../gallery-img7.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(3); // Start with middle image as focus
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  useEffect(() => {
    let interval;
    if (autoplayEnabled) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 1000); // Slowed down to 3 seconds
    }
    
    return () => clearInterval(interval);
  }, [images.length, autoplayEnabled]);

  const handleNext = () => {
    setAutoplayEnabled(false); // Disable autoplay when manually navigating
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setAutoplayEnabled(false); // Disable autoplay when manually navigating
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleImageClick = (index) => {
    setAutoplayEnabled(false); // Disable autoplay when manually navigating
    setCurrentIndex(index);
  };

  // Updated positioning function with more spread and larger main image
  const getCirclePosition = (index) => {
    const position = (index - currentIndex + images.length) % images.length;
    
    if (position === 0) {
      // Main image (center) - now even larger
      return {
        size: "w-2/3 h-96", // Increased size
        opacity: "opacity-100",
        zIndex: "z-30",
        top: "top-1/2",
        left: "left-1/2",
        transform: "transform -translate-x-1/2 -translate-y-1/2"
      };
    } else if (position === 1 || position === images.length - 1) {
      // Medium images (adjacent to main)
      const direction = position === 1 ? 1 : -1;
      return {
        size: "w-1/3 h-64", // Slightly larger
        opacity: "opacity-75",
        zIndex: "z-20",
        top: "top-1/2",
        left: position === 1 ? "left-3/4" : "left-1/4",
        transform: "transform -translate-x-1/2 -translate-y-1/4"
      };
    } else if (position === 2 || position === images.length - 2) {
      // Small images (edges)
      return {
        size: "w-1/4 h-48", // Slightly larger
        opacity: "opacity-50",
        zIndex: "z-10",
        top: "top-1/2", 
        left: position === 2 ? "left-[90%]" : "left-[10%]",
        transform: "transform -translate-x-1/2 -translate-y-1/2"
      };
    } else {
      // Hidden images
      return {
        size: "w-0 h-0",
        opacity: "opacity-0",
        zIndex: "z-0",
        top: "top-1/2",
        left: "left-1/2",
        transform: "transform -translate-x-1/2 -translate-y-1/2"
      };
    }
  };

  return (
    <section className="bg-[#1a1a1a] py-16 px-6 text-center text-white">
      {/* Heading */}
      <motion.h2
        className="text-4xl font-bold text-[#A3CFF0] mb-12"
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        Event Gallery
      </motion.h2>

      {/* Image Slider Container */}
      <div className="relative mx-auto max-w-6xl h-[500px]"> {/* Increased height */}
        {/* Navigation Arrows */}
        <button 
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Images Display */}
        {images.map((src, index) => {
          const { size, opacity, zIndex, top, left, transform } = getCirclePosition(index);
          return (
            <motion.div
              key={index}
              className={`absolute ${size} ${opacity} ${zIndex} ${top} ${left} ${transform} transition-all duration-500 ease-in-out cursor-pointer`}
              onClick={() => handleImageClick(index)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: opacity === "opacity-0" ? 0 : opacity === "opacity-50" ? 0.5 : opacity === "opacity-75" ? 0.75 : 1,
                scale: 1
              }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={src}
                alt={`Event ${index + 1}`}
                className="h-full w-full object-cover rounded-lg shadow-lg"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center mt-12 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? "bg-[#A3CFF0] w-6" : "bg-gray-500"
            }`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default EventGallery;