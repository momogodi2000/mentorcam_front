import React, { useState, useEffect } from 'react';
import InstitutionLayout from '../institut_layout';
import { 
  Search, Filter, Plus, MoreVertical, UserCheck, Users, 
  Calendar, Clock, Star, ChevronDown, RefreshCw, MessageSquare,
  Sparkles, BookOpen, Target, BarChart, Award, Video
} from 'lucide-react';

const Mentorship = () => {
  const [isEnglish, setIsEnglish] = useState(false);
  const [selectedView, setSelectedView] = useState('active');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Sample mentorship data
  const mentorshipPrograms = [
    {
      id: 1,
      title: 'Software Development Career Path',
      mentor: 'Dr. Alice Johnson',
      expertise: 'Full Stack Development',
      duration: '6 months',
      mentees: 8,
      rating: 4.8,
      sessions: 24,
      status: 'active',
      nextSession: '2025-02-15',
      description: 'Comprehensive mentorship program covering modern web development practices and career guidance.',
      topics: ['React', 'Node.js', 'Career Planning']
    },
    {
      id: 2,
      title: 'Digital Marketing Mastery',
      mentor: 'Jean-Pierre Kouam',
      expertise: 'Digital Marketing',
      duration: '3 months',
      mentees: 12,
      rating: 4.6,
      sessions: 12,
      status: 'active',
      nextSession: '2025-02-18',
      description: 'Strategic digital marketing mentorship focusing on African markets.',
      topics: ['SEO', 'Social Media', 'Content Strategy']
    },
    {
      id: 3,
      title: 'Business Leadership Program',
      mentor: 'Sarah Mbarga',
      expertise: 'Business Management',
      duration: '4 months',
      mentees: 6,
      rating: 4.9,
      sessions: 16,
      status: 'upcoming',
      nextSession: '2025-03-01',
      description: 'Executive mentorship program for emerging business leaders in Cameroon.',
      topics: ['Leadership', 'Strategy', 'Innovation']
    }
  ];

  const mentorshipStats = [
    {
      title: isEnglish ? 'Active Programs' : 'Programmes Actifs',
      value: '15',
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      title: isEnglish ? 'Total Mentees' : 'Total Mentorés',
      value: '124',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: isEnglish ? 'Success Rate' : 'Taux de Réussite',
      value: '92%',
      icon: Target,
      color: 'bg-purple-500'
    },
    {
      title: isEnglish ? 'Avg. Rating' : 'Note Moyenne',
      value: '4.8',
      icon: Star,
      color: 'bg-yellow-500'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-2 dark:text-white">{value}</h3>
        </div>
        <div className={`${color} p-4 rounded-full`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const MentorshipCard = ({ program }) => {
    const statusColors = {
      active: 'text-green-500 bg-green-50 dark:bg-green-900/20',
      upcoming: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
      completed: 'text-gray-500 bg-gray-50 dark:bg-gray-900/20'
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold dark:text-white">{program.title}</h3>
            <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
              <UserCheck className="w-4 h-4 mr-2" />
              {program.mentor}
              <span className="mx-2">•</span>
              <Sparkles className="w-4 h-4 mr-2" />
              {program.expertise}
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
          {program.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {program.topics.map((topic, index) => (
            <span key={index} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
              {topic}
            </span>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{program.duration}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 mr-1" />
            <span className="text-sm">{program.mentees} mentees</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Video className="w-4 h-4 mr-1" />
            <span className="text-sm">{program.sessions} sessions</span>
          </div>
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 mr-1 fill-current" />
            <span className="text-sm">{program.rating}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {isEnglish ? 'Next Session: ' : 'Prochaine Session: '}{program.nextSession}
            </span>
          </div>
          <button className="flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
            <MessageSquare className="w-4 h-4 mr-1" />
            {isEnglish ? 'Contact' : 'Contacter'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <InstitutionLayout isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">
              {isEnglish ? 'Mentorship Programs' : 'Programmes de Mentorat'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {isEnglish 
                ? 'Manage and track your mentorship programs'
                : 'Gérez et suivez vos programmes de mentorat'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <Filter className="w-4 h-4 mr-2" />
              {isEnglish ? 'Filters' : 'Filtres'}
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
              <Plus className="w-4 h-4 mr-2" />
              {isEnglish ? 'New Program' : 'Nouveau Programme'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentorshipStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm animate-slideDown">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isEnglish ? 'Expertise Area' : 'Domaine d\'Expertise'}
                </label>
                <select className="w-full p-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700">
                  <option>{isEnglish ? 'All Areas' : 'Tous les domaines'}</option>
                  <option>Development</option>
                  <option>Marketing</option>
                  <option>Business</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isEnglish ? 'Duration' : 'Durée'}
                </label>
                <select className="w-full p-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700">
                  <option>{isEnglish ? 'Any Duration' : 'Toute durée'}</option>
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>1 year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isEnglish ? 'Status' : 'Statut'}
                </label>
                <select className="w-full p-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700">
                  <option>{isEnglish ? 'All Status' : 'Tous les statuts'}</option>
                  <option>{isEnglish ? 'Active' : 'Actif'}</option>
                  <option>{isEnglish ? 'Upcoming' : 'À venir'}</option>
                  <option>{isEnglish ? 'Completed' : 'Terminé'}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Program Listings */}
        <div className="grid grid-cols-1 gap-6">
          {mentorshipPrograms.map(program => (
            <MentorshipCard key={program.id} program={program} />
          ))}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-spin">
              <RefreshCw className="w-8 h-8 text-white" />
            </div>
          </div>
        )}
      </div>
    </InstitutionLayout>
  );
};

export default Mentorship;