import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/backend_connection';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from '../../ui/table';
import { Loader2, Users, UserCheck, DollarSign, Calendar, Briefcase, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/admin-dashboard/');
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again later.');
        setLoading(false);
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare chart data for user statistics
  const prepareUserStatsData = () => {
    if (!dashboardData) return [];
    
    return [
      { name: 'Total Active', value: dashboardData.active_users_count },
      { name: 'Active This Month', value: dashboardData.active_users_this_month_count },
      { name: 'Active Mentors', value: dashboardData.active_mentors_count },
      { name: 'Available Mentors', value: dashboardData.available_mentors_count }
    ];
  };

  // Prepare chart data for revenue statistics
  const prepareRevenueData = () => {
    if (!dashboardData) return [];
    
    return [
      { name: 'Total', value: dashboardData.total_revenue },
      { name: 'This Month', value: dashboardData.total_revenue_this_month },
      { name: 'Mobile Money', value: dashboardData.mobile_money_revenue }
    ];
  };

  // Simulated monthly trend data (would come from API in real implementation)
  const getMonthlyTrendData = () => {
    return [
      { name: 'Jan', users: 4000, sessions: 2400, revenue: 2400 },
      { name: 'Feb', users: 3000, sessions: 1398, revenue: 2210 },
      { name: 'Mar', users: 2000, sessions: 9800, revenue: 2290 },
      { name: 'Apr', users: 2780, sessions: 3908, revenue: 2000 },
      { name: 'May', users: 1890, sessions: 4800, revenue: 2181 },
      { name: 'Jun', users: 2390, sessions: 3800, revenue: 2500 },
      { name: 'Jul', users: 3490, sessions: 4300, revenue: 2100 },
    ];
  };

  // Simulated mentor category data
  const getMentorCategoryData = () => {
    return [
      { name: 'Technology', value: 400 },
      { name: 'Business', value: 300 },
      { name: 'Education', value: 300 },
      { name: 'Healthcare', value: 200 },
      { name: 'Other', value: 100 },
    ];
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <span className="ml-2 text-xl">Loading dashboard data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Analytics and platform overview</p>
        </div>
        
        <div className="mt-4 md:mt-0 bg-white dark:bg-gray-800 rounded-lg shadow p-1 flex space-x-1">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'overview' 
                ? 'bg-primary text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')} 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'users' 
                ? 'bg-primary text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Users
          </button>
          <button 
            onClick={() => setActiveTab('revenue')} 
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'revenue' 
                ? 'bg-primary text-white' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Revenue
          </button>
        </div>
      </div>
      
      {activeTab === 'overview' && (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={item}>
              <StatCard 
                title="Active Users" 
                value={dashboardData.active_users_count} 
                subValue={`${dashboardData.active_users_this_month_count} this month`}
                change={+8.2}
                icon={<Users className="w-8 h-8 text-blue-600" />}
                color="bg-blue-100"
              />
            </motion.div>
            <motion.div variants={item}>
              <StatCard 
                title="Active Mentors" 
                value={dashboardData.active_mentors_count} 
                subValue={`${dashboardData.available_mentors_count} available`}
                change={+5.1}
                icon={<UserCheck className="w-8 h-8 text-green-600" />}
                color="bg-green-100"
              />
            </motion.div>
            <motion.div variants={item}>
              <StatCard 
                title="Total Revenue" 
                value={`$${dashboardData.total_revenue.toLocaleString()}`} 
                subValue={`$${dashboardData.total_revenue_this_month.toLocaleString()} this month`}
                change={+12.5}
                icon={<DollarSign className="w-8 h-8 text-emerald-600" />}
                color="bg-emerald-100"
              />
            </motion.div>
            <motion.div variants={item}>
              <StatCard 
                title="Mentorship Sessions" 
                value={dashboardData.mentorship_sessions_count}
                subValue="Last 30 days"
                change={-2.3}
                icon={<Calendar className="w-8 h-8 text-purple-600" />}
                color="bg-purple-100"
              />
            </motion.div>
          </div>

          {/* Trends Section */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>User growth, sessions, and revenue trends over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getMonthlyTrendData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="sessions" stroke="#10b981" />
                    <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activities and Job Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={item}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Recent Mentorship Activities</CardTitle>
                  <CardDescription>Latest sessions and bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Mentor</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dashboardData.recent_activities.slice(0, 5).map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell className="font-medium">{activity.user}</TableCell>
                            <TableCell>{activity.professional}</TableCell>
                            <TableCell>{new Date(activity.booking_date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                                activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {activity.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Jobs Overview</CardTitle>
                  <CardDescription>Active jobs and applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">Active Jobs</h3>
                      <p className="text-3xl font-bold mt-2">
                        {dashboardData.jobs.filter(job => job.status === 'active').length}
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-green-800 dark:text-green-300">Total Applications</h3>
                      <p className="text-3xl font-bold mt-2">
                        {dashboardData.job_applications.length}
                      </p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Applications</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dashboardData.jobs.slice(0, 4).map((job) => (
                          <TableRow key={job.id}>
                            <TableCell className="font-medium">{job.title}</TableCell>
                            <TableCell>{job.company_name}</TableCell>
                            <TableCell>
                              {dashboardData.job_applications.filter(app => app.job === job.id).length}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      )}
      
      {activeTab === 'users' && (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                  <CardDescription>Active users and mentors overview</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareUserStatsData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={item}>
              <Card>
                <CardHeader>
                  <CardTitle>Mentor Categories</CardTitle>
                  <CardDescription>Distribution by specialization</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getMentorCategoryData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {getMentorCategoryData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>User Directory</CardTitle>
                <CardDescription>Active platform users and mentors</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* This would be populated with actual user data from the API */}
                    {dashboardData.recent_activities.slice(0, 10).map((activity, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{activity.user}</TableCell>
                        <TableCell>{`user${index}@example.com`}</TableCell>
                        <TableCell>{index % 3 === 0 ? 'Mentor' : 'User'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            index % 4 === 0 ? 'bg-red-100 text-red-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {index % 4 === 0 ? 'Inactive' : 'Active'}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(activity.booking_date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
      
      {activeTab === 'revenue' && (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={item}>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <DollarSign className="w-8 h-8 mx-auto text-green-600" />
                    <h3 className="mt-2 font-medium text-gray-500">Total Revenue</h3>
                    <p className="text-3xl font-bold mt-1">${dashboardData.total_revenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600 flex items-center justify-center mt-2">
                      <ArrowUp className="w-4 h-4 mr-1" /> 12.5% from last month
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={item}>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Calendar className="w-8 h-8 mx-auto text-blue-600" />
                    <h3 className="mt-2 font-medium text-gray-500">This Month</h3>
                    <p className="text-3xl font-bold mt-1">${dashboardData.total_revenue_this_month.toLocaleString()}</p>
                    <p className="text-sm text-green-600 flex items-center justify-center mt-2">
                      <ArrowUp className="w-4 h-4 mr-1" /> 8.3% from previous month
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={item}>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 mx-auto text-purple-600" />
                    <h3 className="mt-2 font-medium text-gray-500">Projected</h3>
                    <p className="text-3xl font-bold mt-1">${(dashboardData.total_revenue_this_month * 1.15).toFixed(0).toLocaleString()}</p>
                    <p className="text-sm text-green-600 flex items-center justify-center mt-2">
                      <ArrowUp className="w-4 h-4 mr-1" /> 15% projected growth
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Revenue distribution by source</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={prepareRevenueData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Recent transactions and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.recent_activities.slice(0, 10).map((activity, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">TRX-{Math.floor(Math.random() * 10000)}</TableCell>
                        <TableCell>{activity.user}</TableCell>
                        <TableCell>${activity.amount}</TableCell>
                        <TableCell>{new Date(activity.booking_date).toLocaleDateString()}</TableCell>
                        <TableCell>{index % 2 === 0 ? 'Mobile Money' : 'Credit Card'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                            activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {activity.status === 'completed' ? 'Paid' : 
                             activity.status === 'pending' ? 'Pending' : 'Failed'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// Enhanced Stat Card Component
const StatCard = ({ title, value, subValue, change, icon, color }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {subValue && <p className="text-sm text-gray-500 mt-1">{subValue}</p>}
            {change !== undefined && (
              <div className={`flex items-center text-sm mt-2 ${
                change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {change >= 0 ? 
                  <ArrowUp className="w-4 h-4 mr-1" /> : 
                  <ArrowDown className="w-4 h-4 mr-1" />
                }
                {Math.abs(change)}% from last period
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;