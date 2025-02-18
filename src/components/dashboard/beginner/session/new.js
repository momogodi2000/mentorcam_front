import React, { useState, useEffect } from 'react';
import { sessionsService } from '../../../services/biginner/session_course_services';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Video, FileText, Eye, Star, User, Plus } from 'lucide-react';
import { useToast } from '../../../ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../ui/dialog_2';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Textarea } from '../../../ui/textarea';
import { Skeleton } from '../../../ui/skeleton';
import BeginnerLayout from '../biginner_layout'; // Import the BeginnerLayout

export default function SessionsPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const [userType, setUserType] = useState(localStorage.getItem('userType') || 'amateur');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await sessionsService.getCourses();
      setCourses(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const CourseCard = ({ course }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
    >
      <div className="relative h-48">
        <img
          src={course.course_image || "/api/placeholder/400/300"}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 m-2 bg-blue-500 text-white px-2 py-1 rounded">
          {course.mode}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(course.date).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {course.duration} min
          </div>
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {course.view_count}
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1" />
            {course.rating.toFixed(1)}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span className="text-sm text-gray-600">{course.mentor_name}</span>
          </div>
          <Button
            onClick={() => handleViewContent(course.id)}
            variant="outline"
          >
            View Content
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const handleViewContent = async (courseId) => {
    try {
      const content = await sessionsService.getCourseContent(courseId);
      setSelectedCourse(content);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const ContentDialog = () => (
    <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{selectedCourse?.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <p className="text-gray-600">{selectedCourse?.description}</p>
          
          {selectedCourse?.video && (
            <div className="aspect-video">
              <video
                controls
                className="w-full h-full rounded-lg"
                src={selectedCourse.video}
              />
            </div>
          )}
          
          {selectedCourse?.pdf_note && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-6 h-6 mr-2 text-blue-500" />
                <span>Course Notes</span>
              </div>
              <Button
                onClick={() => window.open(selectedCourse.pdf_note, '_blank')}
                variant="outline"
              >
                Download PDF
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <BeginnerLayout>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Learning Sessions</h1>
            {userType === 'professional' && (
              <Button
                onClick={() => setIsCreating(true)}
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-lg shadow-lg p-4">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </AnimatePresence>
            </div>
          )}

          <ContentDialog />
        </div>
      </div>
    </BeginnerLayout>
  );
}