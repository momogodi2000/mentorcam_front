import axiosInstance from '../backend_connection';

// Send a message to the AI using Gemini
// Make sure user_id is defined and not null/empty before calling this
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
    }
    throw error;
  }
};

// Fetch chat history (if needed)
export const fetchChatHistory = async (user_id) => {
  try {
    const response = await axiosInstance.get(`/chat-history/?user_id=${user_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

// Fetch chat list (if needed)
export const fetchChatList = async (user_id) => {
  try {
    const response = await axiosInstance.get(`/chat-list/?user_id=${user_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat list:', error);
    throw error;
  }
};

// Clear chat history (optional new feature)
export const clearChatHistory = async (user_id) => {
  try {
    const response = await axiosInstance.delete(`/chat-history/?user_id=${user_id}`);
    return response.data;
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
};