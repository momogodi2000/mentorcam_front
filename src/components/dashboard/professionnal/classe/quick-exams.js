import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Book,
  FileText,
  Upload,
  PlusCircle,
  ChevronRight,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../../ui/card';
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
import onlineCourseServices from '../../../services/professionnal/online_classe_services';


const QuickExamDashboard = ({ isEnglish }) => {
  const navigate = useNavigate();
  const [examData, setExamData] = useState({
    title: '',
    examType: '',
    questionsPdf: null,
    answersPdf: null
  });

  const handleFileChange = (e, field) => {
    setExamData({
      ...examData,
      [field]: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', examData.title);
      formData.append('exam_type', examData.examType);
      formData.append('questions_pdf', examData.questionsPdf);
      formData.append('answers_pdf', examData.answersPdf);

      await onlineCourseServices.createQuickExam(formData);
      toast.success(isEnglish ? 'Quick exam created successfully!' : 'Examen rapide créé avec succès!');
      navigate('/quick-exams');
    } catch (error) {
      toast.error(isEnglish ? 'Error creating quick exam' : 'Erreur lors de la création de l\'examen rapide');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {isEnglish ? 'Quick Exam Management' : 'Gestion des Examens Rapides'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {isEnglish 
            ? 'Create and manage quick exams for your courses' 
            : 'Créez et gérez des examens rapides pour vos cours'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEnglish ? 'Create New Quick Exam' : 'Créer un Nouvel Examen Rapide'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">
                  {isEnglish ? 'Exam Title' : 'Titre de l\'examen'}
                </Label>
                <Input
                  id="title"
                  value={examData.title}
                  onChange={(e) => setExamData({...examData, title: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="examType">
                  {isEnglish ? 'Exam Type' : 'Type d\'examen'}
                </Label>
                <Select
                  value={examData.examType}
                  onValueChange={(value) => setExamData({...examData, examType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isEnglish ? "Select type" : "Sélectionner le type"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrepreneurial">
                      {isEnglish ? 'Entrepreneurial' : 'Entrepreneurial'}
                    </SelectItem>
                    <SelectItem value="general">
                      {isEnglish ? 'General Culture' : 'Culture Générale'}
                    </SelectItem>
                    <SelectItem value="technical">
                      {isEnglish ? 'Technical' : 'Technique'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="questionsPdf">
                  {isEnglish ? 'Questions PDF' : 'PDF des Questions'}
                </Label>
                <Input
                  id="questionsPdf"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'questionsPdf')}
                  required
                />
              </div>

              <div>
                <Label htmlFor="answersPdf">
                  {isEnglish ? 'Answers PDF' : 'PDF des Réponses'}
                </Label>
                <Input
                  id="answersPdf"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'answersPdf')}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <PlusCircle className="w-4 h-4 mr-2" />
                {isEnglish ? 'Create Quick Exam' : 'Créer l\'examen rapide'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isEnglish ? 'Quick Exam Statistics' : 'Statistiques des Examens Rapides'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate('/quick-exams/stats')}
              >
                <div className="flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  {isEnglish ? 'View Analytics' : 'Voir les Analyses'}
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-between"
                onClick={() => navigate('/quick-exams/list')}
              >
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  {isEnglish ? 'Manage Exams' : 'Gérer les Examens'}
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuickExamDashboard;