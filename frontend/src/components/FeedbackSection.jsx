import React, { useState } from "react";

const FeedbackSection = () => {
  const [reviews, setReviews] = useState([
    { id: 1, name: "Anjali S.", text: "The Vignan Mahotsav was an incredible experience! The organization was flawless!" },
    { id: 2, name: "Rahul K.", text: "I loved every moment of the event. The activities were engaging and fun!" },
    { id: 3, name: "Priya M.", text: "Great platform to showcase creativity and innovation. Highly recommend!" }
  ]);

  const [newReview, setNewReview] = useState("");
  const [newName, setNewName] = useState("");

  const handleSubmit = () => {
    if (newReview.trim() && newName.trim()) {
      const newFeedback = {
        id: reviews.length + 1,
        name: newName,
        text: newReview,
      };
      setReviews([...reviews, newFeedback]);
      setNewReview("");
      setNewName("");
    }
  };

  return (
    <div className="bg-[#1a1a1a] text-white py-10 px-6 md:px-16 text-center">
      <h2 className="text-3xl font-bold mb-6 text-[#A3CFF0]">What People Say</h2>

      <div className="flex flex-wrap justify-center gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-[#1a1a1a] text-white shadow-md p-5 rounded-lg w-80 border border-[#A3CFF0]">
            <p className="italic text-gray-300">"{review.text}"</p>
            <p className="font-semibold mt-2 text-[#A3CFF0]">- {review.name}</p>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-semibold mt-10 text-[#A3CFF0]">Share Your Experience</h3>
      <div className="flex flex-col items-center mt-4">
        <textarea
          className="bg-[#1a1a1a] border border-[#A3CFF0] text-white p-3 w-full max-w-lg rounded-md focus:ring-2 focus:ring-[#A3CFF0]"
          placeholder="Write your feedback..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          rows="4"
        ></textarea>

        <input
          className="bg-[#1a1a1a] border border-[#A3CFF0] text-white p-3 w-full max-w-lg rounded-md mt-3 focus:ring-2 focus:ring-[#A3CFF0]"
          placeholder="Your Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />

        <button
          className="bg-[#A3CFF0] text-black px-6 py-2 mt-4 rounded-md font-bold hover:bg-[#A3CFF0]/80 transition"
          onClick={handleSubmit}
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackSection;