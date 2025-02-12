import React, { useState } from 'react';
import { Search, Filter, Plus, Briefcase, MapPin, Clock, Users, ChevronRight, ArrowUpRight, X, Calendar, PhoneCall, Mail, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../ui/dialog_3';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../ui/tab';
import InstitutionLayout from '../institut_layout';

const JobDetailModal = ({ job, isEnglish, onClose }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{job.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
          </div>
        </div>
        <Badge variant="outline" className="ml-2">
          {job.type}
        </Badge>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">{isEnglish ? 'Details' : 'Détails'}</TabsTrigger>
          <TabsTrigger value="company">{isEnglish ? 'Company' : 'Entreprise'}</TabsTrigger>
          <TabsTrigger value="apply">{isEnglish ? 'Apply' : 'Postuler'}</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-4">
          <div>
            <h3 className="font-semibold mb-2">{isEnglish ? 'Job Description' : 'Description du poste'}</h3>
            <p className="text-gray-600 dark:text-gray-400">{job.description}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">{isEnglish ? 'Requirements' : 'Prérequis'}</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
              {job.requirements?.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">{isEnglish ? 'Skills' : 'Compétences'}</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="company" className="space-y-4 mt-4">
          <div>
            <h3 className="font-semibold mb-2">{isEnglish ? 'About' : 'À propos'}</h3>
            <p className="text-gray-600 dark:text-gray-400">{job.companyDescription}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">{isEnglish ? 'Contact' : 'Contact'}</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{job.companyEmail}</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4" />
                <span>{job.companyPhone}</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="apply" className="space-y-4 mt-4">
          <div className="text-center space-y-4">
            <Button className="w-full">
              {isEnglish ? 'Apply Now' : 'Postuler maintenant'}
            </Button>
            <Button variant="outline" className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              {isEnglish ? 'Share Job' : 'Partager'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const JobCard = ({ job, isEnglish, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer"
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
            <Badge variant={job.type === 'Full-time' ? 'default' : 'secondary'}>
              {job.type}
            </Badge>
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
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
            <ArrowUpRight className={`w-5 h-5 transition-all duration-300 ${
              isHovered ? 'text-blue-600 transform translate-x-1 -translate-y-1' : 'text-gray-400'
            }`} />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <JobDetailModal job={job} isEnglish={isEnglish} />
      </DialogContent>
    </Dialog>
  );
};

const CreateJobModal = ({ isEnglish, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEnglish ? 'Create New Job Offer' : 'Créer une nouvelle offre d\'emploi'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Add job creation form here */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const JobOffers = () => {
  const [isEnglish] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const jobOffers = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp',
      type: 'Full-time',
      location: 'Douala, Cameroon',
      postedDate: '2 days ago',
      applicants: 45,
      skills: ['React', 'Node.js', 'PostgreSQL'],
      description: 'We are looking for a Senior Software Engineer to join our team...',
      requirements: [
        '5+ years of experience in web development',
        'Strong knowledge of React and Node.js',
        'Experience with cloud services (AWS/GCP)'
      ],
      companyDescription: 'TechCorp is a leading software company in Cameroon...',
      companyEmail: 'careers@techcorp.cm',
      companyPhone: '+237 6XX XXX XXX'
    },
    // Add more job offers...
  ];

  const filters = [
    { id: 'all', label: isEnglish ? 'All Jobs' : 'Tous les emplois' },
    { id: 'fulltime', label: isEnglish ? 'Full-time' : 'Temps plein' },
    { id: 'contract', label: isEnglish ? 'Contract' : 'Contrat' },
    { id: 'remote', label: isEnglish ? 'Remote' : 'Télétravail' }
  ];

  return (
    <InstitutionLayout isEnglish={isEnglish}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isEnglish ? 'Job Offers' : 'Offres d\'emploi'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEnglish ? 'Find and manage your job postings' : 'Trouvez et gérez vos offres d\'emploi'}
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="mt-4 md:mt-0">
            <Plus className="w-5 h-5 mr-2" />
            {isEnglish ? 'Post New Job' : 'Publier une offre'}
          </Button>
        </div>

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
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? 'default' : 'outline'}
                onClick={() => setSelectedFilter(filter.id)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobOffers.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              isEnglish={isEnglish}
              onSelect={setSelectedJob}
            />
          ))}
        </div>

        <CreateJobModal 
          isEnglish={isEnglish}
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </div>
    </InstitutionLayout>
  );
};

export default JobOffers;