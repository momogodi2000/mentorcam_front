import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, Award, Calendar, User, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import BeginnerLayout from '../biginner_layout'; // Import the BeginnerLayout
import axiosInstance from '../../../services/backend_connection';

// Domain and Subdomain Data
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

const RatingPage = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [experience, setExperience] = useState('');
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedSubdomain, setSelectedSubdomain] = useState('');
  const [subdomains, setSubdomains] = useState([]);

  // Fetch professionals based on domain and subdomain
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedDomain) params.append('domain', selectedDomain);
        if (selectedSubdomain) params.append('subdomain', selectedSubdomain);

        const response = await axiosInstance.get(`/professionals/?${params.toString()}`);
        setProfessionals(response.data);
        setSelectedProfessional(null); // Reset selected professional when filters change
      } catch (error) {
        setErrorMessage('Error fetching professionals. Please try again.');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [selectedDomain, selectedSubdomain]);

  const handleDomainChange = (e) => {
    const domain = e.target.value;
    setSelectedDomain(domain);
    setSelectedSubdomain('');
    setSubdomains(DOMAINS[domain] || []);
  };

  const handleSubdomainChange = (e) => {
    setSelectedSubdomain(e.target.value);
  };

  const handleProfessionalSelect = (professional) => {
    setSelectedProfessional(professional);
    // Reset form when selecting new professional
    setRating(0);
    setComment('');
    setExperience('');
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProfessional) {
      setErrorMessage('Please select a professional to rate');
      return;
    }

    try {
      await axiosInstance.post('/ratings/', {
        professional: selectedProfessional.id,
        rating: rating,
        comment: comment,
        experience_details: experience,
        domain: selectedDomain,
        subdomain: selectedSubdomain
      });

      setSuccessMessage('Votre évaluation a été enregistrée avec succès!');
      // Reset form
      setRating(0);
      setComment('');
      setExperience('');

      // Refresh professionals list to update ratings
      const params = new URLSearchParams();
      if (selectedDomain) params.append('domain', selectedDomain);
      if (selectedSubdomain) params.append('subdomain', selectedSubdomain);
      const response = await axiosInstance.get(`/professionals/?${params.toString()}`);
      setProfessionals(response.data);

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error submitting rating. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  if (loading && !professionals.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <BeginnerLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Professional Info Card */}
        {selectedProfessional && (
          <Card className="w-full transition-all duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-col md:flex-row items-center gap-4">
              <img
                src="/api/placeholder/150/150"
                alt={selectedProfessional.name}
                className="rounded-full w-32 h-32 object-cover"
              />
              <div className="space-y-2 text-center md:text-left">
                <CardTitle className="text-2xl font-bold">{selectedProfessional.name}</CardTitle>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Briefcase className="w-4 h-4" />
                  <span>{selectedProfessional.domain_name}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Award className="w-4 h-4" />
                  <span>{selectedProfessional.certification_name || 'No certifications listed'}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>
                    {selectedProfessional.average_rating?.toFixed(1) || '0.0'}
                    ({selectedProfessional.total_reviews || 0} avis)
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Domain and Subdomain Filter */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Filtrer par domaine et sous-domaine</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Domaine</label>
              <select
                value={selectedDomain}
                onChange={handleDomainChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionnez un domaine</option>
                {Object.keys(DOMAINS).map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>

            {selectedDomain && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">Sous-domaine</label>
                <select
                  value={selectedSubdomain}
                  onChange={handleSubdomainChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez un sous-domaine</option>
                  {subdomains.map((subdomain) => (
                    <option key={subdomain} value={subdomain}>
                      {subdomain}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Professionals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {professionals.map((professional) => (
            <Card
              key={professional.id}
              className={`w-full transition-all duration-300 hover:shadow-lg cursor-pointer ${
                selectedProfessional?.id === professional.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleProfessionalSelect(professional)}
            >
              <CardHeader className="flex flex-col items-center gap-4">
                <img
                  src="/api/placeholder/150/150"
                  alt={professional.name}
                  className="rounded-full w-24 h-24 object-cover"
                />
                <div className="space-y-2 text-center">
                  <CardTitle className="text-xl font-bold">{professional.name}</CardTitle>
                  <div className="flex items-center gap-2 justify-center">
                    <Briefcase className="w-4 h-4" />
                    <span>{professional.domain_name}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Award className="w-4 h-4" />
                    <span>{professional.certification_name || 'No certifications'}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>
                      {(professional.average_rating || 0).toFixed(1)}
                      ({professional.total_reviews || 0} avis)
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Rating Form - only show if a professional is selected */}
        {selectedProfessional && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Évaluer {selectedProfessional.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Star Rating */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Note globale</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleRatingChange(value)}
                        className="transition-all duration-200 hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            value <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Commentaire</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Partagez votre expérience..."
                  />
                </div>

                {/* Experience Details */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Détails de l'expérience</label>
                  <textarea
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Décrivez votre expérience de mentorat..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Soumettre l'évaluation
                </button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Success and Error Messages */}
        {successMessage && (
          <Alert className="bg-green-100 border-green-400">
            <AlertDescription className="text-green-700">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="bg-red-100 border-red-400">
            <AlertDescription className="text-red-700">
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </BeginnerLayout>
  );
};

export default RatingPage;