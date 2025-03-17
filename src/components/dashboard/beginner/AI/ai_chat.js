import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, Send, User, Bot, ChevronRight, Compass, Award, Map, Download, FileText, ArrowUp, Image, X, Paperclip, AlertCircle, Languages, Moon, Sun, ArrowLeft
} from 'lucide-react';
import { sendMessage, fetchChatHistory, clearChatHistory, updateChatTitle } from '../../../services/biginner/chatService';
import { getUser } from '../../../services/get_user'; // Import the getUser service

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showSkillMap, setShowSkillMap] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [language, setLanguage] = useState('fr'); // 'fr' for French, 'en' for English
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null); // Add state for user data
  const [loadingUser, setLoadingUser] = useState(true); // Add loading state for user data
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Language translations
  const translations = {
    fr: {
      welcome: "Bonjour! Je suis votre assistant IA personnel. Comment puis-je vous aider dans votre parcours professionnel aujourd'hui?",
      header: "Chat IA - Assistant Professionnel",
      poweredBy: "Propulsé par IA",
      visualize: "Visualisez Votre Avenir Professionnel",
      discover: "Découvrez des parcours professionnels adaptés au marché camerounais grâce à notre technologie IA.",
      skillMapping: "Cartographie des Compétences",
      aiAnalyzes: "Notre IA analyse vos compétences et vous propose un plan de développement personnalisé.",
      suggestions: "Questions suggérées:",
      inputPlaceholder: "Posez une question sur votre parcours professionnel...",
      guideText: "L'assistant IA vous guidera dans le développement de vos compétences adaptées au marché camerounais",
      fileLimit: "Limite: 10MB",
      recommendedPaths: "Parcours Recommandés",
      mentorsAvailable: "mentors disponibles",
      highEmployment: "Fort potentiel d'emploi",
      growingSector: "Secteur en croissance",
      soughtSkill: "Compétence recherchée",
      popularResources: "Ressources Populaires",
      futureCareers: "Guide des métiers d'avenir",
      essentialSkills: "Compétences essentielles 2025",
      regionalOpportunities: "Opportunités par région",
      downloadPDF: "Télécharger PDF",
      explore: "Explorer",
      errorMessage: "Désolé, une erreur s'est produite. Veuillez réessayer.",
      fileSizeError: "Le fichier ne doit pas dépasser 10MB",
      changeLanguage: "Changer la langue",
      toggleTheme: "Changer le thème",
      returnToDashboard: "Retour au tableau de bord",
      youAreHere: "Vous",
      startingPoint: "Point de départ",
      fundamentalSkills: "Compétences Fondamentales",
      technicalSkills: "Compétences Techniques",
      softSkills: "Soft Skills",
      certification: "Certification",
      webDevelopment: "Développement Web",
      agroEntrepreneurship: "Agro-entrepreneuriat",
      digitalMarketing: "Marketing Digital",
      loadingUser: "Chargement de votre profil..."
    },
    en: {
      welcome: "Hello! I'm your personal AI assistant. How can I help with your professional journey today?",
      header: "AI Chat - Professional Assistant",
      poweredBy: "Powered by AI",
      visualize: "Visualize Your Professional Future",
      discover: "Discover professional paths adapted to the Cameroonian market through our AI technology.",
      skillMapping: "Skills Mapping",
      aiAnalyzes: "Our AI analyzes your skills and offers you a personalized development plan.",
      suggestions: "Suggested questions:",
      inputPlaceholder: "Ask a question about your professional journey...",
      guideText: "The AI assistant will guide you in developing your skills adapted to the Cameroonian market",
      fileLimit: "Limit: 10MB",
      recommendedPaths: "Recommended Paths",
      mentorsAvailable: "mentors available",
      highEmployment: "High employment potential",
      growingSector: "Growing sector",
      soughtSkill: "Sought-after skill",
      popularResources: "Popular Resources",
      futureCareers: "Guide to future careers",
      essentialSkills: "Essential skills 2025",
      regionalOpportunities: "Regional opportunities",
      downloadPDF: "Download PDF",
      explore: "Explore",
      errorMessage: "Sorry, an error occurred. Please try again.",
      fileSizeError: "File must not exceed 10MB",
      changeLanguage: "Change language",
      toggleTheme: "Toggle theme",
      returnToDashboard: "Return to dashboard",
      youAreHere: "You",
      startingPoint: "Starting point",
      fundamentalSkills: "Fundamental Skills",
      technicalSkills: "Technical Skills",
      softSkills: "Soft Skills",
      certification: "Certification",
      webDevelopment: "Web Development",
      agroEntrepreneurship: "Agro-entrepreneurship",
      digitalMarketing: "Digital Marketing",
      loadingUser: "Loading your profile..."
    }
  };

  const t = translations[language];

  // English and French suggestions
  const suggestionsByLanguage = {
    fr: [
      "Comment puis-je devenir un développeur web?",
      "Quelles compétences sont recherchées dans l'agriculture?",
      "Je cherche un mentor en entrepreneuriat",
      "Parcours professionnel en artisanat",
    ],
    en: [
      "How can I become a web developer?",
      "What skills are in demand in agriculture?",
      "I'm looking for a mentor in entrepreneurship",
      "Professional path in craftsmanship",
    ]
  };

  // Fetch current user on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
        setLoadingUser(false);
      } catch (error) {
        console.error('Error fetching current user:', error);
        setLoadingUser(false);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        try {
          const history = await fetchChatHistory(user.id);
          // Convert timestamp strings to Date objects
          const formattedHistory = history.map((message) => ({
            ...message,
            timestamp: new Date(message.timestamp), // Ensure timestamp is a Date object
          }));
          setMessages(formattedHistory);
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      };
  
      fetchHistory();
    }
  }, [user]);

  // Set initial welcome message based on language
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: t.welcome,
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
  }, [language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Apply dark mode to document body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if ((input.trim() === '' && !mediaFile) || !user) return;
  
    // Create form data if there's a media file
    const formData = new FormData();
    if (mediaFile) {
      formData.append('media', mediaFile);
    }
    formData.append('message', input);
    formData.append('user_id', user.id); // Use the current user's ID
  
    // Create message content - include media info if present
    const messageContent = mediaFile 
      ? `${input || ""}${input ? "\n" : ""}[Fichier joint: ${mediaFile.name}]` 
      : input;
    
    // Add user message with media preview if present
    const newMessages = [
      ...messages,
      {
        id: messages.length + 1,
        text: messageContent,
        sender: 'user',
        timestamp: new Date(),
        mediaPreview: mediaPreview,
        mediaType: mediaFile?.type || null,
      },
    ];
    
    setMessages(newMessages);
    setInput('');
    setMediaFile(null);
    setMediaPreview(null);
    setLoading(true);
    setShowSuggestions(false);
  
    try {
      // Send message to the backend using the named export `sendMessage`
      const response = await sendMessage(user.id, input, mediaFile);
      const aiResponse = response.response;
  
      // Add AI response to messages
      setMessages([
        ...newMessages,
        {
          id: newMessages.length + 1,
          text: aiResponse,
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
  
      // Show skill map if the response suggests it
      if (aiResponse.toLowerCase().includes('cartographie') || 
          aiResponse.toLowerCase().includes('mapping')) {
        setShowSkillMap(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([
        ...newMessages,
        {
          id: newMessages.length + 1,
          text: t.errorMessage,
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError(t.fileSizeError);
      return;
    }
    
    setUploadError('');
    setMediaFile(file);
    
    // Create preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      // For non-image files, just store the file info
      setMediaPreview(file.name);
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'fr' ? 'en' : 'fr');
  };

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const redirectToDashboard = () => {
    // In a real app, you would use your router to navigate
    window.location.href = '/beginner_dashboard';
  };

  // Show loading state while fetching user data
  if (loadingUser) {
    return (
      <div className={`flex items-center justify-center h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg">{t.loadingUser}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'} p-4 shadow-md`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={redirectToDashboard}
              className={`mr-3 p-2 rounded-full ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'}`}
              title={t.returnToDashboard}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-white text-xl font-bold flex items-center">
              <MessageCircle className="mr-2" />
              {t.header}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleLanguage}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'}`}
              title={t.changeLanguage}
            >
              <Languages className="h-5 w-5" />
            </button>
            <button 
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'}`}
              title={t.toggleTheme}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white bg-opacity-20'} px-3 py-1 rounded-full text-white text-sm`}>
              {t.poweredBy}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Messages area */}
          <div className={`flex-1 overflow-y-auto p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-3xl mx-auto">
              {/* Banner */}
              <div className={`mb-6 ${darkMode ? 'bg-gradient-to-br from-blue-950 to-purple-950 border-blue-800' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100'} rounded-xl p-4 border shadow-sm`}>
                <h2 className={`text-lg font-bold ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>{t.visualize}</h2>
                <p className={`${darkMode ? 'text-blue-400' : 'text-blue-700'} mb-2`}>{t.discover}</p>
                <div className="flex items-start mt-3 text-sm">
                  <div className="flex-1">
                    <div className={`font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-700'} flex items-center`}>
                      <Compass className="h-4 w-4 mr-1" /> {t.skillMapping}
                    </div>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{t.aiAnalyzes}</p>
                  </div>
                </div>
              </div>

              {messages.map((message) => (
                <div key={message.id} className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-xs md:max-w-md lg:max-w-lg ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${message.sender === 'user' ? 'bg-blue-500 ml-2' : 'bg-purple-500 mr-2'}`}>
                      {message.sender === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : darkMode 
                          ? 'bg-gray-800 border-gray-700 text-gray-100' 
                          : 'bg-white border border-gray-200 text-gray-800'
                    }`}>
                      <p className="whitespace-pre-line">{message.text}</p>
                      
                      {/* Display media preview if exists */}
                      {message.mediaPreview && message.mediaType?.startsWith('image/') && (
                        <div className="mt-2 rounded overflow-hidden">
                          <img 
                            src={message.mediaPreview} 
                            alt="Média" 
                            className="max-w-full h-auto max-h-48 object-contain"
                          />
                        </div>
                      )}
                      
                      {/* For non-image files */}
                      {message.mediaPreview && !message.mediaType?.startsWith('image/') && (
                        <div className="mt-2 p-2 bg-blue-400 rounded flex items-center">
                          <Paperclip className="h-4 w-4 mr-2" />
                          <span className="text-sm text-white truncate">
                            {typeof message.mediaPreview === 'string' ? message.mediaPreview : "Fichier attaché"}
                          </span>
                        </div>
                      )}
                      
                      <div className={`text-xs mt-1 ${
                        message.sender === 'user' 
                          ? 'text-blue-100' 
                          : darkMode 
                            ? 'text-gray-400' 
                            : 'text-gray-400'
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-500 mr-2 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className={`py-3 px-4 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700' 
                        : 'bg-white border border-gray-200'
                    }`}>
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showSkillMap && (
                <div className={`my-6 ${
                  darkMode 
                    ? 'bg-gray-800 border-blue-900' 
                    : 'bg-white border-blue-200'
                } rounded-xl border overflow-hidden shadow-sm`}>
                  <div className={`${
                    darkMode ? 'bg-blue-950 border-blue-900' : 'bg-blue-50 border-blue-100'
                  } p-3 border-b`}>
                    <h3 className={`font-semibold ${
                      darkMode ? 'text-blue-300' : 'text-blue-800'
                    } flex items-center`}>
                      <Map className="w-4 h-4 mr-2" /> {t.skillMapping}
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className={`relative h-64 ${
                      darkMode ? 'bg-gray-850' : 'bg-blue-50'
                    } rounded-lg p-2 overflow-hidden`}>
                      <div className="absolute inset-0 flex items-center justify-center opacity-5">
                        <Compass className={`w-40 h-40 ${
                          darkMode ? 'text-blue-400' : 'text-blue-500'
                        }`} />
                      </div>
                      {/* Skill Map Visualization */}
                      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-40 w-40 ${
                        darkMode ? 'bg-gray-700 border-blue-600' : 'bg-white border-blue-400'
                      } rounded-full shadow-md flex items-center justify-center border-2 z-10`}>
                        <div className="text-center">
                          <div className={`${
                            darkMode ? 'text-blue-300' : 'text-blue-600'
                          } font-bold`}>{t.youAreHere}</div>
                          <div className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>{t.startingPoint}</div>
                        </div>
                      </div>
                      {/* First level skills */}
                      <div className={`absolute top-1/4 left-1/4 h-20 w-20 ${
                        darkMode ? 'bg-purple-900 border-purple-700' : 'bg-purple-100 border-purple-300'
                      } rounded-full shadow flex items-center justify-center border animate-pulse`}>
                        <div className={`text-xs text-center ${
                          darkMode ? 'text-purple-300' : 'text-purple-800'
                        } font-medium`}>{t.fundamentalSkills}</div>
                      </div>
                      <div className={`absolute top-1/5 right-1/4 h-24 w-24 ${
                        darkMode ? 'bg-green-900 border-green-700' : 'bg-green-100 border-green-300'
                      } rounded-full shadow flex items-center justify-center border`}>
                        <div className={`text-xs text-center ${
                          darkMode ? 'text-green-300' : 'text-green-800'
                        } font-medium`}>{t.technicalSkills}</div>
                      </div>
                      <div className={`absolute bottom-1/4 left-1/3 h-16 w-16 ${
                        darkMode ? 'bg-orange-900 border-orange-700' : 'bg-orange-100 border-orange-300'
                      } rounded-full shadow flex items-center justify-center border`}>
                        <div className={`text-xs text-center ${
                          darkMode ? 'text-orange-300' : 'text-orange-800'
                        } font-medium`}>{t.softSkills}</div>
                      </div>
                      <div className={`absolute bottom-8 right-12 h-20 w-20 ${
                        darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-100 border-blue-300'
                      } rounded-full shadow flex items-center justify-center border`}>
                        <div className={`text-xs text-center ${
                          darkMode ? 'text-blue-300' : 'text-blue-800'
                        } font-medium`}>{t.certification}</div>
                      </div>
                      {/* Connecting lines */}
                      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                        <line x1="50%" y1="50%" x2="25%" y2="25%" stroke={darkMode ? "#4B5563" : "#d6d3e6"} strokeWidth="2" />
                        <line x1="50%" y1="50%" x2="75%" y2="20%" stroke={darkMode ? "#4B5563" : "#d6e9d8"} strokeWidth="2" />
                        <line x1="50%" y1="50%" x2="33%" y2="75%" stroke={darkMode ? "#4B5563" : "#f7e2d0"} strokeWidth="2" />
                        <line x1="50%" y1="50%" x2="80%" y2="80%" stroke={darkMode ? "#4B5563" : "#d6e5f3"} strokeWidth="2" />
                      </svg>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <button className={`text-sm ${
                        darkMode ? 'text-blue-400' : 'text-blue-600'
                      } flex items-center`}>
                        <Download className="h-4 w-4 mr-1" /> {t.downloadPDF}
                      </button>
                      <button className={`text-sm ${
                        darkMode ? 'text-blue-400' : 'text-blue-600'
                      } flex items-center`}>
                        {t.explore} <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggestions */}
          {showSuggestions && (
            <div className={`${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border-t p-3`}>
              <div className="max-w-3xl mx-auto">
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                } mb-2`}>{t.suggestions}</p>
                <div className="flex flex-wrap gap-2">
                  {suggestionsByLanguage[language].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`${
                        darkMode 
                          ? 'bg-blue-900 hover:bg-blue-800 text-blue-300' 
                          : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                      } px-3 py-2 rounded-full text-sm transition-colors duration-200`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Media preview */}
          {mediaPreview && (
            <div className={`${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border-t p-2`}>
              <div className={`max-w-3xl mx-auto flex items-center justify-between px-2 py-1 ${
                darkMode ? 'bg-blue-900' : 'bg-blue-50'
              } rounded`}>
                <div className="flex items-center overflow-hidden">
                  {mediaFile?.type.startsWith('image/') ? (
                    <div className={`h-10 w-10 rounded ${
                      darkMode ? 'bg-blue-800' : 'bg-blue-100'
                    } overflow-hidden mr-2 flex-shrink-0`}>
                      <img src={mediaPreview} alt="Aperçu" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className={`h-10 w-10 rounded ${
                      darkMode ? 'bg-blue-800' : 'bg-blue-100'
                    } mr-2 flex items-center justify-center flex-shrink-0`}>
                      <Paperclip className={`h-5 w-5 ${
                        darkMode ? 'text-blue-300' : 'text-blue-500'
                      }`} />
                    </div>
                  )}
                  <div className={`text-sm ${
                    darkMode ? 'text-blue-300' : 'text-blue-800'
                  } truncate`}>
                    {mediaFile?.name}
                  </div>
                </div>
                <button onClick={removeMedia} className={`ml-2 p-1 rounded-full ${
                  darkMode ? 'hover:bg-blue-800' : 'hover:bg-blue-100'
                }`}>
                  <X className={`h-5 w-5 ${
                    darkMode ? 'text-blue-300' : 'text-blue-500'
                  }`} />
                </button>
              </div>
            </div>
          )}

          {/* Error message for media upload */}
          {uploadError && (
            <div className={`${
              darkMode ? 'bg-red-900 border-red-800' : 'bg-red-50 border-red-200'
            } border-t p-2`}>
              <div className={`max-w-3xl mx-auto flex items-center px-3 py-1 ${
                darkMode ? 'text-red-300' : 'text-red-600'
              } text-sm`}>
                <AlertCircle className="h-4 w-4 mr-2" /> {uploadError}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className={`${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border-t p-4`}>
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={`w-full ${
                    darkMode 
                      ? 'bg-gray-700 text-white focus:ring-blue-600' 
                      : 'bg-gray-100 focus:ring-blue-500'
                  } border-none rounded-full py-3 pl-4 pr-24 focus:ring-2 focus:outline-none`}
                  placeholder={t.inputPlaceholder}
                />

                {/* Media upload button */}
                <button
                  onClick={handleFileSelect}
                  className={`absolute right-12 top-1/2 transform -translate-y-1/2 p-2 ${
                    darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-500'
                  }`}
                >
                  <Paperclip className="h-5 w-5" />
                </button>

                {/* Hidden file input */}
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                />

                {/* Send button */}
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() && !mediaFile}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-2 ${
                    (input.trim() || mediaFile) 
                      ? darkMode 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-blue-500 hover:bg-blue-600' 
                      : 'bg-gray-300'
                  } transition-colors duration-200`}
                >
                  <Send className={`h-4 w-4 ${
                    (input.trim() || mediaFile) ? 'text-white' : 'text-gray-500'
                  }`} />
                </button>
              </div>

              {/* Input area footer */}
              <div className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              } mt-2 flex items-center justify-center`}>
                <span>{t.guideText}</span>
                <span className="mx-1">•</span>
                <span className="flex items-center">
                  <Paperclip className="h-3 w-3 mr-1" /> {t.fileLimit}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;