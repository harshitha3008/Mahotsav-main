
// Check if user is logged in and has proper role
export const isAuthenticated = () => {
  const adminInfoString = localStorage.getItem("adminInfo");
  
  if (!adminInfoString) {
    return false;
  }
  
  try {
    const adminInfo = JSON.parse(adminInfoString);
    return adminInfo && adminInfo.token && adminInfo.role === 'core';
  } catch (error) {
    console.error("Error parsing admin info:", error);
    return false;
  }
};

// Get current admin info
export const getAdminInfo = () => {
  const adminInfoString = localStorage.getItem("adminInfo");
  
  if (!adminInfoString) {
    return null;
  }
  
  try {
    return JSON.parse(adminInfoString);
  } catch (error) {
    console.error("Error parsing admin info:", error);
    return null;
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem("adminInfo");
  // Redirect to login page or home
  window.location.href = '/admin-login';
};