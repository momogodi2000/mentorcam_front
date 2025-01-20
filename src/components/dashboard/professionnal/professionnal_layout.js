import React, { useState } from 'react';
import {
    Sun, Moon, Globe, Users, BookOpen, Calendar, Search, Bell, Menu, X,
    BookOpenCheck, MessageSquare, Star, Award, User, Clock, Heart, MapPin,
    Briefcase, Wallet, ChartBar, GraduationCap, Settings, Video, LogOut,
    BarChart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const ProfessionalLayout = ({ children, isDarkMode, setIsDarkMode, isEnglish, setIsEnglish }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const menuItems = [
        { icon: BarChart, label: isEnglish ? 'Complete profile' : 'Finalise le profile', path: '/complete'  },
        { icon: ChartBar, label: isEnglish ? 'Dashboard' : 'Tableau de Bord', path: '/professional_dashboard' },
        { icon: Users, label: isEnglish ? 'My Students' : 'Mes Étudiants' },
        { icon: Calendar, label: isEnglish ? 'Sessions' : 'Sessions' },
        { icon: Video, label: isEnglish ? 'Online Classes' : 'Cours en Ligne' },
        { icon: Wallet, label: isEnglish ? 'Earnings' : 'Revenus' },
        { icon: GraduationCap, label: isEnglish ? 'Courses' : 'Cours' },
        { icon: MessageSquare, label: isEnglish ? 'Messages' : 'Messages' },
        { icon: Settings, label: isEnglish ? 'Settings' : 'Paramètres' }
    ];

    const handleLogout = () => {
        console.log('Logging out...');
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r border-gray-200 dark:border-gray-700`}>
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <BookOpenCheck className="w-8 h-8 text-blue-600" />
                        <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            MentorCam Pro
                        </span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden"
                        aria-label="Close sidebar"
                    >
                        <X className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-500'}`} />
                    </button>
                </div>

                <div className="p-4">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold">DK</span>
                        </div>
                        <div>
                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Dr. Kamga Paul
                            </h3>
                            <p className="text-sm text-gray-500">
                                {isEnglish ? 'Web Development Expert' : 'Expert en Développement Web'}
                            </p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {menuItems.map((item, index) => (
                            <button
                            onClick={() => navigate(item.path)}

                                key={index}
                                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                                    index === 0
                                        ? 'bg-blue-600 text-white'
                                        : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
                                }`}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full p-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        {isEnglish ? 'Logout' : 'Déconnexion'}
                    </button>
                </div>
            </aside>

            <div className={`p-4 sm:ml-64 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden text-gray-500 dark:text-gray-400"
                            aria-label="Open sidebar"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="flex-1 max-w-xl mx-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={isEnglish ? "Search students, sessions..." : "Rechercher étudiants, sessions..."}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                            >
                                {isDarkMode ? (
                                    <Sun className="w-5 h-5 text-gray-300" />
                                ) : (
                                    <Moon className="w-5 h-5 text-gray-600" />
                                )}
                            </button>
                            <button
                                onClick={() => setIsEnglish(!isEnglish)}
                                className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                aria-label="Change language"
                            >
                                <Globe className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                                <span className="ml-2">{isEnglish ? 'EN' : 'FR'}</span>
                            </button>
                            <button
                                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                aria-label="Notifications"
                            >
                                <Bell className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                        </div>
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
};

export default ProfessionalLayout;