import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../ui/dialog_2";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label_2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { Alert, AlertDescription } from "../../../ui/alert";
import { 
  TrashIcon, 
  AlertTriangle, 
  FileEdit,
  Settings,
  Ban,
  Clock,
  Users,
  Star 
} from "lucide-react";
import { toast } from 'react-toastify';
import onlineCourseServices from '../../../services/professionnal/online_classe_services';

const ManageOnlineClass = ({ 
  course, 
  isOpen, 
  onClose, 
  onCourseUpdated,
  isEnglish,
  mode 
}) => {
  const [activeTab, setActiveTab] = useState(mode || 'edit');
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // Fetch course data when course ID changes
  useEffect(() => {
    const fetchCourseData = async () => {
      if (course) {
        setLoading(true);
        try {
          const data = await onlineCourseServices.getCourse(course);
          setCourseData(data);
        } catch (error) {
          toast.error(isEnglish ? 'Error fetching course details' : 'Erreur lors du chargement des détails du cours');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCourseData();
  }, [course]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setCourseData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setCourseData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleUpdateCourse = async () => {
    if (!courseData) return;
    
    setLoading(true);
    try {
      await onlineCourseServices.updateCourse(courseData.id, courseData);
      toast.success(isEnglish ? 'Course updated successfully!' : 'Cours mis à jour avec succès!');
      onCourseUpdated();
      onClose();
    } catch (error) {
      toast.error(isEnglish ? 'Error updating course' : 'Erreur lors de la mise à jour du cours');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!courseData?.id) {
      toast.error(isEnglish ? 'Invalid course ID' : 'ID du cours invalide');
      return;
    }

    setLoading(true);
    try {
      await onlineCourseServices.deleteCourse(courseData.id);
      toast.success(isEnglish ? 'Course deleted successfully!' : 'Cours supprimé avec succès!');
      onCourseUpdated();
      onClose();
    } catch (error) {
      toast.error(isEnglish ? 'Error deleting course' : 'Erreur lors de la suppression du cours');
    } finally {
      setLoading(false);
    }
  };

  const handleReportCourse = async () => {
    if (!courseData?.id) return;
    
    setLoading(true);
    try {
      await onlineCourseServices.reportCourse(courseData.id, { reason: reportReason });
      toast.success(isEnglish ? 'Course reported successfully!' : 'Cours signalé avec succès!');
      onClose();
    } catch (error) {
      toast.error(isEnglish ? 'Error reporting course' : 'Erreur lors du signalement du cours');
    } finally {
      setLoading(false);
    }
  };

  const renderEditTab = () => {
    if (!courseData) return null;

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            {isEnglish ? 'Course Title' : 'Titre du Cours'}
          </Label>
          <Input
            id="title"
            name="title"
            value={courseData.title || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">
              {isEnglish ? 'Date' : 'Date'}
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={courseData.date ? new Date(courseData.date).toISOString().split('T')[0] : ''}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">
              {isEnglish ? 'Duration (minutes)' : 'Durée (minutes)'}
            </Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              value={courseData.duration || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            {isEnglish ? 'Description' : 'Description'}
          </Label>
          <textarea
            id="description"
            name="description"
            value={courseData.description || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            rows="4"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="course_image">
            {isEnglish ? 'Course Image' : 'Image du Cours'}
          </Label>
          <Input
            id="course_image"
            name="course_image"
            type="file"
            onChange={handleInputChange}
            accept="image/*"
          />
        </div>

        {courseData.mode === 'online' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="pdf_note">
                {isEnglish ? 'PDF Note' : 'Note PDF'}
              </Label>
              <Input
                id="pdf_note"
                name="pdf_note"
                type="file"
                onChange={handleInputChange}
                accept=".pdf"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video">
                {isEnglish ? 'Video' : 'Vidéo'}
              </Label>
              <Input
                id="video"
                name="video"
                type="file"
                onChange={handleInputChange}
                accept="video/*"
              />
            </div>
          </>
        )}

        <Button 
          onClick={handleUpdateCourse} 
          disabled={loading}
          className="w-full"
        >
          {isEnglish ? 'Update Course' : 'Mettre à jour le Cours'}
        </Button>
      </div>
    );
  };

  const renderManageTab = () => {
    if (!courseData) return null;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5" />
              <span className="font-medium">
                {isEnglish ? 'Attendees' : 'Participants'}
              </span>
            </div>
            <p className="text-2xl font-bold">{courseData.attendees || 0}</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-5 h-5" />
              <span className="font-medium">
                {isEnglish ? 'Rating' : 'Évaluation'}
              </span>
            </div>
            <p className="text-2xl font-bold">{(courseData.rating || 0).toFixed(1)}</p>
          </div>
        </div>

        {!confirmDelete ? (
          <Button 
            variant="destructive" 
            onClick={() => setConfirmDelete(true)}
            className="w-full"
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            {isEnglish ? 'Delete Course' : 'Supprimer le Cours'}
          </Button>
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {isEnglish 
                ? 'Are you sure you want to delete this course? This action cannot be undone.'
                : 'Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.'}
              <div className="flex space-x-2 mt-4">
                <Button
                  variant="destructive"
                  onClick={handleDeleteCourse}
                  disabled={loading}
                >
                  {isEnglish ? 'Confirm Delete' : 'Confirmer la Suppression'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setConfirmDelete(false)}
                >
                  {isEnglish ? 'Cancel' : 'Annuler'}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  };

  const renderReportTab = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reportReason">
          {isEnglish ? 'Reason for Report' : 'Motif du Signalement'}
        </Label>
        <textarea
          id="reportReason"
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          rows="4"
          placeholder={isEnglish ? "Describe the issue..." : "Décrivez le problème..."}
        />
      </div>

      <Button 
        onClick={handleReportCourse} 
        disabled={loading || !reportReason}
        className="w-full"
        variant="destructive"
      >
        <Ban className="w-4 h-4 mr-2" />
        {isEnglish ? 'Submit Report' : 'Soumettre le Signalement'}
      </Button>
    </div>
  );

  if (!courseData && !loading) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {courseData?.title || ''}
          </DialogTitle>
        </DialogHeader>

        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeTab === 'edit' ? 'default' : 'outline'}
            onClick={() => setActiveTab('edit')}
          >
            <FileEdit className="w-4 h-4 mr-2" />
            {isEnglish ? 'Edit' : 'Modifier'}
          </Button>
          <Button
            variant={activeTab === 'manage' ? 'default' : 'outline'}
            onClick={() => setActiveTab('manage')}
          >
            <Settings className="w-4 h-4 mr-2" />
            {isEnglish ? 'Manage' : 'Gérer'}
          </Button>
          <Button
            variant={activeTab === 'report' ? 'default' : 'outline'}
            onClick={() => setActiveTab('report')}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            {isEnglish ? 'Report' : 'Signaler'}
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : (
          <>
            {activeTab === 'edit' && renderEditTab()}
            {activeTab === 'manage' && renderManageTab()}
            {activeTab === 'report' && renderReportTab()}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ManageOnlineClass;