import React, { useState, useEffect } from 'react';
import {
    Sun, Moon, Globe, Users, BookOpen, Calendar, Search, Bell, Menu, X,
    BookOpenCheck, MessageSquare, Star, Award, User, Clock, Heart, MapPin,
    Briefcase, Wallet, ChartBar, GraduationCap, Settings, Video, LogOut,
    BarChart, UserCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../../authService';
import { getUser } from '../../services/get_user';

const ProfessionalLayout = ({ children, isDarkMode, setIsDarkMode, isEnglish, setIsEnglish }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

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

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const menuItems = [
        { icon: BarChart, label: isEnglish ? 'Complete Profile' : 'Finaliser le Profil', path: '/complete' },
        { icon: ChartBar, label: isEnglish ? 'Dashboard' : 'Tableau de Bord', path: '/professional_dashboard' },
        { icon: Users, label: isEnglish ? 'My Students' : 'Mes Étudiants', path: '/student' },
        { icon: Calendar, label: isEnglish ? 'Sessions' : 'Sessions', path: '#' },
        { icon: Video, label: isEnglish ? 'Online Classes' : 'Cours en Ligne', path: '/online_classe' },
        { icon: Wallet, label: isEnglish ? 'Earnings' : 'Revenus', path: '/earning' },
        { icon: GraduationCap, label: isEnglish ? 'Courses' : 'Cours', path: '/classe' },
        { icon: MessageSquare, label: isEnglish ? 'Messages' : 'Messages', path: '/pro_messages' },
        { icon: Settings, label: isEnglish ? 'Settings' : 'Paramètres', path: '/setting' }
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

    const ProfileSection = () => {
        const [imageError, setImageError] = useState(false);

        const handleImageError = () => {
            setImageError(true);
        };

        return (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 mb-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white"
            >
                <div className="flex items-start space-x-4">
                    <div className="relative">
                        {currentUser?.profile_picture && !imageError ? (
                            <img
                                src={currentUser.profile_picture}
                                alt="Profile"
                                className="w-16 h-16 rounded-full object-cover border-2 border-white"
                                onError={handleImageError}
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                                <UserCircle className="w-8 h-8 text-white" />
                            </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg">{currentUser?.full_name || 'Loading...'}</h3>
                        <p className="text-blue-100 text-sm">{currentUser?.email}</p>
                        <div className="flex items-center mt-2 text-sm text-blue-100">
                            <MapPin className="w-4 h-4 mr-1" />
                            {currentUser?.location || 'Location not set'}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 left-0 z-40 w-72 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center justify-between p-4">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center space-x-3"
                            >
                                <BookOpenCheck className="w-8 h-8 text-blue-600" />
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    MentorCam Pro
                                </span>
                            </motion.div>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="md:hidden"
                            >
                                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        <div className="px-4">
                            <ProfileSection />

                            <nav className="space-y-2">
                                {menuItems.map((item, index) => (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate(item.path)}
                                        key={index}
                                        className={`flex items-center w-full p-3 rounded-lg transition-all ${
                                            index === 0
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : `text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`
                                        }`}
                                    >
                                        <item.icon className="w-5 h-5 mr-3" />
                                        {item.label}
                                    </motion.button>
                                ))}
                            </nav>
                        </div>

                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700"
                        >
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full p-3 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 transition-colors"
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                {isEnglish ? 'Logout' : 'Déconnexion'}
                            </button>
                        </motion.div>
                    </motion.aside>
                )}
            </AnimatePresence>

            <div className={`p-4 ${isSidebarOpen ? 'sm:ml-72' : ''} transition-all duration-300`}>
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
                >
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className={`md:hidden text-gray-500 dark:text-gray-400 ${isSidebarOpen ? 'hidden' : ''}`}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="flex-1 max-w-xl mx-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={isEnglish ? "Search students, sessions..." : "Rechercher étudiants, sessions..."}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
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
                                <span className="ml-2">{isEnglish ? 'EN' : 'FR'}</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
};

export default ProfessionalLayout;