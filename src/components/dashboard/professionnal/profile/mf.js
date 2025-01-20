import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Book, Award, Clock, Calendar, 
  CreditCard, Plus, X, Camera, Briefcase, GraduationCap, 
  Certificate, Globe, Star, Video, Clock8, DollarSign,
  FileText, Linkedin, Github, Twitter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Textarea } from '../../../ui/textarea';
import { Badge } from '../../../ui/badge';
import { Alert, AlertDescription } from '../../../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select';
import { Checkbox } from '../../../ui/checkbox';
import ProfessionalLayout from '../professionnal_layout';

// Define domains and their subdomains
const DOMAINS = {
  "Software Development": [
    "Web Development", "Mobile App Development", "Game Development", 
    "DevOps & CI/CD", "Software Testing & QA"
  ],
  "Data Science & Machine Learning": [
    "Data Analytics", "Machine Learning", "Deep Learning", 
    "Data Visualization", "Natural Language Processing"
  ],
  "Cybersecurity": [
    "Network Security", "Ethical Hacking", "Cloud Security", 
    "Cryptography", "Incident Response"
  ],
  "Cloud Computing": [
    "AWS Services", "Google Cloud Platform", "Microsoft Azure", 
    "Cloud Architecture", "Kubernetes & Docker"
  ],
  "UI/UX Design": [
    "User Research", "Wireframing & Prototyping", "Interaction Design", 
    "Visual Design", "Usability Testing"
  ],
  "Business and Entrepreneurship": [
    "Business Strategy", "Market Analysis", "Funding & Investments",
    "Startup Growth Hacking", "Leadership & Team Building"
  ],
  "Digital Marketing": [
    "SEO Optimization", "Content Marketing", "Social Media Strategy",
    "Email Marketing", "Affiliate Marketing"
  ]
};

const SERVICES = [
  { id: "oneOnOne", label: "1:1 Consultation" },
  { id: "groupSession", label: "Group Sessions" },
  { id: "longTerm", label: "Long-term Mentorship" },
  { id: "codeReview", label: "Code Review" },
  { id: "careerGuidance", label: "Career Guidance" }
];

const CompleteProfile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isEnglish, setIsEnglish] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    // Basic Information
    profileImage: null,
    fullName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    biography: '',
    hourlyRate: '',
    
    // Professional Details
    domains: [],
    subdomains: [],
    yearsOfExperience: '',
    languages: [],
    services: [],
    
    // Education & Certifications
    education: [{ degree: '', institution: '', year: '' }],
    certifications: [{ name: '', issuer: '', year: '' }],
    
    // Portfolio
    portfolio: {
      projects: [],
      githubUrl: '',
      linkedinUrl: '',
      personalWebsite: ''
    },
    
    // Availability
    availability: {
      weekdays: [],
      weekends: false,
      hoursPerWeek: '',
      timeZone: ''
    },
    
    // Mentorship Plans
    mentorshipPlans: {
      monthly: {
        price: '',
        description: '',
        features: []
      },
      trimester: {
        price: '',
        description: '',
        features: []
      },
      yearly: {
        price: '',
        description: '',
        features: []
      }
    }
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, profileImage: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBasicInfoChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDomainChange = (domain) => {
    const updatedDomains = formData.domains.includes(domain)
      ? formData.domains.filter(d => d !== domain)
      : [...formData.domains, domain];
    setFormData({ ...formData, domains: updatedDomains });
  };

  const handleServiceChange = (serviceId) => {
    const updatedServices = formData.services.includes(serviceId)
      ? formData.services.filter(s => s !== serviceId)
      : [...formData.services, serviceId];
    setFormData({ ...formData, services: updatedServices });
  };

  const renderBasicInfo = () => (
    <Card className="p-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {isEnglish ? 'Basic Information' : 'Informations de Base'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Image Upload */}
        <div className="flex justify-center">
          <div className="relative w-32 h-32">
            <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden border-4 border-blue-500">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700">
              <Camera className="w-4 h-4 text-white" />
              <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            </label>
          </div>
        </div>

        {/* Basic Information Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              {isEnglish ? 'Full Name' : 'Nom Complet'}
            </label>
            <Input
              value={formData.fullName}
              onChange={(e) => handleBasicInfoChange('fullName', e.target.value)}
              placeholder={isEnglish ? 'John Doe' : 'Jean Dupont'}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {isEnglish ? 'Email' : 'Email'}
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleBasicInfoChange('email', e.target.value)}
              placeholder="example@domain.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              {isEnglish ? 'Professional Title' : 'Titre Professionnel'}
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleBasicInfoChange('title', e.target.value)}
              placeholder={isEnglish ? 'Senior Software Engineer' : 'Ingénieur Logiciel Senior'}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              {isEnglish ? 'Hourly Rate (FCFA)' : 'Taux Horaire (FCFA)'}
            </label>
            <Input
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => handleBasicInfoChange('hourlyRate', e.target.value)}
              placeholder="5000"
            />
          </div>
        </div>

        {/* Biography */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {isEnglish ? 'Professional Biography' : 'Biographie Professionnelle'}
          </label>
          <Textarea
            value={formData.biography}
            onChange={(e) => handleBasicInfoChange('biography', e.target.value)}
            rows={4}
            placeholder={isEnglish ? 'Tell us about your professional journey and expertise...' : 'Parlez-nous de votre parcours professionnel et de votre expertise...'}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderProfessionalDetails = () => (
    <Card className="p-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {isEnglish ? 'Professional Details' : 'Détails Professionnels'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Domains Selection */}
        <div className="space-y-4">
          <label className="text-lg font-medium">
            {isEnglish ? 'Domains of Expertise' : 'Domaines d\'Expertise'}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(DOMAINS).map((domain) => (
              <div key={domain} className="flex items-start space-x-2">
                <Checkbox
                  checked={formData.domains.includes(domain)}
                  onCheckedChange={() => handleDomainChange(domain)}
                />
                <div className="space-y-1">
                  <label className="font-medium">{domain}</label>
                  <p className="text-sm text-gray-500">
                    {DOMAINS[domain].join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services Offered */}
        <div className="space-y-4">
          <label className="text-lg font-medium">
            {isEnglish ? 'Services Offered' : 'Services Proposés'}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERVICES.map((service) => (
              <div key={service.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.services.includes(service.id)}
                  onCheckedChange={() => handleServiceChange(service.id)}
                />
                <label>{service.label}</label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderMentorshipPlans = () => (
    <Card className="p-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {isEnglish ? 'Mentorship Plans' : 'Plans de Mentorat'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['monthly', 'trimester', 'yearly'].map((plan) => (
            <Card key={plan} className="p-4">
              <CardHeader>
                <CardTitle className="text-xl capitalize">
                  {isEnglish ? plan : plan === 'monthly' ? 'Mensuel' : plan === 'trimester' ? 'Trimestriel' : 'Annuel'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {isEnglish ? 'Price (FCFA)' : 'Prix (FCFA)'}
                  </label>
                  <Input
                    type="number"
                    value={formData.mentorshipPlans[plan].price}
                    onChange={(e) => setFormData({
                      ...formData,
                      mentorshipPlans: {
                        ...formData.mentorshipPlans,
                        [plan]: {
                          ...formData.mentorshipPlans[plan],
                          price: e.target.value
                        }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {isEnglish ? 'Description' : 'Description'}
                  </label>
                  <Textarea
                    value={formData.mentorshipPlans[plan].description}
                    onChange={(e) => setFormData({
                      ...formData,
                      mentorshipPlans: {
                        ...formData.mentorshipPlans,
                        [plan]: {
                          ...formData.mentorshipPlans[plan],
                          description: e.target.value
                        }
                      }
                    })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ProfessionalLayout
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
      isEnglish={isEnglish}
      setIsEnglish={setIsEnglish}
    >
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {isEnglish ? 'Complete Your Mentor Profile' : 'Complétez Votre Profil de Mentor'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {isEnglish 
              ? 'Create your professional profile to start mentoring and sharing your expertise'
              : 'Créez votre profil professionnel pour commencer à mentorer et partager votre expertise'}
          </p>
        </div>

       {/* Progress Steps */}
       <div className="mb-8 flex justify-between items-center">
          <div className="hidden md:flex gap-4 flex-1">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  step === currentStep
                    ? 'bg-blue-600'
                    : step < currentStep
                    ? 'bg-blue-400'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-4 items-center md:ml-6">
            <span className="text-sm font-medium">
              {isEnglish ? 'Step' : 'Étape'} {currentStep} {isEnglish ? 'of' : 'sur'} 3
            </span>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          {currentStep === 1 && renderBasicInfo()}
          {currentStep === 2 && renderProfessionalDetails()}
          {currentStep === 3 && renderMentorshipPlans()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              {isEnglish ? 'Previous' : 'Précédent'}
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                {isEnglish ? 'Next' : 'Suivant'}
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={() => {
                  // Handle form submission
                  console.log('Form submitted:', formData);
                  // Add your submission logic here
                  
                  // Show success message
                  Alert({
                    title: isEnglish ? 'Profile Updated' : 'Profil Mis à Jour',
                    description: isEnglish 
                      ? 'Your mentor profile has been successfully created!'
                      : 'Votre profil de mentor a été créé avec succès !',
                    variant: 'success'
                  });
                }}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                {isEnglish ? 'Complete Profile' : 'Terminer le Profil'}
              </Button>
            )}
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-8">
          <Alert>
            <AlertDescription>
              {isEnglish 
                ? 'All fields are required to create a comprehensive mentor profile. Make sure to provide accurate and detailed information to help potential mentees understand your expertise and offerings.'
                : 'Tous les champs sont requis pour créer un profil de mentor complet. Assurez-vous de fournir des informations précises et détaillées pour aider les potentiels mentorés à comprendre votre expertise et vos offres.'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </ProfessionalLayout>
  );
};

export default CompleteProfile;