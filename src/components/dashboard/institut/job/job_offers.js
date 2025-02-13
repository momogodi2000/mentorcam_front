import React, { useState, useEffect } from 'react';
import { Search, Plus, Briefcase, MapPin, Clock, Users, ArrowUpRight, X, DollarSign, Calendar, Building } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../ui/dialog_2';
import { Alert, AlertDescription } from '../../../ui/alert';
import InstitutionLayout from '../institut_layout';
import { motion, AnimatePresence } from 'framer-motion';
import JobService from '../../../services/institute/job_services';

// JobCard Component remains the same
const JobCard = ({ job, isEnglish, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(job)}
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
          job.type === 'Remote' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
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
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <DollarSign className="w-4 h-4 mr-2" />
          <span className="text-sm">{job.salary}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-wrap gap-2">
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
    </motion.div>
  );
};

// Updated NewJobModal Component with API integration
const NewJobModal = ({ isOpen, onClose, isEnglish, onJobCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    type: 'Full-time',
    location: '',
    salary: '',
    description: '',
    requirements: '',
    skills: []
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await JobService.createJob(formData);
      onJobCreated();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating job offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEnglish ? 'Post New Job Offer' : 'Publier une nouvelle offre d\'emploi'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {isEnglish ? 'Job Title' : 'Titre du poste'}
              </label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {isEnglish ? 'Company' : 'Entreprise'}
              </label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {isEnglish ? 'Job Type' : 'Type de poste'}
              </label>
              <select
                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {isEnglish ? 'Location' : 'Lieu'}
              </label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {isEnglish ? 'Salary' : 'Salaire'}
              </label>
              <input
                type="text"
                className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {isEnglish ? 'Description' : 'Description'}
            </label>
            <textarea
              className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {isEnglish ? 'Cancel' : 'Annuler'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (isEnglish ? 'Posting...' : 'Publication...') : (isEnglish ? 'Post Job' : 'Publier l\'offre')}
            </button>
          </div>
          {error && (
            <Alert className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Updated Main JobOffers Component with API integration
const JobOffers = () => {
  const [isEnglish] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = async (filters = {}) => {
    try {
      setLoading(true);
      const data = await JobService.getAllJobs(filters);
      setJobs(data);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        const results = await JobService.searchJobs(searchQuery);
        setJobs(results);
      } catch (error) {
        setError('Error searching jobs');
      }
    } else {
      fetchJobs();
    }
  };

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(debounceSearch);
  }, [searchQuery]);

  const handleJobSelect = async (jobId) => {
    try {
      const jobDetails = await JobService.getJobById(jobId);
      setSelectedJob(jobDetails);
    } catch (error) {
      setError('Error fetching job details');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm(isEnglish ? 'Are you sure you want to delete this job?' : 'Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      try {
        await JobService.deleteJob(jobId);
        fetchJobs();
      } catch (error) {
        setError('Error deleting job');
      }
    }
  };

  const filters = [
    { id: 'all', label: isEnglish ? 'All Jobs' : 'Tous les emplois' },
    { id: 'fulltime', label: isEnglish ? 'Full-time' : 'Temps plein' },
    { id: 'contract', label: isEnglish ? 'Contract' : 'Contrat' },
    { id: 'remote', label: isEnglish ? 'Remote' : 'Télétravail' }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = selectedFilter === 'all' || 
      job.type.toLowerCase().includes(selectedFilter.toLowerCase());
    return matchesFilter;
  });

  if (loading) {
    return (
      <InstitutionLayout isEnglish={isEnglish}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </InstitutionLayout>
    );
  }

  return (
    <InstitutionLayout isEnglish={isEnglish}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <Alert className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isEnglish ? 'Job Offers' : 'Offres d\'emploi'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEnglish ? 'Find and manage your job postings' : 'Trouvez et gérez vos offres d\'emploi'}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            {isEnglish ? 'Post New Job' : 'Publier une offre'}
          </motion.button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEnglish ? "Search job offers..." : "Rechercher des offres..."}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors duration-300 ${
                  selectedFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {filter.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Job Cards Grid */}
        <AnimatePresence>
          {filteredJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <Alert>
                <AlertDescription>
                  {isEnglish 
                    ? 'No job offers found matching your criteria.' 
                    : 'Aucune offre d\'emploi ne correspond à vos critères.'}
                </AlertDescription>
              </Alert>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredJobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    isEnglish={isEnglish}
                    onSelect={(job) => handleJobSelect(job.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Job Details Modal */}
        <Dialog 
          open={selectedJob !== null} 
          onOpenChange={() => setSelectedJob(null)}
        >
          <DialogContent className="sm:max-w-[600px]">
            {selectedJob && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>{selectedJob.title}</span>
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Building className="w-5 h-5 text-gray-500" />
                    <span className="text-lg font-medium">{selectedJob.company}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{selectedJob.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span>{selectedJob.salary}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{selectedJob.postedDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>{selectedJob.applicants} {isEnglish ? 'applicants' : 'candidats'}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">{isEnglish ? 'Required Skills' : 'Compétences requises'}</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">{isEnglish ? 'Description' : 'Description'}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{selectedJob.description}</p>
                  </div>
                  
                  {/* View Applicants Button */}
                  <button
                    onClick={() => window.location.href = `/job_applicant/${selectedJob.id}`}
                    className="w-full py-2 px-4 mb-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
                  >
                    {isEnglish ? 'View Applicants' : 'Voir les candidats'}
                  </button>
                  
                  {/* Delete Job Button */}
                  <button
                    onClick={() => handleDeleteJob(selectedJob.id)}
                    className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                  >
                    {isEnglish ? 'Delete Job' : 'Supprimer l\'offre'}
                  </button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* New Job Modal */}
        <NewJobModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          isEnglish={isEnglish} 
          onJobCreated={() => fetchJobs()}
        />
      </div>
    </InstitutionLayout>
  );
};

export default JobOffers;