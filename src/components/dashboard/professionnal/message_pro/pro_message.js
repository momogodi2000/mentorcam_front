import React, { useState } from 'react';
import { Search, Send, Paperclip, Mic, Video, Image as ImageIcon, Camera, Users, Hash, ChevronRight, Phone, VideoIcon as VideoCall } from 'lucide-react';
import ProfessionalLayout from '../professionnal_layout';
import { Card, CardContent } from '../../../ui/card';
import { ScrollArea } from '../../../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';

const ProMessages = () => {

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [activeChatType, setActiveChatType] = useState('mentors'); // 'mentors' or 'communities'

  // Sample data for mentors
  const mentors = [
    {
      id: 1,
      name: 'Dr. Kamga Paul',
      role: 'Web Development Expert',
      avatar: '/api/placeholder/32/32',
      status: 'online',
      lastMessage: 'How is your progress with React?',
      unread: 2,
      lastSeen: 'Now'
    },
    {
      id: 2,
      name: 'Mme. Nguemo Sarah',
      role: 'Digital Marketing Mentor',
      avatar: '/api/placeholder/32/32',
      status: 'offline',
      lastMessage: 'Great work on your last assignment!',
      unread: 0,
      lastSeen: '2h ago'
    },
    // Add more mentors...
  ];

  // Sample data for communities
  const communities = [
    {
      id: 1,
      name: 'Web Development Hub',
      members: 156,
      avatar: '/api/placeholder/32/32',
      lastMessage: 'Anyone experienced with Next.js?',
      unread: 5
    },
    {
      id: 2,
      name: 'Digital Marketing Pro',
      members: 89,
      avatar: '/api/placeholder/32/32',
      lastMessage: 'Tips for social media growth',
      unread: 0
    },
    // Add more communities...
  ];

  // Sample messages for the selected chat
  const messages = [
    {
      id: 1,
      sender: 'Dr. Kamga Paul',
      content: 'How is your progress with the React components?',
      timestamp: '10:30 AM',
      type: 'text'
    },
    {
      id: 2,
      sender: 'me',
      content: 'I have completed the basic structure. Working on styling now.',
      timestamp: '10:32 AM',
      type: 'text'
    },
    {
      id: 3,
      sender: 'Dr. Kamga Paul',
      content: 'Great! Let me know if you need any help.',
      timestamp: '10:35 AM',
      type: 'text'
    },
    // Add more messages...
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Add message sending logic here
      setMessageInput('');
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
                  <h2 className="font-medium dark:text-white">{selectedChat.name}</h2>
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
              <div className="space-y-4">
                {messages.map((message) => (
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
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button variant="ghost" size="icon">
                  <ImageIcon className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Mic className="w-5 h-5" />
                </Button>
                <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
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