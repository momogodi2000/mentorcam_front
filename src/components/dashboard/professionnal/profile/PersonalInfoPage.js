import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Link, Camera } from 'lucide-react';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { useToast } from '../../../ui/use-toast';
const PersonalInfoPage = ({ formData, setFormData, setCurrentStep, isEnglish }) => {
    const { toast } = useToast();
    const [imagePreview, setImagePreview] = useState(formData.profilePicture || null);
  
    // Ensure socialLinks is always an object
    const socialLinks = formData.socialLinks || {};
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          setFormData({ ...formData, profilePicture: file });
        };
        reader.readAsDataURL(file);
      }
    };
  
    return (
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
          {[
            { label: isEnglish ? 'Full Name' : 'Nom Complet', icon: User, key: 'fullName' },
            { label: 'Email', icon: Mail, key: 'email' },
            { label: isEnglish ? 'Phone' : 'Téléphone', icon: Phone, key: 'phone' },
            { label: isEnglish ? 'Location' : 'Localisation', icon: MapPin, key: 'location' },
          ].map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium">{field.label}</label>
              <div className="relative">
                <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-10"
                  value={formData[field.key]}
                  onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>
  
        {/* Social Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{isEnglish ? 'Social Links' : 'Liens Sociaux'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(socialLinks).map(([platform, value]) => (
              <div key={platform} className="space-y-2">
                <label className="text-sm font-medium capitalize">{platform}</label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    className="pl-10"
                    value={value}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialLinks: { ...socialLinks, [platform]: e.target.value },
                    })}
                    placeholder={`${platform} URL`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Navigation */}
        <div className="flex justify-end">
          <Button onClick={() => setCurrentStep(2)}>
            {isEnglish ? 'Next' : 'Suivant'}
          </Button>
        </div>
      </div>
    );
  };
  
  export default PersonalInfoPage;