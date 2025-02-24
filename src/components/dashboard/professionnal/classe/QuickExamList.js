import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { FileText, Trash2, Edit, ArrowLeft, Clock, User, Book } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from '../../../ui/dialog_2';
import { Label } from '../../../ui/label_2';
import { Input } from '../../../ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../../ui/select';
import onlineCourseServices from '../../../services/professionnal/quick_exam_services';
import ProfessionalLayout from '../professionnal_layout';
import { useNavigate } from 'react-router-dom';

const QuickExamList = ({ isEnglish, isDarkMode }) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    examType: '',
    duration: '',
    maxAttempts: '',
    questionsPdf: null,
    answersPdf: null
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const data = await onlineCourseServices.getQuickExams();
      setExams(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching exams:', error);
      toast.error(isEnglish ? 'Failed to load exams' : 'Échec du chargement des examens');
      setLoading(false);
    }
  };

  const handleEditClick = (exam) => {
    setCurrentExam(exam);
    setEditFormData({
      title: exam.title,
      examType: exam.exam_type,
      duration: exam.duration.toString(),
      maxAttempts: exam.max_attempts.toString(),
      questionsPdf: null,
      answersPdf: null
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (exam) => {
    setCurrentExam(exam);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!currentExam) return;
    
    setIsDeleting(true);
    try {
      await onlineCourseServices.deleteQuickExam(currentExam.id);
      setExams(exams.filter(exam => exam.id !== currentExam.id));
      toast.success(isEnglish ? 'Exam deleted successfully' : 'Examen supprimé avec succès');
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error(error.message || (isEnglish ? 'Failed to delete exam' : 'Échec de la suppression de l\'examen'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setEditFormData(prev => ({
        ...prev,
        [field]: file
      }));
    } else {
      toast.error(isEnglish ? 'Please upload a PDF file' : 'Veuillez télécharger un fichier PDF');
    }
  };

  const handleSaveEdit = async () => {
    if (!currentExam) return;
    
    setIsSaving(true);
    try {
      const updatedExam = await onlineCourseServices.updateQuickExam(currentExam.id, editFormData);
      setExams(exams.map(exam => 
        exam.id === currentExam.id ? {...exam, ...updatedExam} : exam
      ));
      toast.success(isEnglish ? 'Exam updated successfully' : 'Examen mis à jour avec succès');
      setEditDialogOpen(false);
    } catch (error) {
      toast.error(error.message || (isEnglish ? 'Failed to update exam' : 'Échec de la mise à jour de l\'examen'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewDetails = (examId) => {
    navigate(`/quick-exams/${examId}`);
  };

  const handleReturn = () => {
    navigate('/quick-exams');
  };

  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <ProfessionalLayout isEnglish={isEnglish} isDarkMode={isDarkMode}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-6">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <Button
                onClick={handleReturn}
                variant="outline"
                className="mb-4 hover:bg-blue-50 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {isEnglish ? 'Back to Dashboard' : 'Retour au Tableau de Bord'}
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {isEnglish ? 'Quick Exam List' : 'Liste des Examens Rapides'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                {isEnglish 
                  ? 'Manage and monitor your quick exams from one place'
                  : 'Gérez et surveillez vos examens rapides depuis un seul endroit'}
              </p>
            </div>
          </motion.div>

          {/* Exams Grid */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {loading ? (
              // Loading skeletons
              [...Array(6)].map((_, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="animate-pulse bg-gray-100 dark:bg-gray-700 rounded-xl h-48"
                />
              ))
            ) : exams.length === 0 ? (
              <div className="col-span-3 text-center py-8">
                <FileText className="w-12 h-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  {isEnglish ? 'No exams found' : 'Aucun examen trouvé'}
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {isEnglish 
                    ? 'Create your first quick exam to get started' 
                    : 'Créez votre premier examen rapide pour commencer'}
                </p>
                <Button 
                  onClick={() => navigate('/quick-exams')}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isEnglish ? 'Create Exam' : 'Créer un examen'}
                </Button>
              </div>
            ) : (
              exams.map((exam) => (
                <motion.div key={exam.id} variants={item}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800">
                    <CardHeader>
                      <CardTitle className="text-lg flex justify-between items-start">
                        <div className="flex-1">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {exam.title}
                          </span>
                          <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{exam.duration || '30'} mins</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-blue-50 dark:hover:bg-gray-700"
                            onClick={() => handleEditClick(exam)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
                            onClick={() => handleDeleteClick(exam)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Book className="w-4 h-4 mr-2" />
                          <span>{isEnglish ? 'Type: ' : 'Type : '}{exam.exam_type}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <User className="w-4 h-4 mr-2" />
                          <span>
                            {isEnglish ? 'Students: ' : 'Étudiants : '}
                            {exam.student_count || '0'}
                          </span>
                        </div>
                        <div className="mt-4">
                          <Button 
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                            size="sm"
                            onClick={() => handleViewDetails(exam.id)}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            {isEnglish ? 'View Details' : 'Voir les détails'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEnglish ? 'Delete Exam' : 'Supprimer l\'examen'}
            </DialogTitle>
            <DialogDescription>
              {isEnglish 
                ? 'Are you sure you want to delete this exam? This action cannot be undone.'
                : 'Êtes-vous sûr de vouloir supprimer cet examen ? Cette action ne peut pas être annulée.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" disabled={isDeleting}>
                {isEnglish ? 'Cancel' : 'Annuler'}
              </Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⟳</span>
                  {isEnglish ? 'Deleting...' : 'Suppression...'}
                </span>
              ) : (
                <span className="flex items-center">
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isEnglish ? 'Delete' : 'Supprimer'}
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Exam Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEnglish ? 'Edit Exam' : 'Modifier l\'examen'}
            </DialogTitle>
            <DialogDescription>
              {isEnglish 
                ? 'Update the exam details below. Only update the files if you want to replace them.'
                : 'Mettez à jour les détails de l\'examen ci-dessous. Ne mettez à jour les fichiers que si vous souhaitez les remplacer.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">
                  {isEnglish ? 'Exam Title' : 'Titre de l\'examen'}
                </Label>
                <Input
                  id="edit-title"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-examType">
                  {isEnglish ? 'Exam Type' : 'Type d\'examen'}
                </Label>
                <Select
                  value={editFormData.examType}
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, examType: value }))}
                >
                  <SelectTrigger id="edit-examType">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">
                    {isEnglish ? 'Duration (minutes)' : 'Durée (minutes)'}
                  </Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    min="1"
                    value={editFormData.duration}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-maxAttempts">
                    {isEnglish ? 'Maximum Attempts' : 'Tentatives Maximum'}
                  </Label>
                  <Input
                    id="edit-maxAttempts"
                    type="number"
                    min="1"
                    value={editFormData.maxAttempts}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, maxAttempts: e.target.value }))}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-questionsPdf">
                  {isEnglish ? 'Questions PDF (Optional)' : 'PDF des Questions (Optionnel)'}
                </Label>
                <Input
                  id="edit-questionsPdf"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'questionsPdf')}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">
                  {isEnglish 
                    ? 'Only upload if you want to replace the current file' 
                    : 'Téléchargez uniquement si vous souhaitez remplacer le fichier actuel'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-answersPdf">
                  {isEnglish ? 'Answers PDF (Optional)' : 'PDF des Réponses (Optionnel)'}
                </Label>
                <Input
                  id="edit-answersPdf"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'answersPdf')}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">
                  {isEnglish 
                    ? 'Only upload if you want to replace the current file' 
                    : 'Téléchargez uniquement si vous souhaitez remplacer le fichier actuel'}
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isSaving}>
                {isEnglish ? 'Cancel' : 'Annuler'}
              </Button>
            </DialogClose>
            <Button 
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isSaving ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⟳</span>
                  {isEnglish ? 'Saving...' : 'Enregistrement...'}
                </span>
              ) : (
                <span className="flex items-center">
                  <Edit className="w-4 h-4 mr-2" />
                  {isEnglish ? 'Save Changes' : 'Enregistrer les modifications'}
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProfessionalLayout>
  );
};

export default QuickExamList;