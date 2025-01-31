import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Textarea } from '../../../ui/textarea';
import { Alert, AlertDescription } from '../../../ui/alert';
import { X, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const MentorshipPlansPage = ({ formData, setFormData, isEnglish }) => {
  const [formErrors, setFormErrors] = useState({});

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    ['monthly', 'trimester', 'yearly'].forEach((plan) => {
      if (!formData.mentorship[plan].price) {
        errors[`${plan}-price`] = isEnglish ? 'Price is required' : 'Le prix est requis';
      }
      if (!formData.mentorship[plan].description) {
        errors[`${plan}-description`] = isEnglish ? 'Description is required' : 'La description est requise';
      }
      if (!formData.mentorship[plan].maxStudents) {
        errors[`${plan}-maxStudents`] = isEnglish ? 'Maximum students is required' : 'Le nombre maximum d\'étudiants est requis';
      }
      if (formData.mentorship[plan].features.length === 0) {
        errors[`${plan}-features`] = isEnglish ? 'At least one feature is required' : 'Au moins une caractéristique est requise';
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
      className="space-y-8"
    >
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
              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{isEnglish ? 'Price (FCFA)' : 'Prix (FCFA)'}</label>
                <Input
                  type="number"
                  value={formData.mentorship[plan].price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mentorship: {
                        ...formData.mentorship,
                        [plan]: {
                          ...formData.mentorship[plan],
                          price: e.target.value,
                        },
                      },
                    })
                  }
                />
                {formErrors[`${plan}-price`] && (
                  <p className="text-red-500 text-sm">{formErrors[`${plan}-price`]}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{isEnglish ? 'Description' : 'Description'}</label>
                <Textarea
                  value={formData.mentorship[plan].description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mentorship: {
                        ...formData.mentorship,
                        [plan]: {
                          ...formData.mentorship[plan],
                          description: e.target.value,
                        },
                      },
                    })
                  }
                  rows={3}
                />
                {formErrors[`${plan}-description`] && (
                  <p className="text-red-500 text-sm">{formErrors[`${plan}-description`]}</p>
                )}
              </div>

              {/* Maximum Students */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {isEnglish ? 'Maximum Students' : 'Nombre Maximum d\'Étudiants'}
                </label>
                <Input
                  type="number"
                  value={formData.mentorship[plan].maxStudents}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mentorship: {
                        ...formData.mentorship,
                        [plan]: {
                          ...formData.mentorship[plan],
                          maxStudents: e.target.value,
                        },
                      },
                    })
                  }
                />
                {formErrors[`${plan}-maxStudents`] && (
                  <p className="text-red-500 text-sm">{formErrors[`${plan}-maxStudents`]}</p>
                )}
              </div>

              {/* Features */}
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
                                features: newFeatures,
                              },
                            },
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
                                features: newFeatures,
                              },
                            },
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
                            features: [...formData.mentorship[plan].features, ''],
                          },
                        },
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {isEnglish ? 'Add Feature' : 'Ajouter une Caractéristique'}
                  </Button>
                  {formErrors[`${plan}-features`] && (
                    <p className="text-red-500 text-sm">{formErrors[`${plan}-features`]}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert */}
      <Alert>
        <AlertDescription>
          {isEnglish
            ? 'Note: All prices should be in FCFA. Make sure to provide clear value propositions for each plan.'
            : 'Note : Tous les prix doivent être en FCFA. Assurez-vous de fournir des propositions de valeur claires pour chaque plan.'}
        </AlertDescription>
      </Alert>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit}>
          {isEnglish ? 'Save Changes' : 'Enregistrer les modifications'}
        </Button>
      </div>
    </motion.div>
  );
};

export default MentorshipPlansPage;