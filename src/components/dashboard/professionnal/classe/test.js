import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Video,
  Users,
  Calendar,
  Clock,
  Edit,
  Trash2,
  MessageCircle,
  ChevronRight,
  Share2,
  Download,
  Star,
  Clipboard,
  Award,
  FileText,
  Plus,
  Play,
  PieChart,
  BookOpen,
  User,
  UserCheck,
  Info,
  ExternalLink,
  Eye,
  X
} from 'lucide-react';
import ProfessionalLayout from '../professionnal_layout';
import { getUser } from '../../../services/get_user';
import ClassHeader from './ClassHeader';
import ClassContent from './ClassContent';

const Classe = ({ isDarkMode, setIsDarkMode, isEnglish, setIsEnglish }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);

  // Mock data for a single class - in a real app, this would come from an API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchClassData = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockClass = {
          id: parseInt(id),
          title: isEnglish ? 'Advanced Web Development Techniques' : 'Techniques Avancées de Développement Web',
          description: isEnglish 
            ? 'Master modern web development frameworks and tools to build scalable and responsive applications.'
            : 'Maîtrisez les frameworks et outils de développement web modernes pour créer des applications évolutives et réactives.',
          date: '2025-02-20T15:00:00',
          duration: 120,
          domain: isEnglish ? 'Programming' : 'Programmation',
          level: isEnglish ? 'Advanced' : 'Avancé',
          thumbnail: '/api/placeholder/800/450',
          attendees: 24,
          maxAttendees: 30,
          rating: 4.7,
          viewCount: 154,
          materials: [
            { id: 1, name: isEnglish ? 'Course Syllabus' : 'Programme du Cours', type: 'pdf', size: '1.2 MB' },
            { id: 2, name: isEnglish ? 'Code Examples' : 'Exemples de Code', type: 'zip', size: '5.4 MB' },
            { id: 3, name: isEnglish ? 'Presentation Slides' : 'Diapositives de Présentation', type: 'pptx', size: '3.8 MB' }
          ],
          topics: [
            isEnglish ? 'React Hooks and Context API' : 'Hooks React et API Context',
            isEnglish ? 'Server-Side Rendering' : 'Rendu Côté Serveur',
            isEnglish ? 'GraphQL Fundamentals' : 'Fondamentaux de GraphQL',
            isEnglish ? 'State Management with Redux' : 'Gestion d\'État avec Redux',
            isEnglish ? 'Serverless Architecture' : 'Architecture Serverless'
          ],
          requirements: [
            isEnglish ? 'Basic knowledge of JavaScript' : 'Connaissance de base de JavaScript',
            isEnglish ? 'Familiarity with React basics' : 'Familiarité avec les bases de React',
            isEnglish ? 'Understanding of HTTP and APIs' : 'Compréhension du HTTP et des API'
          ],
          status: isEnglish ? 'Upcoming' : 'À venir',
        };

        // Generate mock attendees
        const mockAttendees = [];
        for (let i = 0; i < 24; i++) {
          mockAttendees.push({
            id: 100 + i,
            name: `${isEnglish ? 'Student' : 'Étudiant'} ${i + 1}`,
            avatar: `/api/placeholder/40/40?text=${i + 1}`,
            role: i % 5 === 0 ? (isEnglish ? 'Professional' : 'Professionnel') : (isEnglish ? 'Amateur' : 'Amateur'),
            status: i % 3 === 0 ? 'confirmed' : i % 3 === 1 ? 'pending' : 'attended'
          });
        }

        setClassData(mockClass);
        setAttendees(mockAttendees);
        setLoading(false);
      }, 1000);
    };

    fetchUser();
    fetchClassData();
  }, [id, isEnglish]);

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(
      isEnglish ? 'en-US' : 'fr-FR',
      options
    );
  };

  const handleAddCourse = (formData) => {
    console.log('New course data:', formData);
    // Here you would typically send this data to your API
    setShowAddCourseModal(false);
  };

  if (loading) {
    return (
      <ProfessionalLayout 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        isEnglish={isEnglish}
        setIsEnglish={setIsEnglish}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </ProfessionalLayout>
    );
  }

  return (
    <ProfessionalLayout 
      isDarkMode={isDarkMode} 
      setIsDarkMode={setIsDarkMode} 
      isEnglish={isEnglish}
      setIsEnglish={setIsEnglish}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Add Course Button */}
        {currentUser?.role === 'professional' && (
          <div className="mb-6 flex justify-end">
            <button 
              onClick={() => setShowAddCourseModal(true)}
              className="flex items-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isEnglish ? 'Add New Course' : 'Ajouter un Nouveau Cours'}
            </button>
          </div>
        )}
        
        {/* Class Header Component */}
        <ClassHeader 
          classData={classData}
          currentUser={currentUser}
          formatDate={formatDate}
          isDarkMode={isDarkMode}
          isEnglish={isEnglish}
        />
        
        {/* Tabs */}
        <div className="flex border-b mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'overview'
                ? `border-b-2 ${isDarkMode ? 'border-blue-500 text-blue-500' : 'border-blue-600 text-blue-600'}`
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`
            }`}
          >
            {isEnglish ? 'Overview' : 'Aperçu'}
          </button>
          
          <button
            onClick={() => setActiveTab('attendees')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'attendees'
                ? `border-b-2 ${isDarkMode ? 'border-blue-500 text-blue-500' : 'border-blue-600 text-blue-600'}`
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`
            }`}
          >
            {isEnglish ? 'Attendees' : 'Participants'}
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'analytics'
                ? `border-b-2 ${isDarkMode ? 'border-blue-500 text-blue-500' : 'border-blue-600 text-blue-600'}`
                : `${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`
            }`}
          >
            {isEnglish ? 'Analytics' : 'Analyse'}
          </button>
        </div>
        
        {/* Content Component */}
        <ClassContent 
          activeTab={activeTab}
          classData={classData}
          attendees={attendees}
          isDarkMode={isDarkMode}
          isEnglish={isEnglish}
        />
      </div>

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <AddCourseModal 
          onClose={() => setShowAddCourseModal(false)}
          onSubmit={handleAddCourse}
          isDarkMode={isDarkMode}
          isEnglish={isEnglish}
        />
      )}
    </ProfessionalLayout>
  );
};

// Add Course Modal Component
const AddCourseModal = ({ onClose, onSubmit, isDarkMode, isEnglish }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    duration: 60,
    domain: '',
    level: '',
    maxAttendees: 30,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl overflow-hidden`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {isEnglish ? 'Add New Course' : 'Ajouter un Nouveau Cours'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                {isEnglish ? 'Title' : 'Titre'}
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={`w-full p-2 border rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            <div>
              <label htmlFor="description" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                {isEnglish ? 'Description' : 'Description'}
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full p-2 border rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="date" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                {isEnglish ? 'Date & Time' : 'Date et Heure'}
              </label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className={`w-full p-2 border rounded-md ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                  {isEnglish ? 'Duration (minutes)' : 'Durée (minutes)'}
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="15"
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label htmlFor="maxAttendees" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                  {isEnglish ? 'Max Attendees' : 'Nombre Maximum de Participants'}
                </label>
                <input
                  type="number"
                  id="maxAttendees"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                  required
                  min="1"
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="domain" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                  {isEnglish ? 'Domain' : 'Domaine'}
                </label>
                <input
                  type="text"
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div>
                <label htmlFor="level" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                  {isEnglish ? 'Level' : 'Niveau'}
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 border rounded-md ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">{isEnglish ? '-- Select Level --' : '-- Sélectionner un Niveau --'}</option>
                  <option value={isEnglish ? 'Beginner' : 'Débutant'}>
                    {isEnglish ? 'Beginner' : 'Débutant'}
                  </option>
                  <option value={isEnglish ? 'Intermediate' : 'Intermédiaire'}>
                    {isEnglish ? 'Intermediate' : 'Intermédiaire'}
                  </option>
                  <option value={isEnglish ? 'Advanced' : 'Avancé'}>
                    {isEnglish ? 'Advanced' : 'Avancé'}
                  </option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className={`py-2 px-4 border rounded-md ${
                  isDarkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {isEnglish ? 'Cancel' : 'Annuler'}
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                {isEnglish ? 'Create Course' : 'Créer le Cours'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Classe;