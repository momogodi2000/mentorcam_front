import axiosInstance from './backend_connection';

const aiChatService = {
  // Send a message to the AI
  sendMessage: async (user_id, text, media_url = null, media_type = null) => {
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
  },

  // Fetch chat history (if needed)
  getChatHistory: async (user_id) => {
    try {
      const response = await axiosInstance.get(`/chat-history/?user_id=${user_id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  },
};

export default aiChatService;