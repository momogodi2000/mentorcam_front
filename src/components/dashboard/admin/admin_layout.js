import React, { useState, useEffect } from 'react';
import { Sun, Moon, Globe, Users, BookOpen, Calendar, Bell, BarChart2, Settings, Menu, X, BookOpenCheck, TrendingUp, Wallet, PhoneCall, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../../authService';
import { getUser } from '../../services/get_user'; // Import the getUser service

const AdminLayout = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); // State to store current user data
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch current user data on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await getUser(); // Use the getUser service
        setCurrentUser(userData); // Set the current user data
      } catch (error) {
        console.error('Error fetching user data:', error); // Debugging log
        // If there's an error, force logout
        handleLogout();
      }
    };

    fetchCurrentUser();
  }, []);

  const menuItems = [
    { icon: BarChart2, label: isEnglish ? 'Dashboard' : 'Tableau de Bord', path: '/stat_page' },
    { icon: Users, label: isEnglish ? 'Users' : 'Utilisateurs', path: '/admin/users' },
    { icon: BookOpen, label: isEnglish ? 'Courses' : 'Formations', path: '/admin' },
    { icon: Calendar, label: isEnglish ? 'Events' : 'Événements', path: '/admin' },
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
      // Clear local storage and session storage
      localStorage.clear();
      sessionStorage.clear();
      // Redirect to login page and replace history
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect to login page even if there's an error
      navigate('/login', { replace: true });
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser) return 'A'; // Default initial for admin
    const names = currentUser.full_name ? currentUser.full_name.split(' ') : [];
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return currentUser.full_name ? currentUser.full_name[0].toUpperCase() : 'A';
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 100 }}
            className={`fixed top-0 left-0 z-40 w-72 h-screen ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } border-r border-gray-200 dark:border-gray-700 shadow-xl`}
          >
            {/* Sidebar content */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-6 border-b dark:border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <BookOpenCheck className="w-8 h-8 text-blue-600" />
                </motion.div>
                <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  MentorCam
                </span>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
              >
                <X className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-500'}`} />
              </button>
            </motion.div>

            {/* User Info */}
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold">{getUserInitials()}</span>
                </div>
                <div>
                  <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {currentUser?.full_name || 'Loading...'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {currentUser?.email || 'Loading...'}
                  </p>
                </div>
              </div>
            </div>

            <nav className="space-y-2 p-6">
              {menuItems.map((item, index) => (
                <motion.button
                  key={index}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center w-full p-4 rounded-xl transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </motion.button>
              ))}
            </nav>

            <div className="absolute bottom-0 w-full space-y-4 p-6 border-t dark:border-gray-700">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3 bg-blue-50 dark:bg-gray-700 p-4 rounded-xl"
              >
                <PhoneCall className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Support: +237 6XX XXX XXX
                </span>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center w-full p-4 rounded-xl transition-colors text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700"
              >
                <LogOut className="w-5 h-5 mr-3" />
                {isEnglish ? 'Logout' : 'Déconnexion'}
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`p-4 ${isSidebarOpen ? 'md:ml-72' : ''} transition-all duration-300`}>
        {/* Top Navigation */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`mb-6 p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </motion.button>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Globe className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                <span className="ml-2">{isEnglish ? 'EN' : 'FR'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Bell className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"
                />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Outlet for nested routes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {children || <Outlet />}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLayout;