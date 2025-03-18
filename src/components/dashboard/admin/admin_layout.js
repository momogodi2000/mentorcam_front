import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sun, Moon, Globe, Users, BookOpen, Calendar, Bell, 
  BarChart2, Settings, Menu, X, BookOpenCheck, 
  Wallet, LogOut, Search, UserCircle, MapPin,
  HelpCircle, ChevronRight, MessageSquare, Home, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../../authService';
import { getUser } from '../../services/get_user';

const AdminLayout = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isEnglish, setIsEnglish] = useState(() => localStorage.getItem('language') !== 'fr');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  const [showTooltip, setShowTooltip] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Default profile image
  const defaultProfileImage = useMemo(() => require("../../../assets/images/avarta1 (1).png"), []);

  // Update theme in localStorage and HTML
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Update language in localStorage
  useEffect(() => {
    localStorage.setItem('language', isEnglish ? 'en' : 'fr');
  }, [isEnglish]);

  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await getUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const menuItems = [
    { 
      icon: Home, 
      label: isEnglish ? 'Dashboard' : 'Tableau de Bord', 
      path: '/stat_page',
      badge: null 
    },
    { 
      icon: Users, 
      label: isEnglish ? 'Users' : 'Utilisateurs', 
      path: '/admin/users',
      badge: { text: '5', color: 'bg-blue-500' }
    },
    { 
      icon: BookOpen, 
      label: isEnglish ? 'Courses' : 'Formations', 
      path: '/admin',
      badge: null
    },
    { 
      icon: Calendar, 
      label: isEnglish ? 'Events' : 'Événements', 
      path: '/admin_events',
      badge: { text: 'New', color: 'bg-green-500' }
    },
    { 
      icon: Wallet, 
      label: isEnglish ? 'Payments' : 'Paiements', 
      path: '/revenue',
      badge: null
    },
    { 
      icon: Award, 
      label: isEnglish ? 'Certificates' : 'Certificats', 
      path: '#',
      badge: null
    },
    { 
      icon: MessageSquare, 
      label: isEnglish ? 'Messages' : 'Messages', 
      path: '#',
      badge: { text: '3', color: 'bg-red-500' }
    },
    { 
      icon: Settings, 
      label: isEnglish ? 'Settings' : 'Paramètres', 
      path: '/admin',
      badge: null
    }
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

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

  const handleImageError = () => {
    setImageError(true);
  };

  // Function to get the appropriate profile image
  const getProfileImage = () => {
    if (currentUser?.profile_picture && !imageError) {
      return currentUser.profile_picture;
    }
    return defaultProfileImage;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const sidebarVariants = {
    open: { 
      x: 0,
      boxShadow: "10px 0px 50px rgba(0,0,0,0.1)",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    },
    closed: { 
      x: "-100%",
      boxShadow: "none",
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 40 
      } 
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth < 1024 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-30 lg:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed top-0 left-0 z-40 w-72 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.7 }}
                className="bg-blue-600 text-white p-2 rounded-lg"
              >
                <BookOpenCheck className="w-6 h-6" />
              </motion.div>
              <motion.span 
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                MentorCam Pro
              </motion.span>
            </motion.div>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* User Profile Card */}
        <motion.div 
          variants={itemVariants}
          className="p-5 mx-4 my-4 rounded-xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8" />
          
          <div className="flex items-start space-x-4 relative z-10">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentUser?.profile_picture && !imageError ? (
                  <img
                    src={getProfileImage()}
                    alt="Profile"
                    className="w-14 h-14 rounded-full object-cover border-2 border-white/50 shadow-lg"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center shadow-lg border-2 border-white/50">
                    <UserCircle className="w-7 h-7 text-white" />
                  </div>
                )}
                <motion.div 
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, repeatDelay: 3 }}
                />
              </motion.div>
            </div>
            <div className="flex-1">
              <motion.h3 
                className="font-bold text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {currentUser?.full_name || 'Administrator'}
              </motion.h3>
              <motion.p 
                className="text-blue-100 text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                {currentUser?.email || 'admin@mentorcam.com'}
              </motion.p>
              <motion.div 
                className="flex items-center mt-2 text-sm text-blue-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <MapPin className="w-4 h-4 mr-1" />
                {currentUser?.location || 'System Administrator'}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Menu */}
        <motion.nav 
          className="flex-1 space-y-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {menuItems.map((item, index) => (
            <motion.button
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setShowTooltip(item.label)}
              onMouseLeave={() => setShowTooltip(null)}
              className={`flex items-center justify-between w-full p-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : `text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`
              }`}
            >
              <div className="flex items-center">
                <item.icon className={`w-5 h-5 mr-3 ${location.pathname === item.path ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                <span className="font-medium">{item.label}</span>
              </div>
              
              {item.badge && (
                <span className={`${item.badge.color} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                  {item.badge.text}
                </span>
              )}
            </motion.button>
          ))}
        </motion.nav>

        {/* Bottom Support Card */}
        <div className="p-4 border-t dark:border-gray-700">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="p-3 rounded-xl bg-blue-50 dark:bg-gray-700 mb-4"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white">
                  {isEnglish ? 'Need Help?' : 'Besoin d\'aide?'}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {isEnglish ? 'Check our documentation' : 'Consultez notre documentation'}
                </p>
                <motion.button
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 mt-2"
                >
                  {isEnglish ? 'View Documentation' : 'Voir Documentation'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </motion.button>
              </div>
            </div>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#FEE2E2' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-xl transition-colors text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">{isEnglish ? 'Logout' : 'Déconnexion'}</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : ''}`}>
        {/* Top Navigation */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-20 backdrop-blur-md bg-white/90 dark:bg-gray-800/90 shadow-sm border-b border-gray-200 dark:border-gray-700"
        >
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: isSidebarOpen ? 180 : 0 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </motion.button>

                {/* Breadcrumb - visible on larger screens */}
                <div className="hidden md:flex items-center space-x-2 text-sm">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Admin</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300 font-medium">
                    {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                  </span>
                </div>

                {/* Search Bar (visible on larger screens) */}
                <div className="hidden md:block relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isEnglish ? "Search..." : "Rechercher..."}
                    className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-1 md:space-x-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                  <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {isDarkMode ? (isEnglish ? 'Light Mode' : 'Mode Clair') : (isEnglish ? 'Dark Mode' : 'Mode Sombre')}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEnglish(!isEnglish)}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
                >
                  <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">{isEnglish ? 'EN' : 'FR'}</span>
                  <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {isEnglish ? 'Switch to French' : 'Switch to English'}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  {notificationCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold"
                    >
                      {notificationCount}
                    </motion.span>
                  )}
                  <span className="absolute bottom-full mb-2 right-0 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {isEnglish ? 'Notifications' : 'Notifications'}
                  </span>
                </motion.button>

                {/* User Profile Image - Mobile Only */}
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentUser?.profile_picture && !imageError ? (
                    <img
                      src={getProfileImage()}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-700 cursor-pointer"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center cursor-pointer">
                      <UserCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  <motion.div 
                    className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white dark:border-gray-800"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, repeatDelay: 3 }}
                  />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="px-4 pb-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEnglish ? "Search..." : "Rechercher..."}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </motion.header>

        {/* Content Area */}
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-4 md:p-6"
        >
          {isLoading ? (
            <div className="w-full flex justify-center items-center min-h-[70vh]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <>{children || <Outlet />}</>
          )}
        </motion.main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 mt-8">
          <div className="max-w-7xl mx-auto py-4 px-4 overflow-hidden">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              © 2025 MentorCam Pro. {isEnglish ? 'All rights reserved.' : 'Tous droits réservés.'}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;