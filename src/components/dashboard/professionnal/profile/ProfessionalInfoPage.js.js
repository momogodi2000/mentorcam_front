import React, { useState } from 'react';
import { Book, Award, ChevronDown, ChevronUp, X, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../ui/card';
import { Input } from '../../../ui/input';
import { Button } from '../../../ui/button';
import { Textarea } from '../../../ui/textarea';




const ProfessionalInfoPage = ({ formData, setFormData, setCurrentStep, isEnglish }) => {
  const [expandedDomain, setExpandedDomain] = useState(null);

  const handleDomainSelection = (domain, subdomain) => {
    setFormData((prev) => {
      const newDomains = [...prev.domains];
      const domainIndex = newDomains.findIndex((d) => d.name === domain);
      if (domainIndex === -1) {
        newDomains.push({ name: domain, subdomains: [subdomain] });
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
      return { ...prev, domains: newDomains };
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Professional Title & Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {isEnglish ? 'Professional Title' : 'Titre Professionnel'}
          </label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
          />
        </div>
      </div>

      {/* Domains of Expertise */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {isEnglish ? 'Domains of Expertise' : 'Domaines d\'expertise'}
        </h3>
        {Object.entries(DOMAINS).map(([domain, subdomains]) => (
          <Card key={domain}>
            <CardHeader
              className="cursor-pointer"
              onClick={() => setExpandedDomain(expandedDomain === domain ? null : domain)}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">{domain}</CardTitle>
                {expandedDomain === domain ? <ChevronUp /> : <ChevronDown />}
              </div>
            </CardHeader>
            {expandedDomain === domain && (
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {subdomains.map((subdomain) => (
                    <div key={subdomain} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.domains.some(
                          (d) => d.name === domain && d.subdomains.includes(subdomain)
                        )}
                        onChange={() => handleDomainSelection(domain, subdomain)}
                      />
                      <label className="text-sm">{subdomain}</label>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep(1)}>
          {isEnglish ? 'Previous' : 'Précédent'}
        </Button>
        <Button onClick={() => setCurrentStep(3)}>
          {isEnglish ? 'Next' : 'Suivant'}
        </Button>
      </div>
    </div>
  );
};

export default ProfessionalInfoPage;