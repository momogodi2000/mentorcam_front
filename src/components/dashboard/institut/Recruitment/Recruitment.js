import React, { useState, useEffect } from 'react';
import InstitutionLayout from '../institut_layout';
import { 
  Search, Filter, Plus, MoreVertical, Briefcase, Users, 
  Building, Clock, Calendar, MapPin, ChevronDown, RefreshCw,
  CheckCircle2, XCircle, AlertCircle, DollarSign
} from 'lucide-react';

const Recruitment = () => {
  const [isEnglish, setIsEnglish] = useState(false);
  const [selectedTab, setSelectedTab] = useState('active');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Sample job data - In a real app, this would come from an API
  const jobListings = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'Douala, Cameroon',
      type: 'Full-time',
      salary: '1,500,000 - 2,500,000 XAF',
      applicants: 45,
      status: 'active',
      deadline: '2025-03-15',
      posted: '2025-02-01'
    },
    {
      id: 2,
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Yaoundé, Cameroon',
      type: 'Full-time',
      salary: '1,200,000 - 1,800,000 XAF',
      applicants: 28,
      status: 'active',
      deadline: '2025-03-20',
      posted: '2025-02-05'
    },
    {
      id: 3,
      title: 'Financial Analyst',
      department: 'Finance',
      location: 'Douala, Cameroon',
      type: 'Contract',
      salary: '1,000,000 - 1,500,000 XAF',
      applicants: 32,
      status: 'closed',
      deadline: '2025-02-10',
      posted: '2025-01-15'
    }
  ];

  const recruitmentStats = [
    {
      title: isEnglish ? 'Active Jobs' : 'Postes Actifs',
      value: '12',
      icon: Briefcase,
      color: 'bg-blue-500'
    },
    {
      title: isEnglish ? 'Total Applicants' : 'Candidats Totaux',
      value: '245',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: isEnglish ? 'Departments' : 'Départements',
      value: '8',
      icon: Building,
      color: 'bg-purple-500'
    },
    {
      title: isEnglish ? 'Time to Hire' : 'Délai de Recrutement',
      value: '18d',
      icon: Clock,
      color: 'bg-orange-500'
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

  const JobCard = ({ job }) => {
    const statusColors = {
      active: 'text-green-500 bg-green-50 dark:bg-green-900/20',
      closed: 'text-red-500 bg-red-50 dark:bg-red-900/20',
      draft: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold dark:text-white">{job.title}</h3>
            <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
              <Building className="w-4 h-4 mr-2" />
              {job.department}
              <MapPin className="w-4 h-4 ml-4 mr-2" />
              {job.location}
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
            {job.type}
          </span>
          <span className={`px-3 py-1 text-sm rounded-full ${statusColors[job.status]}`}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <DollarSign className="w-4 h-4 mr-1" />
            <span className="text-sm">{job.salary}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 mr-1" />
            <span className="text-sm">{job.applicants} {isEnglish ? 'applicants' : 'candidats'}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-1" />
              {isEnglish ? 'Posted: ' : 'Publié le: '}{job.posted}
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              {isEnglish ? 'Deadline: ' : 'Date limite: '}{job.deadline}
            </div>
          </div>
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
              {isEnglish ? 'Recruitment Management' : 'Gestion du Recrutement'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {isEnglish 
                ? 'Manage your job listings and track applications'
                : 'Gérez vos offres d\'emploi et suivez les candidatures'}
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
              {isEnglish ? 'New Job' : 'Nouvelle Offre'}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recruitmentStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm animate-slideDown">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isEnglish ? 'Department' : 'Département'}
                </label>
                <select className="w-full p-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700">
                  <option>{isEnglish ? 'All Departments' : 'Tous les départements'}</option>
                  <option>Engineering</option>
                  <option>Marketing</option>
                  <option>Finance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isEnglish ? 'Location' : 'Localisation'}
                </label>
                <select className="w-full p-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700">
                  <option>{isEnglish ? 'All Locations' : 'Toutes les localisations'}</option>
                  <option>Douala</option>
                  <option>Yaoundé</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isEnglish ? 'Job Type' : 'Type de Poste'}
                </label>
                <select className="w-full p-2 border dark:border-gray-700 rounded-lg dark:bg-gray-700">
                  <option>{isEnglish ? 'All Types' : 'Tous les types'}</option>
                  <option>{isEnglish ? 'Full-time' : 'Temps plein'}</option>
                  <option>{isEnglish ? 'Part-time' : 'Temps partiel'}</option>
                  <option>{isEnglish ? 'Contract' : 'Contrat'}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b dark:border-gray-700">
          <nav className="flex space-x-8">
            {['active', 'draft', 'closed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`py-4 px-1 relative ${
                  selectedTab === tab
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {selectedTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobListings
            .filter(job => job.status === selectedTab)
            .map(job => (
              <JobCard key={job.id} job={job} />
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

export default Recruitment;