import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Moon, Globe, Users, BookOpen, Calendar, Search,
  Bell, Menu, X, BookOpenCheck, MessageSquare, Star,
  Award, User, LogOut, Home, Briefcase, CalendarDays
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../authService';
import { getUser } from '../../services/get_user';
import { Card, CardContent } from '../../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';

const BeginnerLayout = ({ children, isDarkMode, setIsDarkMode, isEnglish, setIsEnglish }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await getUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        handleLogout();
      }
    };

    fetchCurrentUser();
  }, []);

  const menuItems = [
    { icon: Home, label: isEnglish ? 'Dashboard' : 'Tableau de bord', path: '/beginner_dashboard' },
    { icon: BookOpen, label: isEnglish ? 'Learning Path' : 'Parcours d\'apprentissage', path: '/learning' },
    { icon: Users, label: isEnglish ? 'Find Mentors' : 'Trouver des Mentors', path: '/mentors' },
    { icon: CalendarDays, label: isEnglish ? 'Events' : 'Événements', path: '/find_events' },
    { icon: Briefcase, label: isEnglish ? 'Job Opportunities' : 'Offres d\'emploi', path: '/job_applicant' },
    { icon: Calendar, label: isEnglish ? 'Sessions' : 'Sessions', path: '/sessions' },
    { icon: MessageSquare, label: isEnglish ? 'Messages' : 'Messages', path: '/chat' },
    { icon: Award, label: isEnglish ? 'Achievements' : 'Réalisations', path: '/achievements' },
    { icon: Star, label: isEnglish ? 'Rate' : 'Évaluer', path: '/rate' },
    { icon: User, label: isEnglish ? 'Profile' : 'Profil', path: '/profile' }
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

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", bounce: 0.15 }}
            className={`fixed top-0 left-0 z-40 w-64 h-screen ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } border-r border-gray-200 dark:border-gray-700`}
          >
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => navigate('/beginner_dashboard')}
              >
                <BookOpenCheck className="w-8 h-8 text-blue-600" />
                <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  MentorCam
                </span>
              </motion.div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden"
              >
                <X className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-500'}`} />
              </Button>
            </div>

            <div className="p-4">
              <Card className="mb-6">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={currentUser?.profile_picture} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {currentUser?.full_name || 'Loading...'}
                      </h3>
                      <p className="text-sm text-gray-500">{currentUser?.email || 'Loading...'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <nav className="space-y-1">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                      window.location.pathname === item.path
                        ? 'bg-blue-600 text-white'
                        : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </motion.button>
                ))}
              </nav>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700"
            >
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="flex items-center w-full justify-center"
              >
                <LogOut className="w-5 h-5 mr-3" />
                {isEnglish ? 'Logout' : 'Déconnexion'}
              </Button>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className={`p-4 sm:ml-64 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden"
                >
                  <Menu className="w-6 h-6" />
                </Button>

                <div className="flex-1 max-w-xl mx-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={isEnglish ? "Search for mentors, skills..." : "Rechercher des mentors, compétences..."}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsDarkMode(!isDarkMode)}
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
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                  </motion.button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {children}
      </div>
    </div>
  );
};

export default BeginnerLayout;