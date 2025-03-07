import axiosInstance from '../backend_connection';

// Send a message to the AI
// Make sure user_id is defined and not null/empty before calling this
export const sendMessage = async (user_id, text, media_url = null, media_type = null) => {
  if (!user_id) {
    throw new Error('User ID is required');
  }
  
  try {
    const response = await axiosInstance.post('/ai-chat/', {
      user_id,
      text,
      media_url,
      media_type,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
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