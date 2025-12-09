// Utility functions for authentication and user management

const USER_ID_KEY = 'camp_userId';
const USER_KEY = 'camp_user';
const TOKEN_KEY = 'camp_token';
const LAST_ACTIVITY_KEY = 'camp_lastActivity';
const SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

export const authUtils = {
    // Get token from localStorage
    getToken: () => {
      return localStorage.getItem(TOKEN_KEY);
    },

    // Set token in localStorage
    setToken: (token) => {
      localStorage.setItem(TOKEN_KEY, token);
    },

  // Get userId from localStorage
  getUserId: () => {
    return localStorage.getItem(USER_ID_KEY);
  },

  // Set userId in localStorage
  setUserId: (userId) => {
    localStorage.setItem(USER_ID_KEY, userId);
  },

  // Get user object from localStorage
  getUser: () => {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error('Failed to parse user from localStorage:', e);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  // Set user object in localStorage
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (user?.id || user?._id) {
      localStorage.setItem(USER_ID_KEY, user.id || user._id);
    }
  },

  // Clear auth data
  clearAuth: () => {
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  },

  // Session timeout management
  updateLastActivity: () => {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  },

  getLastActivity: () => {
    const timestamp = localStorage.getItem(LAST_ACTIVITY_KEY);
    return timestamp ? parseInt(timestamp, 10) : null;
  },

  isSessionExpired: () => {
    const lastActivity = authUtils.getLastActivity();
    if (!lastActivity) return false;
    return Date.now() - lastActivity > SESSION_TIMEOUT_MS;
  },

  getSessionTimeoutMs: () => SESSION_TIMEOUT_MS
};

