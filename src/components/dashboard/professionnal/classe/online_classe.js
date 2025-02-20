import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  Users,
  Calendar,
  Plus,
  ChevronRight,
  Edit,
  Clock,
  Eye,
  Star,
  Filter,
  Search,
  ArrowUp,
  ArrowDown,
  X,
  Book
} from 'lucide-react';
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
import ProfessionalLayout from '../professionnal_layout';
import onlineCourseServices from '../../../services/professionnal/online_classe_services';
import { toast } from 'react-toastify';
import ManageOnlineClass from './management';

const DOMAINS = {
  "Software Development": ["Web Development", "Mobile App Development", "Game Development", "DevOps & CI/CD", "Software Testing & QA"],
  "Data Science & Machine Learning": ["Data Analytics", "Machine Learning", "Deep Learning", "Data Visualization", "Natural Language Processing"],
  "Cybersecurity": ["Network Security", "Ethical Hacking", "Cloud Security", "Cryptography", "Incident Response"],
  "Cloud Computing": ["AWS Services", "Google Cloud Platform", "Microsoft Azure", "Cloud Architecture", "Kubernetes & Docker"],
  "UI/UX Design": ["User Research", "Wireframing & Prototyping", "Interaction Design", "Visual Design", "Usability Testing"],
  "Digital Marketing": ["SEO Optimization", "Content Marketing", "Social Media Strategy", "Email Marketing", "Affiliate Marketing"],
  "Business and Entrepreneurship": ["Business Strategy", "Market Analysis", "Funding & Investments", "Startup Growth Hacking", "Leadership & Team Building"],
  "Artificial Intelligence": ["AI Strategy & Implementation", "Robotics Process Automation", "AI Ethics & Policies", "AI for Business Optimization", "Computer Vision"],
  "Education & Training": ["Curriculum Development", "Online Course Creation", "E-learning Platforms", "Public Speaking", "Academic Research Guidance"],
  "Healthcare & Medicine": ["Medical Research", "Healthcare Administration", "Public Health", "Medical Technology", "Telemedicine"],
  "Environmental Science": ["Climate Change Studies", "Renewable Energy", "Sustainable Development", "Wildlife Conservation", "Waste Management"],
  "Legal Studies": ["Corporate Law", "Intellectual Property Law", "Criminal Justice", "International Law", "Human Rights Law"],
  "Hospitality & Tourism": ["Hotel Management", "Event Planning", "Travel Consultancy", "Food & Beverage Management", "Customer Service"],
  "Sports & Fitness": ["Athlete Training", "Sports Management", "Physical Therapy", "Nutritional Coaching", "Recreational Sports"],
  "Music & Performing Arts": ["Music Composition", "Theater Acting", "Film Production", "Dance Choreography", "Instrumental Training"]
};
const CreateCourseModal = ({ isOpen, onClose, isEnglish, isDarkMode, onCourseCreated }) => {
  const [courseData, setCourseData] = useState({
    title: '',
    date: '',
    time: '',
    duration: '',
    domain: '',
    subdomain: '',
    description: '',
    mode: '',
    pdf_note: null,
    video: null,
    course_image: null
  });

  const [error, setError] = useState('');
  const [availableSubdomains, setAvailableSubdomains] = useState([]);
  const navigate = useNavigate(); // Use the useNavigate hook


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

  const handleDomainChange = (value) => {
    setCourseData(prev => ({
      ...prev,
      domain: value,
      subdomain: '' // Reset subdomain when domain changes
    }));
    setAvailableSubdomains(DOMAINS[value] || []);
  };

  const handleSubdomainChange = (value) => {
    setCourseData(prev => ({
      ...prev,
      subdomain: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Validate required fields
      if (!courseData.title || !courseData.date || !courseData.time || 
          !courseData.duration || !courseData.domain || !courseData.description || 
          !courseData.mode) {
        throw new Error(isEnglish ? 'Please fill all required fields' : 'Veuillez remplir tous les champs requis');
      }

      // Validate online course requirements
      if (courseData.mode === 'online' && !courseData.pdf_note && !courseData.video) {
        throw new Error(isEnglish ? 
          'Online courses must have either a PDF note or a video' : 
          'Les cours en ligne doivent avoir soit une note PDF, soit une vidéo'
        );
      }

      // Format date and time
      const dateTime = new Date(`${courseData.date}T${courseData.time}`);
      const formattedData = {
        ...courseData,
        date: dateTime.toISOString(),
        duration: parseInt(courseData.duration)
      };

      const response = await onlineCourseServices.createCourse(formattedData);
      toast.success(isEnglish ? 'Course created successfully!' : 'Cours créé avec succès!');
      onCourseCreated();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEnglish ? 'Create New Course' : 'Créer un Nouveau Cours'}
          </DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-200 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              {isEnglish ? 'Course Title *' : 'Titre du Cours *'}
            </Label>
            <Input
              id="title"
              name="title"
              value={courseData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">
                {isEnglish ? 'Date *' : 'Date *'}
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={courseData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">
                {isEnglish ? 'Time *' : 'Heure *'}
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={courseData.time}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">
              {isEnglish ? 'Duration (minutes) *' : 'Durée (minutes) *'}
            </Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              min="1"
              value={courseData.duration}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">
              {isEnglish ? 'Domain *' : 'Domaine *'}
            </Label>
            <Select
              value={courseData.domain}
              onValueChange={handleDomainChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={isEnglish ? "Select domain" : "Sélectionner le domaine"} />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(DOMAINS).map((domain) => (
                  <SelectItem key={domain} value={domain}>
                    {domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subdomain">
              {isEnglish ? 'Subdomain' : 'Sous-domaine'}
            </Label>
            <Select
              value={courseData.subdomain}
              onValueChange={handleSubdomainChange}
              disabled={!courseData.domain}
            >
              <SelectTrigger>
                <SelectValue placeholder={isEnglish ? "Select subdomain" : "Sélectionner le sous-domaine"} />
              </SelectTrigger>
              <SelectContent>
                {availableSubdomains.map((subdomain) => (
                  <SelectItem key={subdomain} value={subdomain}>
                    {subdomain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mode">
              {isEnglish ? 'Mode *' : 'Mode *'}
            </Label>
            <Select
              name="mode"
              value={courseData.mode}
              onValueChange={(value) => handleInputChange({ target: { name: 'mode', value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder={isEnglish ? "Select mode" : "Sélectionner le mode"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presential">
                  {isEnglish ? 'Presential' : 'Présentiel'}
                </SelectItem>
                <SelectItem value="online">
                  {isEnglish ? 'Online' : 'En ligne'}
                </SelectItem>
              </SelectContent>
            </Select>
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

          <div className="space-y-2">
            <Label htmlFor="description">
              {isEnglish ? 'Description *' : 'Description *'}
            </Label>
            <textarea
              id="description"
              name="description"
              value={courseData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              rows="4"
              required
            />
          </div>

            <div className="space-y-2 mt-4">
            <Label>
              {isEnglish ? 'Quick Exam (Optional)' : 'Examen Rapide (Optionnel)'}
            </Label>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate('/quick-exams')}
            >
              <Book className="w-4 h-4 mr-2" />
              {isEnglish ? 'Manage Quick Exams' : 'Gérer les Examens Rapides'}
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {isEnglish ? 'Cancel' : 'Annuler'}
            </Button>
            <Button type="submit">
              {isEnglish ? 'Create Course' : 'Créer le Cours'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


const getImageUrl = (relativePath) => {
  if (!relativePath) return null;

  const BACKEND_URL = 'http://127.0.0.1:8000';

  if (relativePath.startsWith('http')) {
      return relativePath;
  }

  const cleanPath = relativePath.replace(/^\/+/, '');

  return `${BACKEND_URL}/${cleanPath}`;
}

const OnlineClasses = () => {
  const navigate = useNavigate();
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [pastClasses, setPastClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [managementModalOpen, setManagementModalOpen] = useState(false);
  const [managementMode, setManagementMode] = useState('edit');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const [upcoming, past] = await Promise.all([
        onlineCourseServices.getUpcomingCourses(),
        onlineCourseServices.getPastCourses()
      ]);
      setUpcomingClasses(upcoming);
      setPastClasses(past);
    } catch (error) {
      toast.error(isEnglish ? 'Error fetching courses' : 'Erreur lors du chargement des cours');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setManagementMode('edit');
    setManagementModalOpen(true);
  };
  
  const handleManageCourse = (course) => {
    setSelectedCourse(course);
    setManagementMode('manage');
    setManagementModalOpen(true);
  };
  
  const handleViewReport = (course) => {
    setSelectedCourse(course);
    setManagementMode('report');
    setManagementModalOpen(true);
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(
      isEnglish ? 'en-US' : 'fr-FR',
      options
    );
  };

  const filterAndSortClasses = (classes) => {
    let filteredClasses = classes;
    
    if (searchTerm) {
      filteredClasses = classes.filter(
        (c) => c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.domain.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterBy !== 'all') {
      filteredClasses = filteredClasses.filter(c => c.domain.toLowerCase() === filterBy.toLowerCase());
    }

    return filteredClasses.sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      switch (sortBy) {
        case 'date':
          return direction * (new Date(a.date) - new Date(b.date));
        case 'title':
          return direction * a.title.localeCompare(b.title);
        case 'attendees':
          return direction * (a.attendees - b.attendees);
        case 'rating':
          return direction * (a.rating - b.rating);
        case 'views':
          return direction * (a.viewCount - b.viewCount);
        default:
          return 0;
      }
    });
  };

  return (
    <ProfessionalLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
      
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {isEnglish ? 'Online Classes' : 'Cours en Ligne'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {isEnglish 
                ? 'Manage your virtual classroom sessions and engage with students online'
                : 'Gérez vos sessions de classe virtuelle et interagissez avec les étudiants en ligne'}
            </p>
          </div>
          
          <Button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 md:mt-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            {isEnglish ? 'Create New Class' : 'Créer un Nouveau Cours'}
          </Button>
        </div>

        <CreateCourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isEnglish={isEnglish}
          isDarkMode={isDarkMode}
          onCourseCreated={fetchCourses}
        />

                  {/* Add ManageOnlineClass component */}
        <ManageOnlineClass
          course={selectedCourse}
          isOpen={managementModalOpen}
          onClose={() => setManagementModalOpen(false)}
          onCourseUpdated={fetchCourses}
          isEnglish={isEnglish}
          mode={managementMode}
        />
        
        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder={isEnglish ? "Search classes..." : "Rechercher des cours..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            value={filterBy}
            onValueChange={setFilterBy}
          >
            <SelectTrigger>
              <SelectValue placeholder={isEnglish ? "All Domains" : "Tous les Domaines"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {isEnglish ? "All Domains" : "Tous les Domaines"}
              </SelectItem>
              {Object.keys(DOMAINS).map((domain) => (
                <SelectItem key={domain} value={domain.toLowerCase()}>
                  {domain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex space-x-2">
            <Button
              variant={sortBy === 'date' ? 'default' : 'outline'}
              onClick={() => {
                if (sortBy === 'date') {
                  setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortBy('date');
                  setSortDirection('asc');
                }
              }}
              className="flex items-center"
            >
              <Calendar className="w-4 h-4 mr-1" />
              {isEnglish ? "Date" : "Date"}
              {sortBy === 'date' && (
                sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />
              )}
            </Button>
            
            <Button
              variant={sortBy === 'attendees' ? 'default' : 'outline'}
              onClick={() => {
                if (sortBy === 'attendees') {
                  setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortBy('attendees');
                  setSortDirection('asc');
                }
              }}
              className="flex items-center"
            >
              <Users className="w-4 h-4 mr-1" />
              {isEnglish ? "Attendees" : "Participants"}
              {sortBy === 'attendees' && (
                sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />
              )}
            </Button>
            
            <Button
              variant={sortBy === 'rating' ? 'default' : 'outline'}
              onClick={() => {
                if (sortBy === 'rating') {
                  setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortBy('rating');
                  setSortDirection('asc');
                }
              }}
              className="flex items-center"
            >
              <Star className="w-4 h-4 mr-1" />
              {isEnglish ? "Rating" : "Évaluation"}
              {sortBy === 'rating' && (
                sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />
              )}
            </Button>
          </div>
        </div>

        {/* Upcoming Classes Section */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {isEnglish ? 'Upcoming Classes' : 'Cours à Venir'}
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800 animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterAndSortClasses(upcomingClasses).map((course) => (
                <div 
                  key={course.id}
                  className="rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800 transition-all hover:shadow-lg"
                >
                  <div className="relative">
                    <img
                      src={getImageUrl(course.course_image) || "/api/placeholder/400/200"}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <span className="text-white text-sm font-medium px-2 py-1 rounded bg-blue-600">
                        {course.domain}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
                      {course.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(course.date)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{course.duration} {isEnglish ? 'min' : 'min'}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{course.attendees} {isEnglish ? 'enrolled' : 'inscrits'}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCourse(course.id)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        {isEnglish ? 'Edit' : 'Modifier'}
                      </Button>
                      
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleManageCourse(course.id)}
                      >
                        {isEnglish ? 'Manage' : 'Gérer'}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        {/* Past Classes Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {isEnglish ? 'Past Classes' : 'Cours Passés'}
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800 animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterAndSortClasses(pastClasses).map((course) => (
                <div 
                  key={course.id}
                  className="rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800 transition-all hover:shadow-lg"
                >
                  <div className="relative">
                    <img
                      src={course.course_image || "/api/placeholder/400/200"}
                      alt={course.title}
                      className="w-full h-48 object-cover filter grayscale"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="text-white text-xs px-2 py-1 rounded bg-gray-600">
                        {isEnglish ? 'Completed' : 'Terminé'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
                      {course.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(course.date)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{course.attendees} {isEnglish ? 'attended' : 'présents'}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Star className="w-4 h-4 mr-1" />
                        <span>{course.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => navigate(`/class/${course.id}/report`)}
                    >
                      {isEnglish ? 'View Report' : 'Voir Rapport'}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </ProfessionalLayout>
  );
};

export default OnlineClasses;