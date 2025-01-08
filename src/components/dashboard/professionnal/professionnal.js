import React, { useState } from 'react';
import {
    Sun, Moon, Globe, Users, BookOpen, Calendar, Search, Bell, Menu, X,
    BookOpenCheck, MessageSquare, Star, Award, User, Clock, Heart, MapPin,
    Briefcase, Wallet, ChartBar, GraduationCap, Settings, Video
} from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProfessionalDashboard = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isEnglish, setIsEnglish] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    // Données des revenus et sessions de mentorat
    const mentorshipData = [
        { month: 'Jan', sessions: 12, revenue: 150000, students: 8 },
        { month: 'Feb', sessions: 15, revenue: 180000, students: 10 },
        { month: 'Mar', sessions: 18, revenue: 220000, students: 12 },
        { month: 'Apr', sessions: 22, revenue: 280000, students: 15 },
    ];

    const stats = [
        {
            icon: Wallet,
            label: isEnglish ? 'Monthly Revenue' : 'Revenus Mensuels',
            value: '280,000 FCFA',
            change: isEnglish ? '+15% this month' : '+15% ce mois'
        },
        {
            icon: Users,
            label: isEnglish ? 'Active Students' : 'Apprenants Actifs',
            value: '15',
            change: isEnglish ? '+3 this month' : '+3 ce mois'
        },
        {
            icon: Clock,
            label: isEnglish ? 'Hours Taught' : 'Heures Enseignées',
            value: '45h',
            change: isEnglish ? '22 sessions' : '22 sessions'
        },
        {
            icon: Star,
            label: isEnglish ? 'Rating' : 'Évaluation',
            value: '4.8/5',
            change: isEnglish ? 'From 35 reviews' : 'Sur 35 avis'
        }
    ];

    const upcomingSessions = [
        {
            student: 'Jean Dubois',
            topic: isEnglish ? 'Advanced Web Development' : 'Développement Web Avancé',
            date: '15 Jan, 14:00',
            status: isEnglish ? 'Confirmed' : 'Confirmé',
            payment: isEnglish ? 'Paid' : 'Payé'
        },
        {
            student: 'Marie Fono',
            topic: isEnglish ? 'Mobile App Design' : 'Design d\'Applications Mobiles',
            date: '18 Jan, 10:00',
            status: isEnglish ? 'Pending' : 'En attente',
            payment: isEnglish ? 'Awaiting' : 'En attente'
        }
    ];

    const activeStudents = [
        {
            name: 'Jean Dubois',
            level: isEnglish ? 'Beginner' : 'Débutant',
            progress: 60,
            nextSession: '15 Jan',
            domain: isEnglish ? 'Web Development' : 'Développement Web'
        },
        {
            name: 'Marie Fono',
            level: isEnglish ? 'Intermediate' : 'Intermédiaire',
            progress: 75,
            nextSession: '18 Jan',
            domain: isEnglish ? 'UI/UX Design' : 'Design UI/UX'
        },
        {
            name: 'Paul Tamba',
            level: isEnglish ? 'Advanced' : 'Avancé',
            progress: 90,
            nextSession: '20 Jan',
            domain: isEnglish ? 'Mobile Development' : 'Développement Mobile'
        }
    ];

    const menuItems = [
        { icon: ChartBar, label: isEnglish ? 'Dashboard' : 'Tableau de Bord' },
        { icon: Users, label: isEnglish ? 'My Students' : 'Mes Étudiants' },
        { icon: Calendar, label: isEnglish ? 'Sessions' : 'Sessions' },
        { icon: Video, label: isEnglish ? 'Online Classes' : 'Cours en Ligne' },
        { icon: Wallet, label: isEnglish ? 'Earnings' : 'Revenus' },
        { icon: GraduationCap, label: isEnglish ? 'Courses' : 'Cours' },
        { icon: MessageSquare, label: isEnglish ? 'Messages' : 'Messages' },
        { icon: Settings, label: isEnglish ? 'Settings' : 'Paramètres' }
    ];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            {/* Sidebar - Similar structure to BeginnerDashboard but with professional menu items */}
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
            </aside>

            {/* Main Content */}
            <div className={`p-4 sm:ml-64 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                {/* Top Navigation - Similar to BeginnerDashboard */}
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

                {/* Performance Charts and Sessions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                        <CardContent className="p-6">
                            <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {isEnglish ? 'Performance Overview' : 'Aperçu des Performances'}
                            </h2>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={mentorshipData}>
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
                                            dataKey="sessions"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            name={isEnglish ? 'Sessions' : 'Sessions'}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="students"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            name={isEnglish ? 'Students' : 'Étudiants'}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card><Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                    <CardContent className="p-6">
                        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {isEnglish ? 'Upcoming Sessions' : 'Sessions à Venir'}
                        </h2>
                        <div className="space-y-4">
                            {upcomingSessions.map((session, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg ${
                                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                                    } flex items-center justify-between`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <User className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {session.student}
                                            </h3>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {session.topic}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {session.date}
                                        </p>
                                        <div className="flex items-center space-x-2 mt-1">
                                                <span className={`text-sm px-2 py-1 rounded ${
                                                    session.status === (isEnglish ? 'Confirmed' : 'Confirmé')
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {session.status}
                                                </span>
                                            <span className={`text-sm px-2 py-1 rounded ${
                                                session.payment === (isEnglish ? 'Paid' : 'Payé')
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                    {session.payment}
                                                </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                </div>

                {/* Active Students Section */}
                <Card className={`mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {isEnglish ? 'Active Students' : 'Étudiants Actifs'}
                            </h2>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                {isEnglish ? 'View All' : 'Voir Tout'}
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className={`text-left ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <th className="pb-3 font-medium">{isEnglish ? 'Student' : 'Étudiant'}</th>
                                    <th className="pb-3 font-medium">{isEnglish ? 'Domain' : 'Domaine'}</th>
                                    <th className="pb-3 font-medium">{isEnglish ? 'Level' : 'Niveau'}</th>
                                    <th className="pb-3 font-medium">{isEnglish ? 'Progress' : 'Progrès'}</th>
                                    <th className="pb-3 font-medium">{isEnglish ? 'Next Session' : 'Prochaine Session'}</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {activeStudents.map((student, index) => (
                                    <tr key={index} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                        <td className="py-4">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                    <User className="w-4 h-4 text-blue-600" />
                                                </div>
                                                {student.name}
                                            </div>
                                        </td>
                                        <td className="py-4">{student.domain}</td>
                                        <td className="py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    student.level === (isEnglish ? 'Beginner' : 'Débutant')
                                                        ? 'bg-green-100 text-green-800'
                                                        : student.level === (isEnglish ? 'Intermediate' : 'Intermédiaire')
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {student.level}
                                                </span>
                                        </td>
                                        <td className="py-4">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                                <div
                                                    className="bg-blue-600 h-2.5 rounded-full"
                                                    style={{ width: `${student.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm mt-1 block">
                                                    {student.progress}%
                                                </span>
                                        </td>
                                        <td className="py-4">{student.nextSession}</td>
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

export default ProfessionalDashboard;