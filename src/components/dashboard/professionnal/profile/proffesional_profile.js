import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Book, Languages as LanguagesIcon, 
  Award, Clock, Calendar, CreditCard, Plus, X, Camera,
  Briefcase, ChevronDown, ChevronUp, GraduationCap, Link
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Textarea } from '../../../ui/textarea';
import { Badge } from '../../../ui/badge';
import { Alert, AlertDescription } from '../../../ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { useToast } from "../../../ui/use-toast";
import ProfessionalLayout from '../professionnal_layout';
import axiosInstance from '../../../services/backend_connection';

const DOMAINS = {
  "Software Development": ["Web Development", "Mobile App Development", "Game Development", "DevOps & CI/CD", "Software Testing & QA"],
  "Data Science & Machine Learning": ["Data Analytics", "Machine Learning", "Deep Learning", "Data Visualization", "Natural Language Processing"],
  "Cybersecurity": ["Network Security", "Ethical Hacking", "Cloud Security", "Cryptography", "Incident Response"],
  "Cloud Computing": ["AWS Services", "Google Cloud Platform", "Microsoft Azure", "Cloud Architecture", "Kubernetes & Docker"],
  "UI/UX Design": ["User Research", "Wireframing & Prototyping", "Interaction Design", "Visual Design", "Usability Testing"],
  "Digital Marketing": ["SEO Optimization", "Content Marketing", "Social Media Strategy", "Email Marketing", "Affiliate Marketing"],
  "Business and Entrepreneurship": ["Business Strategy", "Market Analysis", "Funding & Investments", "Startup Growth Hacking", "Leadership & Team Building"],
  "Artificial Intelligence": ["AI Strategy & Implementation", "Robotics Process Automation", "AI Ethics & Policies", "AI for Business Optimization", "Computer Vision"],
  "Education & Training": ["Curriculum Development", "Online Course Creation", "E-learning Platforms", "Public Speaking", "Academic Research Guidance"]
};

const CompleteProfile = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [expandedDomain, setExpandedDomain] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    profilePicture: null,
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      website: ''
    },
    title: '',
    biography: '',
    hourlyRate: '',
    domains: [],
    education: {
      degrees: [],
      certifications: []
    },
    mentorship: {
      monthly: {
        price: '',
        description: '',
        features: [],
        maxStudents: ''
      },
      trimester: {
        price: '',
        description: '',
        features: [],
        maxStudents: ''
      },
      yearly: {
        price: '',
        description: '',
        features: [],
        maxStudents: ''
      }
    }
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axiosInstance.get('/professional-profile/');
      if (response.data) {
        const profileData = {
          fullName: response.data.user.full_name,
          email: response.data.user.email,
          phone: response.data.user.phone_number,
          location: response.data.location,
          profilePicture: response.data.profile_picture,
          socialLinks: {
            linkedin: response.data.linkedin || '',
            github: response.data.github || '',
            twitter: response.data.twitter || '',
            website: response.data.website || ''
          },
          title: response.data.title,
          biography: response.data.biography,
          hourlyRate: response.data.hourly_rate,
          domains: response.data.domains || [],
          education: {
            degrees: response.data.education || [],
            certifications: response.data.certifications || []
          },
          mentorship: {
            monthly: response.data.mentorship_plans.find(plan => plan.plan_type === 'monthly') || {
              price: '',
              description: '',
              features: [],
              maxStudents: ''
            },
            trimester: response.data.mentorship_plans.find(plan => plan.plan_type === 'trimester') || {
              price: '',
              description: '',
              features: [],
              maxStudents: ''
            },
            yearly: response.data.mentorship_plans.find(plan => plan.plan_type === 'yearly') || {
              price: '',
              description: '',
              features: [],
              maxStudents: ''
            }
          }
        };
        setFormData(profileData);
        if (response.data.profile_picture) {
          setImagePreview(response.data.profile_picture);
        }
      }
    } catch (error) {
      toast({
        title: isEnglish ? "Error" : "Erreur",
        description: isEnglish 
          ? "Failed to load profile data" 
          : "Échec du chargement des données du profil",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const transformFormDataForBackend = () => {
    const formDataToSend = new FormData();
    
    // Append basic fields
    formDataToSend.append('full_name', formData.fullName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone_number', formData.phone);
    formDataToSend.append('location', formData.location);
    
    // Append social links
    formDataToSend.append('linkedin', formData.socialLinks.linkedin);
    formDataToSend.append('github', formData.socialLinks.github);
    formDataToSend.append('twitter', formData.socialLinks.twitter);
    formDataToSend.append('website', formData.socialLinks.website);
    
    // Append professional info
    formDataToSend.append('title', formData.title);
    formDataToSend.append('biography', formData.biography);
    formDataToSend.append('hourly_rate', formData.hourlyRate);
    
    // Append domains as JSON string
    formDataToSend.append('domains', JSON.stringify(formData.domains));
    
    // Append education and certifications as JSON strings
    formDataToSend.append('education', JSON.stringify(formData.education.degrees));
    formDataToSend.append('certifications', JSON.stringify(formData.education.certifications));
    
    // Append mentorship plans as JSON string
    const mentorshipPlans = [
      { plan_type: 'monthly', ...formData.mentorship.monthly },
      { plan_type: 'trimester', ...formData.mentorship.trimester },
      { plan_type: 'yearly', ...formData.mentorship.yearly }
    ];
    formDataToSend.append('mentorship_plans', JSON.stringify(mentorshipPlans));
    
    // Append profile picture if it exists and is a File object
    if (formData.profilePicture instanceof File) {
      formDataToSend.append('profile_picture', formData.profilePicture);
    }
    
    return formDataToSend;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formDataToSend = transformFormDataForBackend();
      
      try {
        await axiosInstance.put('/professional-profile/', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } catch (error) {
        if (error.response?.status === 404) {
          await axiosInstance.post('/professional-profile/', formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } else {
          throw error;
        }
      }

      toast({
        title: isEnglish ? "Success" : "Succès",
        description: isEnglish 
          ? "Profile successfully saved" 
          : "Profil enregistré avec succès",
      });
    } catch (error) {
      toast({
        title: isEnglish ? "Error" : "Erreur",
        description: isEnglish 
          ? "Failed to save profile" 
          : "Échec de l'enregistrement du profil",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        
        setFormData(prev => ({...prev, profilePicture: file}));
      } catch (error) {
        toast({
          title: isEnglish ? "Error" : "Erreur",
          description: isEnglish 
            ? "Failed to upload image" 
            : "Échec du téléchargement de l'image",
          variant: "destructive"
        });
      }
    }
  };

  const handleDomainSelection = (domain, subdomain) => {
    setFormData(prev => {
      const newDomains = [...prev.domains];
      const domainIndex = newDomains.findIndex(d => d.name === domain);
      
      if (domainIndex === -1) {
        newDomains.push({
          name: domain,
          subdomains: [subdomain]
        });
      } else {
        const subdomains = newDomains[domainIndex].subdomains;
        if (subdomains.includes(subdomain)) {
          newDomains[domainIndex].subdomains = subdomains.filter(s => s !== subdomain);
          if (newDomains[domainIndex].subdomains.length === 0) {
            newDomains.splice(domainIndex, 1);
          }
        } else {
          newDomains[domainIndex].subdomains.push(subdomain);
        }
      }
      
      return {
        ...prev,
        domains: newDomains
      };
    });
  };

  const addEducation = (type, data) => {
    setFormData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        [type]: [...prev.education[type], data]
      }
    }));
  };

  if (isLoading) {
    return (
      <ProfessionalLayout 
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isEnglish={isEnglish}
        setIsEnglish={setIsEnglish}
      >
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
        </div>
      </ProfessionalLayout>
    );
  }

  const renderStep1 = () => (
    <div className="space-y-6 animate-fadeIn">
      {/* Profile Picture */}
      <div className="text-center mb-8">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
            <Camera className="w-4 h-4 text-white" />
            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
          </label>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">{isEnglish ? 'Full Name' : 'Nom Complet'}</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              className="pl-10" 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{isEnglish ? 'Email' : 'Email'}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              className="pl-10" 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{isEnglish ? 'Phone' : 'Téléphone'}</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              className="pl-10"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{isEnglish ? 'Location' : 'Localisation'}</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              className="pl-10"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{isEnglish ? 'Social Links' : 'Liens Sociaux'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(formData.socialLinks).map(([platform, value]) => (
            <div key={platform} className="space-y-2">
              <label className="text-sm font-medium capitalize">{platform}</label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  className="pl-10"
                  value={value}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: {
                      ...formData.socialLinks,
                      [platform]: e.target.value
                    }
                  })}
                  placeholder={`${platform} URL`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fadeIn">
      {/* Professional Title & Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {isEnglish ? 'Professional Title' : 'Titre Professionnel'}
          </label>
          <Input 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder={isEnglish ? 'e.g. Senior Software Engineer' : 'ex. Ingénieur Logiciel Senior'}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {isEnglish ? 'Hourly Rate (FCFA)' : 'Taux Horaire (FCFA)'}
          </label>
          <Input 
            type="number"
            value={formData.hourlyRate}
            onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
            placeholder="0"
          />
        </div>
      </div>

      {/* Domains of Expertise */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {isEnglish ? 'Domains of Expertise' : 'Domaines d\'expertise'}
        </h3>
        <div className="space-y-4">
          {Object.entries(DOMAINS).map(([domain, subdomains]) => (
            <Card key={domain}>
              <CardHeader 
                className="cursor-pointer" 
                onClick={() => setExpandedDomain(expandedDomain === domain ? null : domain)}
              >
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">{domain}</CardTitle>
                  {expandedDomain === domain ? 
                    <ChevronUp className="w-4 h-4" /> : 
                    <ChevronDown className="w-4 h-4" />
                  }
                </div>
              </CardHeader>
              {expandedDomain === domain && (
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {subdomains.map(subdomain => {
                      const isSelected = formData.domains.some(
                        d => d.name === domain && d.subdomains.includes(subdomain)
                      );
                      return (
                        <div key={subdomain} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleDomainSelection(domain, subdomain)}
                            id={`${domain}-${subdomain}`}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor={`${domain}-${subdomain}`} className="text-sm">
                            {subdomain}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Professional Biography */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {isEnglish ? 'Professional Biography' : 'Biographie Professionnelle'}
        </label>
        <Textarea 
          value={formData.biography}
          onChange={(e) => setFormData({...formData, biography: e.target.value})}
          rows={4}
          placeholder={isEnglish ? 
            "Share your professional journey, expertise, and what makes you a great mentor..." : 
            "Partagez votre parcours professionnel, votre expertise et ce qui fait de vous un excellent mentor..."
          }
        />
      </div>

      {/* Education & Certifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
        {isEnglish ? 'Education & Certifications' : 'Formation et Certifications'}
        </h3>
        <div className="space-y-4">
          {/* Degrees */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {isEnglish ? 'Academic Degrees' : 'Diplômes Académiques'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.education.degrees.map((degree, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{degree.degree}</p>
                      <p className="text-sm text-gray-600">{degree.institution} - {degree.year}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          education: {
                            ...prev.education,
                            degrees: prev.education.degrees.filter((_, i) => i !== index)
                          }
                        }));
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-2">
                  <Input 
                    placeholder={isEnglish ? "Degree" : "Diplôme"}
                    id="new-degree"
                  />
                  <Input 
                    placeholder={isEnglish ? "Institution" : "Institution"}
                    id="new-institution"
                  />
                  <Input 
                    placeholder={isEnglish ? "Year" : "Année"}
                    id="new-year"
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const degree = document.getElementById('new-degree').value;
                    const institution = document.getElementById('new-institution').value;
                    const year = document.getElementById('new-year').value;
                    if (degree && institution && year) {
                      addEducation('degrees', { degree, institution, year });
                      document.getElementById('new-degree').value = '';
                      document.getElementById('new-institution').value = '';
                      document.getElementById('new-year').value = '';
                    }
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isEnglish ? 'Add Degree' : 'Ajouter un Diplôme'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {isEnglish ? 'Professional Certifications' : 'Certifications Professionnelles'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.education.certifications.map((cert, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{cert.name}</p>
                      <p className="text-sm text-gray-600">{cert.issuer} - {cert.year}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          education: {
                            ...prev.education,
                            certifications: prev.education.certifications.filter((_, i) => i !== index)
                          }
                        }));
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-2">
                  <Input 
                    placeholder={isEnglish ? "Certification Name" : "Nom de la Certification"}
                    id="new-cert-name"
                  />
                  <Input 
                    placeholder={isEnglish ? "Issuer" : "Émetteur"}
                    id="new-cert-issuer"
                  />
                  <Input 
                    placeholder={isEnglish ? "Year" : "Année"}
                    id="new-cert-year"
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const name = document.getElementById('new-cert-name').value;
                    const issuer = document.getElementById('new-cert-issuer').value;
                    const year = document.getElementById('new-cert-year').value;
                    if (name && issuer && year) {
                      addEducation('certifications', { name, issuer, year });
                      document.getElementById('new-cert-name').value = '';
                      document.getElementById('new-cert-issuer').value = '';
                      document.getElementById('new-cert-year').value = '';
                    }
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {isEnglish ? 'Add Certification' : 'Ajouter une Certification'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Mentorship Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['monthly', 'trimester', 'yearly'].map((plan) => (
          <Card key={plan}>
            <CardHeader>
              <CardTitle>
                {isEnglish 
                  ? plan.charAt(0).toUpperCase() + plan.slice(1) + ' Plan'
                  : 'Plan ' + (plan === 'monthly' ? 'Mensuel' : plan === 'trimester' ? 'Trimestriel' : 'Annuel')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{isEnglish ? 'Price (FCFA)' : 'Prix (FCFA)'}</label>
                <Input 
                  type="number"
                  value={formData.mentorship[plan].price}
                  onChange={(e) => setFormData({
                    ...formData,
                    mentorship: {
                      ...formData.mentorship,
                      [plan]: {
                        ...formData.mentorship[plan],
                        price: e.target.value
                      }
                    }
                  })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{isEnglish ? 'Description' : 'Description'}</label>
                <Textarea 
                  value={formData.mentorship[plan].description}
                  onChange={(e) => setFormData({
                    ...formData,
                    mentorship: {
                      ...formData.mentorship,
                      [plan]: {
                        ...formData.mentorship[plan],
                        description: e.target.value
                      }
                    }
                  })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {isEnglish ? 'Maximum Students' : 'Nombre Maximum d\'Étudiants'}
                </label>
                <Input 
                  type="number"
                  value={formData.mentorship[plan].maxStudents}
                  onChange={(e) => setFormData({
                    ...formData,
                    mentorship: {
                      ...formData.mentorship,
                      [plan]: {
                        ...formData.mentorship[plan],
                        maxStudents: e.target.value
                      }
                    }
                  })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{isEnglish ? 'Features' : 'Caractéristiques'}</label>
                <div className="space-y-2">
                  {formData.mentorship[plan].features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...formData.mentorship[plan].features];
                          newFeatures[index] = e.target.value;
                          setFormData({
                            ...formData,
                            mentorship: {
                              ...formData.mentorship,
                              [plan]: {
                                ...formData.mentorship[plan],
                                features: newFeatures
                              }
                            }
                          });
                        }}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          const newFeatures = formData.mentorship[plan].features.filter((_, i) => i !== index);
                          setFormData({
                            ...formData,
                            mentorship: {
                              ...formData.mentorship,
                              [plan]: {
                                ...formData.mentorship[plan],
                                features: newFeatures
                              }
                            }
                          });
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        mentorship: {
                          ...formData.mentorship,
                          [plan]: {
                            ...formData.mentorship[plan],
                            features: [...formData.mentorship[plan].features, '']
                          }
                        }
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {isEnglish ? 'Add Feature' : 'Ajouter une Caractéristique'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert>
        <AlertDescription>
          {isEnglish 
            ? 'Note: All prices should be in FCFA. Make sure to provide clear value propositions for each plan.'
            : 'Note : Tous les prix doivent être en FCFA. Assurez-vous de fournir des propositions de valeur claires pour chaque plan.'}
        </AlertDescription>
      </Alert>
    </div>
  );

  return (
    <ProfessionalLayout 
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
      isEnglish={isEnglish}
      setIsEnglish={setIsEnglish}
    >
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isEnglish ? 'Complete Your Profile' : 'Complétez Votre Profil'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {isEnglish 
              ? 'Fill in your information to start mentoring'
              : 'Remplissez vos informations pour commencer le mentorat'}
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
            >
              {isEnglish ? 'Previous' : 'Précédent'}
            </Button>
            <div className="flex gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    step === currentStep
                      ? 'bg-blue-600'
                      : step < currentStep
                      ? 'bg-gray-400'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                {isEnglish ? 'Next' : 'Suivant'}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
              >
                {isEnglish ? 'Submit' : 'Soumettre'}
              </Button>
            )}
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </form>
        </div>
      </div>
    </ProfessionalLayout>
  );
};

export default CompleteProfile;