import React, { useState, useEffect } from 'react';
import { Search, Briefcase, MapPin, DollarSign, Calendar, Filter, ChevronDown, ChevronUp, BookOpen, Users, Clock } from 'lucide-react';
import BeginnerLayout from '../biginner_layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../../ui/dialog_2';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Badge } from '../../../ui/badge';
import { fetchAllJobs, submitJobApplication } from '../../../services/biginner/find_job';
import { toast } from '../../../ui/use-toast_2';

const JobApplicant = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    isActive: true,
    experience: '',
    salary: ''
  });
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await fetchAllJobs(filters, searchTerm);
      setJobs(jobsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load jobs. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [filters, searchTerm]);

  const handleApply = async (job) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('cover_letter', coverLetter);
      if (resume) {
        formData.append('resume', resume);
      }

      await submitJobApplication(job.id, formData);
      
      setShowApplicationModal(false);
      setCoverLetter('');
      setResume(null);
      toast({
        title: "Success",
        description: "Your application has been submitted successfully!",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const jobTypes = ['Full-time', 'Contract', 'Remote', 'Part-time', 'Internship'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
  const salaryRanges = ['$0-$50k', '$50k-$100k', '$100k-$150k', '$150k+'];
  
  return (
    <BeginnerLayout 
      isDarkMode={isDarkMode} 
      setIsDarkMode={setIsDarkMode} 
      isEnglish={isEnglish} 
      setIsEnglish={setIsEnglish}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header Section */}
        <div className="mb-12 space-y-4">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Discover Your Next Career
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                {jobs.length} opportunities waiting for you
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                className="w-12 h-12 p-2"
              >
                <div className="grid grid-cols-2 gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-current rounded" />
                  ))}
                </div>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className="w-12 h-12 p-2"
              >
                <div className="space-y-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-full h-2 bg-current rounded" />
                  ))}
                </div>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <BookOpen className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <Users className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Companies</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {new Set(jobs.map(job => job.company)).size}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <Clock className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">New Today</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {jobs.filter(job => job.posted_date_display === 'Today').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="mb-8 space-y-4 sticky top-0 bg-white dark:bg-gray-900 z-10 p-4 rounded-xl shadow-sm">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, or keywords..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white transition-all hover:border-blue-500"
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="">Job Type</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white transition-all hover:border-blue-500"
                value={filters.experience}
                onChange={(e) => setFilters({...filters, experience: e.target.value})}
              >
                <option value="">Experience</option>
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <select
                className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white transition-all hover:border-blue-500"
                value={filters.salary}
                onChange={(e) => setFilters({...filters, salary: e.target.value})}
              >
                <option value="">Salary Range</option>
                {salaryRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Jobs List */}
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}`}>
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="col-span-full text-center py-12 animate-fade-in">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No jobs found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            jobs.map((job, index) => (
              <div
                key={job.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all transform hover:-translate-y-1 animate-fade-in overflow-hidden group ${
                  viewMode === 'list' ? 'flex flex-col md:flex-row md:items-center' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300 mb-4">
                        <span className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {job.company}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {job.salary}
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant={job.type === 'Full-time' ? 'default' : 'secondary'}
                      className="animate-pulse-slow"
                    >
                      {job.type}
                    </Badge>
                  </div>
                  
                  <div className={`mt-4 transition-all duration-300 ${expandedJob === job.id ? '' : 'line-clamp-3'}`}>
                    <p className="text-gray-600 dark:text-gray-300">
                      {job.description}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
                    <button
                      onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                      className="text-blue-600 dark:text-blue-400 text-sm flex items-center hover:text-blue-700 transition-colors"
                    >
                      {expandedJob === job.id ? (
                        <>Show less <ChevronUp className="ml-1 w-4 h-4" /></>
                      ) : (
                        <>Show more <ChevronDown className="ml-1 w-4 h-4" /></>
                      )}
                    </button>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Posted {job.posted_date_display}
                      </span>
                      <Button
                        onClick={() => {
                          setSelectedJob(job);
                          setShowApplicationModal(true);
                        }}
                        className="transition-all hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Enhanced Application Modal */}
        <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Apply for {selectedJob?.title}
              </DialogTitle>
              <DialogDescription className="text-lg">
                Complete your application for {selectedJob?.company}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-6">
              {/* Job Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Position Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span>{selectedJob?.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{selectedJob?.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span>{selectedJob?.salary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Posted {selectedJob?.posted_date_display}</span>
                  </div>
                </div>
              </div>

              {/* Application Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cover Letter
                  </label>
                  <div className="relative">
                    <textarea
                      className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all min-h-[200px] resize-none"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Why are you a good fit for this position? Share your relevant experience and motivation..."
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                      {coverLetter.length}/2000
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Resume
                  </label>
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                    {resume ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {resume.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setResume(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Input
                          type="file"
                          onChange={(e) => setResume(e.target.files[0])}
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          id="resume-upload"
                        />
                        <label
                          htmlFor="resume-upload"
                          className="cursor-pointer block"
                        >
                          <div className="text-gray-500 dark:text-gray-400">
                            <p>Drag and drop your resume here or</p>
                            <p className="text-blue-500 hover:text-blue-600 transition-colors">
                              browse files
                            </p>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            Supported formats: PDF, DOC, DOCX (Max 5MB)
                          </p>
                        </label>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowApplicationModal(false)}
                  disabled={submitting}
                  className="w-32"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleApply(selectedJob)}
                  disabled={submitting || !coverLetter.trim() || !resume}
                  className="w-32 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </BeginnerLayout>
  );
};

export default JobApplicant;