// services/chatService.js
import axiosInstance from '../backend_connection';

// Fetch chat history for a mentor or community
export const fetchChatHistory = async (chatId, chatType) => {
  try {
    const response = await axiosInstance.get(`/chat/history/${chatId}/`, {
      params: { chat_type: chatType }, // 'mentors' or 'communities'
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

// Send a message to a mentor or community
export const sendMessage = async (chatId, chatType, message) => {
  try {
    const response = await axiosInstance.post(`/chat/send/${chatId}/`, {
      chat_type: chatType, // 'mentors' or 'communities'
      message,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Fetch list of mentors or communities
export const fetchChatList = async (chatType) => {
  try {
    const response = await axiosInstance.get(`/chat/list/`, {
      params: { chat_type: chatType }, // 'mentors' or 'communities'
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching chat list:', error);
    throw error;
  }
};