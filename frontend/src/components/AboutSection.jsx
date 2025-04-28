import React from "react";
import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section className="bg-[#1a1a1a] py-16 px-6 text-center text-white">
      {/* Main Heading */}
      <motion.h2
        className="text-4xl font-bold text-[#A3CFF0]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        Mahotsav Event
      </motion.h2>

      {/* Subtext */}
      <motion.p
        className="text-lg text-[#A3CFF0] mt-2"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        A Complete Vignan Mahotsav Event Management System! <br />
        This system helps you manage events efficiently. Explore our features!
      </motion.p>

      {/* Content Box */}
      <motion.div
        className="mt-6 bg-[#1a1a1a] p-6 rounded-lg text-left max-w-3xl mx-auto 
                  border-2 border-[#A3CFF0] shadow-[0_0_15px_#A3CFF0] transition-shadow duration-500 ease-in-out"
        initial={{ opacity: 0, y: 50, boxShadow: "0px 0px 0px #A3CFF0" }}
        whileInView={{ opacity: 1, y: 0, boxShadow: "0px 0px 20px #A3CFF0" }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {/* Sections */}
        {[
          {
            title: "Explore the Diverse Events at Vignan Mahotsav",
            content:
              "Welcome to Vignan Mahotsav! Our event management system brings together a diverse array of events, ensuring seamless coordination and an enriching experience for everyone involved. From technical innovations to cultural extravaganzas, there's something for everyone!",
          },
          {
            title: "Purpose",
            content:
              "Mahotsav is all about helping students come together and work as a team. It’s a chance to try new things and join in on various events. Whether you love sports, technology, or the arts, there’s something here for you!",
          },
          {
            title: "Who Can Participate?",
            content:
              "Mahotsav is open to all students who are registered for the event. We invite everyone to join in, no matter your background or experience.",
          },
          {
            title: "Event Categories",
            content: (
              <ul className="list-disc ml-6">
                <li>
                  🏆 <b>Sports and Games:</b> Compete in exciting matches that
                  test your skills and teamwork.
                </li>
                <li>
                  💡 <b>Technical Events:</b> Take part in workshops and
                  contests that challenge your creativity and problem-solving
                  abilities.
                </li>
              </ul>
            ),
          },
          {
            title: "Join Us",
            content:
              "Be a part of Mahotsav and create memories that will last forever. Whether you’re taking part in the events or cheering for your friends, your presence will make this celebration even better!",
          },
        ].map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.6 + index * 0.2,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-[#A3CFF0] mt-6">
              {section.title}
            </h3>
            <p className="text-white mt-3">{section.content}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default AboutSection;
