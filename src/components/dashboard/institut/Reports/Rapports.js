import React, { useState, useEffect } from 'react';
import InstitutionLayout from '../institut_layout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Filter, RefreshCw, Calendar, TrendingUp, Users, Briefcase, Target } from 'lucide-react';
import { fetchInstitutionStatistics } from '../../../services/institute/rapport';

const Rapports = () => {
  const [isEnglish, setIsEnglish] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    jobs: [],
    events: [],
    job_statistics: {
      total_jobs: 0,
      active_jobs: 0,
      average_applications_per_job: 0
    },
    event_statistics: {
      total_events: 0,
      upcoming_events: 0,
      average_attendees_per_event: 0
    }
  });

  // Format data for charts
  const prepareActivityData = () => {
    // Group jobs and events by month
    const monthlyData = {};
    
    // Process jobs data
    statistics.jobs.forEach(job => {
      const date = new Date(job.created_at);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, applications: 0, hires: 0, events: 0 };
      }
      
      // Count applications for this job
      if (job.applications && job.applications.length) {
        monthlyData[monthKey].applications += job.applications.length;
      }
      
      // Count successful hires (assuming there's a hired status in applications)
      if (job.applications) {
        const hiredCount = job.applications.filter(app => app.status === 'hired').length;
        monthlyData[monthKey].hires += hiredCount;
      }
    });
    
    // Process events data
    statistics.events.forEach(event => {
      const date = new Date(event.date || event.created_at);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, applications: 0, hires: 0, events: 0 };
      }
      
      monthlyData[monthKey].events += 1;
    });
    
    // Convert to array and sort by month
    return Object.values(monthlyData).sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });
  };

  // Calculate total applications from all jobs
  const calculateTotalApplications = () => {
    return statistics.jobs.reduce((total, job) => {
      return total + (job.applications ? job.applications.length : 0);
    }, 0);
  };

  // Calculate successful hires
  const calculateSuccessfulHires = () => {
    return statistics.jobs.reduce((total, job) => {
      if (!job.applications) return total;
      return total + job.applications.filter(app => app.status === 'hired').length;
    }, 0);
  };

  // Calculate conversion rate
  const calculateConversionRate = () => {
    const applications = calculateTotalApplications();
    const hires = calculateSuccessfulHires();
    return applications > 0 ? ((hires / applications) * 100).toFixed(1) + '%' : '0%';
  };

  useEffect(() => {
    const loadStatistics = async () => {
      setIsLoading(true);
      try {
        const data = await fetchInstitutionStatistics();
        setStatistics(data);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStatistics();
  }, []);

  const activityData = prepareActivityData();

  const statsCards = [
    {
      title: isEnglish ? 'Total Applications' : 'Candidatures Totales',
      value: calculateTotalApplications().toString(),
      change: '+12.5%', // This would ideally be calculated from historical data
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: isEnglish ? 'Successful Hires' : 'Recrutements Réussis',
      value: calculateSuccessfulHires().toString(),
      change: '+8.2%', // This would ideally be calculated from historical data
      icon: Briefcase,
      color: 'bg-green-500'
    },
    {
      title: isEnglish ? 'Events Organized' : 'Événements Organisés',
      value: statistics.event_statistics.total_events.toString(),
      change: '+15.3%', // This would ideally be calculated from historical data
      icon: Calendar,
      color: 'bg-purple-500'
    },
    {
      title: isEnglish ? 'Conversion Rate' : 'Taux de Conversion',
      value: calculateConversionRate(),
      change: '+5.4%', // This would ideally be calculated from historical data
      icon: Target,
      color: 'bg-orange-500'
    }
  ];

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

        {/* Job Statistics Detail */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">
            {isEnglish ? 'Job Statistics' : 'Statistiques des Offres'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">{isEnglish ? 'Total Jobs' : 'Total des Offres'}</p>
              <h4 className="text-xl font-bold mt-1 dark:text-white">{statistics.job_statistics.total_jobs}</h4>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">{isEnglish ? 'Active Jobs' : 'Offres Actives'}</p>
              <h4 className="text-xl font-bold mt-1 dark:text-white">{statistics.job_statistics.active_jobs}</h4>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">{isEnglish ? 'Avg. Applications' : 'Moy. Candidatures'}</p>
              <h4 className="text-xl font-bold mt-1 dark:text-white">
                {statistics.job_statistics.average_applications_per_job ? 
                  statistics.job_statistics.average_applications_per_job.toFixed(1) : '0'}
              </h4>
            </div>
          </div>
        </div>

        {/* Event Statistics Detail */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">
            {isEnglish ? 'Event Statistics' : 'Statistiques des Événements'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">{isEnglish ? 'Total Events' : 'Total des Événements'}</p>
              <h4 className="text-xl font-bold mt-1 dark:text-white">{statistics.event_statistics.total_events}</h4>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">{isEnglish ? 'Upcoming Events' : 'Événements à Venir'}</p>
              <h4 className="text-xl font-bold mt-1 dark:text-white">{statistics.event_statistics.upcoming_events}</h4>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">{isEnglish ? 'Avg. Attendees' : 'Moy. Participants'}</p>
              <h4 className="text-xl font-bold mt-1 dark:text-white">
                {statistics.event_statistics.average_attendees_per_event ? 
                  statistics.event_statistics.average_attendees_per_event.toFixed(1) : '0'}
              </h4>
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