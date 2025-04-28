// Helper function to get token from localStorage
// Modified getAuthToken function with more detailed logging
const getAuthToken = () => {
  console.log('Getting auth token...');
  const adminInfoStr = localStorage.getItem('adminInfo');
  console.log('adminInfo from localStorage:', adminInfoStr);
  
  if (!adminInfoStr) {
    console.error('No adminInfo found in localStorage');
    throw new Error('No authentication information found');
  }
  
  try {
    const adminInfo = JSON.parse(adminInfoStr);
    console.log('Parsed adminInfo:', adminInfo);
    
    if (!adminInfo.token) {
      console.error('No token found in adminInfo');
      throw new Error('Authentication token not found');
    }
    
    console.log('Using token:', adminInfo.token.substring(0, 20) + '...');
    return adminInfo.token;
  } catch (error) {
    console.error('Error parsing admin info:', error);
    throw new Error('Invalid authentication data');
  }
};

export const fetchEventsByAdmin = async () => {
  try {
    const token = getAuthToken();
    
    console.log('Sending request to /api/events/byAdmin with token:', 
                token.substring(0, 20) + '...');
    
    const response = await fetch('http://localhost:10000/api/events/byAdmin', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    if (response.status === 401) {
      console.error('Authentication failed. Please log in again.');
      // Don't remove token for debugging purposes right now
      // localStorage.removeItem('adminInfo');
      return { success: false, message: 'Session expired. Please log in again.', events: [] };
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Success response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const submitEvent = async (formData) => {
  // Create FormData object for file upload
  const data = new FormData();
  
  // Add all form fields
  data.append('eventCategory', formData.eventCategory);
  data.append('eventName', formData.eventName);
  data.append('participantCategory', formData.participantCategory);
  data.append('rules', formData.rules);
  
  // We're no longer sending adminRole from frontend
  // The backend will extract adminId from JWT token
  
  // Add prizes as JSON string
  data.append('prizes', JSON.stringify(formData.prizes));
  
  // Add lead auth info
  data.append('leadAuth', JSON.stringify(formData.leadAuth));
  
  // Add contact persons
  data.append('contactPersons', JSON.stringify(formData.contactPersons));
  
  // Add image if it exists
  if (formData.image) {
    data.append('image', formData.image);
  }
  
  try {
    // Get token using the helper function
    const token = getAuthToken();
    
    const response = await fetch('http://localhost:10000/api/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: data,
    });
    
    // First check if response is ok before trying to parse JSON
    if (!response.ok) {
      // Try to parse error JSON if available
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server error: ${response.status}`);
      } catch (jsonError) {
        // If JSON parsing fails, use status text
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const fetchEventDetails = async (eventId) => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(`http://localhost:10000/api/events/${eventId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching event details for ID ${eventId}:`, error);
    throw error;
  }
};

// export const fetchEventsByAdmin = async () => {
//   try {
//     const token = getAuthToken();
    
//     const response = await fetch('http://localhost:10000/api/events/byAdmin', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });
    
//     if (response.status === 401) {
//       // Handle unauthorized specifically
//       console.error('Authentication failed. Please log in again.');
//       localStorage.removeItem('adminInfo'); // Clear invalid token
//       return { success: false, message: 'Session expired. Please log in again.', events: [] };
//     }
    
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || `Server error: ${response.status}`);
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching events:', error);
//     throw error;
//   }
// };

export const updateEvent = async (eventId, formData) => {
  try {
    const token = getAuthToken();
    
    // Create FormData object for file upload if there's an image
    let data;
    let headers;
    
    if (formData.image instanceof File) {
      // If we have a new image file, use FormData
      data = new FormData();
      
      // Add all form fields
      data.append('eventCategory', formData.eventCategory);
      data.append('eventName', formData.eventName);
      data.append('participantCategory', formData.participantCategory);
      data.append('rules', formData.rules);
      
      // Add prizes as JSON string
      data.append('prizes', JSON.stringify(formData.prizes));
      
      // Add lead auth info
      data.append('leadAuth', JSON.stringify(formData.leadAuth));
      
      // Add contact persons
      data.append('contactPersons', JSON.stringify(formData.contactPersons));
      
      // Add image if it exists
      data.append('image', formData.image);
      
      // Only set Authorization header when using FormData
      headers = {
        'Authorization': `Bearer ${token}`
      };
    } else {
      // If no new image, use JSON
      data = JSON.stringify(formData);
      headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
    }

    // Make sure we're using the full API URL
    const API_URL = import.meta.env?.VITE_API_URL || '';
    const url = `${API_URL}/api/events/${eventId}`;
    
    console.log(`Sending PUT request to: ${url}`);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: data,
      credentials: 'include' // Include credentials to send cookies
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Server response:', errorData);
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating event with ID ${eventId}:`, error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const token = getAuthToken();
    
    // Make sure we're using the full API URL as in updateEvent function
    const API_URL = import.meta.env?.VITE_API_URL || '';
    const url = `${API_URL}/api/events/${eventId}`;
    
    console.log(`Sending DELETE request to: ${url}`);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Include credentials to send cookies
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Server response:', errorData);
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting event with ID ${eventId}:`, error);
    throw error;
  }
};