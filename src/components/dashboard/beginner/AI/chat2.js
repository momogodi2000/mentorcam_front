import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, User, Bot, ChevronRight, Compass, Award, Map, Download, FileText, ArrowUp } from 'lucide-react';
import BeginnerLayout from '../biginner_layout'; // Update this path to match your project structure

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour! Je suis votre assistant IA personnel. Comment puis-je vous aider dans votre parcours professionnel aujourd'hui?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showSkillMap, setShowSkillMap] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);
  const messagesEndRef = useRef(null);
  
  const suggestions = [
    "Comment puis-je devenir un développeur web?",
    "Quelles compétences sont recherchées dans l'agriculture?",
    "Je cherche un mentor en entrepreneuriat",
    "Parcours professionnel en artisanat",
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const newMessages = [...messages, {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    }];
    
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setShowSuggestions(false);
    
    // Simulate AI response
    setTimeout(() => {
      let aiResponse;
      
      if (input.toLowerCase().includes('développeur') || input.toLowerCase().includes('web')) {
        aiResponse = "Le développement web est un domaine très demandé au Cameroun! Voici quelques étapes pour vous lancer:\n\n1. Commencez par apprendre HTML, CSS et JavaScript\n2. Explorez des frameworks comme React ou Laravel\n3. Créez un portfolio de projets\n\nJe vous recommande nos mentors comme Jean Takam (Développeur Full-Stack) et Marie Nkodo (Experte UI/UX). Souhaitez-vous voir votre cartographie de compétences pour ce parcours?";
        setShowSkillMap(true);
      } else if (input.toLowerCase().includes('agriculture')) {
        aiResponse = "L'agriculture présente d'excellentes opportunités au Cameroun! Les compétences recherchées incluent:\n\n• Techniques agricoles durables\n• Gestion des cultures\n• Connaissances en agritech\n• Expertise en chaîne d'approvisionnement\n\nVous pourriez explorer nos formations avec Pierre Mbarga, expert en agriculture moderne à Yaoundé. Souhaitez-vous voir une cartographie des compétences agricoles?";
        setShowSkillMap(true);
      } else if (input.toLowerCase().includes('mentor') || input.toLowerCase().includes('entrepreneuriat')) {
        aiResponse = "Excellent choix! L'entrepreneuriat est dynamique au Cameroun. Nous avons plusieurs mentors spécialisés comme:\n\n• Sophie Tekam (Douala) - Experte en création d'entreprise\n• Paul Etoundi (Yaoundé) - Spécialiste en financement\n\nIls peuvent vous guider sur le business plan, les stratégies de financement et la gestion. Souhaitez-vous une analyse personnalisée de votre parcours entrepreneurial?";
      } else if (input.toLowerCase().includes('artisanat')) {
        aiResponse = "L'artisanat camerounais est reconnu mondialement! Voici quelques parcours possibles:\n\n• Sculpture sur bois - formation avec Maître Ndongo\n• Tissage traditionnel - atelier de Mme Bella\n• Création de bijoux - programme de certification avec l'institut d'artisanat\n\nCes compétences sont très demandées, surtout avec le développement du tourisme. Souhaitez-vous voir les opportunités régionales?";
        setShowSkillMap(true);
      } else {
        aiResponse = "Merci pour votre question! Pour mieux vous orienter dans votre parcours professionnel, pourriez-vous préciser quel domaine vous intéresse particulièrement? Je peux vous aider à identifier les compétences recherchées, les mentors disponibles et visualiser votre progression potentielle sur le marché camerounais.";
      }
      
      setMessages([...newMessages, {
        id: newMessages.length + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      }]);
      
      setLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
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

  // The component content to be rendered inside BeginnerLayout
  const chatContent = (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {/* Banner */}
          <div className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 shadow-sm dark:from-blue-900 dark:to-purple-900 dark:border-blue-800">
            <h2 className="text-lg font-bold text-blue-800 dark:text-blue-300">Visualisez Votre Avenir Professionnel</h2>
            <p className="text-blue-700 mb-2 dark:text-blue-400">Découvrez des parcours professionnels adaptés au marché camerounais grâce à notre technologie IA.</p>
            <div className="flex items-start mt-3 text-sm">
              <div className="flex-1">
                <div className="font-semibold text-purple-700 flex items-center dark:text-purple-400">
                  <Compass className="h-4 w-4 mr-1" /> Cartographie des Compétences
                </div>
                <p className="text-gray-600 mt-1 dark:text-gray-400">Notre IA analyse vos compétences et vous propose un plan de développement personnalisé.</p>
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
                    : isDarkMode 
                      ? 'bg-gray-800 border border-gray-700 text-gray-200' 
                      : 'bg-white border border-gray-200 text-gray-800'
                }`}>
                  <p className="whitespace-pre-line">{message.text}</p>
                  <div className={`text-xs mt-1 ${
                    message.sender === 'user' 
                      ? 'text-blue-100' 
                      : isDarkMode 
                        ? 'text-gray-500' 
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
                  isDarkMode 
                    ? 'bg-gray-800 border border-gray-700' 
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
            <div className={`my-6 rounded-xl border overflow-hidden shadow-sm ${
              isDarkMode 
                ? 'bg-gray-800 border-blue-800' 
                : 'bg-white border-blue-200'
            }`}>
              <div className={`p-3 border-b ${
                isDarkMode 
                  ? 'bg-blue-900 border-blue-800' 
                  : 'bg-blue-50 border-blue-100'
              }`}>
                <h3 className={`font-semibold flex items-center ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-800'
                }`}>
                  <Map className="w-4 h-4 mr-2" /> Cartographie des Compétences
                </h3>
              </div>
              <div className="p-4">
                <div className={`relative h-64 rounded-lg p-2 overflow-hidden ${
                  isDarkMode ? 'bg-gray-900' : 'bg-blue-50'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-5">
                    <Compass className="w-40 h-40 text-blue-500" />
                  </div>
                  
                  {/* Skill Map Visualization */}
                  <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full shadow-md flex items-center justify-center border-2 border-blue-400 z-10 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <div className="text-center">
                      <div className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Vous</div>
                      <div className="text-xs text-gray-500">Point de départ</div>
                    </div>
                  </div>
                  
                  {/* First level skills */}
                  <div className={`absolute top-1/4 left-1/4 h-20 w-20 rounded-full shadow flex items-center justify-center border animate-pulse ${
                    isDarkMode ? 'bg-purple-900 border-purple-700' : 'bg-purple-100 border-purple-300'
                  }`}>
                    <div className={`text-xs text-center font-medium ${
                      isDarkMode ? 'text-purple-300' : 'text-purple-800'
                    }`}>Compétences Fondamentales</div>
                  </div>
                  
                  <div className={`absolute top-1/5 right-1/4 h-24 w-24 rounded-full shadow flex items-center justify-center border ${
                    isDarkMode ? 'bg-green-900 border-green-700' : 'bg-green-100 border-green-300'
                  }`}>
                    <div className={`text-xs text-center font-medium ${
                      isDarkMode ? 'text-green-300' : 'text-green-800'
                    }`}>Compétences Techniques</div>
                  </div>
                  
                  <div className={`absolute bottom-1/4 left-1/3 h-16 w-16 rounded-full shadow flex items-center justify-center border ${
                    isDarkMode ? 'bg-orange-900 border-orange-700' : 'bg-orange-100 border-orange-300'
                  }`}>
                    <div className={`text-xs text-center font-medium ${
                      isDarkMode ? 'text-orange-300' : 'text-orange-800'
                    }`}>Soft Skills</div>
                  </div>
                  
                  <div className={`absolute bottom-8 right-12 h-20 w-20 rounded-full shadow flex items-center justify-center border ${
                    isDarkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-100 border-blue-300'
                  }`}>
                    <div className={`text-xs text-center font-medium ${
                      isDarkMode ? 'text-blue-300' : 'text-blue-800'
                    }`}>Certification</div>
                  </div>
                  
                  {/* Connecting lines */}
                  <svg className="absolute inset-0 w-full h-full" style={{zIndex: 1}}>
                    <line x1="50%" y1="50%" x2="25%" y2="25%" stroke={isDarkMode ? "#6b46c1" : "#d6d3e6"} strokeWidth="2" />
                    <line x1="50%" y1="50%" x2="75%" y2="20%" stroke={isDarkMode ? "#065f46" : "#d6e9d8"} strokeWidth="2" />
                    <line x1="50%" y1="50%" x2="33%" y2="75%" stroke={isDarkMode ? "#9a3412" : "#f7e2d0"} strokeWidth="2" />
                    <line x1="50%" y1="50%" x2="80%" y2="80%" stroke={isDarkMode ? "#1e40af" : "#d6e5f3"} strokeWidth="2" />
                  </svg>
                </div>
                
                <div className="mt-3 flex justify-between">
                  <button className={`text-sm flex items-center ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    <Download className="h-4 w-4 mr-1" /> Télécharger PDF
                  </button>
                  <button className={`text-sm flex items-center ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    Explorer <ChevronRight className="h-4 w-4 ml-1" />
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
        <div className={`border-t p-3 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="max-w-3xl mx-auto">
            <p className={`text-sm mb-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Questions suggérées:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-3 py-2 rounded-full text-sm transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-blue-900 hover:bg-blue-800 text-blue-300' 
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className={`border-t p-4 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full border-none rounded-full py-3 pl-4 pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                isDarkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400' 
                  : 'bg-gray-100 text-gray-800'
              }`}
              placeholder="Posez une question sur votre parcours professionnel..."
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full p-2 transition-colors duration-200 ${
                input.trim() 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : isDarkMode 
                    ? 'bg-gray-600' 
                    : 'bg-gray-300'
              }`}
            >
              <Send className={`h-4 w-4 ${
                input.trim() 
                  ? 'text-white' 
                  : isDarkMode 
                    ? 'text-gray-400' 
                    : 'text-gray-500'
              }`} />
            </button>
          </div>
          <div className={`text-xs mt-2 text-center ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            L'assistant IA vous guidera dans le développement de vos compétences adaptées au marché camerounais
          </div>
        </div>
      </div>
      
      {/* Mobile scroll to top button */}
      <button 
        className="md:hidden fixed bottom-20 right-6 bg-blue-500 text-white p-2 rounded-full shadow-lg z-10"
        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );

  return (
    <BeginnerLayout 
      isDarkMode={isDarkMode} 
      setIsDarkMode={setIsDarkMode}
      isEnglish={isEnglish}
      setIsEnglish={setIsEnglish}
    >
      {chatContent}
    </BeginnerLayout>
  );
};

export default AIChat;