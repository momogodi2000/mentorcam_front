import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Moon, Globe, Users, Calendar, Search, Bell, Menu, X,
  Building, Briefcase, ChartBar, Target, FileText, Settings,
  UserCheck, LogOut, UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../authService';
import { getUser } from '../../services/get_user';
import { Card, CardContent } from '../../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';

const InstitutionLayout = ({ children, isEnglish, setIsEnglish }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const menuItems = [
    { icon: ChartBar, label: isEnglish ? 'Dashboard' : 'Tableau de Bord', path: '/institut_dashboard' },
    { icon: Users, label: isEnglish ? 'Talent Pool' : 'Vivier de Talents', path: '/talent' },
    { icon: Briefcase, label: isEnglish ? 'Job Offers' : 'Offres d\'Emploi', path: '/job' },
    { icon: Calendar, label: isEnglish ? 'Events' : 'Événements', path: '/event' },
    { icon: UserCheck, label: isEnglish ? 'Mentorship' : 'Mentorat', path: '/Mentorship' },
    { icon: Target, label: isEnglish ? 'Recruitment' : 'Recrutement', path: '/Recruitment' },
    { icon: UserPlus, label: isEnglish ? 'Job Applicants' : 'Candidats', path: '/job_apply' },
    { icon: FileText, label: isEnglish ? 'Reports' : 'Rapports', path: '/rapport' },
    { icon: Settings, label: isEnglish ? 'Settings' : 'Paramètres', path: '/setting_institute' }
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

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <motion.aside
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className={`fixed top-0 left-0 z-40 h-screen 
              ${isMobile ? 'w-full sm:w-80' : 'w-64'}
              ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
              border-r border-gray-200 dark:border-gray-700
              overflow-y-auto`}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUpVariants}
              className="flex items-center justify-between p-4 border-b dark:border-gray-700"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => navigate('/institut_dashboard')}
              >
                <Building className="w-8 h-8 text-blue-600" />
                <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  TechCorp
                </span>
              </motion.div>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-500'}`} />
                </Button>
              )}
            </motion.div>

            <div className="p-4">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUpVariants}
              >
                <Card className="mb-6">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={currentUser?.profile_picture} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <h3 className={`font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {currentUser?.full_name || 'Loading...'}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">{currentUser?.email || 'Loading...'}</p>
                        <p className="text-sm text-gray-500 truncate">{currentUser?.phone_number || 'Loading...'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <nav className="space-y-1">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={index}
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUpVariants}
                    custom={index}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      navigate(item.path);
                      if (isMobile) setIsSidebarOpen(false);
                    }}
                    className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                      window.location.pathname === item.path
                        ? 'bg-blue-600 text-white'
                        : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="truncate">{item.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUpVariants}
              className="sticky bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700 bg-inherit"
            >
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="flex items-center w-full justify-center"
              >
                <LogOut className="w-5 h-5 mr-3" />
                <span className="truncate">
                  {isEnglish ? 'Logout' : 'Déconnexion'}
                </span>
              </Button>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className={`transition-all duration-300 ${
        isSidebarOpen && !isMobile ? 'ml-64' : 'ml-0'
      } p-4`}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
        >
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(true)}
                  className={isMobile ? 'block' : 'hidden'}
                >
                  <Menu className="w-6 h-6" />
                </Button>

                <div className="flex-1 w-full sm:max-w-xl">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={isEnglish ? "Search talents, events..." : "Rechercher talents, événements..."}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
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
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                  </motion.button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default InstitutionLayout;