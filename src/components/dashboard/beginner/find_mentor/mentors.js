import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Clock, Heart, User, Award, Languages, 
  CreditCard, Calendar, BookOpen, Briefcase, Mail, Phone, Globe, FileCheck, 
  Linkedin, Github, Twitter, GraduationCap, FileText, Download } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../../ui/card';
import { Alert, AlertTitle, AlertDescription } from '../../../ui/alert';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import BeginnerLayout from '../biginner_layout';
import FindMentorServices from '../../../services/biginner/find_mentor';
import BookingModal from './BookingModal';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DOMAINS = {
  "Software Development": ["Web Development", "Mobile App Development", "Game Development", "DevOps & CI/CD", "Software Testing & QA"],
  "Data Science & Machine Learning": ["Data Analytics", "Machine Learning", "Deep Learning", "Data Visualization", "Natural Language Processing"],
  "Cybersecurity": ["Network Security", "Ethical Hacking", "Cloud Security", "Cryptography", "Incident Response"],
  "Cloud Computing": ["AWS Services", "Google Cloud Platform", "Microsoft Azure", "Cloud Architecture", "Kubernetes & Docker"],
  "UI/UX Design": ["User Research", "Wireframing & Prototyping", "Interaction Design", "Visual Design", "Usability Testing"],
  "Digital Marketing": ["SEO Optimization", "Content Marketing", "Social Media Strategy", "Email Marketing", "Affiliate Marketing"],
  "Business and Entrepreneurship": ["Business Strategy", "Market Analysis", "Funding & Investments", "Startup Growth Hacking", "Leadership & Team Building"],
  "Artificial Intelligence": ["AI Strategy & Implementation", "Robotics Process Automation", "AI Ethics & Policies", "AI for Business Optimization", "Computer Vision"],
  "Education & Training": ["Curriculum Development", "Online Course Creation", "E-learning Platforms", "Public Speaking", "Academic Research Guidance"],
  "Healthcare & Medicine": ["Medical Research", "Healthcare Administration", "Public Health", "Medical Technology", "Telemedicine"],
  "Environmental Science": ["Climate Change Studies", "Renewable Energy", "Sustainable Development", "Wildlife Conservation", "Waste Management"],
  "Legal Studies": ["Corporate Law", "Intellectual Property Law", "Criminal Justice", "International Law", "Human Rights Law"],
  "Hospitality & Tourism": ["Hotel Management", "Event Planning", "Travel Consultancy", "Food & Beverage Management", "Customer Service"],
  "Sports & Fitness": ["Athlete Training", "Sports Management", "Physical Therapy", "Nutritional Coaching", "Recreational Sports"],
  "Music & Performing Arts": ["Music Composition", "Theater Acting", "Film Production", "Dance Choreography", "Instrumental Training"]
};

const FindMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [expandedProfile, setExpandedProfile] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState({ url: null, title: '' });
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const response = await FindMentorServices.searchMentors({
          domain: selectedDomain === 'all' ? '' : selectedDomain,
          searchQuery
        });

        const enrichedMentors = await Promise.all(response.results.map(async mentor => {
          try {
            const ratingsResponse = await FindMentorServices.getMentorRatings(mentor.id);
            const profileResponse = await FindMentorServices.getMentorProfile(mentor.id);
            
            return {
              ...mentor,
              ...profileResponse,
              completionScore: calculateProfileCompletion(mentor),
              ratings: ratingsResponse
            };
          } catch (err) {
            console.error(`Error fetching data for mentor ${mentor.id}:`, err);
            return mentor;
          }
        }));

        setMentors(enrichedMentors);
        setError(null);
      } catch (err) {
        setError('Failed to load mentors. Please try again later.');
        console.error('Mentor fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [selectedDomain, searchQuery]);

  const calculateProfileCompletion = (mentor) => {
    const fields = [
      mentor.title,
      mentor.biography,
      mentor.hourly_rate,
      mentor.linkedin,
      mentor.github,
      mentor.website,
      mentor.degree,
      mentor.certification_name,
      mentor.plan_type,
      mentor.domain_name
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  };

  const handleViewPdf = async (url, title) => {
    try {
      const pdfData = await FindMentorServices.getPdfDocument(url);
      setSelectedPdf({ 
        url: pdfData, 
        title: title 
      });
      setShowPdfModal(true);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Failed to load PDF document.');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const handleBookSession = (mentor) => {
    setSelectedMentor(mentor);
    setShowBookingModal(true);
  };

  const MentorCard = ({ mentor }) => {
    const isExpanded = expandedProfile === mentor.id;

    return (
      <Card className="transform transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Profile Image Section */}
            <div className="relative w-full lg:w-48">
              <img
                src={mentor.profile_picture || '/api/placeholder/200/200'}
                alt={mentor.full_name}
                className="w-full lg:w-48 h-48 rounded-lg object-cover"
              />
              <Badge className="absolute top-2 right-2 bg-blue-500">
                {mentor.completionScore}% Complete
              </Badge>
            </div>

            <div className="flex-1 space-y-4">
              {/* Basic Info Section */}
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold flex items-center gap-2">
                    {mentor.full_name}
                    {mentor.certification_file && (
                      <FileCheck className="w-5 h-5 text-green-500" />
                    )}
                  </h3>
                  <p className="text-gray-600">{mentor.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{mentor.location || 'Location not specified'}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{mentor.average_rating || '4.5'}</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {mentor.hourly_rate?.toLocaleString()} FCFA
                    <span className="text-sm font-normal">/hour</span>
                  </p>
                </div>
              </div>

              {isExpanded && (
                <div className="space-y-6 mt-4 animate-fadeIn">
                  {/* Professional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Education Section */}
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Education & Certifications
                      </h4>
                      <div className="space-y-2">
                        <p className="font-medium">Degree: {mentor.degree || 'Not specified'}</p>
                        <p>Institution: {mentor.institution}</p>
                        <p>Year: {mentor.education_year}</p>
                        {mentor.diploma_file && (
                          <Button
                            variant="outline"
                            onClick={() => handleViewPdf(mentor.diploma_file, 'Diploma')}
                            className="mt-2"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Diploma
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">Certification: {mentor.certification_name}</p>
                        <p>Issuer: {mentor.certification_issuer}</p>
                        <p>Year: {mentor.certification_year}</p>
                        {mentor.certification_file && (
                          <Button
                            variant="outline"
                            onClick={() => handleViewPdf(mentor.certification_file, 'Certification')}
                            className="mt-2"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Certification
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Domain & Expertise */}
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Domain & Expertise
                      </h4>
                      <div className="space-y-2">
                        <p className="font-medium">Domain: {mentor.domain_name}</p>
                        <div className="flex flex-wrap gap-2">
                          {mentor.subdomains?.map((subdomain, index) => (
                            <Badge key={index} variant="secondary">
                              {subdomain}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mentorship Plans */}
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Mentorship Plans
                      </h4>
                      <div className="space-y-2">
                        <p>Plan Type: {mentor.plan_type}</p>
                        <p>Price: {mentor.plan_price?.toLocaleString()} FCFA</p>
                        <p>Max Students: {mentor.max_students}</p>
                        <p className="text-gray-600">{mentor.plan_description}</p>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Professional Links
                      </h4>
                      <div className="flex flex-wrap gap-4">
                        {mentor.linkedin && (
                          <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <Linkedin className="w-4 h-4 mr-2" />
                              LinkedIn
                            </Button>
                          </a>
                        )}
                        {mentor.github && (
                          <a href={mentor.github} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <Github className="w-4 h-4 mr-2" />
                              GitHub
                            </Button>
                          </a>
                        )}
                        {mentor.twitter && (
                          <a href={mentor.twitter} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <Twitter className="w-4 h-4 mr-2" />
                              Twitter
                            </Button>
                          </a>
                        )}
                        {mentor.website && (
                          <a href={mentor.website} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <Globe className="w-4 h-4 mr-2" />
                              Website
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Biography */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Biography</h4>
                    <p className="text-gray-600">{mentor.biography || 'No biography provided'}</p>
                  </div>

                  {/* Ratings & Reviews */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Ratings & Reviews</h4>
                    {mentor.ratings.length > 0 ? (
                      mentor.ratings.map((rating, index) => (
                        <div key={index} className="border p-4 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-medium">{rating.rating}</span>
                          </div>
                          <p className="text-gray-600">{rating.comment}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Domain: {rating.domain} | Subdomain: {rating.subdomain}
                          </p>
                          <p className="text-sm text-gray-500">{rating.experience_details}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No ratings yet.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                <Button
                  onClick={() => setExpandedProfile(isExpanded ? null : mentor.id)}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  {isExpanded ? 'Show Less' : 'View Full Profile'}
                </Button>
                <Button
                  onClick={() => handleBookSession(mentor)}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                >
                  Book Session
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <BeginnerLayout
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
      isEnglish={isEnglish}
      setIsEnglish={setIsEnglish}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Find Your Mentor</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              placeholder="Search by name, domain, or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {Object.keys(DOMAINS).map(domain => (
                  <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
            {mentors.length === 0 && (
              <Alert>
                <AlertDescription>
                  No mentors found. Try adjusting your search criteria.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </div>

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        mentor={selectedMentor}
      />

      {showPdfModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedPdf.title}</h2>
              <div className="flex gap-2">
                <Button onClick={() => setPageNumber(prev => Math.max(1, prev - 1))} 
                        disabled={pageNumber <= 1}>
                  Previous
                </Button>
                <span className="px-2 py-1">
                  Page {pageNumber} of {numPages}
                </span>
                <Button onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                        disabled={pageNumber >= numPages}>
                  Next
                </Button>
                <Button onClick={() => setShowPdfModal(false)}>Close</Button>
              </div>
            </div>
            <Document
              file={selectedPdf.url}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page 
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </div>
        </div>
      )}
    </BeginnerLayout>
  );
};

export default FindMentors;