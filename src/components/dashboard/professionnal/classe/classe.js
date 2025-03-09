import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video,Users,Calendar,Clock,Edit,Trash2,MessageCircle,ChevronRight,Share2,Download,Star,Clipboard,Award,FileText,Plus,Play,PieChart,BookOpen,User,UserCheck,Info,ExternalLink,Eye
} from 'lucide-react';
import ProfessionalLayout from '../professionnal_layout';
import { getUser } from '../../../services/get_user';

const Classe = ({ isDarkMode, setIsDarkMode, isEnglish, setIsEnglish }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState(null);
  const [attendees, setAttendees] = useState([]);

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className={`rounded-lg overflow-hidden shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
                  <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    {isEnglish ? 'About This Class' : 'À Propos de ce Cours'}
                  </h3>
                  <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {classData?.description}
                  </p>
                  
                  <h4 className={`text-lg font-medium mt-6 mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    {isEnglish ? 'What You\'ll Learn' : 'Ce que Vous Apprendrez'}
                  </h4>
                  <ul className="space-y-2">
                    {classData?.topics.map((topic, i) => (
                      <li key={i} className="flex items-start">
                        <ChevronRight className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{topic}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <h4 className={`text-lg font-medium mt-6 mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    {isEnglish ? 'Requirements' : 'Prérequis'}
                  </h4>
                  <ul className="space-y-2">
                    {classData?.requirements.map((req, i) => (
                      <li key={i} className="flex items-start">
                        <Info className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <span className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div>
                <div className={`rounded-lg overflow-hidden shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
                  <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    {isEnglish ? 'Class Details' : 'Détails du Cours'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {isEnglish ? 'Date & Time' : 'Date et Heure'}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(classData?.date)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {isEnglish ? 'Duration' : 'Durée'}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {classData?.duration} {isEnglish ? 'minutes' : 'minutes'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <BookOpen className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {isEnglish ? 'Domain' : 'Domaine'}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {classData?.domain}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Award className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {isEnglish ? 'Level' : 'Niveau'}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {classData?.level}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {isEnglish ? 'Participants' : 'Participants'}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {classData?.attendees} / {classData?.maxAttendees} {isEnglish ? 'enrolled' : 'inscrits'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Star className={`w-5 h-5 text-yellow-500`} />
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {isEnglish ? 'Rating' : 'Évaluation'}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {classData?.rating} / 5.0
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Eye className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {isEnglish ? 'Views' : 'Vues'}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {classData?.viewCount}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <button className="w-full flex items-center justify-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200">
                      <Edit className="w-4 h-4 mr-2" />
                      {isEnglish ? 'Edit Class' : 'Modifier le Cours'}
                    </button>
                    
                    <button className="w-full flex items-center justify-center py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200">
                      <Play className="w-4 h-4 mr-2" />
                      {isEnglish ? 'Start Class' : 'Démarrer le Cours'}
                    </button>
                    
                    <button className="w-full flex items-center justify-center py-2 px-4 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 dark:text-blue-400 dark:border-blue-400 rounded-md transition-colors duration-200">
                      <Share2 className="w-4 h-4 mr-2" />
                      {isEnglish ? 'Share Class' : 'Partager le Cours'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`mt-6 rounded-lg overflow-hidden shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {isEnglish ? 'Class Materials' : 'Matériel de Cours'}
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className={`py-3 text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {isEnglish ? 'Name' : 'Nom'}
                      </th>
                      <th className={`py-3 text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {isEnglish ? 'Type' : 'Type'}
                      </th>
                      <th className={`py-3 text-left ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {isEnglish ? 'Size' : 'Taille'}
                      </th>
                      <th className={`py-3 text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {isEnglish ? 'Action' : 'Action'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {classData?.materials.map((material) => (
                      <tr 
                        key={material.id}
                        className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}`}
                      >
                        <td className={`py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-gray-400" />
                            {material.name}
                          </div>
                        </td>
                        <td className={`py-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {material.type.toUpperCase()}
                        </td>
                        <td className={`py-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {material.size}
                        </td>
                        <td className="py-3 text-right">
                          <button className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            <Download className="w-4 h-4 mr-1" />
                            {isEnglish ? 'Download' : 'Télécharger'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <button 
                className="mt-4 flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                <Plus className="w-4 h-4 mr-1" />
                {isEnglish ? 'Add New Material' : 'Ajouter un Nouveau Matériel'}
              </button>
            </div>
          </div>
        );
      
      case 'attendees':
        return (
          <div className="animate-fadeIn">
            <div className={`rounded-lg overflow-hidden shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {isEnglish ? 'Attendees' : 'Participants'}
                </h3>
                <div className="flex space-x-2">
                  <div className={`text-sm px-3 py-1 rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                    {classData?.attendees} / {classData?.maxAttendees}
                  </div>
                  <button className="flex items-center text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                    <Plus className="w-4 h-4 mr-1" />
                    {isEnglish ? 'Invite' : 'Inviter'}
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendees.map((attendee) => (
                  <div 
                    key={attendee.id}
                    className={`p-4 rounded-lg border ${
                      isDarkMode 
                        ? 'border-gray-700 hover:bg-gray-750' 
                        : 'border-gray-200 hover:bg-gray-50'
                    } transition-colors duration-200`}
                  >
                    <div className="flex items-center">
                      <img 
                        src={attendee.avatar} 
                        alt={attendee.name} 
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <h4 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          {attendee.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {attendee.role}
                        </p>
                      </div>
                      
                      <div className="ml-auto">
                        {attendee.status === 'confirmed' && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                          }`}>
                            {isEnglish ? 'Confirmed' : 'Confirmé'}
                          </span>
                        )}
                        {attendee.status === 'pending' && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {isEnglish ? 'Pending' : 'En attente'}
                          </span>
                        )}
                        {attendee.status === 'attended' && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {isEnglish ? 'Attended' : 'Participé'}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex mt-3 space-x-2">
                      <button className="text-xs flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {isEnglish ? 'Message' : 'Message'}
                      </button>
                      <button className="text-xs flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        <UserCheck className="w-3 h-3 mr-1" />
                        {isEnglish ? 'Profile' : 'Profil'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'analytics':
        return (
          <div className="animate-fadeIn">
            <div className={`rounded-lg overflow-hidden shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
              <h3 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {isEnglish ? 'Class Analytics' : 'Analyse du Cours'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {isEnglish ? 'Total Enrollment' : 'Inscriptions Totales'}
                      </p>
                      <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        {classData?.attendees}
                      </p>
                    </div>
                    <Users className={`w-10 h-10 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div className="mt-2 text-sm text-green-600">
                    +12% {isEnglish ? 'from last week' : 'depuis la semaine dernière'}
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {isEnglish ? 'Average Rating' : 'Évaluation Moyenne'}
                      </p>
                      <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        {classData?.rating}
                      </p>
                    </div>
                    <Star className="w-10 h-10 text-yellow-500" />
                  </div>
                  <div className="mt-2 text-sm text-blue-600">
                    +0.2 {isEnglish ? 'from last class' : 'depuis le dernier cours'}
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {isEnglish ? 'View Count' : 'Nombre de Vues'}
                      </p>
                      <p className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                        {classData?.viewCount}
                      </p>
                    </div>
                    <Eye className={`w-10 h-10 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <div className="mt-2 text-sm text-green-600">
                    +28 {isEnglish ? 'this week' : 'cette semaine'}
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                  {isEnglish ? 'Enrollment Over Time' : 'Évolution des Inscriptions'}
                </h4>
                <div className={`h-64 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {isEnglish ? 'Chart showing enrollment trends' : 'Graphique montrant l\'évolution des inscriptions'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    {isEnglish ? 'Attendance Rate' : 'Taux de Participation'}
                  </h4>
                  <div className={`h-64 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                    <PieChart className={`w-12 h-12 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                </div>
                
                <div>
                  <h4 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    {isEnglish ? 'Participant Demographics' : 'Démographie des Participants'}
                  </h4>
                  <div className={`h-64 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                    <User className={`w-12 h-12 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                  <Download className="w-4 h-4 mr-2" />
                  {isEnglish ? 'Download Full Analytics Report' : 'Télécharger le Rapport Complet'}
</button>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="animate-fadeIn">
            <div className="flex flex-col items-center justify-center py-12">
              <Info className={`w-16 h-16 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <h3 className={`text-xl font-semibold mt-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {isEnglish ? 'Tab content not available' : 'Contenu non disponible'}
              </h3>
              <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {isEnglish ? 'Please select another tab or try again later.' : 'Veuillez sélectionner un autre onglet ou réessayer plus tard.'}
              </p>
            </div>
          </div>
        );
    }
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
        {/* Class Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {classData?.title}
            </h2>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {isEnglish ? 'Status:' : 'Statut:'} <span className="font-medium text-blue-600">{classData?.status}</span>
            </p>
          </div>
          
          {currentUser?.role === 'professional' && (
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button className="flex items-center py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200">
                <Trash2 className="w-4 h-4 mr-2" />
                {isEnglish ? 'Delete Class' : 'Supprimer le Cours'}
              </button>
            </div>
          )}
        </div>
        
        {/* Class Image */}
        <div className="relative rounded-xl overflow-hidden h-80 mb-6">
          <img 
            src={classData?.thumbnail} 
            alt={classData?.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-6 w-full">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-xs px-2 py-1 rounded-full bg-blue-500/80 text-white`}>
                  {classData?.domain}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full bg-purple-500/80 text-white`}>
                  {classData?.level}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-white mr-2" />
                  <span className="text-sm text-white">
                    {formatDate(classData?.date)}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-white mr-2" />
                  <span className="text-sm text-white">
                    {classData?.attendees} / {classData?.maxAttendees}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
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
        
        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </ProfessionalLayout>
  );
};

export default Classe;