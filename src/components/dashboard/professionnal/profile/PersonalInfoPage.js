import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Link, Camera } from 'lucide-react';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Textarea } from '../../../ui/textarea';
import { motion } from 'framer-motion';

const PersonalInfoPage = ({ formData, setFormData, handleImageChange, imagePreview, isEnglish }) => {
  const [formErrors, setFormErrors] = useState({});

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    if (!formData.location.trim()) {
      errors.location = isEnglish ? 'Location is required' : 'La localisation est requise';
    }
    Object.entries(formData.socialLinks).forEach(([platform, value]) => {
      if (!value.trim()) {
        errors[platform] = isEnglish ? `${platform} URL is required` : `L'URL ${platform} est requise`;
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted successfully:', formData);
    } else {
      console.log('Form validation failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
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
          <label className="text-sm font-medium">{isEnglish ? 'Location' : 'Localisation'}</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          {formErrors.location && <p className="text-red-500 text-sm">{formErrors.location}</p>}
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: {
                        ...formData.socialLinks,
                        [platform]: e.target.value,
                      },
                    })
                  }
                  placeholder={`${platform} URL`}
                />
              </div>
              {formErrors[platform] && <p className="text-red-500 text-sm">{formErrors[platform]}</p>}
            </div>
          ))}
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

export default PersonalInfoPage;