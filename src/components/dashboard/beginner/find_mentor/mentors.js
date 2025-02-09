import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, MapPin, Star, Clock, Heart, User, Award, Languages, 
  CreditCard, Calendar, BookOpen, Briefcase, Mail, Phone, Globe, FileCheck, 
  Linkedin, Github, Twitter, GraduationCap, FileText } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../../ui/card';
import { Alert, AlertTitle, AlertDescription } from '../../../ui/alert';
import { Badge } from '../../../ui/badge';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { Slider } from '../../../ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Progress } from '../../../ui/progress';
import BeginnerLayout from '../biginner_layout';
import FindMentorServices from '../../../services/biginner/find_mentor';
import BookingModal from './BookingModal';

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
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const response = await FindMentorServices.searchMentors({
          domain: selectedDomain === 'all' ? '' : selectedDomain,
          searchQuery
        });

        const enrichedMentors = await Promise.all(response.results.map(async mentor => {
          const ratingsResponse = await FindMentorServices.getMentorRatings(mentor.id);
          return {
            ...mentor,
            completionScore: calculateProfileCompletion(mentor),
            ratings: ratingsResponse
          };
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

  const MentorCard = ({ mentor }) => {
    const isExpanded = expandedProfile === mentor.id;

    return (
      <Card className="transform transition-all duration-300 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
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
                    {mentor.plan_price?.toLocaleString()} FCFA
                    <span className="text-sm font-normal">/hour</span>
                  </p>
                </div>
              </div>

              {isExpanded && (
                <div className="space-y-4 mt-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Education
                      </h4>
                      <p>{mentor.degree || 'Not specified'}</p>
                      <p className="text-sm text-gray-600">{mentor.institution}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Certifications
                      </h4>
                      <p>{mentor.certification_name || 'Not specified'}</p>
                      <p className="text-sm text-gray-600">{mentor.certification_issuer}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Biography</h4>
                    <p className="text-gray-600">{mentor.biography || 'No biography provided'}</p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {mentor.linkedin && (
                      <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </a>
                    )}
                    {mentor.github && (
                      <a href={mentor.github} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {mentor.website && (
                      <a href={mentor.website} target="_blank" rel="noopener noreferrer"
                         className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                        <Globe className="w-4 h-4" />
                        Website
                      </a>
                    )}
                  </div>

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
                          <p className="text-sm text-gray-500">{rating.experience_details}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No ratings yet.</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {mentor.subdomains?.map((subdomain, index) => (
                  <Badge key={index} variant="secondary">
                    {subdomain}
                  </Badge>
                ))}
              </div>

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

  const handleBookSession = (mentor) => {
    setSelectedMentor(mentor);
    setShowBookingModal(true);
  };

  return (
    <BeginnerLayout>
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
    </BeginnerLayout>
  );
};

export default FindMentors;