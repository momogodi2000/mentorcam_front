import React, { useState } from 'react';
import { Sun, Moon, Globe, Users, BookOpen, Calendar, Search, Bell, Menu, X, BookOpenCheck, MessageSquare, Star, Award, User, Clock, Heart, MapPin } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BeginnerDashboard = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isEnglish, setIsEnglish] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    // Données des sessions de mentorat
    const learningProgress = [
        { month: 'Jan', hours: 8, skills: 2 },
        { month: 'Feb', hours: 12, skills: 4 },
        { month: 'Mar', hours: 15, skills: 6 },
        { month: 'Apr', hours: 20, skills: 8 },
    ];

    const stats = [
        {
            icon: Clock,
            label: isEnglish ? 'Learning Hours' : 'Heures d\'apprentissage',
            value: '55h',
            change: '+5h cette semaine'
        },
        {
            icon: Award,
            label: isEnglish ? 'Skills Acquired' : 'Compétences Acquises',
            value: '8',
            change: '+2 ce mois'
        },
        {
            icon: Users,
            label: isEnglish ? 'Active Mentors' : 'Mentors Actifs',
            value: '3',
            change: 'Sur 5 sessions'
        },
        {
            icon: Star,
            label: isEnglish ? 'Achievements' : 'Réalisations',
            value: '12',
            change: 'Badges gagnés'
        }
    ];

    const upcomingSessions = [
        {
            mentor: 'Dr. Kamga Paul',
            topic: isEnglish ? 'Advanced Web Development' : 'Développement Web Avancé',
            date: '15 Jan, 14:00',
            status: isEnglish ? 'Confirmed' : 'Confirmé'
        },
        {
            mentor: 'Mme. Nguemo Sarah',
            topic: isEnglish ? 'Digital Marketing' : 'Marketing Digital',
            date: '18 Jan, 10:00',
            status: isEnglish ? 'Pending' : 'En attente'
        }
    ];

    const recommendedMentors = [
        {
            name: 'M. Fotso Jean',
            expertise: isEnglish ? 'Mobile Development' : 'Développement Mobile',
            rating: 4.8,
            location: 'Douala'
        },
        {
            name: 'Mme. Tchamba Marie',
            expertise: isEnglish ? 'UI/UX Design' : 'Design UI/UX',
            rating: 4.9,
            location: 'Yaoundé'
        },
        {
            name: 'M. Nkeng Peter',
            expertise: isEnglish ? 'Data Science' : 'Science des Données',
            rating: 4.7,
            location: 'Buea'
        }
    ];

    const menuItems = [
        { icon: BookOpen, label: isEnglish ? 'Learning Path' : 'Parcours d\'apprentissage' },
        { icon: Users, label: isEnglish ? 'Find Mentors' : 'Trouver des Mentors' },
        { icon: Calendar, label: isEnglish ? 'Sessions' : 'Sessions' },
        { icon: MessageSquare, label: isEnglish ? 'Messages' : 'Messages' },
        { icon: Award, label: isEnglish ? 'Achievements' : 'Réalisations' },
        { icon: User, label: isEnglish ? 'Profile' : 'Profil' }
    ];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r border-gray-200 dark:border-gray-700`}>
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <BookOpenCheck className="w-8 h-8 text-blue-600" />
                        <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              MentorCam
            </span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
                        <X className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-500'}`} />
                    </button>
                </div>

                <div className="p-4">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-bold">JD</span>
                        </div>
                        <div>
                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Jean Dubois
                            </h3>
                            <p className="text-sm text-gray-500">Développeur Junior</p>
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
                {/* Top Navigation */}
                <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden text-gray-500 dark:text-gray-400"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

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
                            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
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

                {/* Progress and Sessions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                        <CardContent className="p-6">
                            <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {isEnglish ? 'Learning Progress' : 'Progression d\'apprentissage'}
                            </h2>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={learningProgress}>
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
                                            dataKey="hours"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            name={isEnglish ? 'Hours Spent' : 'Heures passées'}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="skills"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            name={isEnglish ? 'Skills Gained' : 'Compétences acquises'}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                        <CardContent className="p-6">
                            <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {isEnglish ? 'Upcoming Sessions' : 'Prochaines Sessions'}
                            </h2>
                            <div className="space-y-4">
                                {upcomingSessions.map((session, index) => (
                                    <div key={index} className="p-4 rounded-lg border dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {session.topic}
                                            </h3>
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                session.status === (isEnglish ? 'Confirmed' : 'Confirmé')
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                            }`}>
                        {session.status}
                      </span>
                                        </div>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {session.mentor} • {session.date}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recommended Mentors */}
                <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
                    <CardContent className="p-6">
                        <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {isEnglish ? 'Recommended Mentors' : 'Mentors Recommandés'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recommendedMentors.map((mentor, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg border ${
                                        isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                                    } transition-colors cursor-pointer`}
                                >
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                            <span className="text-blue-600 font-medium">{mentor.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {mentor.name}
                                            </h3>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {mentor.expertise}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {mentor.rating}
                      </span>
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {mentor.location}
                      </span>
                                        </div>
                                    </div>
                                    <button className="mt-3 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                        {isEnglish ? 'Connect' : 'Contacter'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default BeginnerDashboard;