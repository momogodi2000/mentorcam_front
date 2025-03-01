// chatWebSocket.js
import axiosInstance from '../services/backend_connection';

export class ChatWebSocket {
  constructor(roomId, token, onMessageCallback, onStatusChangeCallback) {
    this.roomId = roomId;
    this.token = token;
    this.onMessageCallback = onMessageCallback;
    this.onStatusChangeCallback = onStatusChangeCallback;
    this.socket = null;
    this.connectionAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000; // 3 seconds
    this.isConnecting = false;
    this.isConnected = false;
  }

  connect() {
    if (this.socket || this.isConnecting) {
      return;
    }
    
    this.isConnecting = true;
    this.onStatusChangeCallback('connecting');
    
    // Get the protocol (wss:// for HTTPS, ws:// for HTTP)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Get the host
    const host = window.location.host;
    // Build the WebSocket URL with authentication token
    const wsUrl = `${protocol}//${host}/ws/chat/${this.roomId}/?token=${this.token}`;
    
    this.socket = new WebSocket(wsUrl);
    
    this.socket.onopen = () => {
      console.log(`WebSocket connected to room: ${this.roomId}`);
      this.connectionAttempts = 0;
      this.isConnecting = false;
      this.isConnected = true;
      this.onStatusChangeCallback('connected');
    };
    
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.onMessageCallback(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    this.socket.onclose = (event) => {
      console.log(`WebSocket closed for room ${this.roomId} with code: ${event.code}`);
      this.isConnecting = false;
      this.isConnected = false;
      this.socket = null;
      this.onStatusChangeCallback('disconnected', event.code);
      
      // Only reconnect for certain close codes (not for auth failures)
      if (event.code !== 4003 && this.connectionAttempts < this.maxReconnectAttempts) {
        this.connectionAttempts++;
        setTimeout(() => this.connect(), this.reconnectInterval);
      } else {
        this.onStatusChangeCallback('failed');
      }
    };
    
    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  sendMessage(message) {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'chat_message',
        message: message
      }));
      return true;
    }
    return false;
  }
  
  sendTyping() {
    if (this.socket && this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'typing'
      }));
      return true;
    }
    return false;
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.isConnected = false;
      this.isConnecting = false;
    }
  }
}

// API functions for chat using axiosInstance
export const chatAPI = {
  getMentorChats: async () => {
    try {
      const response = await axiosInstance.get('/chat/mentors/');
      return response.data;
    } catch (error) {
      console.error('Error fetching mentor chats:', error);
      throw error;
    }
  },
  
  getCommunityChats: async () => {
    try {
      const response = await axiosInstance.get('/chat/communities/');
      return response.data;
    } catch (error) {
      console.error('Error fetching community chats:', error);
      throw error;
    }
  },
  
  getChatMessages: async (roomId) => {
    try {
      const response = await axiosInstance.get(`/chat/messages/${roomId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      throw error;
    }
  },
  
  markMessagesRead: async (roomId) => {
    try {
      const response = await axiosInstance.post(`/chat/mark-read/${roomId}/`);
      return response.data;
    } catch (error) {
      console.error('Error marking messages read:', error);
      throw error;
    }
  },
};