import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Badge } from '../../../ui/badge';
import { 
  Calendar, Clock, User, Video, MessageSquare, BookOpen, 
  Filter, ChevronRight, ChevronDown, MapPin, GraduationCap,
  Star, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import BeginnerLayout from '../biginner_layout';
import CourseSessionService from '../../../services/biginner/session_course_services';

const SessionsPage = ({ isDarkMode, isEnglish }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({
    type: 'all',
    date: 'week',
    status: 'all',
    field: 'all'
  });

  const [sessions, setSessions] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await CourseSessionService.getSessions(selectedFilter);
      setSessions(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [selectedFilter]);

  const handleFilterChange = (filterType, value) => {
    const newFilter = { ...selectedFilter, [filterType]: value };
    setSelectedFilter(newFilter);
    fetchSessions(newFilter);
  };

  const SessionCard = ({ session }) => {
    const handleContentAccess = async (sessionId) => {
      try {
        const content = await CourseSessionService.getSessionContent(sessionId);
        console.log(content); // For now, just log the content
      } catch (err) {
        console.error(err); // Handle error (e.g., show error message)
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="mb-4 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4">
              {/* Header Section */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg text-gray-900 dark:text-white">
                      {session.mentorName}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <p className="text-blue-600 dark:text-blue-400">{session.title}</p>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-sm">{session.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Badge variant={
                  session.status === 'confirmed' ? 'success' :
                  session.status === 'pending' ? 'warning' :
                  'secondary'
                }>
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </Badge>
              </div>

              {/* Details Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>{session.time} ({session.duration})</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4" />
                  <span>{session.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <GraduationCap className="w-4 h-4" />
                  <span>{session.field}</span>
                </div>
              </div>

              {/* Description */}
              {session.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {session.description}
                </p>
              )}

              {/* Materials & Prerequisites */}
              {session.materials && (
                <div className="flex flex-wrap gap-2">
                  {session.materials.map((material, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {material}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Price and Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {session.price}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleContentAccess(session.id)}
                    className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
                  >
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-300">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300">
                    <BookOpen className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Past Session Feedback */}
              {session.feedback && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{session.feedback}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          {isEnglish ? 'My Learning Sessions' : 'Mes Sessions d\'Apprentissage'}
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <Filter className="w-5 h-5 mr-2" />
            {isEnglish ? 'Filter' : 'Filtrer'}
            {isFilterOpen ? <ChevronDown className="ml-2 w-4 h-4" /> : <ChevronRight className="ml-2 w-4 h-4" />}
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {isEnglish ? 'Schedule New Session' : 'Planifier une Nouvelle Session'}
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isEnglish ? 'Session Type' : 'Type de Session'}
                  </label>
                  <select 
                    className="w-full p-2 border rounded-lg dark:bg-gray-700"
                    value={selectedFilter.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    <option value="all">{isEnglish ? 'All Types' : 'Tous les Types'}</option>
                    <option value="video">{isEnglish ? 'Video Call' : 'Appel Vidéo'}</option>
                    <option value="in-person">{isEnglish ? 'In-Person' : 'En Personne'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isEnglish ? 'Field' : 'Domaine'}
                  </label>
                  <select 
                    className="w-full p-2 border rounded-lg dark:bg-gray-700"
                    value={selectedFilter.field}
                    onChange={(e) => handleFilterChange('field', e.target.value)}
                  >
                    <option value="all">{isEnglish ? 'All Fields' : 'Tous les Domaines'}</option>
                    <option value="web">{isEnglish ? 'Web Development' : 'Développement Web'}</option>
                    <option value="mobile">{isEnglish ? 'Mobile Development' : 'Développement Mobile'}</option>
                    <option value="marketing">{isEnglish ? 'Digital Marketing' : 'Marketing Digital'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isEnglish ? 'Date Range' : 'Période'}
                  </label>
                  <select 
                    className="w-full p-2 border rounded-lg dark:bg-gray-700"
                    value={selectedFilter.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                  >
                    <option value="week">{isEnglish ? 'This Week' : 'Cette Semaine'}</option>
                    <option value="month">{isEnglish ? 'This Month' : 'Ce Mois'}</option>
                    <option value="custom">{isEnglish ? 'Custom Range' : 'Période Personnalisée'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {isEnglish ? 'Status' : 'Statut'}
                  </label>
                  <select 
                    className="w-full p-2 border rounded-lg dark:bg-gray-700"
                    value={selectedFilter.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">{isEnglish ? 'All Status' : 'Tous les Statuts'}</option>
                    <option value="confirmed">{isEnglish ? 'Confirmed' : 'Confirmé'}</option>
                    <option value="pending">{isEnglish ? 'Pending' : 'En Attente'}</option>
                    <option value="completed">{isEnglish ? 'Completed' : 'Terminé'}</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="mb-6 border-b dark:border-gray-700">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-4 relative ${
                activeTab === 'upcoming'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {isEnglish ? 'Upcoming' : 'À venir'} ({sessions.upcoming.length})
              {activeTab === 'upcoming' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`pb-4 relative ${
                activeTab === 'past'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {isEnglish ? 'Past Sessions' : 'Sessions Passées'} ({sessions.past.length})
              {activeTab === 'past' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                />
              )}
            </button>
          </div>
        </div>
  
         {/* Empty State */}
         {sessions[activeTab].length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              {isEnglish ? 'No sessions found' : 'Aucune session trouvée'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {isEnglish 
                ? 'Get started by scheduling a new session with a mentor'
                : 'Commencez par planifier une nouvelle session avec un mentor'}
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              {isEnglish ? 'Find a Mentor' : 'Trouver un Mentor'}
            </button>
          </div>
        )}
  
        {/* Session Cards */}
        <div className="space-y-4">
          {sessions[activeTab].map(session => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </div>
    );
  };
  
  // Wrap the SessionsPage with BeginnerLayout
  const SessionsPageWithLayout = () => {
    // Move state management to the wrapper component
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isEnglish, setIsEnglish] = useState(true);
  
    return (
      <BeginnerLayout
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isEnglish={isEnglish}
        setIsEnglish={setIsEnglish}
      >
        <SessionsPage 
          isDarkMode={isDarkMode}
          isEnglish={isEnglish}
          setIsDarkMode={setIsDarkMode}
          setIsEnglish={setIsEnglish}
        />
      </BeginnerLayout>
    );
  };
  export default SessionsPageWithLayout;