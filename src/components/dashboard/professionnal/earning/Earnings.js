import React, { useState, useEffect } from 'react';
import { earningsService } from '../../../services/professionnal/earning_services';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { ArrowUpRight, DollarSign, Users, Calendar, ArrowDownRight } from 'lucide-react';
import ProfessionalLayout from '../professionnal_layout';

const EarningsDashboard = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const data = await earningsService.getDetailedEarnings();
      setEarnings(data);
      
      const processedData = processBookingHistory(data.booking_history);
      setChartData(processedData);
    } catch (err) {
      setError('Failed to fetch earnings data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const processBookingHistory = (history) => {
    const monthlyData = history.reduce((acc, booking) => {
      const date = new Date(booking.booking_date);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      if (!acc[monthYear]) {
        acc[monthYear] = { month: monthYear, amount: 0, bookings: 0 };
      }
      
      acc[monthYear].amount += parseFloat(booking.amount);
      acc[monthYear].bookings += 1;
      
      return acc;
    }, {});

    return Object.values(monthlyData);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen text-red-500">
          {error}
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {isEnglish ? 'Professional Earnings Dashboard' : 'Tableau de Bord des Revenus'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {isEnglish ? 'Welcome back,' : 'Bienvenue,'} {earnings?.name}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isEnglish ? 'Total Earnings' : 'Revenus Totaux'}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    ${parseFloat(earnings?.total_earnings).toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-600 dark:text-green-400">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm ml-1">12% increase</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isEnglish ? 'Total Bookings' : 'Réservations Totales'}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {earnings?.booking_history.length}
                  </p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm ml-1">8% increase</span>
              </div>
            </motion.div>
          </div>

          {/* Earnings Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8"
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
              {isEnglish ? 'Earnings Overview' : 'Aperçu des Revenus'}
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#E5E7EB'} />
                  <XAxis 
                    dataKey="month" 
                    stroke={isDarkMode ? '#9CA3AF' : '#4B5563'}
                  />
                  <YAxis 
                    stroke={isDarkMode ? '#9CA3AF' : '#4B5563'}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                      borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                      color: isDarkMode ? '#FFFFFF' : '#000000'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
              {isEnglish ? 'Recent Bookings' : 'Réservations Récentes'}
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">
                      {isEnglish ? 'Student' : 'Étudiant'}
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">
                      {isEnglish ? 'Date' : 'Date'}
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">
                      {isEnglish ? 'Amount' : 'Montant'}
                    </th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300">
                      {isEnglish ? 'Status' : 'Statut'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {earnings?.booking_history.slice(0, 5).map((booking, index) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{booking.student_name}</td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                        {new Date(booking.booking_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                        ${parseFloat(booking.amount).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <ProfessionalLayout 
      isDarkMode={isDarkMode} 
      setIsDarkMode={setIsDarkMode}
      isEnglish={isEnglish}
      setIsEnglish={setIsEnglish}
    >
      {renderContent()}
    </ProfessionalLayout>
  );
};

export default EarningsDashboard;