import axiosInstance from '../backend_connection';

// Send a message to the AI using Gemini
export const sendMessage = async (user_id, text, media = null) => {
  if (!user_id) {
    throw new Error('User ID is required');
  }
  
  try {
    // Create FormData for handling file uploads if present
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('text', text);
    
    if (media) {
      formData.append('media', media);
    }
    
    const response = await axiosInstance.post('/ai-chat/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    
    // Handle specific error responses
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    } else if (error.response && error.response.status === 429) {
      throw new Error('Too many requests. Please wait a moment before trying again.');
    } else if (error.response && error.response.status === 413) {
      throw new Error('The file you\'re trying to upload is too large. Please try a smaller file.');
    } else if (error.message === 'Network Error') {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    throw error;
  }
};

// Fetch chat history
export const fetchChatHistory = async (user_id) => {
  if (!user_id) {
    throw new Error('User ID is required');
  }
  
  try {
    const response = await axiosInstance.get(`/chat-history/?user_id=${user_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

// Fetch chat list
export const fetchChatList = async (user_id) => {
  if (!user_id) {
    throw new Error('User ID is required');
  }
  
  try {
    const response = await axiosInstance.get(`/chat-list/?user_id=${user_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat list:', error);
    throw error;
  }
};

// Clear chat history
export const clearChatHistory = async (user_id) => {
  if (!user_id) {
    throw new Error('User ID is required');
  }
  
  try {
    const response = await axiosInstance.delete(`/chat-history/?user_id=${user_id}`);
    return response.data;
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
};

// Optional: Update chat title
export const updateChatTitle = async (user_id, title) => {
  if (!user_id) {
    throw new Error('User ID is required');
  }
  
  try {
    const response = await axiosInstance.patch('/chat-list/', {
      user_id,
      title
    });
    return response.data;
  } catch (error) {
    console.error('Error updating chat title:', error);
    throw error;
  }
};