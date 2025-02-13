import React, { useState, useEffect } from 'react';
import { Search, Briefcase, MapPin, DollarSign, Calendar, Filter, ChevronDown, ChevronUp } from 'lucide-react';
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
    isActive: true
  });
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Add state for dark mode and language
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);

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

  const jobTypes = ['Full-time', 'Contract', 'Remote'];
  
  return (
    <BeginnerLayout 
      isDarkMode={isDarkMode} 
      setIsDarkMode={setIsDarkMode} 
      isEnglish={isEnglish} 
      setIsEnglish={setIsEnglish}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section with animation */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Job Opportunities
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Find and apply for jobs that match your skills and experience
          </p>
        </div>

        {/* Enhanced Search and Filter Section */}
        <div className="mb-8 space-y-4 animate-slide-in">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, or keywords..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              className="px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white transition-all hover:border-blue-500"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="">All Types</option>
              {jobTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Jobs List with improved animations */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
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
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all transform hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {job.title}
                      </h2>
                      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 mb-4">
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
                    <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'}>
                      {job.type}
                    </Badge>
                  </div>
                  
                  <div className={`mt-4 transition-all duration-300 ${expandedJob === job.id ? '' : 'line-clamp-3'}`}>
                    <p className="text-gray-600 dark:text-gray-300">
                      {job.description}
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
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
                        className="transition-all hover:scale-105"
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
              <DialogDescription>
                Complete your application for {selectedJob?.company}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Cover Letter
                </label>
                <textarea
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-all"
                  rows={6}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Why are you a good fit for this position?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Resume
                </label>
                <Input
                  type="file"
                  onChange={(e) => setResume(e.target.files[0])}
                  accept=".pdf,.doc,.docx"
                  className="cursor-pointer"
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowApplicationModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => handleApply(selectedJob)}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
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