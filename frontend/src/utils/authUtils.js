/**
 * Authentication utility functions
 */

/**
 * Gets the current logged in admin information
 * @returns The admin info object or null if not logged in
 */
export const getLoggedInAdmin = () => {
  const adminInfoString = localStorage.getItem('adminInfo');
  if (!adminInfoString) return null;
  
  try {
    return JSON.parse(adminInfoString);
  } catch (error) {
    console.error('Error parsing admin info:', error);
    return null;
  }
};

/**
 * Checks if the user is logged in
 * @returns boolean indicating if user is logged in
 */
export const isLoggedIn = () => {
  return !!getLoggedInAdmin();
};

/**
 * Gets the role of the currently logged in admin
 * @returns The role string or null if not logged in
 */
export const getAdminRole = () => {
  const adminInfo = getLoggedInAdmin();
  return adminInfo?.role || null;
};

/**
 * Gets the admin's department (cultural, sports, etc.)
 * @returns The department string or null
 */
export const getAdminDepartment = () => {
  const adminInfo = getLoggedInAdmin();
  return adminInfo?.adminId?.toLowerCase() || null;
};

/**
 * Logs out the current admin
 */
export const logoutAdmin = () => {
  localStorage.removeItem('adminInfo');
  localStorage.removeItem('token');
};