import React, { useState } from 'react';
import { Sun, Moon, Globe, Users, BookOpen, Calendar, CreditCard, ChevronDown, Bell, Search, BarChart2, Settings, LogOut, Menu, X } from 'lucide-react';

const AdminDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const stats = [
    { label: isEnglish ? 'Active Users' : 'Utilisateurs Actifs', value: '5,234', change: '+12%' },
    { label: isEnglish ? 'Total Mentors' : 'Total Mentors', value: '1,432', change: '+8%' },
    { label: isEnglish ? 'Revenue' : 'Revenus', value: '2.4M FCFA', change: '+15%' },
    { label: isEnglish ? 'Sessions' : 'Sessions', value: '892', change: '+20%' }
  ];

  const recentActivities = [
    { user: 'Jean Paul K.', action: isEnglish ? 'New mentor registration' : 'Nouvelle inscription mentor', time: '5 min' },
    { user: 'Marie N.', action: isEnglish ? 'Payment received' : 'Paiement reçu', time: '15 min' },
    { user: 'Pierre M.', action: isEnglish ? 'Session completed' : 'Session terminée', time: '1h' }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r border-gray-200 dark:border-gray-700`}>
        <div className="flex items-center justify-between p-4">
          <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            MentorCam Admin
          </span>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <X className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-500'}`} />
          </button>
        </div>

        <nav className="space-y-1 px-3">
          {[
            { icon: BarChart2, label: isEnglish ? 'Dashboard' : 'Tableau de Bord' },
            { icon: Users, label: isEnglish ? 'Users' : 'Utilisateurs' },
            { icon: BookOpen, label: isEnglish ? 'Courses' : 'Formations' },
            { icon: Calendar, label: isEnglish ? 'Events' : 'Événements' },
            { icon: CreditCard, label: isEnglish ? 'Payments' : 'Paiements' },
            { icon: Settings, label: isEnglish ? 'Settings' : 'Paramètres' }
          ].map((item, index) => (
            <button
              key={index}
              className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                index === 0
                  ? 'bg-blue-500 text-white'
                  : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`p-4 sm:ml-64 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        {/* Top Navigation */}
        <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-gray-500 dark:text-gray-400"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
              <button onClick={toggleTheme}>
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <button onClick={() => setIsEnglish(!isEnglish)} className="flex items-center">
                <Globe className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                <span className="ml-2">{isEnglish ? 'EN' : 'FR'}</span>
              </button>
              <button className="relative">
                <Bell className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
            >
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {stat.label}
              </h3>
              <div className="flex items-baseline mt-2">
                <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
                <span className="ml-2 text-sm text-green-500">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {isEnglish ? 'Recent Activities' : 'Activités Récentes'}
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-sm">{activity.user.charAt(0)}</span>
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {activity.user}
                      </p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {activity.action}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {isEnglish ? 'Quick Actions' : 'Actions Rapides'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: isEnglish ? 'Add Mentor' : 'Ajouter Mentor' },
                { icon: Calendar, label: isEnglish ? 'New Event' : 'Nouvel Événement' },
                { icon: BookOpen, label: isEnglish ? 'Add Course' : 'Ajouter Formation' },
                { icon: CreditCard, label: isEnglish ? 'Payments' : 'Paiements' }
              ].map((action, index) => (
                <button
                  key={index}
                  className={`p-4 rounded-lg border ${
                    isDarkMode
                      ? 'border-gray-700 hover:bg-gray-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  } transition-colors flex flex-col items-center justify-center`}
                >
                  <action.icon className={`w-6 h-6 mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;