import React, { useState } from 'react';
import { Search, Filter, Plus, Briefcase, MapPin, Clock, Users, ChevronRight, ArrowUpRight } from 'lucide-react';
import InstitutionLayout from '../institut_layout';

const JobCard = ({ job, isEnglish }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          job.type === 'Full-time' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
          'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
        }`}>
          {job.type}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{job.location}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-2" />
          <span className="text-sm">{isEnglish ? 'Posted' : 'Publié'} {job.postedDate}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <Users className="w-4 h-4 mr-2" />
          <span className="text-sm">{job.applicants} {isEnglish ? 'applicants' : 'candidats'}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex -space-x-2">
          {job.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              {skill}
            </span>
          ))}
        </div>
        <ArrowUpRight className={`w-5 h-5 transition-all duration-300 ${
          isHovered ? 'text-blue-600 transform translate-x-1 -translate-y-1' : 'text-gray-400'
        }`} />
      </div>
    </div>
  );
};

const JobOffers = () => {
  const [isEnglish] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const jobOffers = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp',
      type: 'Full-time',
      location: 'Douala, Cameroon',
      postedDate: '2 days ago',
      applicants: 45,
      skills: ['React', 'Node.js']
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      company: 'DigitalCraft',
      type: 'Contract',
      location: 'Yaoundé, Cameroon',
      postedDate: '1 week ago',
      applicants: 28,
      skills: ['Figma', 'UI/UX']
    },
    {
      id: 3,
      title: 'Product Manager',
      company: 'InnovateHub',
      type: 'Full-time',
      location: 'Remote',
      postedDate: '3 days ago',
      applicants: 56,
      skills: ['Agile', 'Scrum']
    }
  ];

  const filters = [
    { id: 'all', label: isEnglish ? 'All Jobs' : 'Tous les emplois' },
    { id: 'fulltime', label: isEnglish ? 'Full-time' : 'Temps plein' },
    { id: 'contract', label: isEnglish ? 'Contract' : 'Contrat' },
    { id: 'remote', label: isEnglish ? 'Remote' : 'Télétravail' }
  ];

  return (
    <InstitutionLayout isEnglish={isEnglish}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isEnglish ? 'Job Offers' : 'Offres d\'emploi'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEnglish ? 'Find and manage your job postings' : 'Trouvez et gérez vos offres d\'emploi'}
            </p>
          </div>
          <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300">
            <Plus className="w-5 h-5 mr-2" />
            {isEnglish ? 'Post New Job' : 'Publier une offre'}
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={isEnglish ? "Search job offers..." : "Rechercher des offres..."}
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

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobOffers.map((job) => (
            <JobCard key={job.id} job={job} isEnglish={isEnglish} />
          ))}
        </div>
      </div>
    </InstitutionLayout>
  );
};

export default JobOffers;