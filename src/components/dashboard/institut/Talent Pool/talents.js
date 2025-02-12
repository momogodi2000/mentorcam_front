import React, { useState } from 'react';
import { 
  Search, Filter, Star, MapPin, Briefcase, GraduationCap, 
  Users, Mail, Phone, Download, ArrowUpRight, Award, 
  ChevronDown, MessageSquare, UserPlus, BarChart2, Target,
  Calendar, CheckCircle, SlidersHorizontal, X
} from 'lucide-react';
import InstitutionLayout from '../institut_layout';

const SkillBadge = ({ skill, level }) => {
  const getSkillColor = () => {
    switch (level) {
      case 'expert':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSkillColor()}`}>
      {skill}
    </span>
  );
};

const TalentCard = ({ talent, isEnglish }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img 
                src="/api/placeholder/100/100"
                alt={talent.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
              {talent.isOnline && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {talent.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{talent.title}</p>
            </div>
          </div>
          {talent.rating && (
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                {talent.rating}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{talent.location}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Briefcase className="w-4 h-4 mr-2" />
            <span className="text-sm">{talent.experience} {isEnglish ? 'years experience' : 'ans d\'expérience'}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <GraduationCap className="w-4 h-4 mr-2" />
            <span className="text-sm">{talent.education}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {talent.skills.map((skill, index) => (
            <SkillBadge key={index} skill={skill.name} level={skill.level} />
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {talent.certifications.map((cert, index) => (
            <div key={index} className="flex items-center text-gray-600 dark:text-gray-400">
              <Award className="w-4 h-4 mr-1" />
              <span className="text-sm">{cert}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {talent.bio}
        </p>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              <Mail className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
          <button className="flex items-center text-blue-600 dark:text-blue-400 hover:underline">
            <span className="mr-1">{isEnglish ? 'View Profile' : 'Voir le profil'}</span>
            <ArrowUpRight className={`w-4 h-4 transition-all duration-300 ${
              isHovered ? 'transform translate-x-1 -translate-y-1' : ''
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, trend }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
      {trend && (
        <span className={`px-2 py-1 rounded-full text-sm ${
          trend > 0 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        }`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
  </div>
);

const TalentPool = () => {
  const [isEnglish] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const talents = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Senior Software Engineer',
      location: 'Douala, Cameroon',
      experience: 5,
      education: 'MSc Computer Science',
      isOnline: true,
      rating: 4.8,
      skills: [
        { name: 'React', level: 'expert' },
        { name: 'Node.js', level: 'expert' },
        { name: 'Python', level: 'intermediate' }
      ],
      certifications: ['AWS Certified', 'Google Cloud Professional'],
      bio: 'Experienced software engineer with a focus on web development and cloud architecture.'
    },
    {
      id: 2,
      name: 'Jean Michel',
      title: 'UX/UI Designer',
      location: 'Yaoundé, Cameroon',
      experience: 3,
      education: 'BA Design',
      isOnline: false,
      rating: 4.5,
      skills: [
        { name: 'Figma', level: 'expert' },
        { name: 'Adobe XD', level: 'intermediate' },
        { name: 'UI Design', level: 'expert' }
      ],
      certifications: ['Google UX Design'],
      bio: 'Creative designer passionate about creating intuitive and beautiful user experiences.'
    },
    {
      id: 3,
      name: 'Robert Fono',
      title: 'Data Scientist',
      location: 'Remote',
      experience: 4,
      education: 'PhD Mathematics',
      isOnline: true,
      rating: 4.9,
      skills: [
        { name: 'Python', level: 'expert' },
        { name: 'Machine Learning', level: 'expert' },
        { name: 'SQL', level: 'intermediate' }
      ],
      certifications: ['TensorFlow Developer'],
      bio: 'Data scientist specializing in machine learning and predictive analytics.'
    }
  ];

  const filters = [
    { id: 'all', label: isEnglish ? 'All Talents' : 'Tous les talents' },
    { id: 'online', label: isEnglish ? 'Online Now' : 'En ligne' },
    { id: 'verified', label: isEnglish ? 'Verified' : 'Vérifié' },
    { id: 'available', label: isEnglish ? 'Available' : 'Disponible' }
  ];

  // Added missing skillOptions array
  const skillOptions = [
    'React',
    'Node.js',
    'Python',
    'Machine Learning',
    'UI Design',
    'UX Design',
    'SQL',
    'Cloud Architecture',
    'DevOps',
    'Mobile Development'
  ];

  return (
    <InstitutionLayout isEnglish={isEnglish}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isEnglish ? 'Talent Pool' : 'Vivier de talents'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEnglish ? 'Discover and connect with top talent' : 'Découvrez et connectez-vous avec les meilleurs talents'}
            </p>
          </div>
          <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300">
            <Download className="w-5 h-5 mr-2" />
            {isEnglish ? 'Export Talent List' : 'Exporter la liste'}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            icon={Users}
            label={isEnglish ? "Total Talents" : "Total des talents"}
            value="324"
            trend={15}
          />
          <StatCard 
            icon={CheckCircle}
            label={isEnglish ? "Verified Profiles" : "Profils vérifiés"}
            value="186"
            trend={8}
          />
          <StatCard 
            icon={Calendar}
            label={isEnglish ? "Available Now" : "Disponible maintenant"}
            value="92"
            trend={12}
          />
          <StatCard 
            icon={Target}
            label={isEnglish ? "Perfect Matches" : "Correspondances parfaites"}
            value="45"
            trend={20}
          />
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={isEnglish ? "Search talents..." : "Rechercher des talents..."}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors duration-300 ${
                  selectedFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
<div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {isEnglish ? 'Skills' : 'Compétences'}
              </h3>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => {
                    setSelectedSkills(
                      selectedSkills.includes(skill)
                        ? selectedSkills.filter(s => s !== skill)
                        : [...selectedSkills, skill]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedSkills.includes(skill)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Talent Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {talents.map((talent) => (
            <TalentCard key={talent.id} talent={talent} isEnglish={isEnglish} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {isEnglish ? 'Previous' : 'Précédent'}
          </button>
          <div className="flex items-center space-x-1">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === 3}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {isEnglish ? 'Next' : 'Suivant'}
          </button>
        </div>
      </div>
    </InstitutionLayout>
  );
};

export default TalentPool;