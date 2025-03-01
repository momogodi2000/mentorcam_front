import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Paperclip, Mic, Video, Image as ImageIcon, Camera, Users, Hash, ChevronRight, Phone, VideoIcon as VideoCall } from 'lucide-react';
import ProfessionalLayout from '../professionnal_layout';
import { Card, CardContent } from '../../../ui/card';
import { ScrollArea } from '../../../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { ChatWebSocket, chatAPI } from '../../../lib/chatWebSocket';
import { Alert, AlertDescription } from '../../../ui/alert';
import { useToast } from "../../../ui/use-toast";
import axiosInstance from '../../../services/backend_connection'; // Import the axios instance

const ProMessages = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [activeChatType, setActiveChatType] = useState('mentors'); // 'mentors' or 'communities'
  const [messages, setMessages] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimer, setTypingTimer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userToken, setUserToken] = useState('');
  
  const webSocketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Get auth token on component mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setUserToken(token);
    } else {
      setError('Authentication token not found. Please log in again.');
      toast({
        title: "Authentication Error",
        description: "Authentication token not found. Please log in again.",
        variant: "destructive",
      });
    }
  }, []);

  // Fetch mentors and communities on component mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true);
        
        if (activeChatType === 'mentors') {
          const mentorsData = await axiosInstance.get('/chat/mentors/');
          setMentors(mentorsData.data || []);
        } else {
          const communitiesData = await axiosInstance.get('/chat/communities/');
          setCommunities(communitiesData.data || []);
        }
        
        setIsLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load chats. Please try again later.",
          variant: "destructive",
        });
        console.error('Error fetching chats:', error);
        setError(`Failed to load chat data: ${error.response?.data?.error || error.message}`);
        setIsLoading(false);
      }
    };

    if (userToken) {
      fetchChats();
    }
  }, [activeChatType, userToken, toast]);

  // Connect to WebSocket when a chat is selected
  useEffect(() => {
    if (selectedChat && userToken) {
      // First load messages
      const loadMessages = async () => {
        setIsLoading(true);
        try {
          const response = await axiosInstance.get(`/chat/messages/${selectedChat.room_id || selectedChat.id}/`);
          setMessages(response.data || []);
          
          // Mark messages as read
          await axiosInstance.post(`/chat/mark-read/${selectedChat.room_id || selectedChat.id}/`);
          
          // Update the unread count in the chat list
          if (activeChatType === 'mentors') {
            setMentors(prevMentors => 
              prevMentors.map(mentor => 
                mentor.id === selectedChat.id || mentor.room_id === selectedChat.room_id 
                  ? { ...mentor, unread: 0 } 
                  : mentor
              )
            );
          } else {
            setCommunities(prevCommunities => 
              prevCommunities.map(community => 
                community.id === selectedChat.id || community.room_id === selectedChat.room_id 
                  ? { ...community, unread: 0 } 
                  : community
              )
            );
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load messages. Please try again later.",
            variant: "destructive",
          });
          console.error('Error loading messages:', error);
          setError(`Failed to load messages: ${error.response?.data?.error || error.message}`);
        } finally {
          setIsLoading(false);
        }
      };

      loadMessages();

      // Disconnect previous connection if exists
      if (webSocketRef.current) {
        webSocketRef.current.disconnect();
      }
      
      // Create new WebSocket connection
      webSocketRef.current = new ChatWebSocket(
        selectedChat.room_id || selectedChat.id,
        userToken,
        handleWebSocketMessage,
        handleStatusChange
      );
      
      webSocketRef.current.connect();
      
      return () => {
        // Disconnect when component unmounts or chat changes
        if (webSocketRef.current) {
          webSocketRef.current.disconnect();
          webSocketRef.current = null;
        }
      };
    }
  }, [selectedChat, activeChatType, userToken, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle WebSocket message
  const handleWebSocketMessage = (data) => {
    if (data.type === 'chat_message') {
      setMessages(prevMessages => [...prevMessages, data.message || {
        id: Date.now(),
        sender_id: data.sender_id,
        sender: data.sender_name,
        content: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        is_read: false
      }]);
      
      // If the message is not from the current user, mark it as read
      if ((data.message?.sender_id || data.sender_id) !== getCurrentUserId()) {
        axiosInstance.post(`/chat/mark-read/${selectedChat.room_id || selectedChat.id}/`)
          .catch(err => {
            console.error('Failed to mark message as read:', err);
          });
      }
    } else if (data.type === 'typing') {
      // Handle typing indicator
      setIsTyping(true);
      
      // Clear previous timer if exists
      if (typingTimer) {
        clearTimeout(typingTimer);
      }
      
      // Set typing indicator to false after 3 seconds
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
      
      setTypingTimer(timer);
    } else if (data.type === 'chat_history') {
      // Initial history load from WebSocket
      setMessages(data.messages || []);
    }
  };

  // Get current user ID from local storage
  const getCurrentUserId = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        return parsedData.id;
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    }
    return null;
  };

  // Handle WebSocket status changes
  const handleStatusChange = (status, code) => {
    setConnectionStatus(status);
    
    if (status === 'failed') {
      setError('Connection failed. Please try refreshing the page.');
      toast({
        title: "Connection Failed",
        description: "Could not connect to chat server. Please try again later.",
        variant: "destructive",
      });
    } else if (status === 'disconnected' && code === 4003) {
      setError('Unauthorized access. Please log in again.');
      toast({
        title: "Authentication Error",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && webSocketRef.current && connectionStatus === 'connected') {
      // Create a temporary message to show immediately
      const tempMessage = {
        id: `temp-${Date.now()}`,
        sender_id: getCurrentUserId(),
        sender: 'me',
        content: messageInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        is_read: false,
        sending: true
      };
      
      setMessages(prevMessages => [...prevMessages, tempMessage]);
      
      // Send via WebSocket
      const success = webSocketRef.current.sendMessage(messageInput);
      
      if (success) {
        setMessageInput('');
      } else {
        toast({
          title: "Message Not Sent",
          description: "Could not send message. Please check your connection.",
          variant: "destructive",
        });
        
        // Remove the temporary message
        setMessages(prevMessages => 
          prevMessages.filter(msg => msg.id !== tempMessage.id)
        );
      }
    }
  };

  const handleTyping = (e) => {
    setMessageInput(e.target.value);
    
    // Send typing indicator via WebSocket
    if (webSocketRef.current && connectionStatus === 'connected') {
      webSocketRef.current.sendTyping();
    }
  };

  // Reset error message
  const dismissError = () => {
    setError(null);
  };

  // Message content renderer
  const renderMessage = (message) => {
    const isCurrentUser = message.sender_id === getCurrentUserId() || message.sender === 'me';
    
    return (
      <div
        key={message.id}
        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      >
        {!isCurrentUser && (
          <Avatar className="mr-2 flex-shrink-0">
            <AvatarImage src={selectedChat?.avatar} />
            <AvatarFallback>{message.sender?.charAt(0) || selectedChat?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        )}
        <div
          className={`max-w-[70%] rounded-lg p-3 ${
            isCurrentUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 dark:text-white'
          } ${message.sending ? 'opacity-70' : ''}`}
        >
          <p>{message.content}</p>
          <div className="text-xs opacity-70 mt-1 flex justify-between items-center">
            <span>{message.timestamp}</span>
            {isCurrentUser && message.is_read && (
              <span>✓✓</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ProfessionalLayout 
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
      isEnglish={isEnglish}
      setIsEnglish={setIsEnglish}
    >
      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Sidebar */}
        <div className="w-80 border-r dark:border-gray-700 flex flex-col">
          {/* Chat Type Selector */}
          <div className="flex border-b dark:border-gray-700">
            <button
              onClick={() => setActiveChatType('mentors')}
              className={`flex-1 p-4 text-center font-medium ${
                activeChatType === 'mentors'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Mentors
            </button>
            <button
              onClick={() => setActiveChatType('communities')}
              className={`flex-1 p-4 text-center font-medium ${
                activeChatType === 'communities'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Communities
            </button>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 w-full bg-gray-100 dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Chat List */}
          <ScrollArea className="flex-1">
            {isLoading && !selectedChat ? (
              <div className="p-4 text-center">Loading conversations...</div>
            ) : error && !selectedChat && (mentors.length === 0 && communities.length === 0) ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : activeChatType === 'mentors' ? (
              <div className="space-y-1 p-2">
                {mentors.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No mentor conversations yet</div>
                ) : (
                  mentors.map((mentor) => (
                    <div
                      key={mentor.id || mentor.room_id}
                      onClick={() => setSelectedChat(mentor)}
                      className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        selectedChat?.id === mentor.id || selectedChat?.room_id === mentor.room_id ? 'bg-gray-100 dark:bg-gray-800' : ''
                      }`}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={mentor.avatar || mentor.profile_picture} />
                          <AvatarFallback>{mentor.name?.charAt(0) || 'M'}</AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            mentor.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium dark:text-white">{mentor.name}</span>
                          <span className="text-xs text-gray-500">{mentor.lastSeen || mentor.last_message_time || 'New'}</span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-500 truncate">{mentor.lastMessage || mentor.last_message || mentor.role || 'Mentor'}</p>
                          {mentor.unread > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                              {mentor.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {communities.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No community conversations available</div>
                ) : (
                  communities.map((community) => (
                    <div
                      key={community.id || community.room_id}
                      onClick={() => setSelectedChat(community)}
                      className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        selectedChat?.id === community.id || selectedChat?.room_id === community.room_id ? 'bg-gray-100 dark:bg-gray-800' : ''
                      }`}
                    >
                      <Avatar>
                        <AvatarImage src={community.avatar} />
                        <AvatarFallback><Hash className="w-4 h-4" /></AvatarFallback>
                      </Avatar>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium dark:text-white">{community.name}</span>
                          <span className="text-xs text-gray-500">{community.members} members</span>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-gray-500 truncate">{community.lastMessage || community.last_message || 'Community chat'}</p>
                          {community.unread > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                              {community.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center">
                <Avatar>
                  <AvatarImage src={selectedChat.avatar || selectedChat.profile_picture} />
                  <AvatarFallback>
                    {activeChatType === 'mentors' 
                      ? (selectedChat.name?.charAt(0) || 'M') 
                      : <Hash className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <h2 className="font-medium dark:text-white">
                    {selectedChat.name}
                    {connectionStatus === 'connected' && (
                      <span className="ml-2 text-xs text-green-500">●</span>
                    )}
                    {connectionStatus === 'connecting' && (
                      <span className="ml-2 text-xs text-yellow-500">●</span>
                    )}
                    {connectionStatus === 'disconnected' && (
                      <span className="ml-2 text-xs text-red-500">●</span>
                    )}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {activeChatType === 'mentors' ? (selectedChat.role || 'Mentor') : `${selectedChat.members} members`}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {activeChatType === 'mentors' && (
                  <>
                    <Button variant="ghost" size="icon">
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <VideoCall className="w-5 h-5" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="m-2">
                <AlertDescription className="flex justify-between items-center">
                  <span>{error}</span>
                  <Button variant="outline" size="sm" onClick={dismissError}>Dismiss</Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    <>
                      {messages.map(renderMessage)}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg p-3 max-w-[70%]">
                            <p className="text-gray-500">Typing...</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  value={messageInput}
                  onChange={handleTyping}
                  placeholder={connectionStatus === 'connected' ? "Type your message..." : "Connecting..."}
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={connectionStatus !== 'connected'}
                />
                <Button variant="ghost" size="icon">
                  <ImageIcon className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Mic className="w-5 h-5" />
                </Button>
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!messageInput.trim() || connectionStatus !== 'connected'}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              {connectionStatus === 'connecting' && (
                <p className="text-xs text-center mt-2 text-amber-500">Connecting to chat server...</p>
              )}
              {connectionStatus === 'disconnected' && (
                <p className="text-xs text-center mt-2 text-red-500">
                  Disconnected. Trying to reconnect...
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-medium dark:text-white mb-2">
                Select a conversation
              </h2>
              <p className="text-gray-500">
                Choose a mentor or community to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </ProfessionalLayout>
  );
};

export default ProMessages;