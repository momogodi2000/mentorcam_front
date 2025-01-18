import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  // Sample data for charts
  const mentorshipData = [
    { month: 'Jan', sessions: 65, revenue: 1200 },
    { month: 'Feb', sessions: 78, revenue: 1400 },
    { month: 'Mar', sessions: 92, revenue: 1800 },
    { month: 'Apr', sessions: 85, revenue: 1600 },
  ];

  const stats = [
    { 
      label: 'Active Users',
      value: '5,234',
      change: '+12%',
      description: 'Total active users this month'
    },
    { 
      label: 'Active Mentors',
      value: '1,432',
      change: '+8%',
      description: 'Professional mentors available'
    },
    { 
      label: 'Revenue',
      value: '2.4M FCFA',
      change: '+15%',
      description: 'Total revenue this month'
    },
    { 
      label: 'Mobile Money',
      value: '892',
      change: '+20%',
      description: 'Transactions via MTN/Orange'
    }
  ];

  const recentActivities = [
    { 
      user: 'Jean Paul K.',
      action: 'New mentor registration',
      time: '5 min',
      location: 'Douala'
    },
    { 
      user: 'Marie N.',
      action: 'Payment received (Orange Money)',
      time: '15 min',
      location: 'Yaoundé'
    },
    { 
      user: 'Pierre M.',
      action: 'Session completed',
      time: '1h',
      location: 'Bafoussam'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="transform transition-all duration-200"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.label}
                </h3>
                <div className="mt-2 flex items-baseline justify-between">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <motion.span 
                    whileHover={{ scale: 1.1 }}
                    className="text-sm text-green-500 font-medium"
                  >
                    {stat.change}
                  </motion.span>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          variants={item}
          whileHover={{ scale: 1.01 }}
          className="transform transition-all duration-200"
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Mentorship Sessions
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mentorshipData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sessions" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={item}
          whileHover={{ scale: 1.01 }}
          className="transform transition-all duration-200"
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Recent Activities
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                    className="flex items-center justify-between p-4 rounded-xl transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center"
                      >
                        <span className="text-white font-medium text-lg">
                          {activity.user.charAt(0)}
                        </span>
                      </motion.div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.user}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {activity.action}
                        </p>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {activity.location}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                          <motion.span 
                            whileHover={{ scale: 1.1 }}
                            className="text-xs font-medium text-blue-500"
                          >
                            {activity.time} ago
                          </motion.span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Additional Quick Actions */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 cursor-pointer"
          >
            <h3 className="text-lg font-semibold mb-2">Quick Support</h3>
            <p className="text-blue-100 text-sm">
              Need help? Connect with our support team instantly
            </p>
          </motion.div>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 cursor-pointer"
          >
            <h3 className="text-lg font-semibold mb-2">New Mentors</h3>
            <p className="text-green-100 text-sm">
              Review and approve pending mentor applications
            </p>
          </motion.div>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 cursor-pointer"
          >
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-purple-100 text-sm">
              View detailed reports and insights
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;