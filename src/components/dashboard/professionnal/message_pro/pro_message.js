import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Paperclip, Mic, Video, Image as ImageIcon, Camera, Users, Hash, ChevronRight, Phone, VideoIcon as VideoCall } from 'lucide-react';
import ProfessionalLayout from '../professionnal_layout';
import { Card, CardContent } from '../../../ui/card';
import { ScrollArea } from '../../../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { ChatWebSocket, chatAPI } from '../../../lib/chatWebSocket';
import { useToast } from "../../../ui/use-toast";

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
  const [isLoading, setIsLoading] = useState(false);
  const webSocketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Fetch mentors and communities on component mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const mentorsData = await chatAPI.getMentorChats();
        setMentors(mentorsData);
        
        const communitiesData = await chatAPI.getCommunityChats();
        setCommunities(communitiesData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load chats. Please try again later.",
          variant: "destructive",
        });
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  // Connect to WebSocket when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      // First load messages
      const loadMessages = async () => {
        setIsLoading(true);
        try {
          const messagesData = await chatAPI.getChatMessages(selectedChat.id);
          setMessages(messagesData);
          // Mark messages as read
          await chatAPI.markMessagesRead(selectedChat.id);
          // Update the unread count in the chat list
          if (activeChatType === 'mentors') {
            setMentors(prevMentors => 
              prevMentors.map(mentor => 
                mentor.id === selectedChat.id ? { ...mentor, unread: 0 } : mentor
              )
            );
          } else {
            setCommunities(prevCommunities => 
              prevCommunities.map(community => 
                community.id === selectedChat.id ? { ...community, unread: 0 } : community
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
        } finally {
          setIsLoading(false);
        }
      };

      loadMessages();

      // Then establish WebSocket connection
      const token = localStorage.getItem('auth_token') || 'demo-token'; // Get your auth token from where it's stored
      
      const handleMessage = (data) => {
        if (data.type === 'chat_message') {
          setMessages(prevMessages => [...prevMessages, {
            id: Date.now(), // Temporary ID until we get a real one
            sender: data.sender_id === 'me' ? 'me' : data.sender_name,
            content: data.message,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text'
          }]);
        } else if (data.type === 'typing') {
          // Handle typing indicator
          console.log(`${data.sender_name} is typing...`);
        }
      };

      const handleStatusChange = (status, code) => {
        setConnectionStatus(status);
        
        if (status === 'failed') {
          toast({
            title: "Connection Failed",
            description: "Could not connect to chat server. Please try again later.",
            variant: "destructive",
          });
        }
      };

      webSocketRef.current = new ChatWebSocket(
        selectedChat.id,
        token,
        handleMessage,
        handleStatusChange
      );

      webSocketRef.current.connect();

      // Clean up on unmount or when selected chat changes
      return () => {
        if (webSocketRef.current) {
          webSocketRef.current.disconnect();
          webSocketRef.current = null;
        }
      };
    }
  }, [selectedChat, activeChatType]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim() && webSocketRef.current) {
      const success = webSocketRef.current.sendMessage(messageInput);
      
      if (success) {
        // Optimistically add message to the UI
        setMessages(prevMessages => [...prevMessages, {
          id: Date.now(),
          sender: 'me',
          content: messageInput,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text'
        }]);
        
        setMessageInput('');
      } else {
        toast({
          title: "Message Not Sent",
          description: "Could not send message. Please check your connection.",
          variant: "destructive",
        });
      }
    }
  };

  const handleTyping = () => {
    if (webSocketRef.current && connectionStatus === 'connected') {
      webSocketRef.current.sendTyping();
    }
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
    // Debounce this for production
    handleTyping();
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
            {activeChatType === 'mentors' ? (
              <div className="space-y-1 p-2">
                {mentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    onClick={() => setSelectedChat(mentor)}
                    className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      selectedChat?.id === mentor.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                    }`}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={mentor.avatar} />
                        <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
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
                        <span className="text-xs text-gray-500">{mentor.lastSeen}</span>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-500 truncate">{mentor.lastMessage}</p>
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
            ) : (
              <div className="space-y-1 p-2">
                {communities.map((community) => (
                  <div
                    key={community.id}
                    onClick={() => setSelectedChat(community)}
                    className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      selectedChat?.id === community.id ? 'bg-gray-100 dark:bg-gray-800' : ''
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
                        <p className="text-sm text-gray-500 truncate">{community.lastMessage}</p>
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
                  <AvatarImage src={selectedChat.avatar} />
                  <AvatarFallback>{selectedChat.name.charAt(0)}</AvatarFallback>
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
                    {activeChatType === 'mentors' ? selectedChat.role : `${selectedChat.members} members`}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <VideoCall className="w-5 h-5" />
                </Button>
              </div>
            </div>

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
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender === 'me'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 dark:text-white'
                          }`}
                        >
                          <p>{message.content}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {message.timestamp}
                          </span>
                        </div>
                      </div>
                    ))
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
                  onChange={handleInputChange}
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