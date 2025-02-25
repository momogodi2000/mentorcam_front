import React, { useState, useEffect } from 'react';
import { sessionsService } from '../../../services/biginner/session_course_services';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Video, FileText, Eye, Star, User, Plus, Users, PenTool, CheckCircle } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from '../../../ui/radio-group';
import { Label } from '../../../ui/label_2';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tab';
import BeginnerLayout from '../biginner_layout';

export default function SessionsPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showExam, setShowExam] = useState(false);
  const [examType, setExamType] = useState('');
  const { toast } = useToast();
  const [userType, setUserType] = useState(localStorage.getItem('userType') || 'amateur');
  const [quickExam, setQuickExam] = useState(null);
  const [examQuestions, setExamQuestions] = useState(null);
  const [examAnswers, setExamAnswers] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [examScore, setExamScore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examActiveTab, setExamActiveTab] = useState("questions");

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);

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

  const handleRating = async (courseId, rating) => {
    try {
      await sessionsService.rateCourse(courseId, rating);
      setUserRating(rating);
      toast({
        title: "Success",
        description: "Thank you for rating this course!",
      });
      fetchCourses(); // Refresh courses to update rating
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleViewContent = async (courseId) => {
    const selected = courses.find(course => course.id === courseId);
    setSelectedCourse(selected);
    
    // Automatically fetch quick exam if available
    if (selected.quick_exam_info) {
      try {
        const exam = await sessionsService.getQuickExam(selected.quick_exam_info.id);
        setQuickExam(exam);
        setExamQuestions(exam.questions_pdf);
        setExamAnswers(exam.answers_pdf);
        // Reset user answers and score when viewing a new exam
        setUserAnswers({});
        setExamScore(null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load exam data",
          variant: "destructive"
        });
      }
    }
  };

  const handleAnswerSelection = (questionNum, option) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionNum]: option
    }));
  };

  const handleSubmitExam = async () => {
    // Generate question count based on the actual exam
    const questionCount = 20; // Assuming there are 20 questions
    const answeredCount = Object.keys(userAnswers).length;
    
    if (answeredCount < questionCount) {
      toast({
        title: "Warning",
        description: `Please answer all ${questionCount} questions. You've answered ${answeredCount}.`,
        variant: "warning"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await sessionsService.submitExam(quickExam.id, userAnswers);
      setExamScore(response.score);
      toast({
        title: "Success",
        description: `Your exam score is ${response.score}`,
      });

      // Update the session service to reflect the updated stats
      await fetchCourses();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit exam",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingStars = ({ courseId, currentRating, userHasRated }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 cursor-pointer ${
            star <= currentRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => !userHasRated && handleRating(courseId, star)}
        />
      ))}
    </div>
  );

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
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{course.title}</h3>
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
            <Users className="w-4 h-4 mr-1" />
            {course.attendees_count || 0}
          </div>
        </div>

        <div className="mb-4">
          <RatingStars
            courseId={course.id}
            currentRating={course.rating}
            userHasRated={course.user_has_rated}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span className="text-sm text-gray-600">{course.mentor_name}</span>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => handleAttendance(course.id)}
              variant="outline"
              size="sm"
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
            >
              Attend
            </Button>
            <Button
              onClick={() => handleViewContent(course.id)}
              variant="outline"
              size="sm"
              className="bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
            >
              View Content
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const handleAttendance = async (courseId) => {
    try {
      await sessionsService.attendCourse(courseId);
      toast({
        title: "Success",
        description: "You've been added to the attendees list!",
      });
      fetchCourses();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const MultipleChoiceQuestions = () => {
    const questions = Array.from({ length: 20 }, (_, i) => i + 1);
    const options = ['A', 'B', 'C', 'D'];
    
    return (
      <div className="space-y-6 mt-4 max-h-96 overflow-y-auto p-4">
        {questions.map((questionNum) => (
          <div key={questionNum} className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Question {questionNum}</h4>
            <RadioGroup
              value={userAnswers[questionNum]}
              onValueChange={(value) => handleAnswerSelection(questionNum, value)}
              className="flex space-x-4"
            >
              {options.map((option) => (
                <div key={option} className="flex items-center">
                  <RadioGroupItem
                    value={option}
                    id={`q${questionNum}-${option}`}
                    className="mr-1"
                  />
                  <Label htmlFor={`q${questionNum}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>
    );
  };

  const ExamDialog = () => (
    <Dialog open={showExam} onOpenChange={() => setShowExam(false)}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Quick Exam - {selectedCourse?.title}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="questions" className="w-full" value={examActiveTab} onValueChange={setExamActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="questions">Exam Questions</TabsTrigger>
            <TabsTrigger value="answers">Your Answers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="questions" className="space-y-4">
            {examQuestions ? (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Exam Questions</h3>
                  <Button
                    onClick={() => window.open(examQuestions, '_blank')}
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                  >
                    Open in New Tab
                  </Button>
                </div>
                <div className="relative w-full h-96 overflow-hidden rounded-lg">
                  <iframe
                    src={examQuestions}
                    className="absolute top-0 left-0 w-full h-full border-0"
                    title="Exam Questions"
                  />
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-lg">
                <Skeleton className="h-48 w-full mb-4" />
                <p className="text-gray-500">Loading exam questions...</p>
              </div>
            )}
            <Button 
              onClick={() => setExamActiveTab("answers")}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Proceed to Answer Questions
            </Button>
          </TabsContent>
          
          <TabsContent value="answers" className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Answer Sheet</h3>
              <MultipleChoiceQuestions />
            </div>
            <Button 
              onClick={handleSubmitExam} 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Exam
                </span>
              )}
            </Button>
            {examScore !== null && (
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-green-800">
                  Your Score: {examScore}%
                </h3>
                <p className="text-green-600 mt-2">Thank you for completing the exam!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );

  const ContentDialog = () => (
    <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{selectedCourse?.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <p className="text-gray-600">{selectedCourse?.description}</p>
          
          {selectedCourse?.video && (
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <video
                controls
                className="w-full h-full"
                src={selectedCourse.video}
              />
            </div>
          )}
          
          {selectedCourse?.pdf_note && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <FileText className="w-6 h-6 mr-2 text-blue-500" />
                <span>Course Notes</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setShowPdfViewer(true)}
                  variant="outline"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                >
                  View PDF
                </Button>
                <Button
                  onClick={() => window.open(selectedCourse.pdf_note, '_blank')}
                  variant="outline"
                  className="bg-green-50 hover:bg-green-100 text-green-600"
                >
                  Download PDF
                </Button>
              </div>
            </div>
          )}

          {selectedCourse?.quick_exam_info && (
            <Button
              onClick={() => setShowExam(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <PenTool className="w-4 h-4 mr-2" />
              Take Quick Exam
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  const PdfViewerDialog = () => (
    <Dialog open={showPdfViewer} onOpenChange={() => setShowPdfViewer(false)}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Course Notes</DialogTitle>
        </DialogHeader>
        <iframe
          src={`${selectedCourse?.pdf_note}#toolbar=0`}
          className="w-full h-full rounded-lg"
          title="PDF Viewer"
        />
      </DialogContent>
    </Dialog>
  );

  return (
    <BeginnerLayout
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
      isEnglish={isEnglish}
      setIsEnglish={setIsEnglish}
    >
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Learning Sessions</h1>
            {userType === 'professional' && (
              <Button
                onClick={() => setIsCreating(true)}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
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
          <PdfViewerDialog />
          <ExamDialog />
        </div>
      </div>
    </BeginnerLayout>
  );
}