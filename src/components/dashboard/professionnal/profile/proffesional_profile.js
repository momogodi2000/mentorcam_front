import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Upload } from 'lucide-react';
import ProfessionalLayout from '../professionnal_layout'; // Import the ProfessionalLayout
import { professionalProfileService } from '../../../services/professionnal/professionalProfileService'; // Import the service

// Domain data
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

const PLAN_TYPES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'trimester', label: 'Trimester' },
  { value: 'yearly', label: 'Yearly' }
];

const CompleteProfile = ({ isDarkMode, setIsDarkMode, isEnglish, setIsEnglish }) => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    biography: '',
    hourly_rate: '',
    linkedin: '',
    github: '',
    twitter: '',
    website: '',
    degree: '',
    institution: '',
    education_year: '',
    certification_name: '',
    certification_issuer: '',
    certification_year: '',
    certification_file: null,
    diploma_file: null,
    domain_name: '',
    subdomains: [],
    plan_type: '',
    plan_price: '',
    plan_description: '',
    max_students: ''
  });
  const [errors, setErrors] = useState({});

  const [files, setFiles] = useState({
    certification_file: null,
    diploma_file: null
  });

  const validateStep1 = (data) => {
    const newErrors = {};
    
    if (!data.title?.trim()) newErrors.title = 'Title is required';
    if (!data.biography?.trim()) newErrors.biography = 'Biography is required';
    if (data.hourly_rate && (isNaN(data.hourly_rate) || data.hourly_rate <= 0)) {
      newErrors.hourly_rate = 'Please enter a valid hourly rate';
    }
    if (data.linkedin && !data.linkedin.includes('linkedin.com')) {
      newErrors.linkedin = 'Please enter a valid LinkedIn URL';
    }
    if (data.github && !data.github.includes('github.com')) {
      newErrors.github = 'Please enter a valid GitHub URL';
    }
    if (data.twitter && !data.twitter.includes('twitter.com')) {
      newErrors.twitter = 'Please enter a valid Twitter URL';
    }

    return newErrors;
  };

  const validateStep2 = (data) => {
    const newErrors = {};
    
    if (!data.degree) newErrors.degree = 'Degree is required';
    if (!data.institution) newErrors.institution = 'Institution is required';
    if (!data.education_year) newErrors.education_year = 'Education year is required';
    if (!data.domain_name) newErrors.domain_name = 'Please select a domain';
    if (data.subdomains.length === 0) newErrors.subdomains = 'Please select at least one subdomain';

    return newErrors;
  };

  const validateStep3 = (data) => {
    const newErrors = {};
    
    if (!data.plan_type) newErrors.plan_type = 'Please select a plan type';
    if (!data.plan_price || data.plan_price <= 0) newErrors.plan_price = 'Please enter a valid price';
    if (!data.plan_description) newErrors.plan_description = 'Please provide a plan description';
    if (!data.max_students || data.max_students <= 0) newErrors.max_students = 'Please enter maximum number of students';

    return newErrors;
  };

  const handleNext = (e) => {
    e.preventDefault();
    let validationErrors = {};
    
    if (step === 1) {
      validationErrors = validateStep1(formData);
    } else if (step === 2) {
      validationErrors = validateStep2(formData);
    }
    
    if (Object.keys(validationErrors).length === 0) {
      setStep(step + 1);
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1 || step === 2) {
      handleNext(e);
    } else {
      const validationErrors = validateStep3(formData);
      if (Object.keys(validationErrors).length === 0) {
        try {
          // Clean up the data before submission
          const profileData = {
            ...formData,
            hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
            plan_price: formData.plan_price ? parseFloat(formData.plan_price) : null,
            max_students: formData.max_students ? parseInt(formData.max_students) : null,
            subdomains: Array.isArray(formData.subdomains) ? formData.subdomains : [],
          };
  
          // Remove empty strings and file fields
          Object.keys(profileData).forEach((key) => {
            if (profileData[key] === '') {
              profileData[key] = null;
            }
          });
          delete profileData.certification_file;
          delete profileData.diploma_file;
  
          console.log('Submitting profile data:', profileData);
  
          // Create profile
          const response = await professionalProfileService.createProfile(profileData);
          console.log('Profile created:', response);
  
          // Handle file uploads if files exist
          if (files.certification_file || files.diploma_file) {
            const formData = new FormData();
            if (files.certification_file) {
              formData.append('certification_file', files.certification_file);
            }
            if (files.diploma_file) {
              formData.append('diploma_file', files.diploma_file);
            }
  
            console.log('Uploading files...');
            await professionalProfileService.uploadFiles(response.id, formData); // Pass profile ID
          }
  
          navigate('/professional_dashboard');
        } catch (error) {
          console.error('Error submitting form:', error);
  
          // Handle validation errors from the backend
          if (error.errors) {
            setErrors(error.errors);
          } else {
            setErrors({
              submit: error.message || 'Failed to create profile. Please try again.',
            });
          }
        }
      } else {
        setErrors(validationErrors);
      }
    }
  };
  
  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Basic Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Professional Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Biography</label>
              <textarea
                value={formData.biography}
                onChange={(e) => setFormData({...formData, biography: e.target.value})}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.biography && <p className="mt-1 text-sm text-red-600">{errors.biography}</p>}
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.linkedin && <p className="mt-1 text-sm text-red-600">{errors.linkedin}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">GitHub Profile</label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({...formData, github: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.github && <p className="mt-1 text-sm text-red-600">{errors.github}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Twitter Profile</label>
                <input
                  type="url"
                  value={formData.twitter}
                  onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.twitter && <p className="mt-1 text-sm text-red-600">{errors.twitter}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Hourly Rate (XAF)</label>
              <input
                type="number"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({...formData, hourly_rate: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.hourly_rate && <p className="mt-1 text-sm text-red-600">{errors.hourly_rate}</p>}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Education Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Degree</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({...formData, degree: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.degree && <p className="mt-1 text-sm text-red-600">{errors.degree}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Institution</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({...formData, institution: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.institution && <p className="mt-1 text-sm text-red-600">{errors.institution}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Education Year</label>
                <input
                  type="text"
                  value={formData.education_year}
                  onChange={(e) => setFormData({...formData, education_year: e.target.value})}
                  maxLength={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.education_year && <p className="mt-1 text-sm text-red-600">{errors.education_year}</p>}
              </div>
            </div>

            {/* Certification Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Certification Name</label>
                <input
                  type="text"
                  value={formData.certification_name}
                  onChange={(e) => setFormData({...formData, certification_name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Certification Issuer</label>
                <input
                  type="text"
                  value={formData.certification_issuer}
                  onChange={(e) => setFormData({...formData, certification_issuer: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Certification Year</label>
                <input
                  type="text"
                  value={formData.certification_year}
                  onChange={(e) => setFormData({...formData, certification_year: e.target.value})}
                  maxLength={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Domain Selection */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Domain</label>
                <select
                  value={formData.domain_name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      domain_name: e.target.value,
                      subdomains: []
                    });
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Domain</option>
                  {Object.keys(DOMAINS).map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
                {errors.domain_name && <p className="mt-1 text-sm text-red-600">{errors.domain_name}</p>}
              </div>

              {formData.domain_name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subdomains</label>
                  <div className="mt-2 space-y-2">
                    {DOMAINS[formData.domain_name].map(subdomain => (
                      <label key={subdomain} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.subdomains.includes(subdomain)}
                          onChange={(e) => {
                            const newSubdomains = e.target.checked
                              ? [...formData.subdomains, subdomain]
                              : formData.subdomains.filter(s => s !== subdomain);
                            setFormData({...formData, subdomains: newSubdomains});
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{subdomain}</span>
                      </label>
                    ))}
                  </div>
                  {errors.subdomains && <p className="mt-1 text-sm text-red-600">{errors.subdomains}</p>}
                </div>
              )}
            </div>

            {/* File Uploads */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Upload Certification</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          onChange={(e) => handleFileUpload(e, 'certification_file')}
                          accept=".pdf,.doc,.docx"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC up to 10MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Upload Diploma</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          onChange={(e) => handleFileUpload(e, 'diploma_file')}
                          accept=".pdf,.doc,.docx"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Mentorship Plan Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Plan Type</label>
                <select
                  value={formData.plan_type}
                  onChange={(e) => setFormData({...formData, plan_type: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Plan Type</option>
                  {PLAN_TYPES.map(plan => (
                    <option key={plan.value} value={plan.value}>{plan.label}</option>
                  ))}
                </select>
                {errors.plan_type && <p className="mt-1 text-sm text-red-600">{errors.plan_type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Plan Price (XAF)</label>
                <input
                  type="number"
                  value={formData.plan_price}
                  onChange={(e) => setFormData({...formData, plan_price: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.plan_price && <p className="mt-1 text-sm text-red-600">{errors.plan_price}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Plan Description</label>
              <textarea
                value={formData.plan_description}
                onChange={(e) => setFormData({...formData, plan_description: e.target.value})}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.plan_description && <p className="mt-1 text-sm text-red-600">{errors.plan_description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Maximum Number of Students</label>
              <input
                type="number"
                value={formData.max_students}
                onChange={(e) => setFormData({...formData, max_students: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.max_students && <p className="mt-1 text-sm text-red-600">{errors.max_students}</p>}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <ProfessionalLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} isEnglish={isEnglish} setIsEnglish={setIsEnglish}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-xl p-8"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center">
                {step === 1 ? 'Professional Profile' : step === 2 ? 'Education & Domain' : 'Mentorship Plan'}
              </h2>
              <div className="mt-4 flex justify-center">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStepContent()}

              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {step === 3 ? 'Complete Profile' : 'Next'}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </ProfessionalLayout>
  );
};

export default CompleteProfile;