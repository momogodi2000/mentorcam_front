import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  Users,
  Calendar,
  Play,
  Pause,
  Plus,
  ChevronRight,
  Edit,
  Trash2,
  Clock,
  Eye,
  Star,
  Filter,
  Search,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import ProfessionalLayout from '../professionnal_layout';
import { getUser } from '../../../services/get_user';

const OnlineClasses = ({ isDarkMode, setIsDarkMode, isEnglish, setIsEnglish }) => {
  const navigate = useNavigate();
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [pastClasses, setPastClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentUser, setCurrentUser] = useState(null);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchClasses = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockUpcomingClasses = [
          {
            id: 1,
            title: isEnglish ? 'Advanced Web Development' : 'Développement Web Avancé',
            date: '2025-02-20T15:00:00',
            duration: 120,
            attendees: 24,
            thumbnail: '/api/placeholder/380/200',
            domain: isEnglish ? 'Programming' : 'Programmation',
            rating: 4.7,
            viewCount: 154
          },
          {
            id: 2,
            title: isEnglish ? 'Digital Marketing Strategies' : 'Stratégies de Marketing Digital',
            date: '2025-02-22T10:00:00',
            duration: 90,
            attendees: 18,
            thumbnail: '/api/placeholder/380/200',
            domain: isEnglish ? 'Marketing' : 'Marketing',
            rating: 4.5,
            viewCount: 132
          },
          {
            id: 3,
            title: isEnglish ? 'UX/UI Design Fundamentals' : 'Fondamentaux du Design UX/UI',
            date: '2025-02-25T14:00:00',
            duration: 105,
            attendees: 15,
            thumbnail: '/api/placeholder/380/200',
            domain: isEnglish ? 'Design' : 'Design',
            rating: 4.8,
            viewCount: 98
          }
        ];

        const mockPastClasses = [
          {
            id: 4,
            title: isEnglish ? 'Introduction to Python' : 'Introduction à Python',
            date: '2025-01-15T13:00:00',
            duration: 120,
            attendees: 32,
            thumbnail: '/api/placeholder/380/200',
            domain: isEnglish ? 'Programming' : 'Programmation',
            rating: 4.9,
            viewCount: 248
          },
          {
            id: 5,
            title: isEnglish ? 'Mobile App Development with React Native' : 'Développement d\'App Mobile avec React Native',
            date: '2025-01-28T11:00:00',
            duration: 150,
            attendees: 27,
            thumbnail: '/api/placeholder/380/200',
            domain: isEnglish ? 'Programming' : 'Programmation',
            rating: 4.6,
            viewCount: 187
          }
        ];

        setUpcomingClasses(mockUpcomingClasses);
        setPastClasses(mockPastClasses);
        setLoading(false);
      }, 1000);
    };

    fetchUser();
    fetchClasses();
  }, [isEnglish]);

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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterBy(e.target.value);
  };

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortDirection('asc');
    }
  };

  const filterAndSortClasses = (classes) => {
    // First apply filtering
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

    // Then apply sorting
    filteredClasses.sort((a, b) => {
      if (sortBy === 'date') {
        return sortDirection === 'asc'
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'title') {
        return sortDirection === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'attendees') {
        return sortDirection === 'asc'
          ? a.attendees - b.attendees
          : b.attendees - a.attendees;
      } else if (sortBy === 'rating') {
        return sortDirection === 'asc'
          ? a.rating - b.rating
          : b.rating - a.rating;
      } else if (sortBy === 'views') {
        return sortDirection === 'asc'
          ? a.viewCount - b.viewCount
          : b.viewCount - a.viewCount;
      }
      return 0;
    });

    return filteredClasses;
  };

  const upcomingClassesFiltered = filterAndSortClasses(upcomingClasses);
  const pastClassesFiltered = filterAndSortClasses(pastClasses);

  const allDomains = [...new Set([...upcomingClasses, ...pastClasses].map(c => c.domain))];

  return (
    <ProfessionalLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {isEnglish ? 'Online Classes' : 'Cours en Ligne'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {isEnglish 
                ? `Manage your virtual classroom sessions and engage with students online`
                : `Gérez vos sessions de classe virtuelle et interagissez avec les étudiants en ligne`}
            </p>
          </div>
          <button
            className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            {isEnglish ? 'Create New Class' : 'Créer un Nouveau Cours'}
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={isEnglish ? "Search classes..." : "Rechercher des cours..."}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterBy}
              onChange={handleFilterChange}
              className="w-full appearance-none pl-10 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white bg-transparent"
            >
              <option value="all">{isEnglish ? "All Domains" : "Tous les Domaines"}</option>
              {allDomains.map((domain, index) => (
                <option key={index} value={domain}>{domain}</option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400" />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleSort('date')}
              className={`flex items-center px-3 py-2 rounded-lg border ${
                sortBy === 'date' 
                  ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-300' 
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Calendar className="w-4 h-4 mr-1" />
              {isEnglish ? "Date" : "Date"}
              {sortBy === 'date' && (
                sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />
              )}
            </button>
            
            <button
              onClick={() => handleSort('attendees')}
              className={`flex items-center px-3 py-2 rounded-lg border ${
                sortBy === 'attendees' 
                  ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-300' 
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Users className="w-4 h-4 mr-1" />
              {isEnglish ? "Attendees" : "Participants"}
              {sortBy === 'attendees' && (
                sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />
              )}
            </button>
            
            <button
              onClick={() => handleSort('rating')}
              className={`flex items-center px-3 py-2 rounded-lg border ${
                sortBy === 'rating' 
                  ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900 dark:border-blue-800 dark:text-blue-300' 
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Star className="w-4 h-4 mr-1" />
              {isEnglish ? "Rating" : "Évaluation"}
              {sortBy === 'rating' && (
                sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />
              )}
            </button>
          </div>
        </div>

        {/* Upcoming Classes Section */}
        <section className="mb-10 animate-fade-in">
          <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {isEnglish ? 'Upcoming Classes' : 'Cours à Venir'}
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`rounded-lg overflow-hidden shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="h-48 bg-gray-300 dark:bg-gray-700 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-5/6" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : upcomingClassesFiltered.length === 0 ? (
            <div className={`text-center py-8 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Video className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                {isEnglish ? 'No upcoming classes match your search criteria' : 'Aucun cours à venir ne correspond à vos critères de recherche'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingClassesFiltered.map((classItem) => (
                <div 
                  key={classItem.id}
                  className={`rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:scale-102 hover:shadow-lg ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={classItem.thumbnail}
                      alt={classItem.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <span className="text-white text-sm font-medium px-2 py-1 rounded bg-blue-600">
                        {classItem.domain}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className={`font-semibold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {classItem.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(classItem.date)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                          {classItem.duration} {isEnglish ? 'min' : 'min'}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{classItem.attendees} {isEnglish ? 'enrolled' : 'inscrits'}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {classItem.rating}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {classItem.viewCount}
                        </span>
                      </div>
                      
                      <button
                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        onClick={() => navigate(`/class/${classItem.id}`)}
                      >
                        {isEnglish ? 'Manage' : 'Gérer'}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Classes Section */}
        <section className="animate-fade-in">
          <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {isEnglish ? 'Past Classes' : 'Cours Passés'}
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className={`rounded-lg overflow-hidden shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="h-48 bg-gray-300 dark:bg-gray-700 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-1/2" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-5/6" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : pastClassesFiltered.length === 0 ? (
            <div className={`text-center py-8 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Video className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                {isEnglish ? 'No past classes match your search criteria' : 'Aucun cours passé ne correspond à vos critères de recherche'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastClassesFiltered.map((classItem) => (
                <div 
                  key={classItem.id}
                  className={`rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:scale-102 hover:shadow-lg ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={classItem.thumbnail}
                      alt={classItem.title}
                      className="w-full h-48 object-cover filter grayscale"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="text-white text-xs px-2 py-1 rounded bg-gray-600">
                        {isEnglish ? 'Completed' : 'Terminé'}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <span className="text-white text-sm font-medium px-2 py-1 rounded bg-gray-600">
                        {classItem.domain}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className={`font-semibold text-lg mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {classItem.title}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(classItem.date)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                          {classItem.duration} {isEnglish ? 'min' : 'min'}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{classItem.attendees} {isEnglish ? 'attended' : 'présents'}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {classItem.rating}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {classItem.viewCount}
                        </span>
                      </div>
                      
                      <button
                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        onClick={() => navigate(`/class/${classItem.id}`)}
                      >
                        {isEnglish ? 'View Report' : 'Voir Rapport'}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
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