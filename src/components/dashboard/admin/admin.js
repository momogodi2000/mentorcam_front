import React, { useState } from 'react';
import { Sun, Moon, Globe, Users, BookOpen, Calendar, CreditCard, Bell, BarChart2, Settings, Menu, X, BookOpenCheck, TrendingUp, Wallet, PhoneCall } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Sample data for charts
  const mentorshipData = [
    { month: 'Jan', sessions: 65, revenue: 1200 },
    { month: 'Feb', sessions: 78, revenue: 1400 },
    { month: 'Mar', sessions: 92, revenue: 1800 },
    { month: 'Apr', sessions: 85, revenue: 1600 },
  ];

  const stats = [
    { 
      label: isEnglish ? 'Active Users' : 'Utilisateurs Actifs',
      value: '5,234',
      change: '+12%',
      description: isEnglish ? 'Total active users this month' : 'Total des utilisateurs actifs ce mois'
    },
    { 
      label: isEnglish ? 'Active Mentors' : 'Mentors Actifs',
      value: '1,432',
      change: '+8%',
      description: isEnglish ? 'Professional mentors available' : 'Mentors professionnels disponibles'
    },
    { 
      label: isEnglish ? 'Revenue' : 'Revenus',
      value: '2.4M FCFA',
      change: '+15%',
      description: isEnglish ? 'Total revenue this month' : 'Revenu total ce mois'
    },
    { 
      label: isEnglish ? 'Mobile Money' : 'Mobile Money',
      value: '892',
      change: '+20%',
      description: isEnglish ? 'Transactions via MTN/Orange' : 'Transactions via MTN/Orange'
    }
  ];

  const recentActivities = [
    { 
      user: 'Jean Paul K.',
      action: isEnglish ? 'New mentor registration' : 'Nouvelle inscription mentor',
      time: '5 min',
      location: 'Douala'
    },
    { 
      user: 'Marie N.',
      action: isEnglish ? 'Payment received (Orange Money)' : 'Paiement reçu (Orange Money)',
      time: '15 min',
      location: 'Yaoundé'
    },
    { 
      user: 'Pierre M.',
      action: isEnglish ? 'Session completed' : 'Session terminée',
      time: '1h',
      location: 'Bafoussam'
    }
  ];

  const menuItems = [
    { icon: BarChart2, label: isEnglish ? 'Dashboard' : 'Tableau de Bord' },
    { icon: TrendingUp, label: isEnglish ? 'Statistics' : 'Statistiques' },
    { icon: Users, label: isEnglish ? 'Users' : 'Utilisateurs' },
    { icon: BookOpen, label: isEnglish ? 'Courses' : 'Formations' },
    { icon: Calendar, label: isEnglish ? 'Events' : 'Événements' },
    { icon: Wallet, label: isEnglish ? 'Payments' : 'Paiements' },
    { icon: Settings, label: isEnglish ? 'Settings' : 'Paramètres' }
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

        <nav className="space-y-1 p-4">
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

        <div className="absolute bottom-0 w-full p-4 border-t dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <PhoneCall className="w-5 h-5 text-gray-500" />
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Support: +237 6XX XXX XXX
            </span>
          </div>
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
            <Card
              key={index}
              className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
            >
              <CardContent className="p-6">
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {stat.label}
                </h3>
                <div className="mt-2 flex items-baseline justify-between">
                  <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                  <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                </div>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6">
              <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {isEnglish ? 'Mentorship Sessions' : 'Sessions de Mentorat'}
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
                    <Line type="monotone" dataKey="sessions" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-6">
              <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {isEnglish ? 'Recent Activities' : 'Activités Récentes'}
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white font-medium">{activity.user.charAt(0)}</span>
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {activity.user}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {activity.action}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {activity.location}
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;