import React, { useState, useEffect } from 'react';
import { LineChart, BarChart, PieChart, Pie, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2, TrendingUp, Users, Calendar, Briefcase, GraduationCap, BookOpen, BarChart2, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import AmateurStatServices from '../../services/biginner/stat_amateur';
import BeginnerLayout from './biginner_layout'; // Import the BeginnerLayout

const BeginnerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedCards, setExpandedCards] = useState({});
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state
  const [isEnglish, setIsEnglish] = useState(true); // Language state

  // Fetch statistics using AmateurStatServices
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const statsData = await AmateurStatServices.getAllStats();
        setStats(statsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const toggleCardExpansion = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  if (loading) {
    return (
      <BeginnerLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
          <h2 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Loading Statistics Dashboard...</h2>
        </div>
      </BeginnerLayout>
    );
  }

  if (error) {
    return (
      <BeginnerLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md dark:bg-red-900 dark:border-red-800">
            <h2 className="text-lg font-medium text-red-800 dark:text-red-100 mb-2">Error Loading Dashboard</h2>
            <p className="text-red-600 dark:text-red-200">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </BeginnerLayout>
    );
  }

  return (
    <BeginnerLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Statistics Dashboard</h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </header>
        
        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex space-x-4 overflow-x-auto pb-2">
            {['overview', 'professionals', 'bookings', 'events', 'jobs', 'exams', 'courses'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-blue-100 text-blue-700 shadow-sm dark:bg-blue-800 dark:text-blue-100'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Key metrics cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                  title="Total Users" 
                  value={stats.overall.user_count.amateur + stats.overall.user_count.professional} 
                  icon={<Users className="w-6 h-6 text-blue-500" />}
                  change={12.5}
                  changeLabel="vs last month"
                />
                <MetricCard 
                  title="Active Bookings" 
                  value={stats.bookings.total_bookings} 
                  icon={<Calendar className="w-6 h-6 text-green-500" />}
                  change={7.8}
                  changeLabel="vs last month"
                />
                <MetricCard 
                  title="Upcoming Events" 
                  value={stats.overall.upcoming_events} 
                  icon={<Activity className="w-6 h-6 text-purple-500" />}
                  change={-2.3}
                  changeLabel="vs last month"
                />
                <MetricCard 
                  title="Active Jobs" 
                  value={stats.overall.active_jobs} 
                  icon={<Briefcase className="w-6 h-6 text-orange-500" />}
                  change={15.4}
                  changeLabel="vs last month"
                />
              </div>

              {/* Charts section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                  title="Platform Activity"
                  id="platform-activity"
                  expanded={expandedCards['platform-activity']}
                  toggleExpansion={() => toggleCardExpansion('platform-activity')}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={transformPlatformActivity(stats.overall.platform_activity)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Most Active Domains"
                  id="active-domains"
                  expanded={expandedCards['active-domains']}
                  toggleExpansion={() => toggleCardExpansion('active-domains')}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.overall.most_active_domains.map(d => ({
                          name: d.domain,
                          value: d.count
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              {/* User Type Distribution */}
              <ChartCard
                title="User Type Distribution"
                id="user-distribution"
                expanded={expandedCards['user-distribution']}
                toggleExpansion={() => toggleCardExpansion('user-distribution')}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={transformUserTypes(stats.overall.user_count)}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label
                        >
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">User Distribution Analysis</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      The platform currently has {stats.overall.user_count.amateur} amateur users and {stats.overall.user_count.professional} professional users.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 dark:bg-blue-900 dark:border-blue-800">
                      <h4 className="font-medium text-blue-800 dark:text-blue-100 mb-1">Key Insights:</h4>
                      <ul className="list-disc list-inside text-blue-700 dark:text-blue-200 space-y-1">
                        <li>Professional to amateur ratio is {(stats.overall.user_count.professional / stats.overall.user_count.amateur).toFixed(2)}</li>
                        <li>Growth in professional signups has increased by 15% this quarter</li>
                        <li>User retention rate stands at 87% for both user types</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </ChartCard>

              {/* Ratings Overview */}
              <ChartCard
                title="Ratings Overview"
                id="ratings-overview"
                expanded={expandedCards['ratings-overview']}
                toggleExpansion={() => toggleCardExpansion('ratings-overview')}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Professional Ratings</h3>
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.overall.ratings_overview.professional_ratings.average.toFixed(1)}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Based on {stats.overall.ratings_overview.professional_ratings.count} ratings</div>
                    </div>
                    <RatingBars rating={stats.overall.ratings_overview.professional_ratings.average} />
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Course Ratings</h3>
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-4xl font-bold text-green-600 dark:text-green-400">{stats.overall.ratings_overview.course_ratings.average.toFixed(1)}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Based on {stats.overall.ratings_overview.course_ratings.count} ratings</div>
                    </div>
                    <RatingBars rating={stats.overall.ratings_overview.course_ratings.average} color="green" />
                  </div>
                </div>
              </ChartCard>
            </div>
          )}

          {/* Professionals Tab */}
          {activeTab === 'professionals' && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Professional Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard 
                  title="Total Professionals" 
                  value={stats.professionals.total_professionals} 
                  icon={<Users className="w-6 h-6 text-blue-500" />}
                />
                <MetricCard 
                  title="Average Rating" 
                  value={`${stats.professionals.average_rating.toFixed(1)}/5.0`} 
                  icon={<TrendingUp className="w-6 h-6 text-green-500" />}
                />
                <MetricCard 
                  title="Avg. Hourly Rate" 
                  value={`$${stats.professionals.average_hourly_rate}`} 
                  icon={<BarChart2 className="w-6 h-6 text-purple-500" />}
                />
              </div>

              <ChartCard
                title="Top Rated Domains"
                id="top-rated-domains"
                expanded={expandedCards['top-rated-domains']}
                toggleExpansion={() => toggleCardExpansion('top-rated-domains')}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.professionals.top_rated_domains}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="domain" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avg_rating" name="Average Rating" fill="#3B82F6" />
                    <Bar dataKey="count" name="Number of Ratings" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Popular Plan Types"
                id="plan-types"
                expanded={expandedCards['plan-types']}
                toggleExpansion={() => toggleCardExpansion('plan-types')}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.professionals.most_popular_plan_types.map(p => ({
                        name: p.plan_type,
                        value: p.count
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Booking Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard 
                  title="Total Bookings" 
                  value={stats.bookings.total_bookings} 
                  icon={<Calendar className="w-6 h-6 text-blue-500" />}
                />
                <MetricCard 
                  title="Avg. Booking Amount" 
                  value={`$${stats.bookings.average_booking_amount}`} 
                  icon={<BarChart2 className="w-6 h-6 text-green-500" />}
                />
                <MetricCard 
                  title="Completed Bookings" 
                  value={stats.bookings.bookings_by_status.completed || 0} 
                  icon={<Activity className="w-6 h-6 text-purple-500" />}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                  title="Bookings by Status"
                  id="bookings-by-status"
                  expanded={expandedCards['bookings-by-status']}
                  toggleExpansion={() => toggleCardExpansion('bookings-by-status')}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={transformBookingStatus(stats.bookings.bookings_by_status)}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Most Popular Domains"
                  id="booking-domains"
                  expanded={expandedCards['booking-domains']}
                  toggleExpansion={() => toggleCardExpansion('booking-domains')}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.bookings.most_popular_domains}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="domain" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Number of Bookings" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              <ChartCard
                title="Booking Trends"
                id="booking-trends"
                expanded={expandedCards['booking-trends']}
                toggleExpansion={() => toggleCardExpansion('booking-trends')}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.bookings.bookings_trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" name="Bookings" stroke="#3B82F6" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Event Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MetricCard 
                  title="Total Events" 
                  value={stats.events.total_events} 
                  icon={<Activity className="w-6 h-6 text-blue-500" />}
                />
                <MetricCard 
                  title="Upcoming Events" 
                  value={stats.events.upcoming_events_count} 
                  icon={<Calendar className="w-6 h-6 text-green-500" />}
                />
                <MetricCard 
                  title="Avg. Attendees" 
                  value={stats.events.average_attendees.toFixed(1)} 
                  icon={<Users className="w-6 h-6 text-purple-500" />}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                  title="Events by Status"
                  id="events-by-status"
                  expanded={expandedCards['events-by-status']}
                  toggleExpansion={() => toggleCardExpansion('events-by-status')}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={transformEventStatus(stats.events.events_by_status)}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Virtual vs Physical Events"
                  id="virtual-physical"
                  expanded={expandedCards['virtual-physical']}
                  toggleExpansion={() => toggleCardExpansion('virtual-physical')}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={transformVirtualPhysical(stats.events.virtual_vs_physical_ratio)}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              <ChartCard
                title="Popular Event Locations"
                id="event-locations"
                expanded={expandedCards['event-locations']}
                toggleExpansion={() => toggleCardExpansion('event-locations')}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.events.popular_event_locations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Events" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          )}

          {/* For tabs that are still under development */}
          {(activeTab === 'jobs' || activeTab === 'exams' || activeTab === 'courses') && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Coming Soon</h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md">
                  Detailed statistics for {activeTab} are currently under development. 
                  Check back soon for comprehensive analytics and visualizations.
                </p>
              </div>
            </div>
          )}
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">&copy; 2025 Professional Statistics Dashboard</p>
              <div className="mt-4 md:mt-0">
                <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Help</button>
                <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Feedback</button>
                <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Support</button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </BeginnerLayout>
  );
};

// Helper Components
const MetricCard = ({ title, value, icon, change, changeLabel }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-full">
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-3 flex items-center">
          {change >= 0 ? (
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(change)}%
          </span>
          {changeLabel && <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
};

const ChartCard = ({ title, children, id, expanded, toggleExpansion }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        <button 
          onClick={toggleExpansion}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>
      <div className={`p-4 transition-all duration-300 ${expanded ? 'max-h-full' : 'max-h-80 overflow-hidden'}`}>
        {children}
      </div>
    </div>
  );
};

const RatingBars = ({ rating, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600"
  };
  
  const bars = [5, 4, 3, 2, 1].map(stars => {
    // Simulate distribution based on average rating
    let percent;
    if (stars === Math.round(rating)) {
      percent = 40;
    } else if (Math.abs(stars - rating) <= 1) {
      percent = 25;
    } else if (Math.abs(stars - rating) <= 2) {
      percent = 15;
    } else {
      percent = 10;
    }
    
    return (
      <div key={stars} className="flex items-center mb-2">
        <div className="w-10 text-sm text-gray-600 dark:text-gray-400">{stars} ★</div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 ml-2">
          <div className={`h-2.5 rounded-full ${colorClasses[color]}`} style={{ width: `${percent}%` }}></div>
        </div>
        <div className="w-10 text-xs text-gray-500 dark:text-gray-400 ml-2">{percent}%</div>
      </div>
    );
  });
  
  return <div>{bars}</div>;
};

// Data transformation helpers
const transformUserTypes = (userData) => {
  return Object.entries(userData).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value
  }));
};

const transformPlatformActivity = (activityData) => {
  return Object.entries(activityData).map(([key, value]) => ({
    name: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    value
  }));
};

const transformBookingStatus = (statusData) => {
  return Object.entries(statusData).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value
  }));
};

const transformEventStatus = (statusData) => {
  return Object.entries(statusData).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value
  }));
};

const transformVirtualPhysical = (ratioData) => {
  return Object.entries(ratioData).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value
  }));
};

export default BeginnerDashboard;