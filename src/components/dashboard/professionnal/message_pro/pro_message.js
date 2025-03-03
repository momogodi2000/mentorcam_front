import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Send, Paperclip, Mic, Video, Image as ImageIcon, Camera, Users, Hash, ChevronRight, Phone, VideoIcon as VideoCall, Plus } from 'lucide-react';
import ProfessionalLayout from '../professionnal_layout';
import { Card, CardContent } from '../../../ui/card';
import { ScrollArea } from '../../../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { ChatWebSocket, chatAPI } from '../../../lib/chatWebSocket';
import { Alert, AlertDescription } from '../../../ui/alert';
import { useToast } from "../../../ui/use-toast";
import axiosInstance from '../../../services/backend_connection';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../ui/dialog_2";

const ProMessages = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [activeChatType, setActiveChatType] = useState('mentors');
  const [mentors, setMentors] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimer, setTypingTimer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userToken, setUserToken] = useState('');
  const [showCreateCommunityDialog, setShowCreateCommunityDialog] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');
  const [availableAmateurs, setAvailableAmateurs] = useState([]);

  const websocketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch authentication token
  useEffect(() => {
    const token = localStorage.getItem('authToken');
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
  }, [toast]);

  // Fetch chat data based on active chat type
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (activeChatType === 'mentors') {
          const response = await axiosInstance.get('/chat/mentors/');
          setMentors(response.data.mentors || []);
        } else {
          const response = await axiosInstance.get('/chat/communities/');
          setCommunities(response.data.communities || []);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch chats:', err);
        setError(`Failed to load chat data: ${err.response?.data?.error || err.message}`);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load chat data. Please try again later.",
          variant: "destructive",
        });
      }
    };

    if (userToken) {
      fetchData();
    }
  }, [activeChatType, userToken, toast]);

  // Fetch available amateurs
  useEffect(() => {
    const fetchAvailableAmateurs = async () => {
      try {
        const response = await axiosInstance.get('/chat/available-amateurs/');
        setAvailableAmateurs(response.data.amateurs || []);
      } catch (err) {
        console.error('Failed to fetch available amateurs:', err);
        toast({
          title: "Error",
          description: "Failed to load available amateurs. Please try again later.",
          variant: "destructive",
        });
      }
    };

    if (userToken) {
      fetchAvailableAmateurs();
    }
  }, [userToken, toast]);

  // Handle creating a new community
  const handleCreateCommunity = async () => {
    if (!newCommunityName.trim()) {
      toast({
        title: "Error",
        description: "Community name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await chatAPI.createCommunityRoom(newCommunityName);
      setCommunities(prev => [...prev, response]);
      setShowCreateCommunityDialog(false);
      setNewCommunityName('');
      toast({
        title: "Success",
        description: "Community created successfully.",
        variant: "default",
      });
    } catch (err) {
      console.error('Failed to create community:', err);
      toast({
        title: "Error",
        description: "Failed to create community. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Dismiss error message
  const dismissError = () => {
    setError(null);
  };

  // Render individual chat message
  const renderMessage = (message) => {
    const isCurrentUser = message.sender_id === getCurrentUserId() || message.sender === 'me';
    
    return (
      <div
        key={message.id}
        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      >
        {!isCurrentUser && (
          <Avatar className="mr-2 flex-shrink-0">
            <AvatarImage src={selectedChat?.profile_picture} />
            <AvatarFallback>{message.sender?.charAt(0) || 'U'}</AvatarFallback>
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

  // Handle typing in the message input
  const handleTyping = (e) => {
    setMessageInput(e.target.value);
    
    if (websocketRef.current && connectionStatus === 'connected') {
      websocketRef.current.sendTyping();
    }
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (messageInput.trim() && websocketRef.current && connectionStatus === 'connected') {
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
      
      const success = websocketRef.current.sendMessage(messageInput);
      
      if (success) {
        setMessageInput('');
      } else {
        setError('Failed to send message. Please check your connection.');
        toast({
          title: "Message Not Sent",
          description: "Could not send message. Please check your connection.",
          variant: "destructive",
        });
        
        setMessages(prevMessages => 
          prevMessages.filter(msg => msg.id !== tempMessage.id)
        );
      }
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

  // Render chat list
  const renderChatList = () => {
    if (loading && !selectedChat) {
      return <div className="p-4 text-center">Loading conversations...</div>;
    }
    
    if (error && !selectedChat && (mentors.length === 0 && communities.length === 0)) {
      return <div className="p-4 text-center text-red-500">{error}</div>;
    }
    
    if (activeChatType === 'mentors' && mentors.length === 0) {
      return <div className="p-4 text-center text-gray-500">No mentor conversations yet</div>;
    }
    
    if (activeChatType === 'communities' && communities.length === 0) {
      return <div className="p-4 text-center text-gray-500">No community conversations available</div>;
    }
    
    if (activeChatType === 'mentors') {
      return (
        <div className="space-y-1 p-2">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              onClick={() => setSelectedChat(mentor)}
              className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                selectedChat?.room_id === mentor.room_id ? 'bg-gray-100 dark:bg-gray-800' : ''
              }`}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={mentor.profile_picture} />
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
                  <span className="text-xs text-gray-500">{mentor.last_message_time || 'New'}</span>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 truncate">{mentor.last_message || mentor.role || 'Mentor'}</p>
                  {mentor.unread > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                      {mentor.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="space-y-1 p-2">
          {communities.map((community) => (
            <div
              key={community.id}
              onClick={() => setSelectedChat(community)}
              className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                selectedChat?.room_id === community.room_id ? 'bg-gray-100 dark:bg-gray-800' : ''
              }`}
            >
              <Avatar>
                <AvatarFallback><Hash className="w-4 h-4" /></AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <span className="font-medium dark:text-white">{community.name}</span>
                  <span className="text-xs text-gray-500">{community.members} members</span>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500 truncate">{community.last_message || 'Community chat'}</p>
                  {community.unread > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                      {community.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
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
            {renderChatList()}
          </ScrollArea>

          {/* Create Community Button */}
          <div className="p-4 border-t dark:border-gray-700">
            <Button
              className="w-full"
              onClick={() => setShowCreateCommunityDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Community
            </Button>
          </div>
        </div>

        {/* Main Chat Area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center">
                <Avatar>
                  <AvatarImage src={selectedChat.profile_picture} />
                  <AvatarFallback>
                    {activeChatType === 'mentors' 
                      ? (selectedChat.name?.charAt(0) || 'M') 
                      : <Hash className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <h2 className="font-medium dark:text-white">{selectedChat.name}</h2>
                  <p className="text-sm text-gray-500">
                    {activeChatType === 'mentors' ? (selectedChat.role || 'Mentor') : `${selectedChat.members || 0} members`}
                  </p>
                  {connectionStatus !== 'connected' && (
                    <span className="text-xs text-amber-500">
                      {connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                    </span>
                  )}
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
              {loading && !messages.length ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Loading messages...</p>
                </div>
              ) : !messages.length ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">No messages yet</p>
                    <p className="text-sm text-gray-400">Be the first to send a message!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map(renderMessage)}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-gray-800 dark:text-white rounded-lg p-3 max-w-[70%]">
                        <p className="text-gray-500">Typing...</p>
                      </div>
                    </div>
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
                  placeholder="Type your message..."
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

      {/* Create Community Dialog */}
      <Dialog open={showCreateCommunityDialog} onOpenChange={setShowCreateCommunityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Community</DialogTitle>
            <DialogDescription>
              Enter a name for your new community.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={newCommunityName}
            onChange={(e) => setNewCommunityName(e.target.value)}
            placeholder="Community Name"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateCommunityDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCommunity}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProfessionalLayout>
  );
};

export default ProMessages;