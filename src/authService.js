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
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    
    // Store the token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    } else {
      throw new Error('Token not found in response');
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

    if (!authToken) {
      // Just clear local data if no token exists
      clearAuthData();
      return;
    }

    const response = await fetch(`${API_BASE_URL}/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        refresh_token: refreshToken || ''  // Send empty string if no refresh token
      }),
    });

    if (!response.ok) {
      console.error('Logout failed:', await response.text());
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local data
    clearAuthData();
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  sessionStorage.clear(); // Clear session storage as well
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

export const submitContactForm = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Contact submission failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Contact submission error:', error);
    throw error;
  }
};

/**
 * Subscribe to newsletter
 * @param {string} email Subscriber's email address
 * @returns {Promise} Response indicating subscription success
 */
export const subscribeNewsletter = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/newsletter/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Newsletter subscription failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    throw error;
  }
};