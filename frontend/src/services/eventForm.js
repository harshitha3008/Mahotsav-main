// Import the authUtils functions
import { getAdminDepartment } from '../utils/authUtils';

// Event categories and their sub-events
const eventData = {
  cultural: [
    { title: "Music", img: "../music.jpg" },
    { title: "Dance", img: "../dance.jpg" },
    { title: "Dramatics", img: "../dramatics.jpeg" },
    { title: "Literary", img: "../literary.jpeg" },
    { title: "Fine Arts", img: "../fineart.jpeg" },
    { title: "Fashion & Spotlight", img: "../fashion&spotlight.jpeg" },
  ],
  sports: [
    { title: "Team Events", img: "../team-events.jpeg" },
    { title: "Individual Events", img: "../individual-events.jpeg" },
    { title: "Para Sports", img: "../para-sports.jpeg" },
    { title: "Track & Field", img: "../track-field.jpg" },
  ]
};

// Get event categories based on admin role
export const getEventCategories = () => {
  // Use the utility function to get department
  let department = getAdminDepartment();
  
  if (!department) {
    // Fallback: try to get directly from localStorage if utility function fails
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
    department = adminInfo.adminId?.toLowerCase();
  }
  
  if (!department) return [];

  // Handle "culturals" case (with 's' at the end)
  if (department === 'culturals') {
    return eventData.cultural.map(event => event.title);
  }
  
  // Handle "sports" case
  if (department === 'sports') {
    return eventData.sports.map(event => event.title);
  }
  
  return [];
};

// Get sub-events for a category
export const getSubEvents = (category) => {
  const lowerCategory = category.toLowerCase();
  
  // Handle "culturals" mapping to "cultural" in eventData
  if (lowerCategory === 'culturals') {
    return eventData.cultural || [];
  }
  
  return eventData[lowerCategory] || [];
};