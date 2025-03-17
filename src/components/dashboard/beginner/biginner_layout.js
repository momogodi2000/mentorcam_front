import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
  Sun, Moon, Globe, Users, BookOpen, Calendar, Search,
  Bell, Menu, X, BookOpenCheck, MessageSquare, Star,
  Award, User, LogOut, Home, Briefcase, CalendarDays, MessageCircle,
  ChevronLeft, ChevronRight, Settings, HelpCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../../authService';
import { getUser } from '../../services/get_user';
import { Card, CardContent } from '../../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { useMediaQuery } from '../../ui/useMediaQuery';

const BeginnerLayout = ({ children, isDarkMode, setIsDarkMode, isEnglish, setIsEnglish }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const sidebarAnimation = useAnimation();
  
  const isSmallScreen = useMediaQuery('(max-width: 1024px)');
  const isExtraSmallScreen = useMediaQuery('(max-width: 640px)');
  
  // Default profile image
  const defaultProfileImage = require("../../../assets/images/avarta.webp");

  useEffect(() => {
    if (isSmallScreen && !isExtraSmallScreen) {
      setIsCompact(true);
      setIsSidebarOpen(true);
    } else if (isExtraSmallScreen) {
      setIsSidebarOpen(false);
      setIsCompact(false);
    } else {
      setIsCompact(false);
      setIsSidebarOpen(true);
    }
  }, [isSmallScreen, isExtraSmallScreen]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true);
      try {
        const userData = await getUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        handleLogout();
      } finally {
        setTimeout(() => setIsLoading(false), 800); // Add a slight delay for smoother transitions
      }
    };

    fetchCurrentUser();
  }, []);

  const menuItems = [
    { 
      icon: Home, 
      label: isEnglish ? 'Dashboard' : 'Tableau de bord', 
      path: '/beginner_dashboard',
      badge: null
    },
    { 
      icon: BookOpen, 
      label: isEnglish ? 'Learning Path' : 'Parcours d\'apprentissage', 
      path: '/learning',
      badge: { count: '2', color: 'bg-green-500' }
    },
    { 
      icon: Users, 
      label: isEnglish ? 'Find Mentors' : 'Trouver des Mentors', 
      path: '/mentors',
      badge: null
    },
    { 
      icon: CalendarDays, 
      label: isEnglish ? 'Events' : 'Événements', 
      path: '/find_events',
      badge: { count: '1', color: 'bg-yellow-500' }
    },
    { 
      icon: Briefcase, 
      label: isEnglish ? 'Job Opportunities' : 'Offres d\'emploi', 
      path: '/job_applicant',
      badge: null
    },
    { 
      icon: Calendar, 
      label: isEnglish ? 'Sessions' : 'Sessions', 
      path: '/sessions',
      badge: null
    },
    { 
      icon: MessageSquare, 
      label: isEnglish ? 'Messages' : 'Messages', 
      path: '/chat',
      badge: { count: '5', color: 'bg-blue-500' }
    },
    { 
      icon: MessageCircle, 
      label: isEnglish ? 'AI Chat' : 'Chat IA', 
      path: '/ai_chat',
      badge: null
    },
    { 
      icon: Star, 
      label: isEnglish ? 'Rate' : 'Évaluer', 
      path: '/rate',
      badge: null
    },
    { 
      icon: User, 
      label: isEnglish ? 'Profile' : 'Profil', 
      path: '/profile',
      badge: null
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login', { replace: true });
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login', { replace: true });
    }
  };

  const getUserInitials = () => {
    if (!currentUser) return 'U';
    const names = currentUser.full_name ? currentUser.full_name.split(' ') : [];
    return names.length >= 2 ? `${names[0][0]}${names[1][0]}`.toUpperCase() 
      : currentUser.full_name ? currentUser.full_name[0].toUpperCase() : 'U';
  };

  const toggleSidebar = () => {
    if (isSmallScreen && !isExtraSmallScreen) {
      setIsCompact(!isCompact);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const expandSearch = () => {
    setIsSearchExpanded(true);
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const contractSearch = () => {
    if (!searchQuery) {
      setIsSearchExpanded(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Handle search submission
      console.log('Searching for:', searchQuery);
      // navigate('/search-results', { state: { query: searchQuery } });
    }
  };

  // Animation variants
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
    compact: { width: '5rem' },
    full: { width: '16rem' }
  };

  const contentVariants = {
    sidebarOpen: { marginLeft: isCompact ? '5rem' : '16rem' },
    sidebarClosed: { marginLeft: 0 }
  };

  const menuItemVariants = {
    hover: { scale: 1.03, backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.9)' : 'rgba(243, 244, 246, 0.9)' },
    tap: { scale: 0.97 },
    active: { backgroundColor: '#2563eb', color: 'white' }
  };

  const badgeVariants = {
    initial: { scale: 0 },
    animate: { scale: 1, transition: { type: 'spring', stiffness: 500, damping: 25 } }
  };

  const iconButtonVariants = {
    hover: { scale: 1.15, rotate: 5 },
    tap: { scale: 0.85 }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <AnimatePresence mode="wait">
        {(isSidebarOpen || isCompact) && (
          <motion.aside
            initial={isCompact ? 'compact' : 'full'}
            animate={isCompact ? 'compact' : 'full'}
            variants={sidebarVariants}
            transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
            className={`fixed top-0 left-0 z-40 h-screen shadow-lg backdrop-blur-sm ${
              isDarkMode 
                ? 'bg-gray-800/95 text-white border-r border-gray-700' 
                : 'bg-white/95 text-gray-900 border-r border-gray-200'
            }`}
          >
            <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {!isCompact && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-3 cursor-pointer overflow-hidden"
                  onClick={() => navigate('/beginner_dashboard')}
                >
                  <BookOpenCheck className="w-8 h-8 text-blue-600" />
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`text-xl font-bold whitespace-nowrap`}
                  >
                    MentorCam
                  </motion.span>
                </motion.div>
              )}
              
              {isCompact && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-full flex justify-center cursor-pointer"
                  onClick={() => navigate('/beginner_dashboard')}
                >
                  <BookOpenCheck className="w-8 h-8 text-blue-600" />
                </motion.div>
              )}
              
              {!isCompact && (
                <motion.button
                  variants={iconButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={toggleSidebar}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {isSmallScreen ? <ChevronLeft className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </motion.button>
              )}
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100vh-68px)]">
              {!isCompact && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="mb-6 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 border-0 shadow-md">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 500 }}>
                          <Avatar className="w-12 h-12 ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-800">
                            {currentUser?.profile_picture ? (
                              <AvatarImage 
                                src={currentUser.profile_picture} 
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = defaultProfileImage;
                                }} 
                              />
                            ) : (
                              <AvatarImage src={defaultProfileImage} />
                            )}
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-lg">
                              {getUserInitials()}
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white text-lg">
                            {currentUser?.full_name || 'Loading...'}
                          </h3>
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center"
                          >
                            <span className="text-sm text-gray-500 dark:text-gray-300 truncate max-w-[120px]">
                              {currentUser?.email || 'Loading...'}
                            </span>
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Active
                            </span>
                          </motion.div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {isLoading && !isCompact && (
                <div className="mb-6 animate-pulse">
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              )}

              <nav className="space-y-1">
                {menuItems.map((item, index) => (
                  <TooltipProvider key={item.path} delayDuration={isCompact ? 200 : 1000}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          variants={menuItemVariants}
                          whileHover="hover"
                          whileTap="tap"
                          animate={location.pathname === item.path ? "active" : ""}
                          onClick={() => navigate(item.path)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ 
                            opacity: 1, 
                            x: 0,
                            backgroundColor: location.pathname === item.path 
                              ? '#2563eb' 
                              : 'transparent'
                          }}
                          transition={{ 
                            delay: 0.1 + index * 0.05, 
                            duration: 0.3 
                          }}
                          className={`flex items-center w-full ${isCompact ? 'justify-center' : 'justify-between'} p-3 rounded-lg transition-all ${
                            location.pathname === item.path
                              ? 'text-white shadow-md' 
                              : `${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`
                          }`}
                        >
                          <div className="flex items-center">
                            <item.icon className={`${isCompact ? 'w-6 h-6' : 'w-5 h-5 mr-3'}`} />
                            {!isCompact && (
                              <span className="transition-opacity duration-200">{item.label}</span>
                            )}
                          </div>
                          
                          {!isCompact && item.badge && (
                            <motion.span
                              variants={badgeVariants}
                              initial="initial"
                              animate="animate"
                              className={`${item.badge.color} text-white text-xs font-bold px-2 py-1 rounded-full`}
                            >
                              {item.badge.count}
                            </motion.span>
                          )}
                        </motion.button>
                      </TooltipTrigger>
                      {isCompact && (
                        <TooltipContent side="right">
                          <div className="flex items-center space-x-2">
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className={`${item.badge.color} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                                {item.badge.count}
                              </span>
                            )}
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </nav>
            </div>

            <motion.div
              className={`absolute bottom-0 w-full p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              {!isCompact ? (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex space-x-2 mb-4"
                  >
                    <Button
                      variant="outline"
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="flex-1 flex items-center justify-center"
                    >
                      {isDarkMode ? (
                        <Sun className="w-4 h-4 mr-2" />
                      ) : (
                        <Moon className="w-4 h-4 mr-2" />
                      )}
                      {isDarkMode ? (isEnglish ? 'Light' : 'Clair') : (isEnglish ? 'Dark' : 'Sombre')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEnglish(!isEnglish)}
                      className="flex-1 flex items-center justify-center"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      {isEnglish ? 'FR' : 'EN'}
                    </Button>
                  </motion.div>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="flex items-center w-full justify-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {isEnglish ? 'Logout' : 'Déconnexion'}
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          variants={iconButtonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => setIsDarkMode(!isDarkMode)}
                          className="p-2 rounded-full mx-auto hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          {isDarkMode ? (
                            <Sun className="w-5 h-5" />
                          ) : (
                            <Moon className="w-5 h-5" />
                          )}
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {isDarkMode ? (isEnglish ? 'Light Mode' : 'Mode Clair') : (isEnglish ? 'Dark Mode' : 'Mode Sombre')}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          variants={iconButtonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={handleLogout}
                          className="p-2 rounded-full mx-auto text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                        >
                          <LogOut className="w-5 h-5" />
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {isEnglish ? 'Logout' : 'Déconnexion'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>

      <motion.div 
        initial="sidebarOpen"
        animate={isSidebarOpen || isCompact ? "sidebarOpen" : "sidebarClosed"}
        variants={contentVariants}
        transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
        className={`p-4 transition-all duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-30 pb-4"
        >
          <Card className="overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {!isSidebarOpen && !isCompact && (
                    <motion.button
                      variants={iconButtonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={toggleSidebar}
                      className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Menu className="w-6 h-6" />
                    </motion.button>
                  )}
                  
                  {(isCompact || (isSidebarOpen && isSmallScreen && !isExtraSmallScreen)) && (
                    <motion.button
                      variants={iconButtonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={toggleSidebar}
                      className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {isCompact ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                    </motion.button>
                  )}
                  
                  <motion.div 
                    initial={false}
                    animate={{ 
                      width: isSearchExpanded ? '100%' : isExtraSmallScreen ? '100%' : '300px',
                      scale: isSearchExpanded ? 1.02 : 1
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="relative"
                  >
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      isSearchExpanded ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchSubmit}
                      onFocus={expandSearch}
                      onBlur={contractSearch}
                      placeholder={isEnglish ? "Search for mentors, skills..." : "Rechercher des mentors, compétences..."}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all ${
                        isSearchExpanded 
                          ? 'border-blue-300 dark:border-blue-500 shadow-md' 
                          : 'border-gray-200 dark:border-gray-700'
                      } dark:bg-gray-700 dark:text-white`}
                    />
                  </motion.div>
                </div>

                <div className="flex items-center space-x-1 md:space-x-3">
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          variants={iconButtonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => setIsDarkMode(!isDarkMode)}
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {isDarkMode ? (
                            <Sun className="w-5 h-5 text-yellow-400" />
                          ) : (
                            <Moon className="w-5 h-5 text-gray-600" />
                          )}
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          variants={iconButtonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => setIsEnglish(!isEnglish)}
                          className="flex items-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Globe className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                          <span className="ml-1 font-medium">{isEnglish ? 'EN' : 'FR'}</span>
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isEnglish ? 'Switch to French' : 'Switch to English'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          variants={iconButtonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Bell className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                          {unreadNotifications > 0 && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full"
                            >
                              {unreadNotifications}
                            </motion.div>
                          )}
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {unreadNotifications > 0 
                          ? `${unreadNotifications} unread notifications` 
                          : 'No new notifications'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          variants={iconButtonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => navigate('/settings')}
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Settings className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isEnglish ? 'Settings' : 'Paramètres'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.button
                          variants={iconButtonVariants}
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => navigate('/help')}
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <HelpCircle className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                        </motion.button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isEnglish ? 'Help Center' : 'Centre d\'aide'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {!isLoading && (
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="hidden md:block"
                    >
                      <Avatar 
                        className="w-10 h-10 ring-2 ring-blue-500 cursor-pointer"
                        onClick={() => navigate('/profile')}
                      >
                        {currentUser?.profile_picture ? (
                          <AvatarImage 
                            src={currentUser.profile_picture} 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultProfileImage;
                            }} 
                          />
                        ) : (
                          <AvatarImage src={defaultProfileImage} />
                        )}
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                  )}
                               </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-4"
        >
          {children}
        </motion.main>
      </motion.div>
    </div>
  );
};

export default BeginnerLayout;