import React, { useState, useEffect } from 'react';
import { fetchAmateurProgress } from '../../../services/biginner/progress';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Award, Clock, UserCheck, Book, PieChart as PieChartIcon, Calendar, ChevronRight } from 'lucide-react';
import BeginnerLayout from '../biginner_layout'; // Import the BeginnerLayout

const ProgressDashboard = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state
  const [isEnglish, setIsEnglish] = useState(true); // Language state

  // Animation states
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAmateurProgress();
        setProgressData(data);
        setLoading(false);
        // Trigger animations after data loads
        setTimeout(() => setAnimate(true), 300);
      } catch (err) {
        setError('Failed to load progress data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <BeginnerLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Loading your progress...</p>
          </div>
        </div>
      </BeginnerLayout>
    );
  }

  if (error) {
    return (
      <BeginnerLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
        <div className="p-6 max-w-4xl mx-auto my-10 bg-red-50 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-700">
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-200 mb-4">Error</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </BeginnerLayout>
    );
  }

  if (!progressData) return null;

  const { overall_progress, learning_time, active_mentors, achievements } = progressData;

  // Prepare chart data
  const completionData = [
    { name: 'Completed', value: overall_progress.completed_courses, color: '#4F46E5' },
    { name: 'Remaining', value: overall_progress.total_courses - overall_progress.completed_courses, color: '#E5E7EB' }
  ];

  const courseData = [
    { name: 'Course Time', minutes: parseInt(learning_time.total_course_duration) || 0 },
    { name: 'Exam Time', minutes: parseInt(learning_time.total_exam_time) || 0 }
  ];

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <BeginnerLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
      <div className={`bg-gray-50 dark:bg-gray-900 min-h-screen p-6 transition-all duration-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Your Learning Progress</h1>
            <p className="text-gray-600 dark:text-gray-300">Track your development journey and achievements</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1">
            <button 
              className={`flex-1 py-3 px-4 rounded-md transition ${activeTab === 'overview' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`flex-1 py-3 px-4 rounded-md transition ${activeTab === 'courses' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => setActiveTab('courses')}
            >
              Course Progress
            </button>
            <button 
              className={`flex-1 py-3 px-4 rounded-md transition ${activeTab === 'mentors' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => setActiveTab('mentors')}
            >
              Mentors
            </button>
            <button 
              className={`flex-1 py-3 px-4 rounded-md transition ${activeTab === 'achievements' ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Progress */}
              <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-500 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="flex items-center mb-4">
                  <PieChartIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Overall Progress</h2>
                </div>
                <div className="flex justify-between mb-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Completion</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{overall_progress.completion_percentage.toFixed(1)}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Exam Score</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{overall_progress.average_exam_score.toFixed(1)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Mentors</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{overall_progress.active_mentors}</p>
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={completionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        animationBegin={300}
                        animationDuration={1500}
                      >
                        {completionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} Courses`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Learning Time */}
              <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-500 delay-100 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Learning Time</h2>
                </div>
                <div className="flex justify-between mb-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Course Time</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{learning_time.total_course_duration}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Exam Time</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{learning_time.total_exam_time}</p>
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={courseData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Bar dataKey="minutes" fill="#4F46E5" animationBegin={500} animationDuration={1500} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Active Mentors Summary */}
              <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-500 delay-200 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <UserCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Active Mentorships</h2>
                  </div>
                  <button 
                    className="text-indigo-600 dark:text-indigo-400 flex items-center text-sm hover:text-indigo-800 dark:hover:text-indigo-300 transition"
                    onClick={() => setActiveTab('mentors')}
                  >
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">You have {active_mentors.length} active mentorship{active_mentors.length !== 1 ? 's' : ''}</p>
                <div className="space-y-4">
                  {active_mentors.slice(0, 2).map((mentor, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900 transition cursor-pointer">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold mr-3">
                        {/* Added safe access with optional chaining */}
                        {mentor.mentor?.title ? mentor.mentor.title.charAt(0) : 'M'}
                      </div>
                      <div className="flex-1">
                        {/* Added safe access with optional chaining */}
                        <h3 className="font-medium text-gray-900 dark:text-white">{mentor.mentor?.title || 'Mentor'}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{mentor.domain || 'General'}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                        {mentor.status || 'Active'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements Card */}
              <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-500 delay-300 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Achievements</h2>
                  </div>
                  <button 
                    className="text-indigo-600 dark:text-indigo-400 flex items-center text-sm hover:text-indigo-800 dark:hover:text-indigo-300 transition"
                    onClick={() => setActiveTab('achievements')}
                  >
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">You've earned {achievements.length} achievement{achievements.length !== 1 ? 's' : ''}</p>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-all duration-300 delay-${index * 100} ${animate ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
                    >
                      <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mr-3">
                        <Award className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <span className="text-gray-800 dark:text-white">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Course Progress Tab */}
          {activeTab === 'courses' && (
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="flex items-center mb-6">
                <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Course Progress</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-indigo-50 dark:bg-indigo-900 rounded-lg p-4 text-center">
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-1">Completed Courses</p>
                  <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">{overall_progress.completed_courses}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 text-center">
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">Total Courses</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{overall_progress.total_courses}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-700 dark:text-green-300 mb-1">Completion Rate</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">{overall_progress.completion_percentage.toFixed(1)}%</p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Course Completion Progress</h3>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                  <div 
                    className="bg-indigo-600 h-4 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${animate ? overall_progress.completion_percentage : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Exam Performance</h3>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 mr-4">
                    <div 
                      className="bg-blue-600 h-4 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${animate ? overall_progress.average_exam_score : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-lg font-semibold text-blue-700 dark:text-blue-300 whitespace-nowrap">
                    {overall_progress.average_exam_score.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Mentors Tab */}
          {activeTab === 'mentors' && (
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="flex items-center mb-6">
                <UserCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Mentors</h2>
              </div>
              
              {active_mentors.length > 0 ? (
                <div className="space-y-4">
                  {active_mentors.map((mentor, index) => (
                    <div 
                      key={index} 
                      className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-100 dark:border-gray-600 hover:border-indigo-200 dark:hover:border-indigo-400 transition-all duration-300 delay-${index * 100} ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                    >
                      <div className="flex flex-wrap md:flex-nowrap items-start">
                        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-400 text-xl font-bold mr-4 mb-4 md:mb-0">
                          {/* Added safe access with optional chaining and default value */}
                          {mentor.mentor?.title ? mentor.mentor.title.charAt(0) : 'M'}
                        </div>
                        <div className="flex-1">
                          {/* Added safe access with optional chaining and default values */}
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{mentor.mentor?.title || 'Mentor'}</h3>
                          <p className="text-gray-500 dark:text-gray-400 mb-3">{mentor.mentor?.biography || 'No biography available'}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                              {mentor.status || 'Active'}
                            </span>
                            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
                              {mentor.domain || 'General'}
                            </span>
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                              {mentor.plan_type || 'Standard'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <UserCheck className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No Active Mentors</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">You don't have any active mentorships at the moment.</p>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    Find a Mentor
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="flex items-center mb-6">
                <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Your Achievements</h2>
              </div>
              
              {achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900 dark:to-blue-900 rounded-lg p-6 border border-indigo-100 dark:border-indigo-700 shadow-sm transition-all duration-300 delay-${index * 100} hover:shadow-md ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mr-4">
                          <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{achievement}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Achievement Unlocked</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Award className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No Achievements Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Complete courses and exams to earn achievements.</p>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    Browse Courses
                  </button>
                </div>
              )}
              
              {/* Achievement Progress */}
              <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Next Achievements</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Complete 10 courses</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{Math.min(overall_progress.completed_courses, 10)}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${animate ? Math.min(overall_progress.completed_courses / 10 * 100, 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Score above 95% in 5 exams</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">1/5</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${animate ? 20 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Reach 100 hours of learning</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {Math.round((parseInt(learning_time.total_course_duration) + parseInt(learning_time.total_exam_time)) / 60)}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${animate ? Math.min(Math.round((parseInt(learning_time.total_course_duration) + parseInt(learning_time.total_exam_time)) / 60) / 100 * 100, 100) : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </BeginnerLayout>
  );
};

export default ProgressDashboard;