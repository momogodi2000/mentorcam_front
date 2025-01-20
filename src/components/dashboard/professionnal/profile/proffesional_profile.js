import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Book, Languages as LanguagesIcon, 
  Award, Clock, Calendar, CreditCard, Plus, X, Camera
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Textarea } from '../../../ui/textarea';
import { Badge } from '../../../ui/badge';
import { Alert, AlertDescription } from '../../../ui/alert';
import ProfessionalLayout from '../professionnal_layout';

const CompleteProfile = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    specialization: '',
    biography: '',
    experience: '',
    education: '',
    certifications: [],
    availability: {
      weekdays: [],
      weekends: false,
      hoursPerWeek: '',
    },
    mentorship: {
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
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addLanguage = () => {
    if (newLanguage && !languages.includes(newLanguage)) {
      setLanguages([...languages, newLanguage]);
      setNewLanguage('');
    }
  };

  const removeLanguage = (languageToRemove) => {
    setLanguages(languages.filter(language => language !== languageToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', { ...formData, skills, languages });
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-fadeIn">
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
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <label className="text-sm font-medium">{isEnglish ? 'Professional Title' : 'Titre Professionnel'}</label>
        <Input 
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder={isEnglish ? 'e.g. Senior Software Engineer' : 'ex. Ingénieur Logiciel Senior'}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{isEnglish ? 'Skills' : 'Compétences'}</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1">
              {skill}
              <button onClick={() => removeSkill(skill)} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input 
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder={isEnglish ? 'Add a skill' : 'Ajouter une compétence'}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          />
          <Button onClick={addSkill} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{isEnglish ? 'Languages' : 'Langues'}</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {languages.map((language, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1">
              {language}
              <button onClick={() => removeLanguage(language)} className="ml-2">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input 
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            placeholder={isEnglish ? 'Add a language' : 'Ajouter une langue'}
            onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
          />
          <Button onClick={addLanguage} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{isEnglish ? 'Professional Biography' : 'Biographie Professionnelle'}</label>
        <Textarea 
          value={formData.biography}
          onChange={(e) => setFormData({...formData, biography: e.target.value})}
          rows={4}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEnglish ? 'Monthly Plan' : 'Plan Mensuel'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{isEnglish ? 'Price (FCFA)' : 'Prix (FCFA)'}</label>
              <Input 
                type="number"
                value={formData.mentorship.monthly.price}
                onChange={(e) => setFormData({
                  ...formData,
                  mentorship: {
                    ...formData.mentorship,
                    monthly: {
                      ...formData.mentorship.monthly,
                      price: e.target.value
                    }
                  }
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{isEnglish ? 'Description' : 'Description'}</label>
              <Textarea 
                value={formData.mentorship.monthly.description}
                onChange={(e) => setFormData({
                  ...formData,
                  mentorship: {
                    ...formData.mentorship,
                    monthly: {
                      ...formData.mentorship.monthly,
                      description: e.target.value
                    }
                  }
                })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isEnglish ? 'Trimester Plan' : 'Plan Trimestriel'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{isEnglish ? 'Price (FCFA)' : 'Prix (FCFA)'}</label>
              <Input 
                type="number"
                value={formData.mentorship.trimester.price}
                onChange={(e) => setFormData({
                  ...formData,
                  mentorship: {
                    ...formData.mentorship,
                    trimester: {
                      ...formData.mentorship.trimester,
                      price: e.target.value
                    }
                  }
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{isEnglish ? 'Description' : 'Description'}</label>
              <Textarea 
                value={formData.mentorship.trimester.description}
                onChange={(e) => setFormData({
                  ...formData,
                  mentorship: {
                    ...formData.mentorship,
                    trimester: {
                      ...formData.mentorship.trimester,
                      description: e.target.value
                    }
                  }
                })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isEnglish ? 'Yearly Plan' : 'Plan Annuel'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{isEnglish ? 'Price (FCFA)' : 'Prix (FCFA)'}</label>
              <Input 
                type="number"
                value={formData.mentorship.yearly.price}
                onChange={(e) => setFormData({
                  ...formData,
                  mentorship: {
                    ...formData.mentorship,
                    yearly: {
                      ...formData.mentorship.yearly,
                      price: e.target.value
                    }
                  }
                })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{isEnglish ? 'Description' : 'Description'}</label>
              <Textarea 
                value={formData.mentorship.yearly.description}
                onChange={(e) => setFormData({
                  ...formData,
                  mentorship: {
                    ...formData.mentorship,
                    yearly: {
                      ...formData.mentorship.yearly,
                      description: e.target.value
                    }
                  }
                })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
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