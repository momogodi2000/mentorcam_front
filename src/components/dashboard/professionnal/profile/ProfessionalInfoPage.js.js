import React, { useState, useEffect } from 'react';
import { Book, Languages as LanguagesIcon, Award, Briefcase, GraduationCap, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Textarea } from '../../../ui/textarea';
import { motion } from 'framer-motion';
import { getProfessionalProfile, saveProfessionalProfile, updateProfessionalProfile } from '../../../services/professionnal/professionalProfileService';

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

const ProfessionalInfoPage = ({ isEnglish }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDomain, setExpandedDomain] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    biography: '',
    hourlyRate: '',
    location: '',
    profilePicture: null,
    linkedin: '',
    github: '',
    twitter: '',
    website: '',
    domains: [],
    education: { degrees: [], certifications: [] },
    mentorshipPlans: [],
  });

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfessionalProfile();
        setProfile(profileData);
        setFormData({
          title: profileData.title || '',
          biography: profileData.biography || '',
          hourlyRate: profileData.hourly_rate || '',
          location: profileData.location || '',
          profilePicture: profileData.profile_picture || null,
          linkedin: profileData.linkedin || '',
          github: profileData.github || '',
          twitter: profileData.twitter || '',
          website: profileData.website || '',
          domains: profileData.domains || [],
          education: profileData.education || { degrees: [], certifications: [] },
          mentorshipPlans: profileData.mentorship_plans || [],
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle domain selection
  const handleDomainSelection = (domain, subdomain) => {
    setFormData((prev) => {
      const newDomains = [...prev.domains];
      const domainIndex = newDomains.findIndex((d) => d.name === domain);

      if (domainIndex === -1) {
        newDomains.push({
          name: domain,
          subdomains: [subdomain],
        });
      } else {
        const subdomains = newDomains[domainIndex].subdomains;
        if (subdomains.includes(subdomain)) {
          newDomains[domainIndex].subdomains = subdomains.filter((s) => s !== subdomain);
          if (newDomains[domainIndex].subdomains.length === 0) {
            newDomains.splice(domainIndex, 1);
          }
        } else {
          newDomains[domainIndex].subdomains.push(subdomain);
        }
      }

      return {
        ...prev,
        domains: newDomains,
      };
    });
  };

  // Add education or certification
  const addEducation = (type, data) => {
    setFormData((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [type]: [...prev.education[type], data],
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (profile) {
        // Update existing profile
        const updatedProfile = await updateProfessionalProfile(formData);
        console.log('Profile updated:', updatedProfile);
      } else {
        // Create new profile
        const newProfile = await saveProfessionalProfile(formData);
        console.log('Profile created:', newProfile);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Display User Information */}
      {profile && (
        <div>
          <h2>{profile.full_name}</h2>
          <p>Email: {profile.email}</p>
          <p>Phone: {profile.phone_number}</p>
        </div>
      )}

      {/* Professional Title & Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {isEnglish ? 'Professional Title' : 'Titre Professionnel'}
          </label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
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
                  {expandedDomain === domain ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </CardHeader>
              {expandedDomain === domain && (
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {subdomains.map((subdomain) => {
                      const isSelected = formData.domains.some(
                        (d) => d.name === domain && d.subdomains.includes(subdomain)
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
          onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
          rows={4}
          placeholder={
            isEnglish
              ? 'Share your professional journey, expertise, and what makes you a great mentor...'
              : 'Partagez votre parcours professionnel, votre expertise et ce qui fait de vous un excellent mentor...'
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
                      <p className="text-sm text-gray-600">
                        {degree.institution} - {degree.year}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          education: {
                            ...prev.education,
                            degrees: prev.education.degrees.filter((_, i) => i !== index),
                          },
                        }));
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder={isEnglish ? 'Degree' : 'Diplôme'} id="new-degree" />
                  <Input placeholder={isEnglish ? 'Institution' : 'Institution'} id="new-institution" />
                  <Input placeholder={isEnglish ? 'Year' : 'Année'} id="new-year" />
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
                      <p className="text-sm text-gray-600">
                        {cert.issuer} - {cert.year}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          education: {
                            ...prev.education,
                            certifications: prev.education.certifications.filter((_, i) => i !== index),
                          },
                        }));
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder={isEnglish ? 'Certification Name' : 'Nom de la Certification'} id="new-cert-name" />
                  <Input placeholder={isEnglish ? 'Issuer' : 'Émetteur'} id="new-cert-issuer" />
                  <Input placeholder={isEnglish ? 'Year' : 'Année'} id="new-cert-year" />
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

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit}>
          {isEnglish ? 'Save Changes' : 'Enregistrer les modifications'}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProfessionalInfoPage;