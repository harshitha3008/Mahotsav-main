import React, { useState } from "react";
import Countdown from "react-countdown";
import { motion } from "framer-motion";
import heroImage from "../assets/Hero-image.jpg";

const HeroSection = () => {
  const targetDate = new Date("2026-02-06T00:00:00").getTime();

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative h-screen bg-black flex flex-col items-center text-white"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative w-full h-full flex flex-col items-center justify-center text-center">
          {/* Motion Heading */}
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-5xl font-extrabold tracking-wide"
          >
            6-8 Feb 2026
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-6xl font-extrabold mt-3"
          >
            Vignan Mahotsav
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="text-2xl font-semibold mt-3 text-gray-300"
          >
            Let's Show Our Creativity
          </motion.p>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            className="mt-8 p-5 bg-gray-800 text-white rounded-lg shadow-2xl flex space-x-6 border-2 border-gray-600"
          >
            <Countdown
              date={targetDate}
              renderer={({ days, hours, minutes, seconds }) => (
                <>
                  <FlipUnit value={days} label="Days" />
                  <FlipUnit value={hours} label="Hours" />
                  <FlipUnit value={minutes} label="Minutes" />
                  <FlipUnit value={seconds} label="Seconds" />
                </>
              )}
            />
          </motion.div>
        </div>

        {/* Wave Transition Effect */}
        <div className="absolute bottom-[-2px] left-0 w-full overflow-hidden">
          <svg
            className="w-full h-[120px]"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              fill="#1a1a1a"
              d="M0,256 C120,200 280,150 400,180 C520,210 680,310 800,280 C920,250 1080,120 1200,140 C1320,160 1440,250 1440,250 L1440,320 L0,320 Z"
            ></path>
          </svg>
        </div>
      </section>
    </>
  );
};

// Countdown Flip Effect
const FlipUnit = ({ value, label }) => {
  return (
    <motion.div
      className="text-center"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
    >
      <div className="relative w-16 h-20 text-4xl font-extrabold flex items-center justify-center bg-gray-900 text-white rounded-md shadow-lg border border-gray-600">
        {value}
      </div>
      <p className="text-sm mt-1 text-gray-400">{label}</p>
    </motion.div>
  );
};

export default HeroSection;
