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
    // Add token to the request headers for authentication
    const token = localStorage.getItem('token');
    
    const response = await fetch('/api/events', {
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
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`/api/events/${eventId}`, {
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

export const fetchEventsByAdmin = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch('/api/events/byAdmin', {
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
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const updateEvent = async (eventId, formData) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
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
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
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