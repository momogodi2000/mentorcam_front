import React, { useState } from 'react';
import {
    Sun, Moon, Globe, Users, BookOpen, Calendar, Search, Bell, Menu, X,
    BookOpenCheck, Building, Briefcase, GraduationCap, Settings, Video,
    UserCheck, FileText, Award, Target, User, Clock, ChartBar, MapPin, LogOut
} from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';  // Chemin relatif mis à jour
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Le reste du code reste identique...

const InstitutionDashboard = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isEnglish, setIsEnglish] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    // Données des statistiques institutionnelles
    const institutionData = [
        { month: 'Jan', recruitments: 5, mentorships: 8, events: 2 },
        { month: 'Feb', recruitments: 7, mentorships: 12, events: 3 },
        { month: 'Mar', recruitments: 10, mentorships: 15, events: 4 },
        { month: 'Apr', recruitments: 8, mentorships: 18, events: 3 },
    ];

    const stats = [
        {
            icon: UserCheck,
            label: isEnglish ? 'Active Mentorships' : 'Mentorats Actifs',
            value: '18',
            change: isEnglish ? '+3 this month' : '+3 ce mois'
        },
        {
            icon: Briefcase,
            label: isEnglish ? 'Job Openings' : 'Offres d\'Emploi',
            value: '12',
            change: isEnglish ? '5 new positions' : '5 nouveaux postes'
        },
        {
            icon: Calendar,
            label: isEnglish ? 'Upcoming Events' : 'Événements à Venir',
            value: '4',
            change: isEnglish ? 'Next week' : 'Semaine prochaine'
        },
        {
            icon: Users,
            label: isEnglish ? 'Talent Pool' : 'Vivier de Talents',
            value: '256',
            change: isEnglish ? '+28 this month' : '+28 ce mois'
        }
    ];

    const upcomingEvents = [
        {
            title: isEnglish ? 'Tech Career Fair' : 'Salon des Carrières Tech',
            type: isEnglish ? 'Recruitment' : 'Recrutement',
            date: '15 Jan, 09:00',
            location: 'Douala',
            participants: 45
        },
        {
            title: isEnglish ? 'Web Dev Workshop' : 'Atelier Développement Web',
            type: isEnglish ? 'Training' : 'Formation',
            date: '18 Jan, 14:00',
            location: 'Yaoundé',
            participants: 30
        }
    ];

    const talentPool = [
        {
            name: 'Marie Kouam',
            domain: isEnglish ? 'Software Development' : 'Développement Logiciel',
            experience: '3 ans',
            rating: 4.8,
            status: isEnglish ? 'Available' : 'Disponible'
        },
        {
            name: 'Paul Ndam',
            domain: isEnglish ? 'UI/UX Design' : 'Design UI/UX',
            experience: '5 ans',
            rating: 4.9,
            status: isEnglish ? 'In Process' : 'En Cours'
        },
        {
            name: 'Sarah Tamba',
            domain: isEnglish ? 'Data Science' : 'Science des Données',
            experience: '4 ans',
            rating: 4.7,
            status: isEnglish ? 'Available' : 'Disponible'
        }
    ];

    const menuItems = [
        { icon: ChartBar, label: isEnglish ? 'Dashboard' : 'Tableau de Bord' },
        { icon: Users, label: isEnglish ? 'Talent Pool' : 'Vivier de Talents' },
        { icon: Briefcase, label: isEnglish ? 'Job Offers' : 'Offres d\'Emploi' },
        { icon: Calendar, label: isEnglish ? 'Events' : 'Événements' },
        { icon: UserCheck, label: isEnglish ? 'Mentorship' : 'Mentorat' },
        { icon: Target, label: isEnglish ? 'Recruitment' : 'Recrutement' },
        { icon: FileText, label: isEnglish ? 'Reports' : 'Rapports' },
        { icon: Settings, label: isEnglish ? 'Settings' : 'Paramètres' }
    ];

    // UPDATE: Added logout handler function
    const handleLogout = () => {
        // Add your logout logic here
        console.log('Logging out...');
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r border-gray-200 dark:border-gray-700`}>
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <Building className="w-8 h-8 text-blue-600" />
                        <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            TechCorp
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
                    <nav className="space-y-1">
                        {menuItems.map((item, index) => (
                            <button
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

            {/* Main Content */}
            <div className={`p-4 sm:ml-64 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                {/* Top Navigation */}
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
                                    placeholder={isEnglish ? "Search talents, events..." : "Rechercher talents, événements..."}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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
                            >
                                <Globe className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                                <span className="ml-2">{isEnglish ? 'EN' : 'FR'}</span>
                            </button>
                            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Bell className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <stat.icon className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                </div>
                                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {stat.label}
                                </h3>
                                <div className="mt-2">
                                    <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {stat.value}
                                    </p>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {stat.change}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts and Events Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Activity Chart */}
                    <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                        <CardContent className="p-6">
                            <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {isEnglish ? 'Institution Activity' : 'Activité de l\'Institution'}
                            </h2>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={institutionData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                                        <XAxis dataKey="month" stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                                        <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: isDarkMode ? '#1f2937' : 'white',
                                                border: 'none',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="recruitments"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            name={isEnglish ? 'Recruitments' : 'Recrutements'}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="mentorships"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            name={isEnglish ? 'Mentorships' : 'Mentorats'}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="events"
                                            stroke="#f59e0b"
                                            strokeWidth={2}
                                            name={isEnglish ? 'Events' : 'Événements'}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Events */}
                    <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                        <CardContent className="p-6">
                            <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {isEnglish ? 'Upcoming Events' : 'Événements à Venir'}
                            </h2>
                            <div className="space-y-4">
                                {upcomingEvents.map((event, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {event.title}
                                                </h3>
                                                <div className="flex items-center space-x-3 mt-2">
                                                    <span className={`text-sm px-2 py-1 rounded ${
                                                        event.type === (isEnglish ? 'Recruitment' : 'Recrutement')
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {event.type}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        <Clock className="w-4 h-4 inline mr-1" />
                                                        {event.date}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        <MapPin className="w-4 h-4 inline mr-1" />
                                                        {event.location}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Users className="w-4 h-4 text-gray-400 mr-1" />
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                    {event.participants}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full mt-4 py-2 text-center text-blue-600 hover:text-blue-700 font-medium">
                                    {isEnglish ? 'View All Events' : 'Voir Tous les Événements'}
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Talent Pool Section */}
                <Card className={`mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {isEnglish ? 'Talent Pool' : 'Vivier de Talents'}
                            </h2>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                {isEnglish ? 'View All' : 'Voir Tout'}
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className={`text-left ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <th className="pb-3 font-medium">{isEnglish ? 'Name' : 'Nom'}</th>
                                    <th className="pb-3 font-medium">{isEnglish ? 'Domain' : 'Domaine'}</th>
                                    <th className="pb-3 font-medium">{isEnglish ? 'Experience' : 'Expérience'}</th>
                                    <th className="pb-3 font-medium">{isEnglish ? 'Rating' : 'Évaluation'}</th>
                                    <th className="pb-3 font-medium">{isEnglish ? 'Status' : 'Statut'}</th>
                                    <th className="pb-3 font-medium"></th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {talentPool.map((talent, index) => (
                                    <tr key={index} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                        <td className="py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                    <User className="w-4 h-4 text-blue-600" />
                                                </div>
                                                {talent.name}
                                            </div>
                                        </td>
                                        <td className="py-4">{talent.domain}</td>
                                        <td className="py-4">{talent.experience}</td>
                                        <td className="py-4">
                                            <div className="flex items-center">
                                                <Award className="w-4 h-4 text-yellow-400 mr-1" />
                                                <span>{talent.rating}</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    talent.status === (isEnglish ? 'Available' : 'Disponible')
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {talent.status}
                                                </span>
                                        </td>
                                        <td className="py-4">
                                            <button className="text-blue-600 hover:text-blue-700">
                                                {isEnglish ? 'View Profile' : 'Voir Profil'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default InstitutionDashboard;