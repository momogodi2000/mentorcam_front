import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Moon, Globe, Users, Calendar, Search, Bell, Menu, X,
  Building, Briefcase, ChartBar, Target, FileText, Settings,
  UserCheck, LogOut, UserPlus, ChevronRight, ChevronLeft, 
  Sparkles, LayoutDashboard, HelpCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../../authService';
import { getUser } from '../../services/get_user';
import { Card, CardContent } from '../../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { Tooltip } from '../../ui/tooltip';
import { Badge } from '../../ui/badge';
import { Skeleton } from '../../ui/skeleton';

const InstitutionLayout = ({ children, isEnglish, setIsEnglish }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Default profile image URL
  const defaultProfileImage = require("../../../assets/images/avarta.webp");

  useEffect(() => {
    // Check user preference for dark mode
    const userPrefersDark = localStorage.getItem('darkMode') === 'true' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setIsDarkMode(userPrefersDark);
    if (userPrefersDark) {
      document.documentElement.classList.add('dark');
    }

    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      
      if (width < 768) {
        setIsSidebarOpen(false);
        setIsSidebarCollapsed(false);
      } else if (width < 1024) {
        setIsSidebarCollapsed(true);
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(true);
        setIsSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoading(true);
      try {
        const userData = await getUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark');
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: isEnglish ? 'Dashboard' : 'Tableau de Bord', 
      path: '/institut_dashboard',
      badge: 'New'
    },
    { 
      icon: Briefcase, 
      label: isEnglish ? 'Job Offers' : 'Offres d\'Emploi', 
      path: '/job',
      count: 12
    },
    { 
      icon: Calendar, 
      label: isEnglish ? 'Events' : 'Événements', 
      path: '/event',
      count: 5
    },
    { 
      icon: Target, 
      label: isEnglish ? 'Recruitment' : 'Recrutement', 
      path: '/Recruitment'
    },
    { 
      icon: UserPlus, 
      label: isEnglish ? 'Job Applicants' : 'Candidats', 
      path: '/job_apply',
      count: 8 
    },
    { 
      icon: FileText, 
      label: isEnglish ? 'Reports' : 'Rapports', 
      path: '/rapport'
    },
    { 
      icon: Settings, 
      label: isEnglish ? 'Settings' : 'Paramètres', 
      path: '/setting_institute'
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
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  const getProfileImage = () => {
    if (currentUser?.profile_picture && !imageError) {
      return currentUser.profile_picture;
    }
    return defaultProfileImage;
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const newSearches = [
        searchQuery, 
        ...recentSearches.filter(s => s !== searchQuery).slice(0, 4)
      ];
      setRecentSearches(newSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
      setShowSearchDropdown(false);
      // Implement actual search functionality here
      console.log('Searching for:', searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  // Variants for animations
  const sidebarVariants = {
    open: {
      width: isSidebarCollapsed ? '5rem' : '16rem',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      width: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    mobile: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    mobileClosed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={isMobile ? "mobileClosed" : "closed"}
            animate={isMobile ? "mobile" : "open"}
            exit={isMobile ? "mobileClosed" : "closed"}
            variants={sidebarVariants}
            className={`fixed top-0 left-0 z-40 h-screen 
              ${isMobile ? 'w-72' : isSidebarCollapsed ? 'w-20' : 'w-64'}
              ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
              flex flex-col
              border-r border-gray-200 dark:border-gray-700
              shadow-lg overflow-hidden`}
          >
            {/* Sidebar Header */}
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.2}}
              className="flex items-center justify-between p-4 border-b dark:border-gray-700"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => navigate('/institut_dashboard')}
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="p-2 rounded-lg bg-blue-600 text-white"
                >
                  <Building className="w-6 h-6" />
                </motion.div>
                {!isSidebarCollapsed && (
                  <span className="text-xl font-bold">
                    Tech<span className="text-blue-600">Corp</span>
                  </span>
                )}
              </motion.div>
              
              {!isSidebarCollapsed && (
                <div className="flex gap-2">
                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsSidebarOpen(false)}
                      className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                  {!isMobile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleSidebar}
                      className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              )}
              
              {isSidebarCollapsed && !isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              )}
            </motion.div>

            <div className="flex-1 overflow-y-auto">
              {/* User Profile Section */}
              {!isSidebarCollapsed && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUpVariants}
                  custom={0}
                  className="p-4"
                >
                  <Card className="mb-4">
                    <CardContent className="p-3">
                      {isLoading ? (
                        <div className="flex items-center space-x-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10 border-2 border-blue-500">
                            <AvatarImage 
                              src={getProfileImage()} 
                              onError={handleImageError}
                            />
                            <AvatarFallback className="bg-blue-600 text-white">
                              {getUserInitials()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="overflow-hidden">
                            <motion.h3 
                              whileHover={{x: 3}}
                              className="font-medium truncate"
                            >
                              {currentUser?.full_name || 'Loading...'}
                            </motion.h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {currentUser?.email || 'Loading...'}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Navigation Menu */}
              <motion.nav 
                initial="hidden"
                animate="visible"
                variants={staggerVariants}
                className="px-2 py-2"
              >
                {menuItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  
                  return isSidebarCollapsed ? (
                    <Tooltip key={index} text={item.label} side="right">
                      <motion.button
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUpVariants}
                        custom={index}
                        whileHover={{ 
                          scale: 1.05, 
                          backgroundColor: isDarkMode ? 'rgb(55, 65, 81)' : 'rgb(243, 244, 246)' 
                        }}
                        onClick={() => {
                          navigate(item.path);
                          if (isMobile) setIsSidebarOpen(false);
                        }}
                        className={`flex flex-col items-center justify-center w-full p-3 mb-1 rounded-lg transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                        }`}
                      >
                        <div className="relative">
                          <item.icon className="w-5 h-5" />
                          {(item.count > 0 || item.badge) && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                              {item.count > 0 && (
                                <Badge className="absolute h-4 min-w-4 rounded-full flex items-center justify-center text-xs bg-red-500">
                                  {item.count > 99 ? '99+' : item.count}
                                </Badge>
                              )}
                              {item.badge && (
                                <motion.span 
                                  animate="pulse"
                                  variants={pulseVariants}
                                  className="absolute h-2 w-2 rounded-full bg-green-500"
                                />
                              )}
                            </span>
                          )}
                        </div>
                      </motion.button>
                    </Tooltip>
                  ) : (
                    <motion.button
                      key={index}
                      initial="hidden"
                      animate="visible"
                      variants={fadeInUpVariants}
                      custom={index}
                      whileHover={{ 
                        x: 4,
                        transition: { duration: 0.2 } 
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigate(item.path);
                        if (isMobile) setIsSidebarOpen(false);
                      }}
                      className={`flex items-center justify-between w-full p-3 mb-1 rounded-lg transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center">
                        {item.count > 0 && (
                          <Badge 
                            className={`mr-1 ${isActive ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'}`}
                          >
                            {item.count}
                          </Badge>
                        )}
                        {item.badge && (
                          <motion.div 
                            animate="pulse"
                            variants={pulseVariants}
                            className="rounded-md px-2 py-0.5 text-xs bg-green-500 text-white"
                          >
                            {item.badge}
                          </motion.div>
                        )}
                        {isActive && (
                          <div className="ml-2 h-6 w-1 bg-white rounded-full"></div>
                        )}
                      </div>
                    </motion.button>
                  )}
                )}
              </motion.nav>
            </div>

            {/* Sidebar Footer */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUpVariants}
              custom={menuItems.length + 1}
              className="sticky bottom-0 w-full p-4 mt-auto border-t border-gray-200 dark:border-gray-700 bg-inherit"
            >
              {isSidebarCollapsed ? (
                <Tooltip text={isEnglish ? 'Logout' : 'Déconnexion'} side="right">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleLogout}
                    className="w-full h-10 rounded-lg"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </Tooltip>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/help')}
                    className="flex items-center w-full justify-center"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    <span className="truncate">
                      {isEnglish ? 'Help Center' : 'Centre d\'aide'}
                    </span>
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="flex items-center w-full justify-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="truncate">
                      {isEnglish ? 'Logout' : 'Déconnexion'}
                    </span>
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${
        isSidebarOpen && !isMobile ? (isSidebarCollapsed ? 'ml-20' : 'ml-64') : 'ml-0'
      }`}>
        {/* Top Bar */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          custom={0}
          className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-md"
        >
          <Card className="rounded-none border-0 border-b">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Menu className="w-5 h-5" />
                </Button>

                <div className="flex-1 w-full sm:max-w-xl">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={isEnglish ? "Search talents, events..." : "Rechercher talents, événements..."}
                      className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                        dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-800
                        transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearch}
                      onFocus={() => setShowSearchDropdown(true)}
                      autoComplete="off"
                    />
                    {searchQuery && (
                      <button 
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    
                    {/* Search dropdown */}
                    <AnimatePresence>
                      {showSearchDropdown && (recentSearches.length > 0 || searchQuery) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
                        >
                          {searchQuery ? (
                            <div className="p-2 text-sm text-gray-500 dark:text-gray-400">
                              {isEnglish ? 'Press Enter to search' : 'Appuyez sur Entrée pour rechercher'}
                            </div>
                          ) : recentSearches.length > 0 && (
                            <>
                              <div className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                {isEnglish ? 'Recent Searches' : 'Recherches récentes'}
                              </div>
                              {recentSearches.map((search, idx) => (
                                <motion.div
                                  key={idx}
                                  whileHover={{ backgroundColor: isDarkMode ? 'rgb(55, 65, 81)' : 'rgb(243, 244, 246)' }}
                                  className="flex items-center p-2 rounded-md cursor-pointer"
                                  onClick={() => {
                                    setSearchQuery(search);
                                    setShowSearchDropdown(false);
                                  }}
                                >
                                  <Search className="w-3 h-3 mr-2 text-gray-400" />
                                  <span className="text-sm">{search}</span>
                                </motion.div>
                              ))}
                            </>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {isDarkMode ? (
                      <Sun className="w-5 h-5 text-yellow-300" />
                    ) : (
                      <Moon className="w-5 h-5 text-gray-600" />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsEnglish(!isEnglish)}
                    className="flex items-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Globe className="w-5 h-5 text-blue-500" />
                    <span className="ml-2 text-sm font-medium">{isEnglish ? 'EN' : 'FR'}</span>
                  </motion.button>
                  <Tooltip text={isEnglish ? 'Notifications' : 'Notifications'} side="bottom">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      {notificationCount > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold"
                        >
                          {notificationCount}
                        </motion.div>
                      )}
                    </motion.button>
                  </Tooltip>
                  
                  {!isMobile && (
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="hidden md:flex items-center cursor-pointer"
                      onClick={() => navigate('/profile')}
                    >
                      <Avatar className="w-8 h-8 border border-gray-200 dark:border-gray-700">
                        <AvatarImage src={getProfileImage()} onError={handleImageError} />
                        <AvatarFallback className="bg-blue-600 text-white text-xs">
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

        {/* Add a backdrop for mobile when sidebar is open */}
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Page Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          custom={1}
          className="p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            {/* Page title would go here */}
          </motion.div>
          
          {/* Main content */}
          <div className="transition-all duration-500 ease-in-out">
            {children}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          custom={2}
          className="border-t border-gray-200 dark:border-gray-700 mt-8 py-6 px-4 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
            <span>© 2025 TechCorp.</span>
            <span className="hidden sm:block">|</span>
            <div className="flex items-center">
              <Sparkles className="w-4 h-4 mr-1 text-blue-500" />
              <span>{isEnglish ? 'Empowering talents worldwide' : 'Développer les talents mondialement'}</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default InstitutionLayout;