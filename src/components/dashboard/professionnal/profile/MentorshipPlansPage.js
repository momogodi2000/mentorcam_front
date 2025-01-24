import React from 'react';
import { CreditCard, Plus, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../ui/card'; // Adjust path
import { Input } from '../../../ui/input'; // Adjust path
import { Button } from '../../../ui/button'; // Adjust path
import { Textarea } from '../../../ui/textarea'; // Adjust path
import { Alert } from '../../../ui/alert'; // Adjust path



const MentorshipPlansPage = ({ formData, setFormData, handleSubmit, isEnglish, setCurrentStep }) => {
  return (
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
              {/* Price, Description, Max Students, Features */}
              {['price', 'description', 'maxStudents'].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="text-sm font-medium">
                    {isEnglish
                      ? field.charAt(0).toUpperCase() + field.slice(1)
                      : field === 'price'
                      ? 'Prix'
                      : field === 'description'
                      ? 'Description'
                      : 'Nombre Maximum d\'Étudiants'}
                  </label>
                  {field === 'description' ? (
                    <Textarea
                      value={formData.mentorship[plan][field]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mentorship: {
                            ...formData.mentorship,
                            [plan]: { ...formData.mentorship[plan], [field]: e.target.value },
                          },
                        })
                      }
                    />
                  ) : (
                    <Input
                      type={field === 'price' || field === 'maxStudents' ? 'number' : 'text'}
                      value={formData.mentorship[plan][field]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mentorship: {
                            ...formData.mentorship,
                            [plan]: { ...formData.mentorship[plan], [field]: e.target.value },
                          },
                        })
                      }
                    />
                  )}
                </div>
              ))}
              {/* Features */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{isEnglish ? 'Features' : 'Caractéristiques'}</label>
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
                            [plan]: { ...formData.mentorship[plan], features: newFeatures },
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
                            [plan]: { ...formData.mentorship[plan], features: newFeatures },
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(2)}>
          {isEnglish ? 'Previous' : 'Précédent'}
        </Button>
        <Button onClick={handleSubmit}>
          {isEnglish ? 'Submit' : 'Soumettre'}
        </Button>
      </div>
    </div>
  );
};

export default MentorshipPlansPage;