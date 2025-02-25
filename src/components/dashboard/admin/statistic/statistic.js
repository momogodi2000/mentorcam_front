// src/pages/admin/AdminStatistics.jsx
import React, { useState, useEffect } from 'react';
import AdminStatisticsService from '../../../services/admin/statistic_service';
import AdminLayout from '../admin_layout';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, Briefcase, CreditCard, Calendar, BookOpen, Award, TrendingUp,
  Clock, CheckCircle, XCircle, AlertCircle, DollarSign, UserCheck, Download
} from 'lucide-react';

const AdminStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        const data = await AdminStatisticsService.getStatistics();
        setStatistics(data);
        setError(null);
      } catch (err) {
        setError('Failed to load statistics. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, []);

  // Handle CSV download
  const handleDownloadCSV = () => {
    if (statistics) {
      AdminStatisticsService.downloadStatisticsCSV(statistics);
    }
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      </AdminLayout>
    );
  }

  if (!statistics) {
    return (
      <AdminLayout>
        <div className="text-center">No statistics available.</div>
      </AdminLayout>
    );
  }

  // Create data for user type distribution pie chart
  const userTypeData = [
    { name: 'Amateur', value: statistics.amateur_users },
    { name: 'Professional', value: statistics.professional_users },
    { name: 'Institution', value: statistics.institution_users },
    { name: 'Admin', value: statistics.admin_users },
  ];

  // Create data for booking status distribution pie chart
  const bookingStatusData = [
    { name: 'Pending', value: statistics.pending_bookings },
    { name: 'Confirmed', value: statistics.confirmed_bookings },
    { name: 'Completed', value: statistics.completed_bookings },
    { name: 'Cancelled', value: statistics.cancelled_bookings },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Statistics</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleString()}
            </span>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Users" 
            value={statistics.total_users} 
            subtitle={`+${statistics.new_users_last_month} this month`}
            icon={<Users className="w-8 h-8 text-blue-500" />}
            color="blue"
          />
          <StatsCard 
            title="Total Bookings" 
            value={statistics.total_bookings} 
            subtitle={formatCurrency(statistics.total_booking_value)}
            icon={<CreditCard className="w-8 h-8 text-emerald-500" />}
            color="emerald"
          />
          <StatsCard 
            title="Professionals" 
            value={statistics.total_professionals} 
            subtitle={`Avg. ${formatCurrency(statistics.avg_hourly_rate)}/hr`}
            icon={<Briefcase className="w-8 h-8 text-purple-500" />}
            color="purple"
          />
          <StatsCard 
            title="Total Events" 
            value={statistics.total_events} 
            subtitle={`${statistics.upcoming_events} upcoming`}
            icon={<Calendar className="w-8 h-8 text-amber-500" />}
            color="amber"
          />
        </div>

        {/* User Statistics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">User Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {userTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Monthly New Users</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={statistics.monthly_users}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} users`, 'New Users']} />
                  <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Booking Statistics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Booking Status</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} bookings`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Monthly Revenue</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={statistics.monthly_revenue}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#00C49F" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Professional Statistics Section */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top Domains</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statistics.top_domains}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Professionals" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Professionals */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top Performing Professionals</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Bookings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {statistics.professionals_with_most_bookings.map((professional, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {professional.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {professional.bookings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {professional.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Course Stats */}
          <StatsSummaryCard
            title="Course Statistics"
            icon={<BookOpen className="w-6 h-6 text-blue-500" />}
            items={[
              { label: 'Total Courses', value: statistics.total_courses },
              { label: 'Online Courses', value: statistics.online_courses },
              { label: 'In-Person Courses', value: statistics.presential_courses },
              { label: 'Total Attendees', value: statistics.total_course_attendees },
              { label: 'Average Rating', value: `${statistics.avg_course_rating.toFixed(1)}/5` }
            ]}
          />

          {/* Exam Stats */}
          <StatsSummaryCard
            title="Exam Statistics"
            icon={<Award className="w-6 h-6 text-purple-500" />}
            items={[
              { label: 'Total Exams', value: statistics.total_exams },
              { label: 'Total Attempts', value: statistics.total_exam_attempts },
              { label: 'Average Score', value: `${statistics.avg_exam_score.toFixed(1)}%` }
            ]}
          />

          {/* Jobs Stats */}
          <StatsSummaryCard
            title="Job Statistics"
            icon={<Briefcase className="w-6 h-6 text-emerald-500" />}
            items={[
              { label: 'Total Jobs', value: statistics.total_jobs },
              { label: 'Active Jobs', value: statistics.active_jobs },
              { label: 'Total Applications', value: statistics.total_applications },
              { label: 'Avg. Applications/Job', value: statistics.avg_applications_per_job.toFixed(1) }
            ]}
          />
        </div>

        {/* Popular Exams */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Most Popular Exams</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Attempts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {statistics.most_popular_exams.map((exam, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {exam.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {exam.attempts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {exam.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, subtitle, icon, color }) => {
  const colorMap = {
    blue: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
    emerald: "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800",
    purple: "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800",
    amber: "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
  };
  
  return (
    <div className={`flex flex-col p-6 rounded-xl border shadow-sm ${colorMap[color] || colorMap.blue}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        {icon}
      </div>
      <div className="mt-auto">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
};

// Stats Summary Card Component
const StatsSummaryCard = ({ title, icon, items }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        {icon}
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStatistics;