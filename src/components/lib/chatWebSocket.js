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
    this.reconnectTimeoutId = null;
    this.isConnecting = false;
    this.isConnected = false;
    this.heartbeatInterval = null;
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
    
    try {
      this.socket = new WebSocket(wsUrl);
      
      this.socket.onopen = () => {
        console.log(`WebSocket connected to room: ${this.roomId}`);
        this.connectionAttempts = 0;
        this.isConnecting = false;
        this.isConnected = true;
        this.onStatusChangeCallback('connected');
        
        // Set up heartbeat to keep connection alive
        this.setupHeartbeat();
        
        // Fetch initial chat history through regular API
        this.fetchInitialMessages();
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.onMessageCallback(data);
          
          // If this is a pong response, don't process further
          if (data.type === 'pong') return;
          
          // For normal messages, mark as read automatically
          if (data.type === 'chat_message' && this.isConnected) {
            this.markMessagesRead();
          }
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
        
        // Clear heartbeat interval
        if (this.heartbeatInterval) {
          clearInterval(this.heartbeatInterval);
          this.heartbeatInterval = null;
        }
        
        // Only reconnect for certain close codes
        if (event.code !== 4003 && event.code !== 1000 && this.connectionAttempts < this.maxReconnectAttempts) {
          this.connectionAttempts++;
          this.reconnectTimeoutId = setTimeout(() => this.connect(), this.reconnectInterval * this.connectionAttempts);
        } else if (event.code === 4003) {
          // Authentication error - trigger refresh token or redirect to login
          this.onStatusChangeCallback('auth_error');
        } else {
          this.onStatusChangeCallback('failed');
        }
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      this.isConnecting = false;
      this.onStatusChangeCallback('failed');
    }
  }
  
  setupHeartbeat() {
    // Send a ping every 30 seconds to keep the connection alive
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.isConnected) {
        this.socket.send(JSON.stringify({
          type: 'ping'
        }));
      }
    }, 30000);
  }
  
  async fetchInitialMessages() {
    try {
      const data = await chatAPI.getChatMessages(this.roomId);
      if (data && data.messages) {
        this.onMessageCallback({
          type: 'chat_history',
          messages: data.messages
        });
      }
    } catch (error) {
      console.error('Error fetching initial messages:', error);
    }
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
  
  async markMessagesRead() {
    try {
      await chatAPI.markMessagesRead(this.roomId);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }
  
  disconnect() {
    // Clear any pending reconnect attempts
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }
    
    // Clear heartbeat interval
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    // Close the socket with a normal closure code
    if (this.socket) {
      this.socket.close(1000, 'User navigated away');
      this.socket = null;
      this.isConnected = false;
      this.isConnecting = false;
    }
  }
  
  // Method to handle token refresh
  updateToken(newToken) {
    this.token = newToken;
    // If connected, reconnect with new token
    if (this.isConnected) {
      this.disconnect();
      this.connect();
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
  
  // Add a method to create community rooms if needed
  createCommunityRoom: async (roomName) => {
    try {
      const response = await axiosInstance.post('/chat/communities/create/', {
        name: roomName
      });
      return response.data;
    } catch (error) {
      console.error('Error creating community room:', error);
      throw error;
    }
  }
};