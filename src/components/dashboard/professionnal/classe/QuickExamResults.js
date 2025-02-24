import React, { useState, useEffect } from 'react';
import {
  BarChart as BarChartIcon,
  ArrowLeft,
  User,
  Clock,
  Award,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from '../../../ui/card';
import { Button } from '../../../ui/button';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import ProfessionalLayout from '../professionnal_layout';
import { useNavigate } from 'react-router-dom';
import onlineCourseServices from '../../../services/professionnal/quick_exam_services';

const QuickExamResults = ({ isEnglish = true, isDarkMode = false }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({
    recentResults: [],
    scoreDistribution: [],
    performanceOverTime: [],
    summaryStats: {
      totalSubmissions: 0,
      averageScore: 0,
      passRate: 0,
      averageTime: 0
    }
  });

  useEffect(() => {
    const fetchExamResults = async () => {
      try {
        setLoading(true);
        const data = await onlineCourseServices.getQuickExamResults();
        setResults(data);
      } catch (error) {
        console.error('Error fetching exam results:', error);
        // Set some fallback data in case of error
        setResults({
          recentResults: [],
          scoreDistribution: [
            { range: '90-100', count: 0 },
            { range: '80-89', count: 0 },
            { range: '70-79', count: 0 },
            { range: '60-69', count: 0 },
            { range: '0-59', count: 0 }
          ],
          performanceOverTime: [],
          summaryStats: {
            totalSubmissions: 0,
            averageScore: 0,
            passRate: 0,
            averageTime: 0
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExamResults();
  }, []);

  const statsCards = [
    {
      icon: <User className="w-8 h-8 text-blue-500" />,
      title: isEnglish ? 'Total Submissions' : 'Total des Soumissions',
      value: results.summaryStats.totalSubmissions,
      description: isEnglish ? 'Exam attempts' : 'Tentatives d\'examen'
    },
    {
      icon: <Award className="w-8 h-8 text-green-500" />,
      title: isEnglish ? 'Average Score' : 'Score Moyen',
      value: `${results.summaryStats.averageScore}%`,
      description: isEnglish ? 'Overall performance' : 'Performance globale'
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-purple-500" />,
      title: isEnglish ? 'Pass Rate' : 'Taux de Réussite',
      value: `${results.summaryStats.passRate}%`,
      description: isEnglish ? 'Students passing' : 'Étudiants réussissant'
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-500" />,
      title: isEnglish ? 'Average Time' : 'Temps Moyen',
      value: `${results.summaryStats.averageTime}min`,
      description: isEnglish ? 'Completion time' : 'Temps de completion'
    }
  ];

  // Custom tooltip for the bar chart
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="font-medium">{`${payload[0].payload.range}: ${payload[0].value} submissions`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for the line chart
  const CustomLineTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow">
          <p className="font-medium">{payload[0].payload.month}</p>
          <p>{`Average Score: ${payload[0].value}%`}</p>
          <p>{`Submissions: ${payload[1].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ProfessionalLayout isEnglish={isEnglish} isDarkMode={isDarkMode}>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col space-y-4">
            <Button
              onClick={() => navigate('/quick-exams')}
              variant="outline"
              className="w-fit hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isEnglish ? 'Back to Dashboard' : 'Retour au Tableau de Bord'}
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {isEnglish ? 'Exam Results' : 'Résultats des Examens'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {isEnglish
                ? 'Track and analyze student performance across all exams'
                : 'Suivez et analysez la performance des étudiants à travers tous les examens'}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Distribution */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>
                  {isEnglish ? 'Score Distribution' : 'Distribution des Scores'}
                </CardTitle>
                <CardDescription>
                  {isEnglish
                    ? 'Distribution of student scores across all exams'
                    : 'Distribution des scores des étudiants pour tous les examens'}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip content={<CustomBarTooltip />} />
                    <Bar dataKey="count" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>
                  {isEnglish ? 'Performance Trends' : 'Tendances de Performance'}
                </CardTitle>
                <CardDescription>
                  {isEnglish
                    ? 'Average scores and submissions over time'
                    : 'Scores moyens et soumissions au fil du temps'}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results.performanceOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomLineTooltip />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="avgScore"
                      stroke="#4F46E5"
                      name={isEnglish ? "Average Score" : "Score Moyen"}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="submissions"
                      stroke="#10B981"
                      name={isEnglish ? "Submissions" : "Soumissions"}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Results */}
            <Card className="shadow-lg lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  {isEnglish ? 'Recent Results' : 'Résultats Récents'}
                </CardTitle>
                <CardDescription>
                  {isEnglish
                    ? 'Latest exam submissions and scores'
                    : 'Dernières soumissions et scores d\'examens'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.recentResults.length > 0 ? (
                    results.recentResults.map((result, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h4 className="font-medium">{result.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{result.exam}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium">{result.score}%</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{result.time} min</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                      <p className="text-gray-600 dark:text-gray-300">
                        {isEnglish ? 'No recent submissions found.' : 'Aucune soumission récente trouvée.'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </ProfessionalLayout>
  );
};

export default QuickExamResults;