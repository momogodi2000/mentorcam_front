import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, ShoppingCart, CheckCircle, Clock, X, DollarSign, Download, Mail, UserCheck, UserPlus } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminLayout from '../admin_layout';
import axiosInstance from '../../../services/backend_connection';
import { motion } from 'framer-motion';

const AdminRevenue = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState('weekly');
  const [isEnglish, setIsEnglish] = useState(true); // You can connect this to your global language state
  const [emailNotification, setEmailNotification] = useState({
    loading: false,
    type: '',
    result: null
  });
  
  useEffect(() => {
    fetchAnalyticsData();
  }, []);
  
  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/admin/booking-analytics/');
      setAnalyticsData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err.response?.data?.error || 'Failed to fetch analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmailNotifications = async (emailType) => {
    setEmailNotification({
      loading: true,
      type: emailType,
      result: null
    });
    
    try {
      const response = await axiosInstance.post('/admin/booking-analytics/', {
        email_type: emailType
      });
      
      setEmailNotification({
        loading: false,
        type: emailType,
        result: {
          success: true,
          message: response.data.message
        }
      });
      
      // Reset the notification after 5 seconds
      setTimeout(() => {
        setEmailNotification(prev => ({
          ...prev,
          result: null
        }));
      }, 5000);
      
    } catch (err) {
      setEmailNotification({
        loading: false,
        type: emailType,
        result: {
          success: false,
          message: err.response?.data?.error || 'Failed to send email notifications'
        }
      });
    }
  };

  // Prepare data for charts
  const prepareRevenueData = () => {
    if (!analyticsData || !analyticsData.bookings || analyticsData.bookings.length === 0) {
      return [];
    }

    // Create a map to aggregate data by date
    const bookingsByDate = analyticsData.bookings.reduce((acc, booking) => {
      const date = new Date(booking.booking_date);
      let key;
      
      // Format the key based on the selected time frame
      if (timeFrame === 'daily') {
        key = date.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (timeFrame === 'weekly') {
        // Get the Monday of the week
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
        const monday = new Date(date.setDate(diff));
        key = monday.toISOString().split('T')[0];
      } else if (timeFrame === 'monthly') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }
      
      if (!acc[key]) {
        acc[key] = {
          date: key,
          revenue: 0,
          bookings: 0,
          completed: 0,
          pending: 0,
          cancelled: 0
        };
      }
      
      acc[key].revenue += booking.amount;
      acc[key].bookings += 1;
      
      if (booking.status === 'completed') acc[key].completed += 1;
      else if (booking.status === 'pending') acc[key].pending += 1;
      else if (booking.status === 'cancelled') acc[key].cancelled += 1;
      
      return acc;
    }, {});
    
    // Convert the map to an array and sort by date
    return Object.values(bookingsByDate).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const preparePredictionData = () => {
    if (!analyticsData || !analyticsData.predicted_revenue_next_30_days) {
      return [];
    }
    
    const startDate = new Date();
    return analyticsData.predicted_revenue_next_30_days.map((value, index) => {
      const predictionDate = new Date(startDate);
      predictionDate.setDate(startDate.getDate() + index);
      return {
        date: predictionDate.toISOString().split('T')[0],
        predictedRevenue: parseFloat(value.toFixed(2))
      };
    });
  };

  const prepareStatusData = () => {
    if (!analyticsData) return [];
    
    return [
      { name: isEnglish ? 'Completed' : 'Terminé', value: analyticsData.completed_bookings },
      { name: isEnglish ? 'Pending' : 'En attente', value: analyticsData.pending_bookings },
      { name: isEnglish ? 'Cancelled' : 'Annulé', value: analyticsData.cancelled_bookings }
    ];
  };

  // Prepare data for the revenue breakdown chart
  const prepareRevenueBreakdownData = () => {
    if (!analyticsData) return [];
    
    return [
      { name: isEnglish ? 'Bookings' : 'Réservations', value: analyticsData.booking_revenue || 0 },
      { name: isEnglish ? 'Activations' : 'Activations', value: analyticsData.activation_revenue || 0 }
    ];
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Stats card component
  const StatsCard = ({ icon: Icon, title, value, bgColor, textColor, increase }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className={`${bgColor} rounded-xl shadow-lg p-6`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className={`text-2xl font-bold mt-2 ${textColor}`}>{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${bgColor === 'bg-white' ? 'bg-blue-100' : 'bg-opacity-20 bg-white'}`}>
          <Icon className={textColor} size={24} />
        </div>
      </div>
      {increase !== undefined && (
        <div className="mt-4 flex items-center">
          <TrendingUp size={16} className={increase >= 0 ? "text-green-500" : "text-red-500"} />
          <span className={`ml-2 text-sm ${increase >= 0 ? "text-green-500" : "text-red-500"}`}>
            {increase >= 0 ? `+${increase}%` : `${increase}%`}
          </span>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">vs. last period</span>
        </div>
      )}
    </motion.div>
  );

  // Time frame selector component
  const TimeFrameSelector = () => (
    <div className="flex space-x-2 mb-6">
      {['daily', 'weekly', 'monthly'].map((frame) => (
        <button
          key={frame}
          onClick={() => setTimeFrame(frame)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            timeFrame === frame 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {isEnglish 
            ? frame.charAt(0).toUpperCase() + frame.slice(1) 
            : frame === 'daily' 
              ? 'Quotidien' 
              : frame === 'weekly' 
                ? 'Hebdomadaire' 
                : 'Mensuel'}
        </button>
      ))}
    </div>
  );

  // Email Notification Alert Component
  const EmailNotificationAlert = () => {
    if (!emailNotification.result) return null;
    
    return (
      <div className={`mb-6 p-4 rounded-lg ${
        emailNotification.result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        <div className="flex items-center">
          {emailNotification.result.success ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <X className="w-5 h-5 mr-2" />
          )}
          <span>{emailNotification.result.message}</span>
        </div>
      </div>
    );
  };

  // Loading and error handling
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <X className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
        <button
          onClick={fetchAnalyticsData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEnglish ? 'Try Again' : 'Réessayer'}
        </button>
      </AdminLayout>
    );
  }

  const revenueData = prepareRevenueData();
  const predictionData = preparePredictionData();
  const statusData = prepareStatusData();
  const revenueBreakdownData = prepareRevenueBreakdownData();

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEnglish ? 'Revenue Analytics' : 'Analyse des Revenus'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {isEnglish 
            ? 'Track your business performance and booking trends' 
            : 'Suivez la performance de votre entreprise et les tendances des réservations'}
        </p>
      </div>

      {/* Email Notifications Alert */}
      <EmailNotificationAlert />

      {/* Email Notification Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {isEnglish ? 'Email Notifications' : 'Notifications par Email'}
        </h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => sendEmailNotifications('activation_reminder')}
            disabled={emailNotification.loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {emailNotification.loading && emailNotification.type === 'activation_reminder' ? (
              <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
            ) : (
              <UserPlus className="w-5 h-5 mr-2" />
            )}
            {isEnglish ? 'Send Activation Reminders' : 'Envoyer Rappels d\'Activation'}
          </button>
          
          <button
            onClick={() => sendEmailNotifications('payment_confirmation')}
            disabled={emailNotification.loading}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {emailNotification.loading && emailNotification.type === 'payment_confirmation' ? (
              <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
            ) : (
              <Mail className="w-5 h-5 mr-2" />
            )}
            {isEnglish ? 'Send Payment Confirmations' : 'Envoyer Confirmations de Paiement'}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          icon={DollarSign}
          title={isEnglish ? 'Total Revenue' : 'Revenu Total'}
          value={formatCurrency(analyticsData?.total_revenue || 0)}
          bgColor="bg-white dark:bg-gray-800"
          textColor="text-blue-600 dark:text-blue-500"
          increase={12.5} // Example value, replace with actual calculation
        />
        
        <StatsCard 
          icon={ShoppingCart}
          title={isEnglish ? 'Total Bookings' : 'Réservations Totales'}
          value={analyticsData?.total_bookings || 0}
          bgColor="bg-white dark:bg-gray-800"
          textColor="text-green-600 dark:text-green-500"
          increase={8.2} // Example value
        />
        
        <StatsCard 
          icon={UserCheck}
          title={isEnglish ? 'Activated Profiles' : 'Profils Activés'}
          value={analyticsData?.activated_professionals || 0}
          bgColor="bg-white dark:bg-gray-800"
          textColor="text-purple-600 dark:text-purple-500"
          increase={15.3} // Example value
        />
        
        <StatsCard 
          icon={Clock}
          title={isEnglish ? 'Activation Rate' : 'Taux d\'Activation'}
          value={`${analyticsData?.activation_rate || 0}%`}
          bgColor="bg-white dark:bg-gray-800"
          textColor="text-amber-600 dark:text-amber-500"
          increase={5.2} // Example value
        />
      </div>

      {/* Time Frame Selector */}
      <TimeFrameSelector />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Trend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 col-span-1 lg:col-span-2"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isEnglish ? 'Revenue Trend' : 'Tendance des Revenus'}
            </h2>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <Download className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => {
                    if (timeFrame === 'monthly') {
                      return date.substring(0, 7);
                    } else if (timeFrame === 'weekly') {
                      return `W${Math.floor((new Date(date).getDate() - 1) / 7) + 1}`;
                    }
                    return date;
                  }}
                  stroke="#9CA3AF"
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), isEnglish ? 'Revenue' : 'Revenu']}
                  labelFormatter={(date) => `Date: ${date}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  name={isEnglish ? 'Revenue' : 'Revenu'} 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue Breakdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isEnglish ? 'Revenue Breakdown' : 'Répartition des Revenus'}
            </h2>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <Download className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip formatter={(value) => [formatCurrency(value), isEnglish ? 'Amount' : 'Montant']} />
                <Bar 
                  dataKey="value" 
                  name={isEnglish ? 'Amount' : 'Montant'} 
                  fill="#8884d8"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Booking Status */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isEnglish ? 'Booking Status' : 'Statut des Réservations'}
            </h2>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <Download className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip />
                <Bar 
                  dataKey="value" 
                  name={isEnglish ? 'Bookings' : 'Réservations'} 
                  fill="#8884d8"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Monthly Revenue */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 col-span-1 lg:col-span-2"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEnglish ? 'Current Month Revenue' : 'Revenu du Mois en Cours'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isEnglish 
                  ? 'Performance for the current month' 
                  : 'Performance pour le mois en cours'}
              </p>
            </div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">
              {formatCurrency(analyticsData?.monthly_revenue || 0)}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isEnglish ? 'Booking Revenue' : 'Revenu des Réservations'}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                {formatCurrency(analyticsData?.booking_revenue || 0)}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isEnglish ? 'Activation Revenue' : 'Revenu des Activations'}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                {formatCurrency(analyticsData?.activation_revenue || 0)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Revenue Prediction */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isEnglish ? 'Revenue Prediction (Next 30 Days)' : 'Prévision des Revenus (30 Prochains Jours)'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isEnglish 
                ? 'Based on historical booking data and linear regression model' 
                : 'Basé sur les données historiques et un modèle de régression linéaire'}
            </p>
          </div>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <Download className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => date.substring(5)} // Show only MM-DD
                stroke="#9CA3AF"
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), isEnglish ? 'Predicted Revenue' : 'Revenu Prévu']}
                labelFormatter={(date) => `Date: ${date}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="predictedRevenue" 
                name={isEnglish ? 'Predicted Revenue' : 'Revenu Prévu'} 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Activated Professionals */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isEnglish ? 'Activated Professional Profiles' : 'Profils Professionnels Activés'}
            </h2>
            <div>
              <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-medium">
                {analyticsData?.activation_rate || 0}% {isEnglish ? 'Activation Rate' : 'Taux d\'Activation'}
              </span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {isEnglish ? 'Professional' : 'Professionnel'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {isEnglish ? 'Domain' : 'Domaine'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {isEnglish ? 'Rate' : 'Tarif'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {isEnglish ? 'Activation Date' : 'Date d\'Activation'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {analyticsData?.activated_professional_profiles?.slice(0, 5).map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    #{profile.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex flex-col">
                      <span className="font-medium">{profile.full_name}</span>
                      <span className="text-xs text-gray-400">{profile.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {profile.domain}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {profile.hourly_rate ? formatCurrency(profile.hourly_rate) + '/hr' : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {profile.activation_date ? new Date(profile.activation_date).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex justify-center">
          <button className="text-blue-600 dark:text-blue-500 text-sm font-medium hover:underline">
            {isEnglish ? 'View All Activated Professionals' : 'Voir Tous les Professionnels Activés'}
          </button>
        </div>
      </motion.div>

      {/* Recent Bookings */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEnglish ? 'Recent Bookings' : 'Réservations Récentes'}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {isEnglish ? 'Booking ID' : 'ID Réservation'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {isEnglish ? 'Customer' : 'Client'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {isEnglish ? 'Professional' : 'Professionnel'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {isEnglish ? 'Amount' : 'Montant'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {isEnglish ? 'Date' : 'Date'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {isEnglish ? 'Status' : 'Statut'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {analyticsData?.recent_bookings?.slice(0, 5).map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    #{booking.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {booking.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {booking.professional_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(booking.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(booking.booking_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${booking.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : booking.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex justify-center">
          <button className="text-blue-600 dark:text-blue-500 text-sm font-medium hover:underline">
            {isEnglish ? 'View All Bookings' : 'Voir Toutes les Réservations'}
          </button>
        </div>
      </motion.div>

      {/* Additional Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Key Insights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {isEnglish ? 'Key Insights' : 'Insights Clés'}
          </h2>
          <ul className="space-y-3">
            {analyticsData?.insights?.map((insight, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-blue-600 dark:text-blue-500 mt-0.5">
                  <BarChart2 size={20} />
                </div>
                <p className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                  {isEnglish ? insight.text_en : insight.text_fr}
                </p>
              </li>
            ))}
          </ul>
        </motion.div>
        
        {/* Recommendations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {isEnglish ? 'Recommendations' : 'Recommandations'}
          </h2>
          <ul className="space-y-3">
            {analyticsData?.recommendations?.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-600 dark:text-green-500 mt-0.5">
                  <CheckCircle size={20} />
                </div>
                <p className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                  {isEnglish ? recommendation.text_en : recommendation.text_fr}
                </p>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Export Data Section */}
      <div className="mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEnglish ? 'Export Analytics Data' : 'Exporter les Données Analytiques'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isEnglish 
                  ? 'Download detailed analytics for your records or further analysis' 
                  : 'Téléchargez des analyses détaillées pour vos archives ou pour une analyse approfondie'}
              </p>
            </div>
            <div className="mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-2 flex flex-col md:flex-row">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-5 h-5 mr-2" />
                {isEnglish ? 'Export as CSV' : 'Exporter en CSV'}
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                <Download className="w-5 h-5 mr-2" />
                {isEnglish ? 'Export as PDF' : 'Exporter en PDF'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminRevenue;