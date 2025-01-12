// authService.js
/**
 * Authentication service module for handling login, registration, and token management
 */

// You might want to move this to an environment config
const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Login user with email and password
 * @param {string} email User's email
 * @param {string} password User's password
 * @returns {Promise} Response with user data and redirect URL
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    
    // Store the token in localStorage or your preferred storage method
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    // Determine redirect URL based on user type
    const redirectMap = {
      admin: '/admin_dashboard',
      amateur: '/beginner_dashboard',
      professional: '/professional_dashboard',
      institution: '/institut_dashboard'
    };

    return {
      ...data,
      redirect_url: redirectMap[data.user_type] || '/login'
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register new user
 * @param {Object} userData User registration data
 * @param {string} userData.email User's email
 * @param {string} userData.password User's password
 * @param {string} userData.password2 Password confirmation
 * @param {string} userData.user_type User type (amateur/professional/institution)
 * @param {string} userData.phone_number User's phone number
 * @param {string} userData.username User's username
 * @param {string} userData.full_name User's full name
 * @returns {Promise} Response with user data and redirect URL
 */
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    
    // Store the token if provided with registration
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    // Determine redirect URL based on user type
    const redirectMap = {
      admin: '/admin_dashboard',
      amateur: '/beginner_dashboard',
      professional: '/professional_dashboard',
      institution: '/institut_dashboard'
    };

    return {
      ...data,
      redirect_url: redirectMap[userData.user_type] || '/login'
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Logout user and invalidate all sessions
 * @returns {Promise} Response indicating logout success
 */
export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const authToken = localStorage.getItem('authToken');

    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    const response = await fetch(`${API_BASE_URL}/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Logout failed');
    }

    // Clear all auth-related data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');

    return await response.json();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token; // Returns true if token exists
};

/**
 * Get authentication token
 * @returns {string|null}
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};


export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/password/reset/request/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send reset code');
    }

    return await response.json();
  } catch (error) {
    console.error('Request password reset error:', error);
    throw error;
  }
};

export const verifyResetCode = async (email, code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/password/reset/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code: code.join('') }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Invalid verification code');
    }

    return await response.json();
  } catch (error) {
    console.error('Verify reset code error:', error);
    throw error;
  }
};

export const resetPassword = async (email, code, newPassword, confirmPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/password/reset/confirm/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        code: code.join(''),
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Password reset failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};