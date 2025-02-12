import React, { useState, useEffect } from 'react';
import InstitutionLayout from '../institut_layout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Filter, RefreshCw, Calendar, TrendingUp, Users, Briefcase, Target } from 'lucide-react';

const Rapports = () => {
  const [isEnglish, setIsEnglish] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(true);

  // Sample data - In a real app, this would come from an API
  const activityData = [
    { month: 'Jan', applications: 65, hires: 23, events: 12 },
    { month: 'Feb', applications: 78, hires: 28, events: 15 },
    { month: 'Mar', applications: 92, hires: 31, events: 18 },
    { month: 'Apr', applications: 85, hires: 25, events: 14 },
    { month: 'May', applications: 110, hires: 35, events: 22 },
    { month: 'Jun', applications: 95, hires: 30, events: 17 },
  ];

  const statsCards = [
    {
      title: isEnglish ? 'Total Applications' : 'Candidatures Totales',
      value: '525',
      change: '+12.5%',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: isEnglish ? 'Successful Hires' : 'Recrutements Réussis',
      value: '172',
      change: '+8.2%',
      icon: Briefcase,
      color: 'bg-green-500'
    },
    {
      title: isEnglish ? 'Events Organized' : 'Événements Organisés',
      value: '98',
      change: '+15.3%',
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: isEnglish ? 'Conversion Rate' : 'Taux de Conversion',
      value: '32.7%',
      change: '+5.4%',
      icon: Target,
      color: 'bg-orange-500'
    }
  ];

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-2 dark:text-white">{value}</h3>
          <span className={`inline-flex items-center text-sm ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            {change}
          </span>
        </div>
        <div className={`${color} p-4 rounded-full`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <InstitutionLayout isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">
              {isEnglish ? 'Reports & Analytics' : 'Rapports & Analyses'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {isEnglish 
                ? 'Track your recruitment and event performance metrics'
                : 'Suivez vos métriques de recrutement et d\'événements'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <Filter className="w-4 h-4 mr-2" />
              {isEnglish ? 'Filter' : 'Filtrer'}
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
              <Download className="w-4 h-4 mr-2" />
              {isEnglish ? 'Export' : 'Exporter'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              {isEnglish ? 'Activity Overview' : 'Aperçu des Activités'}
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="applications" stroke="#3B82F6" />
                  <Line type="monotone" dataKey="hires" stroke="#10B981" />
                  <Line type="monotone" dataKey="events" stroke="#8B5CF6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Conversion Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              {isEnglish ? 'Conversion Rates' : 'Taux de Conversion'}
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hires" fill="#10B981" />
                  <Bar dataKey="applications" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin">
              <RefreshCw className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
      </div>
    </InstitutionLayout>
  );
};

export default Rapports;