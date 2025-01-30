import React, { useState, useEffect } from 'react';
import { useToast } from "../../../ui/use-toast";
import { Button } from '../../../ui/button';
import ProfessionalLayout from '../professionnal_layout';
import {
  getProfessionalProfile,
  saveProfessionalProfile,
  updateProfessionalProfile,
} from '../../../services/professionnal/professionalProfileService';
import { getUser } from '../../../services/get_user';
import PersonalInfoPage from './PersonalInfoPage';
import ProfessionalInfoPage from './ProfessionalInfoPage.js';
import MentorshipPlansPage from './MentorshipPlansPage';

const CompleteProfile = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState(null);

  const [formData, setFormData] = useState({
    user_id: '',
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

  // Fetch user data first
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUser();
        setUserData(user);
        // Pre-fill form with user data
        setFormData(prev => ({
          ...prev,
          user_id: user.id,
          fullName: user.full_name,
          email: user.email,
          phone: user.phone_number
        }));
        // After getting user data, fetch profile data
        fetchProfileData(user.id);
      } catch (error) {
        toast({
          title: isEnglish ? "Error" : "Erreur",
          description: isEnglish 
            ? "Failed to load user data" 
            : "Échec du chargement des données utilisateur",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const fetchProfileData = async (userId) => {
    try {
      const response = await getProfessionalProfile();
      if (response) {
        const profileData = {
          ...formData,
          user_id: userId,
          location: response.location || '',
          profilePicture: response.profile_picture || null,
          socialLinks: {
            linkedin: response.linkedin || '',
            github: response.github || '',
            twitter: response.twitter || '',
            website: response.website || ''
          },
          title: response.title || '',
          biography: response.biography || '',
          hourlyRate: response.hourly_rate || '',
          domains: response.domains || [],
          education: {
            degrees: response.education || [],
            certifications: response.certifications || []
          },
          mentorship: {
            monthly: response.mentorship_plans?.find(plan => plan.plan_type === 'monthly') || {
              price: '',
              description: '',
              features: [],
              maxStudents: ''
            },
            trimester: response.mentorship_plans?.find(plan => plan.plan_type === 'trimester') || {
              price: '',
              description: '',
              features: [],
              maxStudents: ''
            },
            yearly: response.mentorship_plans?.find(plan => plan.plan_type === 'yearly') || {
              price: '',
              description: '',
              features: [],
              maxStudents: ''
            }
          }
        };
        setFormData(profileData);
        if (response.profile_picture) {
          setImagePreview(response.profile_picture);
        }
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        toast({
          title: isEnglish ? "Error" : "Erreur",
          description: isEnglish 
            ? "Failed to load profile data" 
            : "Échec du chargement des données du profil",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: isEnglish ? "Error" : "Erreur",
          description: isEnglish 
            ? "Image size should not exceed 5MB" 
            : "La taille de l'image ne doit pas dépasser 5 Mo",
          variant: "destructive"
        });
        return;
      }

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

  const transformFormDataForBackend = () => {
    const formDataToSend = new FormData();
    
    // Append user ID
    formDataToSend.append('user_id', userData.id);
    
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
    
    // Append domains, education, and mentorship plans as JSON strings
    formDataToSend.append('domains', JSON.stringify(formData.domains));
    formDataToSend.append('education', JSON.stringify(formData.education.degrees));
    formDataToSend.append('certifications', JSON.stringify(formData.education.certifications));
    
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
        await updateProfessionalProfile(formDataToSend);
      } catch (error) {
        if (error.response?.status === 404) {
          await saveProfessionalProfile(formDataToSend);
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

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between items-center">
            <Button
              type="button"
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
            <Button
              type={currentStep === 3 ? "submit" : "button"}
              onClick={currentStep < 3 ? () => setCurrentStep(currentStep + 1) : undefined}
              disabled={isSaving}
            >
              {currentStep === 3 
                ? (isEnglish ? (isSaving ? 'Saving...' : 'Submit') : (isSaving ? 'Enregistrement...' : 'Soumettre'))
                : (isEnglish ? 'Next' : 'Suivant')}
            </Button>
          </div>

          {currentStep === 1 && (
            <PersonalInfoPage 
              formData={formData}
              setFormData={setFormData}
              handleImageChange={handleImageChange}
              imagePreview={imagePreview}
              isEnglish={isEnglish}
              userData={userData}
            />
          )}
          {currentStep === 2 && (
            <ProfessionalInfoPage 
              formData={formData}
              setFormData={setFormData}
              isEnglish={isEnglish}
            />
          )}
          {currentStep === 3 && (
            <MentorshipPlansPage 
              formData={formData}
              setFormData={setFormData}
              isEnglish={isEnglish}
            />
          )}
        </form>
      </div>
    </ProfessionalLayout>
  );
};

export default CompleteProfile;