import React, { useState, useEffect } from 'react';
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Activity,
  Users,
  Clock,
  Award,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '../../../ui/card';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import ProfessionalLayout from '../professionnal_layout';
import onlineCourseServices from '../../../services/professionnal/quick_exam_services';

const QuickExamStats = ({ isEnglish, isDarkMode, setIsDarkMode, setIsEnglish }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExams: 0,
    examsByType: {},
    averageScore: 0,
    totalParticipants: 0,
    completionRate: 0,
    examTrends: [],
    topPerformers: [],
    examsByDifficulty: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Real API call to fetch statistics
        const statsData = await onlineCourseServices.getQuickExamStatistics();
        setStats(statsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        
        // Fallback to sample data if API call fails
        setStats({
          totalExams: 45,
          examsByType: {
            technical: 20,
            general: 15,
            entrepreneurial: 10
          },
          averageScore: 78.5,
          totalParticipants: 320,
          completionRate: 85,
          examTrends: [
            { month: 'Jan', exams: 8, avgScore: 75 },
            { month: 'Feb', exams: 12, avgScore: 77 },
            { month: 'Mar', exams: 15, avgScore: 82 },
            { month: 'Apr', exams: 10, avgScore: 80 }
          ],
          topPerformers: [
            { name: 'Technical Quiz 3', score: 92 },
            { name: 'General Knowledge 2', score: 88 },
            { name: 'Entrepreneurship 1', score: 85 }
          ],
          examsByDifficulty: [
            { name: 'Easy', value: 30 },
            { name: 'Medium', value: 45 },
            { name: 'Hard', value: 25 }
          ]
        });
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Format data for the exam types pie chart
  const formatExamTypeData = () => {
    return Object.entries(stats.examsByType).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value
    }));
  };

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  const statsCards = [
    {
      icon: <BookOpen className="w-8 h-8 text-indigo-500" />,
      title: isEnglish ? 'Total Exams' : 'Total des Examens',
      value: stats.totalExams,
      description: isEnglish ? 'Total exams created' : 'Total des examens créés'
    },
    {
      icon: <Award className="w-8 h-8 text-emerald-500" />,
      title: isEnglish ? 'Average Score' : 'Score Moyen',
      value: `${stats.averageScore}%`,
      description: isEnglish ? 'Overall performance' : 'Performance globale'
    },
    {
      icon: <Users className="w-8 h-8 text-amber-500" />,
      title: isEnglish ? 'Total Participants' : 'Total des Participants',
      value: stats.totalParticipants,
      description: isEnglish ? 'Active students' : 'Étudiants actifs'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-rose-500" />,
      title: isEnglish ? 'Completion Rate' : 'Taux de Completion',
      value: `${stats.completionRate}%`,
      description: isEnglish ? 'Exam completion rate' : 'Taux de completion des examens'
    }
  ];

  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 space-y-8"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {isEnglish ? 'Quick Exam Statistics' : 'Statistiques des Examens Rapides'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {isEnglish
            ? 'Comprehensive analytics and insights about your exam performance and student engagement'
            : 'Analyses complètes et aperçus de la performance des examens et de l\'engagement des étudiants'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Exam Trends Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              {isEnglish ? 'Exam Trends' : 'Tendances des Examens'}
            </CardTitle>
            <CardDescription>
              {isEnglish
                ? 'Monthly exam creation and average scores'
                : 'Création mensuelle d\'examens et scores moyens'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.examTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="exams"
                  stroke="#4F46E5"
                  name={isEnglish ? "Number of Exams" : "Nombre d'Examens"}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#10B981"
                  name={isEnglish ? "Average Score" : "Score Moyen"}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Exam Types Distribution */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              {isEnglish ? 'Exam Types' : 'Types d\'Examens'}
            </CardTitle>
            <CardDescription>
              {isEnglish
                ? 'Distribution of exam types'
                : 'Répartition des types d\'examens'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formatExamTypeData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {formatExamTypeData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Difficulty Distribution */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              {isEnglish ? 'Difficulty Distribution' : 'Distribution de la Difficulté'}
            </CardTitle>
            <CardDescription>
              {isEnglish
                ? 'Breakdown of exam difficulty levels'
                : 'Répartition des niveaux de difficulté des examens'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.examsByDifficulty}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.examsByDifficulty.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              {isEnglish ? 'Top Performing Exams' : 'Examens les Plus Performants'}
            </CardTitle>
            <CardDescription>
              {isEnglish
                ? 'Exams with the highest average scores'
                : 'Examens avec les meilleurs scores moyens'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topPerformers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </motion.div>
  );

  return (
    <ProfessionalLayout 
      isDarkMode={isDarkMode} 
      setIsDarkMode={setIsDarkMode} 
      isEnglish={isEnglish} 
      setIsEnglish={setIsEnglish}
    >
      {content}
    </ProfessionalLayout>
  );
};

export default QuickExamStats;