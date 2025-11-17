// Utility functions for authentication and user management

const USER_ID_KEY = 'camp_userId';
const USER_KEY = 'camp_user';

export const authUtils = {
  // Get userId from localStorage
  getUserId: () => {
    return localStorage.getItem(USER_ID_KEY) || 'usr_001'; // Default fallback
  },

  // Set userId in localStorage
  setUserId: (userId) => {
    localStorage.setItem(USER_ID_KEY, userId);
  },

  // Get user object from localStorage
  getUser: () => {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Set user object in localStorage
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (user?.id) {
      localStorage.setItem(USER_ID_KEY, user.id);
    }
  },

  // Clear auth data
  clearAuth: () => {
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

