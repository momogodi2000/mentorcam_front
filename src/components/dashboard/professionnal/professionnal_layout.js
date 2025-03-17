import React, { useState, useEffect, useRef } from 'react';
import {
    Sun, Moon, Globe, Users, BookOpen, Calendar, Search, Bell, Menu, X,
    BookOpenCheck, MessageSquare, Star, Award, User, Clock, Heart, MapPin,
    Briefcase, Wallet, ChartBar, GraduationCap, Settings, Video, LogOut,
    BarChart, UserCircle, ChevronRight, Activity, HelpCircle, PieChart
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../../authService';
import { getUser } from '../../services/get_user';
import { Avatar, AvatarImage, AvatarFallback } from '../../ui/avatar'; // Import Avatar components

const ProfessionalLayout = ({ children, isDarkMode, setIsDarkMode, isEnglish, setIsEnglish }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchFocused, setSearchFocused] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'message',
            content: isEnglish ? 'New message from Sarah' : 'Nouveau message de Sarah',
            time: '10m',
            read: false
        },
        {
            id: 2,
            type: 'session',
            content: isEnglish ? 'Session with Thomas starts in 30 minutes' : 'La session avec Thomas commence dans 30 minutes',
            time: '25m',
            read: false
        },
        {
            id: 3,
            type: 'payment',
            content: isEnglish ? 'Payment received: $50.00' : 'Paiement reçu: 50,00 €',
            time: '2h',
            read: true
        }
    ]);
    const [showProfileMenu, setShowProfileMenu] = useState(false); // Add this line
    const navigate = useNavigate();
    const location = useLocation();
    const notificationRef = useRef(null);

    // Default profile image URL
    const defaultProfileImage = require("../../../assets/images/avarta.webp");

    // Handle click outside notifications panel
    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [notificationRef]);

    // Responsive handling
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobileView(mobile);
            if (mobile && isSidebarOpen) {
                setIsSidebarOpen(false);
            } else if (!mobile && !isSidebarOpen) {
                setIsSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarOpen]);

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
        // Save preference to localStorage
        localStorage.setItem('darkMode', !isDarkMode);
    };

    // Check if a menu item is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    const menuItems = [
        { 
            icon: BarChart, 
            label: isEnglish ? 'Complete Profile' : 'Finaliser le Profil', 
            path: '/complete',
            description: isEnglish ? 'Finish setting up your account' : 'Finalisez la configuration de votre compte'
        },
        { 
            icon: ChartBar, 
            label: isEnglish ? 'Dashboard' : 'Tableau de Bord', 
            path: '/professional_dashboard',
            description: isEnglish ? 'Overview of your activities' : 'Aperçu de vos activités'
        },
        { 
            icon: Users, 
            label: isEnglish ? 'My Students' : 'Mes Étudiants', 
            path: '/student',
            description: isEnglish ? 'Manage your student roster' : 'Gérer votre liste d\'étudiants'
        },
        { 
            icon: Calendar, 
            label: isEnglish ? 'Sessions' : 'Sessions', 
            path: '#',
            description: isEnglish ? 'View and schedule sessions' : 'Voir et planifier les sessions'
        },
        { 
            icon: Video, 
            label: isEnglish ? 'Online Classes' : 'Cours en Ligne', 
            path: '/online_classe',
            description: isEnglish ? 'Manage your virtual classes' : 'Gérer vos cours virtuels'
        },
        { 
            icon: Wallet, 
            label: isEnglish ? 'Earnings' : 'Revenus', 
            path: '/earning',
            description: isEnglish ? 'Track your income' : 'Suivre vos revenus'
        },
        { 
            icon: MessageSquare, 
            label: isEnglish ? 'Messages' : 'Messages', 
            path: '/pro_messages',
            description: isEnglish ? 'Communicate with students' : 'Communiquer avec les étudiants'
        },
        { 
            icon: Settings, 
            label: isEnglish ? 'Settings' : 'Paramètres', 
            path: '/setting',
            description: isEnglish ? 'Configure your account' : 'Configurer votre compte'
        }
    ];

    // Submenu items for settings
    const settingsSubMenu = [
        { label: isEnglish ? 'Account' : 'Compte', path: '/setting/account' },
        { label: isEnglish ? 'Notifications' : 'Notifications', path: '/setting/notifications' },
        { label: isEnglish ? 'Privacy' : 'Confidentialité', path: '/setting/privacy' },
        { label: isEnglish ? 'Payments' : 'Paiements', path: '/setting/payments' }
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

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const ProfileSection = () => {
        const [imageError, setImageError] = useState(false);
        const [showProfileMenu, setShowProfileMenu] = useState(false);

        const handleImageError = () => {
            setImageError(true);
        };

        return (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 mb-6 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg relative overflow-hidden"
            >
                {/* Background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12"></div>
                
                <div className="flex items-start space-x-4 relative z-10">
                    <div className="relative">
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="cursor-pointer"
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                        >
                            {currentUser?.profile_picture && !imageError ? (
                                <img
                                    src={currentUser.profile_picture}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                                    onError={handleImageError}
                                />
                            ) : (
                                currentUser && defaultProfileImage ? (
                                    <img 
                                        src={defaultProfileImage}
                                        alt="Default Profile"
                                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shadow-md">
                                        <UserCircle className="w-8 h-8 text-white" />
                                    </div>
                                )
                            )}
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, repeatDelay: 4 }}
                                className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-sm" 
                            />
                        </motion.div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg tracking-tight">{currentUser?.full_name || 'Loading...'}</h3>
                        <p className="text-blue-100 text-sm">{currentUser?.email}</p>
                        <div className="flex items-center mt-2 text-sm text-blue-100">
                            <MapPin className="w-4 h-4 mr-1" />
                            {currentUser?.location || 'Location not set'}
                        </div>
                    </div>
                </div>
                
                <AnimatePresence>
                    {showProfileMenu && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 border-t border-white/20 pt-4"
                        >
                            <div className="flex justify-between text-sm mb-3">
                                <div>
                                    <div className="text-blue-100">{isEnglish ? 'Status' : 'Statut'}</div>
                                    <div className="font-medium flex items-center">
                                        <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                        {isEnglish ? 'Available' : 'Disponible'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-blue-100">{isEnglish ? 'Rating' : 'Évaluation'}</div>
                                    <div className="font-medium flex items-center">
                                        <Star className="w-3 h-3 fill-current text-yellow-300 mr-1" />
                                        4.9
                                    </div>
                                </div>
                                <div>
                                    <div className="text-blue-100">{isEnglish ? 'Students' : 'Étudiants'}</div>
                                    <div className="font-medium">42</div>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/setting')}
                                className="w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-sm text-center backdrop-blur-sm"
                            >
                                {isEnglish ? 'View Profile' : 'Voir le Profil'}
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };

    // Sidebar overlay for mobile
    const SidebarOverlay = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black z-30 lg:hidden"
        />
    );

    // Notification icon with badge
    const NotificationBell = () => (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {unreadCount > 0 && (
                    <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold"
                    >
                        {unreadCount}
                    </motion.span>
                )}
            </motion.button>
        </div>
    );

    // Notifications panel
    const NotificationsPanel = () => (
        <motion.div
            ref={notificationRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
        >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 dark:text-white">
                    {isEnglish ? 'Notifications' : 'Notifications'}
                </h3>
                <button 
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                    {isEnglish ? 'Mark all as read' : 'Marquer tout comme lu'}
                </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <motion.div
                            key={notification.id}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                        >
                            <div className="flex items-start">
                                <div className={`p-2 rounded-full mr-3 ${
                                    notification.type === 'message' 
                                        ? 'bg-blue-100 dark:bg-blue-800' 
                                        : notification.type === 'session' 
                                        ? 'bg-green-100 dark:bg-green-800'
                                        : 'bg-yellow-100 dark:bg-yellow-800'
                                }`}>
                                    {notification.type === 'message' ? (
                                        <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                                    ) : notification.type === 'session' ? (
                                        <Calendar className="w-4 h-4 text-green-600 dark:text-green-300" />
                                    ) : (
                                        <Wallet className="w-4 h-4 text-yellow-600 dark:text-yellow-300" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-800 dark:text-gray-200">{notification.content}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                                </div>
                                {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                )}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        {isEnglish ? 'No notifications' : 'Aucune notification'}
                    </div>
                )}
            </div>
            <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
                <button 
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => navigate('/notifications')}
                >
                    {isEnglish ? 'View all notifications' : 'Voir toutes les notifications'}
                </button>
            </div>
        </motion.div>
    );

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            {/* Mobile overlay when sidebar is open */}
            <AnimatePresence>
                {isSidebarOpen && isMobileView && <SidebarOverlay />}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 left-0 z-40 w-72 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden flex flex-col"
                    >
                        {/* Logo and header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center space-x-3"
                            >
                                <div className="bg-blue-600 text-white p-2 rounded-lg">
                                    <BookOpenCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                                        MentorCam
                                    </span>
                                    <span className="ml-1 text-sm font-medium text-blue-600">Pro</span>
                                </div>
                            </motion.div>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="lg:hidden"
                            >
                                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Scrollable content area */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="px-4 pt-4">
                                <ProfileSection />

                                {/* Stats summary */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="grid grid-cols-2 gap-4 mb-6"
                                >
                                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white shadow-md">
                                        <div className="flex items-center justify-between mb-2">
                                            <Clock className="w-5 h-5 text-emerald-100" />
                                            <span className="text-xs font-medium text-emerald-100">
                                                {isEnglish ? 'This week' : 'Cette semaine'}
                                            </span>
                                        </div>
                                        <p className="text-2xl font-bold">24h</p>
                                        <p className="text-xs text-emerald-100">
                                            {isEnglish ? 'Teaching hours' : 'Heures d\'enseignement'}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 text-white shadow-md">
                                        <div className="flex items-center justify-between mb-2">
                                            <Heart className="w-5 h-5 text-purple-100" />
                                            <span className="text-xs font-medium text-purple-100">
                                                {isEnglish ? 'This month' : 'Ce mois-ci'}
                                            </span>
                                        </div>
                                        <p className="text-2xl font-bold">98%</p>
                                        <p className="text-xs text-purple-100">
                                            {isEnglish ? 'Satisfaction rate' : 'Taux de satisfaction'}
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Menu navigation */}
                                <nav className="space-y-1 mb-6">
                                    {menuItems.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.05 * index }}
                                        >
                                            <motion.button
                                                whileHover={{ 
                                                    scale: 1.01, 
                                                    x: 5,
                                                    transition: { duration: 0.2 } 
                                                }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => navigate(item.path)}
                                                className={`flex items-center w-full p-3 rounded-lg transition-all ${
                                                    isActive(item.path)
                                                        ? 'bg-blue-600 text-white shadow-md'
                                                        : `text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700`
                                                }`}
                                            >
                                                <div className={`mr-3 p-2 rounded-md ${
                                                    isActive(item.path) 
                                                        ? 'bg-blue-500/30' 
                                                        : 'bg-gray-100 dark:bg-gray-700'
                                                }`}>
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <div className="font-medium">{item.label}</div>
                                                    <div className="text-xs opacity-80 mt-0.5 line-clamp-1">
                                                        {item.description}
                                                    </div>
                                                </div>
                                                <ChevronRight className={`w-4 h-4 ${
                                                    isActive(item.path) ? 'opacity-80' : 'opacity-40'
                                                }`} />
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </nav>

                                {/* Quick actions */}
                                <div className="mb-6">
                                    <h4 className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 px-3 mb-2">
                                        {isEnglish ? 'Quick Actions' : 'Actions Rapides'}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="flex flex-col items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-1" />
                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                {isEnglish ? 'New Session' : 'Nouvelle Session'}
                                            </span>
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="flex flex-col items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <PieChart className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-1" />
                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                {isEnglish ? 'Analytics' : 'Analytiques'}
                                            </span>
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Help & Support */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 mb-6"
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
                                            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium mb-1 text-gray-800 dark:text-white">
                                                {isEnglish ? 'Need help?' : 'Besoin d\'aide?'}
                                            </h4>
                                            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                                                {isEnglish 
                                                    ? 'Our support team is ready to assist you.' 
                                                    : 'Notre équipe de support est prête à vous aider.'
                                                }
                                            </p>
                                            <button className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                                {isEnglish ? 'Contact support' : 'Contacter le support'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Logout button */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 border-t border-gray-200 dark:border-gray-700"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLogout}
                                className="flex items-center w-full p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors"
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                <span className="font-medium">{isEnglish ? 'Logout' : 'Déconnexion'}</span>
                            </motion.button>
                        </motion.div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main content */}
            <div className={`p-4 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : ''}`}>
                {/* Top navigation bar */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md backdrop-blur-sm ${
                        isDarkMode ? 'border border-gray-700' : ''
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                        <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            </button>
                            <div className="ml-4">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {isEnglish ? 'Professional Dashboard' : 'Tableau de Bord Professionnel'}
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {isEnglish 
                                        ? 'Manage your teaching and mentoring activities' 
                                        : 'Gérez vos activités d\'enseignement et de mentorat'
                                    }
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Search bar */}
                            <motion.div
                                initial={{ width: searchFocused ? '200px' : '120px' }}
                                animate={{ width: searchFocused ? '200px' : '120px' }}
                                className="relative"
                            >
                                <input
                                    type="text"
                                    placeholder={isEnglish ? 'Search...' : 'Rechercher...'}
                                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                                        isDarkMode 
                                            ? 'bg-gray-700 border-gray-600 text-white' 
                                            : 'bg-gray-100 border-gray-200 text-gray-900'
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                            </motion.div>

                            {/* Theme toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                {isDarkMode ? (
                                    <Sun className="w-6 h-6 text-yellow-400" />
                                ) : (
                                    <Moon className="w-6 h-6 text-gray-600" />
                                )}
                            </button>

                            {/* Language toggle */}
                            <button
                                onClick={() => setIsEnglish(!isEnglish)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Globe className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                            </button>

                            {/* Notifications */}
                            <div className="relative">
                                <NotificationBell />
                                <AnimatePresence>
                                    {showNotifications && <NotificationsPanel />}
                                </AnimatePresence>
                            </div>

                            {/* Profile dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <Avatar className="w-8 h-8">
                                        {currentUser?.profile_picture ? (
                                            <AvatarImage 
                                                src={currentUser.profile_picture} 
                                                alt={currentUser.full_name} 
                                            />
                                        ) : (
                                            <AvatarFallback className="bg-blue-600 text-white">
                                                {currentUser?.full_name?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </button>
                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                                        >
                                            <div className="p-2">
                                                <button
                                                    onClick={() => navigate('/setting')}
                                                    className="w-full text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    {isEnglish ? 'Profile' : 'Profil'}
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400"
                                                >
                                                    {isEnglish ? 'Logout' : 'Déconnexion'}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main content area */}
                <motion.main
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {children}
                </motion.main>
            </div>
        </div>
    );
};

export default ProfessionalLayout;