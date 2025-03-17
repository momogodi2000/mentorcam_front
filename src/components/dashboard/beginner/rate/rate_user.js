import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Star, MessageCircle, Award, Calendar, User, Briefcase, Search, Filter, ChevronDown, X, Check, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../../ui/card';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Badge } from '../../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tab';
import { Separator } from '../../../ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import BeginnerLayout from '../biginner_layout';
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

// Custom components
const StarRating = ({ rating, onChange, interactive = true, size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6';
  
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => interactive && onChange(value)}
          disabled={!interactive}
          className={`transition-all duration-200 ${interactive ? 'hover:scale-110' : ''}`}
        >
          <Star
            className={`${sizeClass} ${
              value <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 animate-pulse">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

const ProfessionalCard = ({ professional, isSelected, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
    className="h-full"
  >
    <Card
      className={`w-full h-full transition-all duration-300 hover:shadow-lg cursor-pointer border-2 ${
        isSelected ? 'border-blue-500 dark:border-blue-400' : 'border-transparent'
      }`}
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center p-6 h-full">
        <div className="relative mb-4">
          <img
            src="/api/placeholder/150/150"
            alt={professional.name}
            className="rounded-full w-24 h-24 object-cover transition-transform duration-500 hover:scale-105"
          />
          {isSelected && (
            <div className="absolute -right-1 -bottom-1 bg-blue-500 text-white rounded-full p-1">
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>
        <h3 className="text-xl font-bold text-center mb-2">{professional.name}</h3>
        <Badge className="mb-2" variant="outline">
          {professional.domain_name}
        </Badge>
        {professional.certification_name && (
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <Award className="w-3 h-3" />
            <span className="truncate max-w-full">{professional.certification_name}</span>
          </div>
        )}
        <div className="mt-auto">
          <div className="flex items-center justify-center">
            <StarRating rating={professional.average_rating || 0} onChange={() => {}} interactive={false} size="sm" />
            <span className="ml-2 text-sm font-medium">
              {(professional.average_rating || 0).toFixed(1)}
            </span>
            <span className="ml-1 text-xs text-gray-500">
              ({professional.total_reviews || 0})
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const FilterPanel = ({ 
  selectedDomain, 
  setSelectedDomain, 
  selectedSubdomain, 
  setSelectedSubdomain, 
  subdomains,
  setSubdomains,
  isEnglish
}) => {
  
  const handleDomainChange = (e) => {
    const domain = e.target.value;
    setSelectedDomain(domain);
    setSelectedSubdomain('');
    setSubdomains(DOMAINS[domain] || []);
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Filter className="mr-2 w-5 h-5" />
          {isEnglish ? 'Filter Professionals' : 'Filtrer les professionnels'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {isEnglish ? 'Domain' : 'Domaine'}
            </label>
            <div className="relative">
              <select
                value={selectedDomain}
                onChange={handleDomainChange}
                className="w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white dark:bg-gray-800"
              >
                <option value="">
                  {isEnglish ? 'Select a domain' : 'Sélectionnez un domaine'}
                </option>
                {Object.keys(DOMAINS).map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 w-5 h-5" />
            </div>
          </div>

          {selectedDomain && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                {isEnglish ? 'Subdomain' : 'Sous-domaine'}
              </label>
              <div className="relative">
                <select
                  value={selectedSubdomain}
                  onChange={(e) => setSelectedSubdomain(e.target.value)}
                  className="w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white dark:bg-gray-800"
                >
                  <option value="">
                    {isEnglish ? 'Select a subdomain' : 'Sélectionnez un sous-domaine'}
                  </option>
                  {subdomains.map((subdomain) => (
                    <option key={subdomain} value={subdomain}>
                      {subdomain}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 w-5 h-5" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const RatingForm = ({ 
  selectedProfessional, 
  rating, 
  setRating, 
  comment, 
  setComment, 
  experience, 
  setExperience, 
  handleSubmit,
  selectedDomain,
  selectedSubdomain,
  isEnglish
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>
          {isEnglish ? `Rate ${selectedProfessional.name}` : `Évaluer ${selectedProfessional.name}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {isEnglish ? 'Overall Rating' : 'Note globale'}
            </label>
            <StarRating rating={rating} onChange={setRating} size="lg" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {isEnglish ? 'Comment' : 'Commentaire'}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
              placeholder={isEnglish ? "Share your experience..." : "Partagez votre expérience..."}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {isEnglish ? 'Experience Details' : "Détails de l'expérience"}
            </label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
              placeholder={isEnglish ? "Describe your mentoring experience..." : "Décrivez votre expérience de mentorat..."}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center"
          >
            {isEnglish ? "Submit Rating" : "Soumettre l'évaluation"}
          </button>
        </form>
      </CardContent>
    </Card>
  </motion.div>
);

const ProfessionalDetail = ({ professional, onBack, isEnglish }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="w-full mb-6">
      <CardHeader className="pb-0">
        <button 
          onClick={onBack}
          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors mb-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {isEnglish ? 'Back to list' : 'Retour à la liste'}
        </button>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <img
              src="/api/placeholder/200/200"
              alt={professional.name}
              className="rounded-full w-36 h-36 object-cover shadow-lg"
            />
            <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{professional.average_rating?.toFixed(1) || '0.0'}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 text-center md:text-left">
            <CardTitle className="text-3xl font-bold">{professional.name}</CardTitle>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Badge variant="secondary" className="text-sm py-1">
                <Briefcase className="w-3 h-3 mr-1" />
                {professional.domain_name}
              </Badge>
              {professional.subdomain && (
                <Badge variant="outline" className="text-sm py-1">
                  {professional.subdomain}
                </Badge>
              )}
            </div>
            
            {professional.certification_name && (
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Award className="w-5 h-5 text-amber-500" />
                <span className="text-sm">{professional.certification_name}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              <span className="text-sm">
                {isEnglish ? `${professional.total_reviews || 0} reviews` : `${professional.total_reviews || 0} avis`}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="mt-4">
        <Tabs defaultValue="about">
          <TabsList className="mb-4">
            <TabsTrigger value="about">{isEnglish ? 'About' : 'À propos'}</TabsTrigger>
            <TabsTrigger value="reviews">{isEnglish ? 'Reviews' : 'Avis'}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">{isEnglish ? 'Experience' : 'Expérience'}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {professional.bio || 
                    (isEnglish ? 
                      'This professional has not added a bio yet.' : 
                      'Ce professionnel n\'a pas encore ajouté de biographie.')}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">{isEnglish ? 'Expertise' : 'Expertise'}</h3>
                <div className="flex flex-wrap gap-2">
                  {professional.skills ? (
                    professional.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      {isEnglish ? 
                        'No specific expertise listed.' : 
                        'Aucune expertise spécifique répertoriée.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            {professional.reviews && professional.reviews.length > 0 ? (
              <div className="space-y-4">
                {professional.reviews.map((review, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-500" />
                        <span className="font-medium">{review.reviewer_name || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center">
                        <StarRating rating={review.rating} onChange={() => {}} interactive={false} size="sm" />
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>{isEnglish ? 'No reviews yet' : 'Pas encore d\'avis'}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </motion.div>
);

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetail, setShowDetail] = useState(false);

  // Fetch professionals based on domain and subdomain
  const fetchProfessionals = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedDomain) params.append('domain', selectedDomain);
      if (selectedSubdomain) params.append('subdomain', selectedSubdomain);
      if (searchQuery) params.append('search', searchQuery);

      const response = await axiosInstance.get(`/professionals/?${params.toString()}`);
      setProfessionals(response.data);
      setSelectedProfessional(null); // Reset selected professional when filters change
      setShowDetail(false);
    } catch (error) {
      setErrorMessage('Error fetching professionals. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDomain, selectedSubdomain, searchQuery]);

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProfessionals();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, fetchProfessionals]);

  const handleProfessionalSelect = (professional) => {
    setSelectedProfessional(professional);
    setShowDetail(true);
    // Reset form when selecting new professional
    setRating(0);
    setComment('');
    setExperience('');
    
    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!selectedProfessional) {
      setErrorMessage(isEnglish ? 'Please select a professional to rate' : 'Veuillez sélectionner un professionnel à évaluer');
      return;
    }

    if (!rating) {
      setErrorMessage(isEnglish ? 'Please select a rating' : 'Veuillez sélectionner une note');
      return;
    }

    if (!selectedDomain) {
      setErrorMessage(isEnglish ? 'Please select a domain' : 'Veuillez sélectionner un domaine');
      return;
    }

    if (!selectedSubdomain) {
      setErrorMessage(isEnglish ? 'Please select a subdomain' : 'Veuillez sélectionner un sous-domaine');
      return;
    }

    try {
      const ratingData = {
        professional: selectedProfessional.id,
        rating: rating,
        comment: comment.trim() || (isEnglish ? 'No comment provided' : 'Aucun commentaire fourni'),
        experience_details: experience.trim() || (isEnglish ? 'No experience details provided' : 'Aucun détail d\'expérience fourni'),
        domain: selectedDomain,
        subdomain: selectedSubdomain
      };

      const response = await axiosInstance.post('/ratings/', ratingData);
      
      setSuccessMessage(isEnglish ? 'Your rating has been submitted successfully!' : 'Votre évaluation a été soumise avec succès !');
      // Reset form
      setRating(0);
      setComment('');
      setExperience('');
      
      // Refresh the professionals list
      fetchProfessionals();

    } catch (error) {
      console.error('Rating submission error:', error.response?.data || error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          Object.values(error.response?.data || {}).flat().join(', ') ||
                          (isEnglish ? 'Error submitting rating. Please try again.' : 'Erreur lors de la soumission de l\'évaluation. Veuillez réessayer.');
      setErrorMessage(errorMessage);
    }
    
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 5000);
  };

  // Filter professionals based on search query
  const filteredProfessionals = useMemo(() => {
    return professionals;
  }, [professionals]);

  const handleBackToList = () => {
    setShowDetail(false);
    setSelectedProfessional(null);
  };

  return (
    <BeginnerLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isEnglish ? 'Professional Ratings' : 'Évaluations des professionnels'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEnglish 
              ? 'Find and rate professionals based on your experience with them.' 
              : 'Trouvez et évaluez des professionnels en fonction de votre expérience avec eux.'}
          </p>
        </header>

        <AnimatePresence mode="wait">
          {/* Success and Error Messages */}
          {(successMessage || errorMessage) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {successMessage && (
                <Alert className="bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-700 mb-4">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                  <AlertDescription className="text-green-700 dark:text-green-400">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}

              {errorMessage && (
                <Alert className="bg-red-100 dark:bg-red-900/30 border-red-400 dark:border-red-700 mb-4">
                  <X className="w-4 h-4 text-red-600 dark:text-red-400 mr-2" />
                  <AlertDescription className="text-red-700 dark:text-red-400">
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}
            </motion.div>
          )}

          {/* Search bar */}
          <div className="relative w-full mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEnglish ? "Search professionals by name or domain..." : "Rechercher des professionnels par nom ou domaine..."}
              className="w-full p-4 pl-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {showDetail && selectedProfessional ? (
            <div className="space-y-6">
              <ProfessionalDetail 
                professional={selectedProfessional} 
                onBack={handleBackToList}
                isEnglish={isEnglish}
              />
              
              <RatingForm
                selectedProfessional={selectedProfessional}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
                experience={experience}
                setExperience={setExperience}
                handleSubmit={handleSubmit}
                selectedDomain={selectedDomain}
                selectedSubdomain={selectedSubdomain}
                isEnglish={isEnglish}
              />
            </div>
          ) : (
            <>
              <FilterPanel 
                selectedDomain={selectedDomain}
                setSelectedDomain={setSelectedDomain}
                selectedSubdomain={selectedSubdomain}
                setSelectedSubdomain={setSelectedSubdomain}
                subdomains={subdomains}
                setSubdomains={setSubdomains}
                isEnglish={isEnglish}
              />

              {loading && !professionals.length ? (
                <SkeletonLoader />
              ) : filteredProfessionals.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  <AnimatePresence>
                    {filteredProfessionals.map((professional) => (
                      <ProfessionalCard
                        key={professional.id}
                        professional={professional}
                        isSelected={selectedProfessional?.id === professional.id}
                        onClick={() => handleProfessionalSelect(professional)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 inline-flex items-center justify-center mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">
                    {isEnglish ? 'No professionals found' : 'Aucun professionnel trouvé'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isEnglish 
                      ? 'Try adjusting your filters or search terms.' 
                      : 'Essayez d\'ajuster vos filtres ou termes de recherche.'}
                  </p>
                </div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </BeginnerLayout>
  );
};

export default RatingPage;