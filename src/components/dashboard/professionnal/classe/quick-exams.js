import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BarChart,
  Book,
  FileText,
  Upload,
  PlusCircle,
  ChevronRight,
  Activity,
  Users,
  Clock,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../../ui/card';
import { Button } from '../../../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../ui/select';
import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label_2';
import { toast } from 'react-toastify';
import onlineCourseServices from '../../../services/professionnal/quick_exam_services';
import ProfessionalLayout from '../professionnal_layout';

const QuickExamDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  
  const [examData, setExamData] = useState({
    title: '',
    examType: '',
    questionsPdf: null,
    answersPdf: null,
    duration: '60',
    maxAttempts: 1
  });

  const [stats] = useState({
    totalExams: 15,
    completedExams: 8,
    averageScore: 85
  });

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setExamData(prev => ({
        ...prev,
        [field]: file
      }));
    } else {
      toast.error(isEnglish ? 'Please upload a PDF file' : 'Veuillez télécharger un fichier PDF');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Validate required fields
      const requiredFields = ['title', 'examType', 'duration', 'questionsPdf', 'answersPdf'];
      const missingFields = requiredFields.filter(field => !examData[field]);
  
      if (missingFields.length > 0) {
        throw new Error(
          isEnglish 
            ? `Please fill in the following required fields: ${missingFields.join(', ')}`
            : `Veuillez remplir les champs obligatoires suivants : ${missingFields.join(', ')}`
        );
      }
  
      // Pass the examData object directly to the service
      // The service will handle FormData creation
      await onlineCourseServices.createQuickExam(examData);
  
      toast.success(
        isEnglish 
          ? 'Quick exam created successfully!' 
          : 'Examen rapide créé avec succès!'
      );
  
      navigate('/online_classe', { 
        state: { 
          openCreateCourseModal: true,
          examCreated: true 
        }
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      title: isEnglish ? 'Total Exams' : 'Total des Examens',
      value: stats.totalExams
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      title: isEnglish ? 'Completed Exams' : 'Examens Terminés',
      value: stats.completedExams
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: isEnglish ? 'Average Score' : 'Score Moyen',
      value: `${stats.averageScore}%`
    }
  ];

  return (
    <ProfessionalLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/online-classes')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isEnglish ? 'Back to Online Classes' : 'Retour aux Cours en Ligne'}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                {stat.icon}
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <h3 className="mt-4 text-gray-600 dark:text-gray-300">{stat.title}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Exam Form */}
          <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEnglish ? 'Create Quick Exam' : 'Créer un Examen Rapide'}
              </CardTitle>
              <CardDescription>
                {isEnglish 
                  ? 'Create a new quick exam that can be attached to your courses'
                  : 'Créez un nouvel examen rapide qui peut être attaché à vos cours'}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      {isEnglish ? 'Exam Title *' : 'Titre de l\'examen *'}
                    </Label>
                    <Input
                      id="title"
                      value={examData.title}
                      onChange={(e) => setExamData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder={isEnglish ? "Enter exam title" : "Entrez le titre de l'examen"}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="examType">
                      {isEnglish ? 'Exam Type *' : 'Type d\'examen *'}
                    </Label>
                    <Select
                      value={examData.examType}
                      onValueChange={(value) => setExamData(prev => ({ ...prev, examType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={isEnglish ? "Select exam type" : "Sélectionner le type d'examen"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entrepreneurial">
                          {isEnglish ? 'Entrepreneurial' : 'Entrepreneurial'}
                        </SelectItem>
                        <SelectItem value="general">
                          {isEnglish ? 'General Knowledge' : 'Culture Générale'}
                        </SelectItem>
                        <SelectItem value="technical">
                          {isEnglish ? 'Technical' : 'Technique'}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="duration">
                      {isEnglish ? 'Duration (minutes) *' : 'Durée (minutes) *'}
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={examData.duration}
                      onChange={(e) => setExamData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxAttempts">
                      {isEnglish ? 'Maximum Attempts' : 'Tentatives Maximum'}
                    </Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      min="1"
                      value={examData.maxAttempts}
                      onChange={(e) => setExamData(prev => ({ ...prev, maxAttempts: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="questionsPdf">
                      {isEnglish ? 'Questions PDF *' : 'PDF des Questions *'}
                    </Label>
                    <div className="relative">
                      <Input
                        id="questionsPdf"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, 'questionsPdf')}
                        className="w-full"
                      />
                      <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="answersPdf">
                      {isEnglish ? 'Answers PDF *' : 'PDF des Réponses *'}
                    </Label>
                    <div className="relative">
                      <Input
                        id="answersPdf"
                        type="file"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, 'answersPdf')}
                        className="w-full"
                      />
                      <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/online_classe')}
                    disabled={loading}
                  >
                    {isEnglish ? 'Cancel' : 'Annuler'}
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">
                          <Upload className="w-4 h-4" />
                        </span>
                        {isEnglish ? 'Creating...' : 'Création...'}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        {isEnglish ? 'Create Exam' : 'Créer l\'examen'}
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Quick Actions Section */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEnglish ? 'Quick Actions' : 'Actions Rapides'}
                </CardTitle>
                <CardDescription>
                  {isEnglish
                    ? 'Access commonly used features and analytics'
                    : 'Accédez aux fonctionnalités et analyses couramment utilisées'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => navigate('/quick-exams/stats')}
                >
                  <div className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    {isEnglish ? 'View Analytics' : 'Voir les Analyses'}
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => navigate('/quick-exams/list')}
                >
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    {isEnglish ? 'Manage Exams' : 'Gérer les Examens'}
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => navigate('/quick-exams/results')}
                >
                  <div className="flex items-center">
                    <BarChart className="w-5 h-5 mr-2" />
                    {isEnglish ? 'View Results' : 'Voir les Résultats'}
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity Card */}
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEnglish ? 'Recent Activity' : 'Activité Récente'}
                </CardTitle>
                <CardDescription>
                  {isEnglish
                    ? 'Track your latest exam activities'
                    : 'Suivez vos dernières activités d\'examen'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full"><Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {isEnglish ? 'Technical Exam 10' : 'Examen Technique 10'}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isEnglish ? '3 students completed' : '3 étudiants ont terminé'}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">2h ago</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Book className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {isEnglish ? 'Pro Tips' : 'Conseils Pro'}
                    </h3>
                    <p className="text-white/80">
                      {isEnglish
                        ? 'Keep your exams concise and clear. Use a mix of question types for better assessment.'
                        : 'Gardez vos examens concis et clairs. Utilisez un mélange de types de questions pour une meilleure évaluation.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            {isEnglish
              ? 'Need help? Check out our documentation or contact support.'
              : 'Besoin d\'aide ? Consultez notre documentation ou contactez le support.'}
          </p>
        </div>
      </div>
    </ProfessionalLayout>
  );
};

export default QuickExamDashboard;