import React, { useState, useEffect } from 'react';
import { 
    BarChart, Bar, LineChart, Line, PieChart, Pie, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer, Cell 
} from 'recharts';
import { 
    Calendar, Globe, Users, FileText, 
    DollarSign, Award, TrendingUp, Download,
    Loader, AlertCircle, RefreshCw
} from 'lucide-react';
import ProfessionalLayout from '../professionnal_layout';
import ProfessionalDashboardService from '../../../services/professionnal/pro_stat';

const ProfessionalDashboard = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
      total_courses: 0,
      total_students: 0,
      total_exams: 0,
      total_earnings: 0,
      most_popular_course: null,
      title: '',
      domain_name: '',
      subdomains: [],
      hourly_rate: 0,
  });
  const [coursesData, setCoursesData] = useState(null);
  const [studentsData, setStudentsData] = useState(null);
  const [examsData, setExamsData] = useState(null);
  const [financesData, setFinancesData] = useState(null);
  const [mentorshipsData, setMentorshipsData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modal state for exports
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState('all');
  const [exporting, setExporting] = useState(false);

  // Color schemes for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Load dashboard data on component mount
  useEffect(() => {
      loadDashboardData();
  }, []);
  
  // Load data based on active tab
  useEffect(() => {
      if (activeTab === 'courses' && !coursesData) {
          loadCoursesData();
      } else if (activeTab === 'students' && !studentsData) {
          loadStudentsData();
      } else if (activeTab === 'exams' && !examsData) {
          loadExamsData();
      } else if (activeTab === 'finances' && !financesData) {
          loadFinancesData();
      } else if (activeTab === 'mentorships' && !mentorshipsData) {
          loadMentorshipsData();
      } else if (activeTab === 'analytics' && !analyticsData) {
          loadAnalyticsData();
      }
  }, [activeTab]);
  
  // Load functions for each data section
  const loadDashboardData = async () => {
      try {
          setLoading(true);
          const response = await ProfessionalDashboardService.getDashboardOverview();
          setDashboardData(response.data || {
              total_courses: 0,
              total_students: 0,
              total_exams: 0,
              total_earnings: 0,
              most_popular_course: null,
              title: '',
              domain_name: '',
              subdomains: [],
              hourly_rate: 0,
          });
          setLoading(false);
      } catch (err) {
          setError("Failed to load dashboard data. Please try again.");
          setLoading(false);
          console.error("Dashboard data error:", err);
      }
  };
    
  const loadCoursesData = async () => {
      try {
          const response = await ProfessionalDashboardService.getCourses();
          setCoursesData(response.data);
      } catch (err) {
          setError("Failed to load courses data.");
          console.error("Courses data error:", err);
      }
  };
    
  const loadStudentsData = async () => {
      try {
          const response = await ProfessionalDashboardService.getStudents();
          setStudentsData(response.data);
      } catch (err) {
          setError("Failed to load students data.");
          console.error("Students data error:", err);
      }
  };
    
  const loadExamsData = async () => {
      try {
          const response = await ProfessionalDashboardService.getExams();
          setExamsData(response.data);
      } catch (err) {
          setError("Failed to load exams data.");
          console.error("Exams data error:", err);
      }
  };
    
  const loadFinancesData = async () => {
      try {
          const response = await ProfessionalDashboardService.getFinances();
          setFinancesData(response.data);
      } catch (err) {
          setError("Failed to load finances data.");
          console.error("Finances data error:", err);
      }
  };
    
  const loadMentorshipsData = async () => {
      try {
          const response = await ProfessionalDashboardService.getMentorships();
          setMentorshipsData(response.data);
      } catch (err) {
          setError("Failed to load mentorships data.");
          console.error("Mentorships data error:", err);
      }
  };
    
  const loadAnalyticsData = async () => {
      try {
          const response = await ProfessionalDashboardService.getAnalytics();
          setAnalyticsData(response.data);
      } catch (err) {
          setError("Failed to load analytics data.");
          console.error("Analytics data error:", err);
      }
  };
    
  // Handle data export
  const handleExport = async () => {
      try {
          setExporting(true);
          const response = await ProfessionalDashboardService.exportData(exportType);
          const filename = `professional_dashboard_${exportType}_${new Date().toISOString().slice(0, 10)}.csv`;
          ProfessionalDashboardService.downloadExport(response.data, filename);
          setExporting(false);
          setShowExportModal(false);
      } catch (err) {
          setError("Failed to export data.");
          setExporting(false);
          console.error("Export error:", err);
      }
  };
    
  // Main component content
  const MainContent = () => {
    // Loading state
    if (loading) {
      return (
        <div className="flex justify-center items-center h-80">
          <div className="animate-spin">
            <Loader className="w-12 h-12 text-blue-500" />
          </div>
        </div>
      );
    }
    
    // Error state
    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
          <button 
            className="mt-3 flex items-center text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-1" /> Retry
          </button>
        </div>
      );
    }
    
    return (
      <div className="pb-12">
        {/* Dashboard Tabs */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Professional Dashboard</h2>
            
            <button 
              onClick={() => setShowExportModal(true)}
              className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </button>
          </div>
          
          <div className="px-4 pb-0 flex space-x-1 overflow-x-auto">
            {['overview', 'courses', 'students', 'exams', 'finances', 'mentorships', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab 
                    ? 'text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400' 
                    : 'text-gray-500 border-transparent hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="space-y-6">
          {/* DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="animate-fadeIn">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Courses</p>
                      <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{dashboardData?.total_courses || 0}</h3>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                      <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</p>
                      <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{dashboardData?.total_students || 0}</h3>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                      <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Exams</p>
                      <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">{dashboardData?.total_exams || 0}</h3>
                    </div>
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                      <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Earnings</p>
                      <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">
                        ${(Number(dashboardData?.total_earnings) || 0).toFixed(2)}
                      </h3>
                    </div>
                    <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                      <DollarSign className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Detail Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Most Popular Course */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Most Popular Course</h3>
                  </div>
                  <div className="p-6">
                    {dashboardData?.most_popular_course ? (
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {dashboardData.most_popular_course.title}
                        </h4>
                        <div className="mt-2 space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {dashboardData.most_popular_course.domain}
                          </span>
                          
                          {dashboardData.most_popular_course.subdomain && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                              {dashboardData.most_popular_course.subdomain}
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-6 grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Attendees</p>
                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                              {dashboardData.most_popular_course.attendees}
                            </p>
                          </div>
                          
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                              {(Number(dashboardData.most_popular_course.average_rating) || 0).toFixed(1)}/5
                            </p>
                          </div>
                          
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Mode</p>
                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                              {dashboardData.most_popular_course.mode}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No courses available</p>
                    )}
                  </div>
                </div>
                
                {/* Profile Overview */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Profile Overview</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex flex-col items-center justify-center md:w-1/3">
                        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                          <Award className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h5 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
                          {dashboardData?.title || 'Professional'}
                        </h5>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {dashboardData?.domain_name || 'General'}
                        </p>
                      </div>
                      
                      <div className="md:w-2/3 space-y-4">
                        <div>
                          <h6 className="text-sm font-medium text-gray-500 dark:text-gray-400">Domain Expertise</h6>
                          <p className="mt-1 text-gray-900 dark:text-white">{dashboardData?.domain_name || 'N/A'}</p>
                        </div>
                        
                        <div>
                          <h6 className="text-sm font-medium text-gray-500 dark:text-gray-400">Subdomains</h6>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {dashboardData?.subdomains?.length > 0 ? (
                              dashboardData.subdomains.map((subdomain, index) => (
                                <span 
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                >
                                  {subdomain}
                                </span>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 dark:text-gray-400">No subdomains specified</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h6 className="text-sm font-medium text-gray-500 dark:text-gray-400">Hourly Rate</h6>
                          <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                            ${(Number(dashboardData?.hourly_rate) || 0).toFixed(2)}/hr
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Other tabs would be implemented similarly */}
          {activeTab !== 'overview' && (
            <div className="animate-fadeIn bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm">
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  This tab is still being loaded or implemented.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Export Modal
  const ExportModal = () => {
    if (!showExportModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Export Data</h3>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Data Type
              </label>
              <select
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              >
                <option value="all">All Data</option>
                <option value="courses">Courses</option>
                <option value="students">Students</option>
                <option value="exams">Exams</option>
                <option value="mentorships">Mentorships</option>
                <option value="finances">Finances</option>
              </select>
            </div>
          </div>
          
          <div className="p-6 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowExportModal(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${
                exporting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {exporting ? (
                <span className="flex items-center">
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </span>
              ) : (
                'Export'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ProfessionalLayout>
      <MainContent />
      <ExportModal />
    </ProfessionalLayout>
  );
};

export default ProfessionalDashboard;