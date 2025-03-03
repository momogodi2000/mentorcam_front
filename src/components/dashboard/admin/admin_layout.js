import React, { useState, useEffect } from 'react';
import { Sun, Moon, Globe, Users, BookOpen, Calendar, Bell, BarChart2, Settings, Menu, X, BookOpenCheck, TrendingUp, Wallet, PhoneCall, LogOut, Search, UserCircle, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../../authService';
import { getUser } from '../../services/get_user';

const AdminLayout = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Default profile image URL (can be replaced with an actual image path)
  const defaultProfileImage = require("../../../assets/images/avarta1 (1).png");

  // Fetch current user data on component mount
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
    { icon: BarChart2, label: isEnglish ? 'Dashboard' : 'Tableau de Bord', path: '/stat_page' },
    { icon: Users, label: isEnglish ? 'Users' : 'Utilisateurs', path: '/admin/users' },
    { icon: BookOpen, label: isEnglish ? 'Courses' : 'Formations', path: '/admin' },
    { icon: Calendar, label: isEnglish ? 'Events' : 'Événements', path: '/admin_events' },
    { icon: Wallet, label: isEnglish ? 'Payments' : 'Paiements', path: '/revenue' },
    { icon: Settings, label: isEnglish ? 'Settings' : 'Paramètres', path: '/admin' }
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
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

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 z-40 w-72 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl overflow-y-auto"
          >
            {/* Sidebar Header */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-4 border-b dark:border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <BookOpenCheck className="w-8 h-8 text-blue-600" />
                </motion.div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  MentorCam
                </span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </motion.div>

            {/* User Profile Card */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 mx-4 my-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white"
            >
              <div className="flex items-start space-x-4">
                <div className="relative">
                  {currentUser?.profile_picture && !imageError ? (
                    <img
                      src={getProfileImage()}
                      alt="Profile"
                      className="w-14 h-14 rounded-full object-cover border-2 border-white"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                      <UserCircle className="w-7 h-7 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{currentUser?.full_name || 'Loading...'}</h3>
                  <p className="text-blue-100 text-sm">{currentUser?.email || 'Loading...'}</p>
                  <div className="flex items-center mt-2 text-sm text-blue-100">
                    <MapPin className="w-4 h-4 mr-1" />
                    {currentUser?.location || 'Administrator'}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Navigation Menu */}
            <nav className="space-y-2 p-4">
              {menuItems.map((item, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center w-full p-3 rounded-xl transition-all ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white shadow-md'
                      : `text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </motion.button>
              ))}
            </nav>

            {/* Bottom Support Card */}
            <div className="absolute bottom-0 w-full space-y-4 p-4 border-t dark:border-gray-700">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 bg-blue-50 dark:bg-gray-700 p-4 rounded-xl"
              >
                <PhoneCall className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Support: +237 6XX XXX XXX
                </span>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center w-full p-3 rounded-xl transition-colors text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700"
              >
                <LogOut className="w-5 h-5 mr-3" />
                {isEnglish ? 'Logout' : 'Déconnexion'}
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : ''}`}>
        {/* Top Navigation */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`sticky top-0 z-20 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </motion.button>

              {/* Search Bar (visible on larger screens) */}
              <div className="hidden md:block ml-4 relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={isEnglish ? "Search users, courses..." : "Rechercher utilisateurs, cours..."}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEnglish(!isEnglish)}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="ml-2 text-gray-600 dark:text-gray-300">{isEnglish ? 'EN' : 'FR'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                />
              </motion.button>

              {/* User Profile Image - Mobile Only */}
              <div className="relative md:hidden">
                {currentUser?.profile_picture && !imageError ? (
                  <img
                    src={getProfileImage()}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-700 flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 rounded-full border border-white dark:border-gray-800" />
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="mt-4 md:hidden relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={isEnglish ? "Search users, courses..." : "Rechercher utilisateurs, cours..."}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </motion.header>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4"
        >
          {children || <Outlet />}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLayout;