import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Textarea } from '../../../ui/textarea';
import { Alert, AlertDescription } from '../../../ui/alert';
import { X, Plus } from 'lucide-react'; // Import the missing icons



import { motion } from 'framer-motion';

const MentorshipPlansPage = ({ formData, setFormData, isEnglish }) => {
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
    </motion.div>
  );
};

export default MentorshipPlansPage;